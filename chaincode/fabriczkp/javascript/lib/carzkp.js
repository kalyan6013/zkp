/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Carzkp extends Contract {

    async init(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        let cars = [
            {
                vehicleNo: '0001',
                year: '1990',
            },
            {
                vehicleNo: '0002',
                year: '2000',
            },

            {
                vehicleNo: '0003',
                year: '2010',
            },

            {
                vehicleNo: '0004',
                year: '2009',
            },

            {
                vehicleNo: '0005',
                year: '2030',
            },
        ];

        for (let i = 0; i < cars.length; i++) {
            cars[i].docType = 'car';
            await ctx.stub.putState(cars[i].vehicleNo , Buffer.from(JSON.stringify(cars[i])));
            // await ctx.stub.putState(cars[i].year, Buffer.from(JSON.stringify(cars[i])));
            console.info('Added <--> ', cars[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryCar(ctx, vehicleNo) {
        const carAsBytes = await ctx.stub.getState(vehicleNo); // get the car from chaincode state
        // console.log(carAsBytes);
        console.log(carAsBytes.toString());
        let caryear = carAsBytes.toString();
        console.log("This is the year: "+ caryear.substring(28,32));
        let year = caryear.substring(28,32);
        console.log("Year : " +year.toString());
       
        if (!caryear || caryear.length === 0) {
            throw new Error(`${vehicleNo} Vehicle No does not exist`);
        }
        else{
            if(year < 1990 || year > 2020){
                console.log("Year inside if : "+ year.toString() );
                throw new Error('Car life span expired');
            }
        else{
            console.log(caryear.toString());
            let outputCarData = caryear.toString();
            return outputCarData;
            }
        }
        
    }

    // async createCar(ctx, vehicleNo) {
    //     console.info('============= START : Create Car ===========');
	
	// let vehicleState = await ctx.stub.getState(vehicleNo);
	// if (vehicleState.toString()){
	//    throw new Error('Data already exists: ' + vehicleNo)
	// }

	// const car = {
    //         vehicleNo,
    //         docType: 'car',
    //     };

    //     await ctx.stub.putState(vehicleNo, Buffer.from(JSON.stringify(car)));
    //     console.info('============= END : Create Car ===========');
	// return vehicleNo + " data inserted successfully";
    // }
   
    // async queryAllCars(ctx) {
    //     const startKey = '0001';
    //     const endKey = '9999';

    //     const iterator = await ctx.stub.getStateByRange(startKey, endKey);

    //     const allResults = [];
    //     while (true) {
    //         const res = await iterator.next();

    //         if (res.value && res.value.value.toString()) {
    //             console.log(res.value.value.toString('utf8'));

    //             const Key = res.value.key;
    //             let Record;
    //             try {
    //                 Record = JSON.parse(res.value.value.toString('utf8'));
    //             } catch (err) {
    //                 console.log(err);
    //                 Record = res.value.value.toString('utf8');
    //             }
    //             allResults.push({ Key, Record });
    //         }
    //         if (res.done) {
    //             console.log('end of data');
    //             await iterator.close();
    //             console.info(allResults);
    //             return JSON.stringify(allResults);
    //         }
    //     }
    // }
}

module.exports = Carzkp;