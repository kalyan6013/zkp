/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
const shim = require('fabric-shim');
const util = require('util');

let Chaincode = class {
  async Init(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    console.info('=========== Instantiated Car/Driver Chaincode ===========');
    return shim.success();
  }

  async Invoke(stub) {
    console.info('Transaction ID: ' + stub.getTxID());
    console.info(util.format('Args: %j', stub.getArgs()));

    let ret = stub.getFunctionAndParameters();
    console.info(ret);

    let method = this[ret.fcn];
    if (!method) {
      console.log('no function of name:' + ret.fcn + ' found');
      throw new Error('Received unknown function ' + ret.fcn + ' invocation');
    }
    try {
      let payload = await method(stub, ret.params, this);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }

  async initData(stub, args, thisClass) {
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }
    // ==== Input sanitation ====
    console.info('--- start init data ---')
    if (args[0].lenth <= 0) {
      throw new Error('1st argument must be a non-empty string');
    }
    if (args[1].lenth <= 0) {
      throw new Error('2nd argument must be a non-empty string');
    }
  
    let vehicleNo = args[0];
    let drivingLicenceNo = args[1];
  
    // ==== Check if marble already exists ====
    // let vehicleState = await stub.GetPrivateData(vehicleNo);
    // let driverState = await stub.GetPrivateData(drivingLicenceNo);
    // if (vehicleState.toString() || driverState.toString()) {
      // throw new Error('Data already exists: ' + vehicleNo + driverState);
    // }
  
    // ==== Create marble object and marshal to JSON ====
    let car = {};
    car.docType = 'car';
    car.vehicleNo = vehicleNo;
    car.drivingLicenceNo = drivingLicenceNo;
  
    // === Save marble to state ===
    await stub.putPrivateData('zkpprivate',vehicleNo, Buffer.from(JSON.stringify(car)));
    
    console.info('- end init '); 
  
  }
  async queryData(stub, args, thisClass) {
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2 arguments to query');
    }
    let vehicleNo = args[0];
    // console.log('This is vehicleNo : '+ vehicleNo);
    let drivingLicenceNo = args[1];
//    if(!vehicleNo || !drivingLicenceNo){
//      throw new Error('Data does not exists');
//    }
//    console.log('Blockchain data : ' + await stub.getState(vehicleNo));
    let vehicleNoAsbytes = await stub.getPrivateData('zkpprivate',vehicleNo);
    console.log('This is vehicle Data : '+ vehicleNoAsbytes);
   let drivingLicenceNooAsbytes = await stub.getPrivateData('zkpprivate',drivingLicenceNo);
   // console.log('This is driving Data : '+ vehicleNoAsbytes);
    if(!vehicleNo){
      let jsonResp={};
      jsonResp.Error='Data does not exists';
      throw new Error(JSON.stringify(jsonResp));
    }
    console.info('=======================================');
    console.log(vehicleNoAsbytes.toString());
    console.log(drivingLicenceNooAsbytes.toString());
    console.info('=======================================');
    return vehicleNoAsbytes;
    // let outputdata = 'Data exists';
    // console.log(outputdata);
    // console.log('Data Exists');
    // return outputdata;
  }
}

shim.start(new Chaincode());







// 'use strict';

// const { Contract } = require('fabric-contract-api');

// class Zkp extends Contract {

//     async initLedger(ctx) {
//         console.info('============= START : Initialize Ledger ===========');
//         const cardriver = [
//             {
//                 vehicleNo: '0001',
//                 drivingLicenceNo: '1234'
//             },
//              {
//                 vehicleNo: '0002',
//                 drivingLicenceNo: '1235'
//             },
//              {
//                 vehicleNo: '0003',
//                 drivingLicenceNo: '1236'
//             },
//              {
//                 vehicleNo: '0004',
//                 drivingLicenceNo: '1237'
//             }
//         ];

//         for (let i = 0; i < cardriver.length; i++) {
//             cardriver[i].docType = 'car';
//             await ctx.stub.putState('CAR' + i, Buffer.from(JSON.stringify(cardriver[i])));
//             console.info('Added <--> ', cardriver[i]);
//         }
//         console.info('============= END : Initialize Ledger ===========');
//     }

//     async queryCar(ctx, vehicleNo,drivingLicenceNo) {
//         const carAsBytes = await ctx.stub.getState(vehicleNo); // get the car from chaincode state
// 	    const licenceAsBytes = await ctx.stub.getState(drivingLicenceNo); // get the car from chaincode state
//         if ((!carAsBytes || carAsBytes.length === 0) && (!licenceAsBytes || licenceAsBytes.length === 0 )) {
//             throw new Error(`${carNumber} does not exist`);
//         }
//         console.log(carAsBytes.toString());
//         return carAsBytes.toString();
//     }

  /*  async createCar(ctx, vehicleNo,drivingLicenceNo) {
        console.info('============= START : Create Car ===========');

        const car = {
            vehicleNo,
            docType: 'car',
            drivingLicenceNo
        };

        await ctx.stub.putState(vehicleNo, Buffer.from(JSON.stringify(car)));
        console.info('============= END : Create Car ===========');
	}*/

// }

// module.exports = Zkp;
