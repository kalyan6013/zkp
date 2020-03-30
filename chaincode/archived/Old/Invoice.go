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

// Index for chaincodeid, docType, creatorUUID, size (descending Invoice).
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

type Invoice struct {
	ObjectType     	string `json:"docType"`
	uuid			string	`json:"uuid"`
	InvoiceID		string  `json:"InvoiceID"`
	OrderID	       	string  `json:"OrderID"`
	InvoiceDate		string `json:"InvoiceDate"`
	SettlementDate	string	`json:"SettlementDate"`
	

}

// ============================================================
// createInvoice - create a new Invoice
// ============================================================
func (t *SimpleChaincode) createInvoice(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error



	logger.Infof("Number of arguments = %s", len(args))
	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}
	creator, err := getCreatorID(stub)
	if err != nil {
		return shim.Error("Failed to get creator")
	}
	logger.Infof("creator = %s", creator)

	// ==== Input sanitation ====
	fmt.Println("- start add Invoice")
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
		return shim.Error("3rd argument must be a non-empty string")
	}
	
	uuid			:= args[0]
	InvoiceID   	:= args[1]
	OrderID	    	:= args[2]
	InvoiceDate		:= args[3]
	SettlementDate	:= args[4]
	
	// ==== Check if Invoice already exists ====
	existing, err := stub.GetState(uuid)
	if err != nil {
		return shim.Error("Failed to get Invoice: " + err.Error())
	} else if existing != nil {
		fmt.Println("This Invoice already exists: " + uuid)
		return shim.Error("This Invoice already exists: " + uuid)
	}

	objectType := "Invoice"
	newInvoice := &Invoice{objectType, uuid,InvoiceID,OrderID,InvoiceDate,SettlementDate}
	InvoiceAsBytes, err := json.Marshal(newInvoice)

	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(uuid, InvoiceAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- end add Invoice")
	return shim.Success(nil)
}

// ============================================================
// updateInvoice - adds a new Invoice
// ============================================================
func (t *SimpleChaincode) updateInvoice(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error

	//   0      1
	//  SettlementDate, uuid
	logger.Infof("Number of arguments = %s", len(args))
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}
	// ==== Input sanitation ====
	fmt.Println("- Start update Invoice")
	if len(args[0]) <= 0 {
		return shim.Error("1st argument must be a non-empty string")
	}
	if len(args[1]) <= 0 {
		return shim.Error("2nd argument must be a non-empty string")
	}

	SettlementDate := args[0]
	uuid := args[1]

	// ==== Check if Invoice already exists ====
	existing, err := stub.GetState(uuid)
	if err != nil {
		return shim.Error("Failed to get Invoice: " + err.Error())
	} else if existing == nil {
		fmt.Println("This Invoice does notexists: " + uuid)
		return shim.Error("This Invoice does not exist: " + uuid)
	}

	existingObj := &Invoice{}
	err = json.Unmarshal(existing, &existingObj)
	if err != nil {
		return shim.Error("Failed to unmarshal : " + err.Error())
	}
	
	existingObj.SettlementDate = SettlementDate
	newInvoiceObjAsBytes, err := json.Marshal(existingObj)

	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(uuid, newInvoiceObjAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- end update Invoice")
	return shim.Success(nil)
}

