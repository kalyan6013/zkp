// pragma solidity ^0.4.24;
// pragma experimental ABIEncoderV2;

import "./alt_bn128.js";
import {EfficientInnerProductVerifier} from "./EfficientInnerProductVerifier.js";
import {PublicParameters} from "./PublicParameters.js";

// contract 
function RangeProofVerifier() {
    let alt_bn128;
    // using alt_bn128 for uint256;
    // using alt_bn128 for alt_bn128.G1Point;
    let alt_bn128G1Point;
    // event DebugEvent(uint256 a, uint256 b, uint256 c);
    // event
     DebugEvent(a,b,c);

    // uint256 public constant m = 64;
    // uint256 public constant n = 6;
    const m=64, n=6;

    PublicParameters public publicParameters;
    EfficientInnerProductVerifier public ipVerifier;

    // uint256[m] public twos;
    // uint256 public lastPowerCreated = 0;

    constructor (
        // address 
        _publicParameters,
        // address 
        _ipVerifier
    )
    //  public 
     {
        require(_publicParameters != address(0));
        require(_ipVerifier != address(0));
        publicParameters = PublicParameters(_publicParameters);
        ipVerifier = EfficientInnerProductVerifier(_ipVerifier);
        require(m == publicParameters.m());
        require(n == publicParameters.n());
        require(m == ipVerifier.m());
        require(n == ipVerifier.n());
    }

    function verify(
        // uint256[10] 
        coords=[], // [input_x, input_y, A_x, A_y, S_x, S_y, commits[0]_x, commits[0]_y, commits[1]_x, commits[1]_y]
        // uint256[5]
         scalars=[], // [tauX, mu, t, a, b]
        // uint256[2*n]
         ls_coords=[], // 2 * n
        // uint256[2*n]
         rs_coords=[]  // 2 * n
    ) 
    // public 
    // // view 
    // returns (bool) 
    {
        RangeProof memory rangeProof;
        // alt_bn128.G1Point memory input = alt_bn128.G1Point(coords[0], coords[1]);
        alt_bn128.G1Point = alt_bn128.G1Point(coords[0], coords[1]);
        rangeProof.A = alt_bn128.G1Point(coords[2], coords[3]);
        rangeProof.S = alt_bn128.G1Point(coords[4], coords[5]);
        rangeProof.commits = [alt_bn128.G1Point(coords[6], coords[7]), alt_bn128.G1Point(coords[8], coords[9])];
        rangeProof.tauX = scalars[0];
        rangeProof.mu = scalars[1];
        rangeProof.t = scalars[2];
        InnerProductProof memory ipProof;
        rangeProof.ipProof = ipProof;
        ipProof.ls = ls_coords;
        ipProof.rs = rs_coords;
        ipProof.a = scalars[3];
        ipProof.b = scalars[4];
        return verifyInternal(input, rangeProof);
    }

    // struct RangeProof {
    //     alt_bn128.G1Point A;
    //     alt_bn128.G1Point S;
    //     alt_bn128.G1Point[2] commits;
    //     let tauX,mu,t;
    //     // uint256 tauX;
    //     // uint256 mu;
    //     // uint256 t;
    //     InnerProductProof ipProof;
    // }

    function makeStrut(names){
        var names = names.split(' ');
        var count = names.length;
        function constructor() {
          for (var i = 0; i < count; i++) {
            this[names[i]] = arguments[i];
          }
        }
        return constructor;
      }
    

    var RangeProof = makeStrut("A,S,commits,tauX,mu,t,ipProof");

    // struct InnerProductProof {
    //     uint256[2*n] ls;
    //     uint256[2*n] rs;
    //     let a,b;
    //     // uint256 a;
    //     // uint256 b;
    // }

    function makeStruts(names){
        var names = names.split(' ');
        var count = names.length;
        function constructor() {
          for (var i = 0; i < count; i++) {
            this[names[i]] = arguments[i];
          }
        }
        return constructor;
      }

      var InnerProductProof = makeStruts("ls,rs,a,b");
    
    // event Proof(uint256 x, uint256 y);
     Proof( x,  y);


    // struct Board {
    //     // uint256 yuint256;
    //     let y,z,zSquared,zCubed,x,k,uChallenge;
    //     uint256[m] ys;
    //     // uint256 z;
    //     // uint256 zSquared;
    //     // uint256 zCubed;
    //     uint256[m] twoTimesZSquared;
    //     // uint256 x;
    //     alt_bn128.G1Point lhs;
    //     // uint256 k;
    //     alt_bn128.G1Point rhs;
    //     // uint256 uChallenge;
    //     alt_bn128.G1Point u;
    //     alt_bn128.G1Point P;
    // }

    function makeStruct1(){
        var names = names.split(' ');
        var count = names.length;
        function constructor() {
          for (var i = 0; i < count; i++) {
            this[names[i]] = arguments[i];
          }
        }
        return constructor;
      }
    }

    var Board=makeStruct1("y,z,zSquared,zCubed,x,k,uChallenge,ys=[m],twoTimesZSquared=[m],lhs,rhs,u,p");

    function verifyInternal(
        // alt_bn128.G1Point input,
        alt_bn128G1Point = input,
        RangeProof proof
    ) 
    // internal 
    // view 
    // returns (bool) 
    {
        // alt_bn128.G1Point memory G = publicParameters.G();
        alt_bn128G1Point = G
        G = publicParameters.G()
        alt_bn128G1Point =H
        //  memory 
         H = publicParameters.H();
        alt_bn128G1Point[m] =gs
        // memory
         gs = publicParameters.gs();
        alt_bn128G1Point[m] = hs
        //  memory 
         hs = publicParameters.hs();
        // Board memory b;
        Board = b;
        
        b.y = uint256(keccak256(input.X, input.Y, proof.A.X, proof.A.Y, proof.S.X, proof.S.Y)).mod();
        b.ys = powers(b.y);
        b.z = uint256(keccak256(b.y)).mod();
        b.zSquared = b.z.mul(b.z);
        b.zCubed = b.zSquared.mul(b.z);
        b.twoTimesZSquared = times(powers(2), b.zSquared);
        b.x = uint256(keccak256(proof.commits[0].X, proof.commits[0].Y, proof.commits[1].X, proof.commits[1].Y)).mod();
        b.lhs = G.mul(proof.t).add(H.mul(proof.tauX));
        b.k = sumScalars(b.ys).mul(b.z.sub(b.zSquared)).sub(b.zCubed.mul(2 ** m).sub(b.zCubed));
        b.rhs = proof.commits[0].mul(b.x).add(proof.commits[1].mul(b.x.mul(b.x)));
        b.rhs = b.rhs.add(input.mul(b.zSquared));
        b.rhs = b.rhs.add(G.mul(b.k));
        if (!b.rhs.eq(b.lhs)) {
            return false;
        }
        b.uChallenge = uint256(keccak256(proof.tauX, proof.mu, proof.t)).mod();
        b.u = G.mul(b.uChallenge);
        alt_bn128G1Point[m] = hPrimes
        // memory 
        hPrimes = haddamard(hs, powers(b.y.inv())); // the most expensive, roughly 64*40000 gas
        // uint256[m] memory hExp = addVectors(times(b.ys, b.z), b.twoTimesZSquared);
        let hExp = addVectors(times(b.ys, b.z), b.twoTimesZSquared);
        b.P = proof.A.add(proof.S.mul(b.x));
        b.P = b.P.add(sumPoints(gs).mul(b.z.neg()));
        b.P = b.P.add(commit(hPrimes, hExp)); // the most expensive, 64*40000
        b.P = b.P.add(H.mul(proof.mu).neg());
        b.P = b.P.add(b.u.mul(proof.t));
        return ipVerifier.verifyWithCustomParams(b.P, proof.ipProof.ls, proof.ipProof.rs, proof.ipProof.a, proof.ipProof.b, gs, hPrimes, b.u);
    }

    function addVectors(
        // uint256[m] 
        a, 
        // uint256[m] 
        b) 
        // internal pure returns (uint256[m] result) 
        {
        for (
            // uint256 
            i = 0; i < m; i++) {
            result[i] = a[i].add(b[i]);
        }
    }

    function haddamard(
        // alt_bn128.G1Point[m] 
        ps=[m], 
        // uint256[m] 
        ss=[m])
    //  internal view returns (alt_bn128.G1Point[m] result) 
     {
        alt_bn128G1Point[m]= ps
    // function haddamard(alt_bn128G1Point[m] ps, ss) i {
        function haddamard(ps, ss){
        for (
            // uint256
             i = 0; i < m; i++) {
            result[i] = ps[i].mul(ss[i]);
        }
    }

   
    function sumScalars(
        // uint256[m] 
        ys=[m]) 
    // internal pure returns (uint256 result) 
    {
        for ( i = 0; i < m; i++) {
            result = result.add(ys[i]);
        }
    }

    function sumPoints(
        // alt_bn128.G1Point[m] 
        ps=[m]) 
    // internal view returns (alt_bn128.G1Point sum) 
    {
        sum = ps[0];
        for ( i = 1; i < m; i++) {
            sum = sum.add(ps[i]);
        }
    }

    function commit(
        // alt_bn128.G1Point[m] 
        ps=[m], 
        // uint256[m] 
        ss=[m]) 
    // internal view returns (alt_bn128.G1Point commit) 
    {
        commit = ps[0].mul(ss[0]);
        for ( i = 1; i < m; i++) {
            commit = commit.add(ps[i].mul(ss[i]));
        }
    }

    function powers(
        // uint256
         base)
    //  internal pure returns (uint256[m] powers) 
     {
        powers[0] = 1;
        powers[1] = base;
        for ( i = 2; i < m; i++) {
            powers[i] = powers[i-1].mul(base);
        }
    }

    // function powers(uint256 base, uint256 firstPower, uint256 numberOfPowers)
    function powers(base,firstPower,numberOfPowers)
    //  internal pure returns (uint256[] powers) 
     {
        // uint256[] memory pwrs = new uint256[](numberOfPowers);
        let pwrs=[];
        pwrs=numberOfPowers;
        pwrs[0] = 1;
        // uint256
        let  i = 0;
        if (firstPower != 0) {
            for (i = 0; i < firstPower; i++) {
                pwrs[0] = pwrs[0].mul(base);
            }
        } 
        for (i = 1; i < numberOfPowers; i++) {
            pwrs[i] = pwrs[i-1].mul(base);
        }
        return pwrs;
    }

    function times(
        // uint256[m] 
        v, 
        // uint256 
        x) 
    // internal pure returns (uint256[m] result) 
    {
        for ( i = 0; i < m; i++) {
            result[i] = v[i].mul(x);
        }
    }
}