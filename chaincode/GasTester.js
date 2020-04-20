// pragma solidity ^0.4.24;
// pragma experimental ABIEncoderV2;

import * as alt_bn128 from './alt_bn128.js';
// import "./alt_bn128.sol";
import * as Conversion from './Conversion.js';

function GasTester() {
    let alt_bn128 = alt_bn128.G1Point;
    let alt_bn128
    // using alt_bn128 for uint256[2];
    let Conversion

    let ECADDPrice;
    let ECMULPrice;
    let MODINVPrice;
    // uint256 public pointGenPrice;
    let pointGenPrice

    // constructor() public {

    // }

    function testECADD(gasUsage) {
        alt_bn128.G1Point = alt_bn128.G1Point(1,2);
        gasUsage = gasleft();
        point = point.add(point);
        gasUsage -= gasleft();
        ECADDPrice = gasUsage;
        return gasUsage;
    }

    // function testECADD() public returns (uint256 gasUsage) {
    //     uint256[2] memory point = [uint256(1),uint256(2)];
    //     gasUsage = gasleft();
    //     point = point.add(point);
    //     gasUsage -= gasleft();
    //     ECADDPrice = gasUsage;
    //     return gasUsage;
    // }

    function testECMUL(gasUsage) {
        alt_bn128.G1Point = alt_bn128.G1Point(1, 2);
        gasUsage = gasleft();
        point = point.mul(uint256(100));
        gasUsage -= gasleft();
        ECMULPrice = gasUsage;
        return gasUsage;
    }

    // function testECMUL() public returns (uint256 gasUsage) {
    //     uint256[2] memory point = [uint256(1),uint256(2)];
    //     gasUsage = gasleft();
    //     point = point.mul(uint256(100));
    //     gasUsage -= gasleft();
    //     ECMULPrice = gasUsage;
    //     return gasUsage;
    // }

    function testMODINV(gasUsage) {
        let num 
        gasUsage = gasleft();
        num = num.inv();
        gasUsage -= gasleft();
        MODINVPrice = gasUsage;
        return gasUsage;
    }

    // function testPointGen() public returns(uint256 gasUsage) {
    //     uint256 index = 1;
    //     bytes32 h = keccak256("G", index.uintToBytes());
    //     gasUsage = gasleft();
    //     alt_bn128.G1Point memory g1p = alt_bn128.uintToCurvePoint(uint256(h));
    //     gasUsage -= gasleft();
    //     pointGenPrice = gasUsage;
    //     return gasUsage;
    // }

    function testPointGen(gasUsage) {
        gasUsage = gasleft();
        alt_bn128.G1Point = alt_bn128.uintToCurvePoint();
        gasUsage -= gasleft();
        pointGenPrice = gasUsage;
        return gasUsage;
    }
}