/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Zkp extends Contract {

    async init(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        let cars = [
            {
                vehicleNo: '0001',
            },
            {
                vehicleNo: '0002',
            },

            {
                vehicleNo: '0003',
            },

            {
                vehicleNo: '0004',
            },

            {
                vehicleNo: '0005',
            },
        ];

        let drivers = [
            {
                licenceNo: '1234',
            },
            {
                licenceNo: '1235',
            },

            {
                licenceNo: '1236',
            },

            {
                licenceNo: '1237',
            },

            {
                licenceNo: '1238',
            },

        ];

        for (let i = 0; i < cars.length; i++) {
            cars[i].docType = 'car';
            await ctx.stub.putState(cars[i].vehicleNo , Buffer.from(JSON.stringify(cars[i])));
            console.info('Added <--> ', cars[i]);
        }
        for (let j = 0; j < drivers.length; j++) {
            drivers[j].docType = 'driver';
            await ctx.stub.putState(drivers[j].licenceNo , Buffer.from(JSON.stringify(drivers[j])));
            console.info('Added <--> ', drivers[j]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryCar(ctx, vehicleNo, licenceNo) {
	//let cNum = vehicleNo;
//	console.log(vehicleNo);
        const carAsBytes = await ctx.stub.getState(vehicleNo); // get the car from chaincode state
	console.log(carAsBytes.toString());
        const driverAsBytes = await ctx.stub.getState(licenceNo);
        if((!carAsBytes || carAsBytes.length === 0) && (!driverAsBytes || driverAsBytes.length === 0)){
	    throw new Error(`Both car and driver data does not exist`);
	}else{
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${vehicleNo} Vehicle No does not exist`);
            //console.info(`${CarNumber} does not exist`);
        }
        if(!driverAsBytes || driverAsBytes.length === 0){
            throw new Error(`${licenceNo} Driving Licence No does not exist`);
            //console.info(`${DriverNumber} does not exist`);
        }
    }
        console.log(carAsBytes.toString());
        console.log(driverAsBytes.toString());
	let outputCarData = carAsBytes.toString();
	let outputDriverData = driverAsBytes.toString();
	let output = outputCarData + outputDriverData;
        return output;
    }

    async createCar(ctx, vehicleNo) {
        console.info('============= START : Create Car ===========');
	
	let vehicleState = await ctx.stub.getState(vehicleNo);
	if (vehicleState.toString()){
	   throw new Error('Data already exists: ' + vehicleNo)
	}

	const car = {
            vehicleNo,
            docType: 'car',
        };

        await ctx.stub.putState(vehicleNo, Buffer.from(JSON.stringify(car)));
        console.info('============= END : Create Car ===========');
	return vehicleNo + " data inserted successfully";
    }
    async createDriver(ctx, licenceNo) {
        console.info('============= START : Create Driver ===========');

	let driverState = await ctx.stub.getState(licenceNo);
	if (driverState.toString()){
	   throw new Error('Data already exists: ' + licenceNo)
	}

        const driver = {
            licenceNo,
            docType: 'driver',
        };

        await ctx.stub.putState(licenceNo, Buffer.from(JSON.stringify(driver)));
        console.info('============= END : Create Driver ===========');
	return licenceNo + " data inserted successfully";
    }


    async queryAllCars(ctx) {
        const startKey = '0001';
        const endKey = '9999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
}

    async queryAllDrivers(ctx) {
	const startKey1 = '1234';
        const endKey1 = '9999';

        const iterator1 = await ctx.stub.getStateByRange(startKey1, endKey1);

        const allResults1 = [];
        while (true) {
            const res1 = await iterator1.next();

            if (res1.value && res1.value.value.toString()) {
                console.log(res1.value.value.toString('utf8'));

                const Key1 = res1.value.key;
                let Record1;
                try {
                    Record1 = JSON.parse(res1.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record1 = res1.value.value.toString('utf8');
                }
                allResults1.push({ Key1, Record1 });
            }
            if (res1.done) {
                console.log('end of data');
                await iterator1.close();
                console.info(allResults1);
                return JSON.stringify(allResults1);
            }
        }
    }

}

module.exports = Zkp;
