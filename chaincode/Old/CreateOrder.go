/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright creatorUUIDship.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

// ====CHAINCODE EXECUTION SAMPLES (CLI) ==================

// ==== Invoke marbles ====
// peer chaincode invoke -C myc1 -n marbles -c '{"Args":["initMarble","marble1","blue","35","tom"]}'
// peer chaincode invoke -C myc1 -n marbles -c '{"Args":["initMarble","marble2","red","50","tom"]}'
// peer chaincode invoke -C myc1 -n marbles -c '{"Args":["initMarble","marble3","blue","70","tom"]}'
// peer chaincode invoke -C myc1 -n marbles -c '{"Args":["transferMarble","marble2","jerry"]}'
// peer chaincode invoke -C myc1 -n marbles -c '{"Args":["transferMarblesBasedOnColor","blue","jerry"]}'
// peer chaincode invoke -C myc1 -n marbles -c '{"Args":["delete","marble1"]}'

// ==== Query marbles ====
// peer chaincode query -C myc1 -n marbles -c '{"Args":["readMarble","marble1"]}'
// peer chaincode query -C myc1 -n marbles -c '{"Args":["getMarblesByRange","marble1","marble3"]}'
// peer chaincode query -C myc1 -n marbles -c '{"Args":["getHistoryForMarble","marble1"]}'

// Rich Query (Only supported if CouchDB is used as state database):
//   peer chaincode query -C myc1 -n marbles -c '{"Args":["queryMarblesBycreatorUUID","tom"]}'
//   peer chaincode query -C myc1 -n marbles -c '{"Args":["queryMarbles","{\"selector\":{\"creatorUUID\":\"tom\"}}"]}'

//The following examples demonstrate creating indexes on CouchDB
//Example hostname:port configurations
//
//Docker or vagrant environments:
// http://couchdb:5984/
//
//Inside couchdb docker container
// http://127.0.0.1:5984/

// Index for chaincodeid, docType, creatorUUID.
// Note that docType and creatorUUID fields must be prefixed with the "data" wrapper
// chaincodeid must be added for all queries
//
// Definition for use with Fauxton interface
// {"index":{"fields":["chaincodeid","data.docType","data.creatorUUID"]},"ddoc":"indexcreatorUUIDDoc", "name":"indexcreatorUUID","type":"json"}
//
// example curl definition for use with command line
// curl -i -X POST -H "Content-Type: application/json" -d "{\"index\":{\"fields\":[\"chaincodeid\",\"data.docType\",\"data.creatorUUID\"]},\"name\":\"indexcreatorUUID\",\"ddoc\":\"indexcreatorUUIDDoc\",\"type\":\"json\"}" http://hostname:port/myc1/_index
//

// Index for chaincodeid, docType, creatorUUID, size (descending order).
// Note that docType, creatorUUID and size fields must be prefixed with the "data" wrapper
// chaincodeid must be added for all queries
//
// Definition for use with Fauxton interface
// {"index":{"fields":[{"data.size":"desc"},{"chaincodeid":"desc"},{"data.docType":"desc"},{"data.creatorUUID":"desc"}]},"ddoc":"indexSizeSortDoc", "name":"indexSizeSortDesc","type":"json"}
//
// example curl definition for use with command line
// curl -i -X POST -H "Content-Type: application/json" -d "{\"index\":{\"fields\":[{\"data.size\":\"desc\"},{\"chaincodeid\":\"desc\"},{\"data.docType\":\"desc\"},{\"data.creatorUUID\":\"desc\"}]},\"ddoc\":\"indexSizeSortDoc\", \"name\":\"indexSizeSortDesc\",\"type\":\"json\"}" http://hostname:port/myc1/_index

// Rich Query with index design doc and index name specified (Only supported if CouchDB is used as state database):
//   peer chaincode query -C myc1 -n marbles -c '{"Args":["queryMarbles","{\"selector\":{\"docType\":\"marble\",\"creatorUUID\":\"tom\"}, \"use_index\":[\"_design/indexcreatorUUIDDoc\", \"indexcreatorUUID\"]}"]}'

// Rich Query with index design doc specified only (Only supported if CouchDB is used as state database):
//   peer chaincode query -C myc1 -n marbles -c '{"Args":["queryMarbles","{\"selector\":{\"docType\":{\"$eq\":\"marble\"},\"creatorUUID\":{\"$eq\":\"tom\"},\"size\":{\"$gt\":0}},\"fields\":[\"docType\",\"creatorUUID\",\"size\"],\"sort\":[{\"size\":\"desc\"}],\"use_index\":\"_design/indexSizeSortDoc\"}"]}'

package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

type Order struct {
	ObjectType     string `json:"docType"`
	uuid           string `json:"uuid"`
	OrderID        string `json:OrderID`
	ProductID      string `json:ProductID`
	Quantity       string `json:Quantity`
	Price          string `json:"Price"`
	OrderDate      string `json:"OrderDate"`
	ExcpectedDate  string `json:"ExcpectedDate"`
	CompletionDate string `json:"CompletionDate"`
	Status         string `json:"Status"`
	InvoiceNumber  string `json:"InvoiceNumber"`
}

// ============================================================
// createOrder - create a new order
// ============================================================
func (t *SimpleChaincode) createOrder(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error

	//   0      1       	2	3	4	5		6	7	8
	//  OrderID, Qty, ProdID,OrderDate,ExcpectedDate,CompletionDate,Status,Price,InvoiceNumber
	logger.Infof("Number of arguments = %s", len(args))
	if len(args) != 8 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}
	creator, err := getCreatorID(stub)
	if err != nil {
		return shim.Error("Failed to get creator")
	}
	logger.Infof("creator = %s", creator)

	// ==== Input sanitation ====
	fmt.Println("- start add order")
	if len(args[0]) <= 0 {
		return shim.Error("1st argument must be a non-empty string")
	}
	if len(args[1]) <= 0 {
		return shim.Error("2nd argument must be a non-empty string")
	}
	if len(args[2]) <= 0 {
		return shim.Error("3rd argument must be a non-empty string")
	}
	if len(args[3]) <= 0 {
		return shim.Error("4th argument must be a non-empty string")
	}
	if len(args[4]) <= 0 {
		return shim.Error("5th argument must be a non-empty string")
	}
	if len(args[5]) <= 0 {
		return shim.Error("6th argument must be a non-empty string")
	}
	if len(args[6]) <= 0 {
		return shim.Error("7th argument must be a non-empty string")
	}
	if len(args[8]) <= 0 {
		return shim.Error("9th argument must be a non-empty string")
	}

	uuid := args[0]
	OrderID := args[1]
	ProductID := args[2]
	Quantity := args[3]
	Price := args[4]
	OrderDate := args[5]
	ExcpectedDate := args[6]
	CompletionDate := args[7]
	Status := args[8]
	InvoiceNumber := args[9]

	// ==== Check if order already exists ====
	existing, err := stub.GetState(uuid)
	if err != nil {
		return shim.Error("Failed to get order: " + err.Error())
	} else if existing != nil {
		fmt.Println("This order already exists: " + uuid)
		return shim.Error("This order already exists: " + uuid)
	}

	objectType := "Order"
	neworder := &order{objectType, uuid, OrderID, ProductID, Quantity, Price, OrderDate, ExcpectedDate, CompletionDate, Status, InvoiceNumber}
	orderAsBytes, err := json.Marshal(neworder)

	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(uuid, orderAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- end add order")
	return shim.Success(nil)
}

// ============================================================
// updateOrder - adds a new Order
// ============================================================
func (t *SimpleChaincode) updateOrder(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error

	//   0      		1		  3
	//  Status, Completion date, uuid
	logger.Infof("Number of arguments = %s", len(args))
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}
	// ==== Input sanitation ====
	fmt.Println("- start update Order")
	if len(args[0]) <= 0 {
		return shim.Error("1st argument must be a non-empty string")
	}
	if len(args[1]) <= 0 {
		return shim.Error("2nd argument must be a non-empty string")
	}
	if len(args[2]) <= 0 {
		return shim.Error("3rd argument must be a non-empty string")
	}
	Status := args[0]
	CompletionDate := args[1]
	uuid := args[2]

	// ==== Check if Order already exists ====
	existing, err := stub.GetState(uuid)
	if err != nil {
		return shim.Error("Failed to get Order: " + err.Error())
	} else if existing == nil {
		fmt.Println("This Order does not exists: " + uuid)
		return shim.Error("This Order does not exist: " + uuid)
	}

	existingObj := &order{}
	err = json.Unmarshal(existing, &existingObj)
	if err != nil {
		return shim.Error("Failed to unmarshal : " + err.Error())
	}

	existingObj.Status = Status
	existingObj.CompletionDate = CompletionDate
	newOrderObjAsBytes, err := json.Marshal(existingObj)

	// existingObj :={Status, CompletionDate}
	// newOrderObjAsBytes, err := json.Marshal(existingObj)

	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(uuid, newOrderObjAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- end update Order")
	return shim.Success(nil)
}
