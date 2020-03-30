package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// OrderChaincode example simple Chaincode implementation
type OrderChaincode struct {
}

//Order function
type Order struct {
	ObjectType     string `json:"docType"`
	OrderID        string `json:"OrderID"`
	ProdID         string `json:"ProdID"`
	Qty            string `json:"Qty"`
	Price          string `json:"Price"`
	OrderDate      string `json:"OrderDate"`
	ExcpectedDate  string `json:"ExcpectedDate"`
	CompletionDate string `json:"CompletionDate"`
	Status         string `json:"Status"`
	InvoiceNumber  string `json:"InvoiceNumber"`
}

//Init function
func (o *OrderChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

//Invoke function
func (o *OrderChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	fmt.Println("invoke is running " + function)

	// Handle different functions
	if function == "createOrder" { //create a new marble
		return o.createOrder(stub, args)
	} else if function == "updateOrder" { //change owner of a specific marble
		return o.updateOrder(stub, args)
	} else if function == "getOrders" {
		return o.getOrder(stub, args)
	}

	fmt.Println("invoke did not find func: " + function) //error
	return shim.Error("Received unknown function invocation")
}

// ============================================================
// createOrder - create a new order
// ============================================================
func (o *OrderChaincode) createOrder(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error

	//   0         1      2	    3	    4			5			6			  7
	//  OrderID, ProdID, Qty, Price, OrderDate,ExcpectedDate,CompletionDate,Status,
	//		8
	// InvoiceNumber
	//	logger.Infof("Number of arguments = %s", len(args))
	if len(args) != 9 {
		return shim.Error("Incorrect number of arguments. Expecting 9")
	}
	//	creator, err := getCreatorID(stub)
	if err != nil {
		return shim.Error("Failed to get creator")
	}
	//	logger.Infof("creator = %s", creator)

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
	if len(args[7]) <= 0 {
		return shim.Error("8th argument must be a non-empty string")
	}
	if len(args[8]) <= 0 {
		return shim.Error("9th argument must be a non-empty string")
	}

	OrderID := args[0]
	ProdID := args[1]
	Qty := args[2]
	Price := args[3]
	OrderDate := args[4]
	ExcpectedDate := args[5]
	CompletionDate := args[6]
	Status := args[7]
	InvoiceNumber := args[8]
	// ==== Check if order already exists ====
	existing, err := stub.GetState(OrderID)
	if err != nil {
		return shim.Error("Failed to get order: " + err.Error())
	} else if existing != nil {
		fmt.Println("This order already exists: " + OrderID)
		return shim.Error("This order already exists: " + OrderID)
	}

	objectType := "Order"
	neworder := &Order{objectType, OrderID, ProdID, Qty, Price, OrderDate, ExcpectedDate, CompletionDate, Status, InvoiceNumber}
	orderAsBytes, err := json.Marshal(neworder)

	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(OrderID, orderAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- end add order")
	return shim.Success(nil)
}

// ============================================================
// updateOrder - adds a new Order
// ============================================================
func (o *OrderChaincode) updateOrder(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error

	//   0      1
	//  Status, OrderID
	//	logger.Infof("Number of arguments = %s", len(args))
	if len(args) != 2 {
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
	Status := args[0]
	OrderID := args[1]

	// ==== Check if Order already exists ====
	existing, err := stub.GetState(OrderID)
	if err != nil {
		return shim.Error("Failed to get Order: " + err.Error())
	} else if existing == nil {
		fmt.Println("This Order does notexists: " + OrderID)
		return shim.Error("This Order does not exist: " + OrderID)
	}

	existingObj := &Order{}
	err = json.Unmarshal(existing, &existingObj)
	if err != nil {
		return shim.Error("Failed to unmarshal : " + err.Error())
	}
	existingObj.Status = Status
	newOrderObjAsBytes, err := json.Marshal(existingObj)

	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(OrderID, newOrderObjAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- end update Order")
	return shim.Success(nil)
}

func (o *OrderChaincode) getOrder(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	fmt.Println("- end get Order")
	return shim.Success(nil)
}
func main() {
	err := shim.Start(new(OrderChaincode))
	if err != nil {
		fmt.Printf("Error starting Order chaincode: %s", err)
	}
}
