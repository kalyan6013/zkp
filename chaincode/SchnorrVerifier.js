// pragma solidity ^0.4.24;
// pragma experimental ABIEncoderV2;

// import "./alt_bn128.sol";
import './alt_bn128.js';
import {PublicParameters} from "./PublicParameters.js";

function SchnorrVerifier() {
    let alt_bn128;
    // using alt_bn128 for alt_bn128.G1Point;

    // constructor() {

    // }

    function verifySignature(
         _hash,
         _s,
         _e,
         _generator,
         _publicKey
    )  {
        alt_bn128.G1Point 
        // memory generator 
        = alt_bn128.G1Point(_generator[0], _generator[1]);
        alt_bn128.G1Point 
        // memory publicKey 
        = alt_bn128.G1Point(_publicKey[0], _publicKey[1]);
        return verifySignatureAsPoints(_hash, _s, _e, generator, publicKey);
    }


    function verifySignatureAsPoints(
        _hash,
        _s,
        _e,
        // alt_bn128.G1Point _generator,
        alt_bn128G1Point = _generator,
        // alt_bn128.G1Point _publicKey
        alt_bn128G1Point = _publicKey
    ) {
        alt_bn128G1Point 
        // memory r_V 
        = _generator.mul(_s).add(_publicKey.mul(_e));
        // uint256
        let e_V = uint256(keccak256(r_V.X, r_V.Y, _publicKey.X, _publicKey.Y, _hash));
        return e_V == _e;
    }
}