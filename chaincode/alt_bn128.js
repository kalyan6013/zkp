function makeStruct(names) {
    var names = names.split(' ');
    var count = names.length;
    function constructor() {
      for (var i = 0; i < count; i++) {
        this[names[i]] = arguments[i];
      }
    }
    return constructor;
  }
  var G1Povar = makeStruct("x y");
 // var example = new Item(2,3);
  function add( p1,  p2)  {
    var  input=[];
    input[0] = p1.X;
    input[1] = p1.Y;
    input[2] = p2.X;
    input[3] = p2.Y;
    
        if (call(not(0), 6, input, 0x80, r, 0x40)==0) {
            revert(0, 0)
        }
}
//Commented is the originial code in all places

//Here we are using struct variable to assign p
// function mul(G1Povar p, var s) (G1Povar r) {
    function mul( p, s) {
    if (s == 1) {
        return p;
    }
    if (s == 2) {
        return add(p, p);
    }
    // var[3] memory input;
    var input = [3];
    input[0] = p.X;
    input[1] = p.Y;
    input[2] = s;
    // assembly {
        // if iszero(staticcall(not(0), 7, input, 0x60, r, 0x40)) {
            if (staticcall(not(0), 7, input, 0x60, r, 0x40)) {
            revert(0, 0)
        }
   
}

// function neg(G1Povar p) varernal pure returns (G1Povar) {
    function neg(p) {
    if (p.X == 0 && p.Y == 0)
        return G1Povar(0, 0);
    var n = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
    return G1Povar(p.X, n - p.Y);
    // return G1Povar(p.X, n - (p.Y % n));

    }
// function eq(G1Povar p1, G1Povar p2) varernal pure returns (bool) {
    function eq(p1, p2) {

    return p1.X == p2.X && p1.Y == p2.Y;

    }
// function add(var x, var y)  {
    function add(x, y){
    var q = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    return addmod(x, y, q);
}

// function mul(var x, var y)  {
    function mul(x, y)  {
    var q = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    return mulmod(x, y, q);
}

function inv( x)  {
    var p = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    var a = x;
    if (a == 0)
        return 0;
    if (a > p)
        a = a % p;
    var t1;
    var t2 = 1;
    var r1 = p;
    var r2 = a;
    var q;
    while (r2 != 0) {
        q = r1 / r2;
        t1 = t2 = r1 = r2 = (t2, t1 - (q) * t2, r2, r1 - q * r2);
    }
    if (t1 < 0)
        return (p - (-t1));
    return (t1);
}

function mod( x)  {
    var q = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    return x % q;
}

function sub( x,  y)  {
    var q = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    return x >= y ? x - y : q - y + x;
}

function neg( x)  {
    return 21888242871839275222246405745257275088548364400416034343698204186575808495617 - x;
}

function modExp( base,  exponent,  modulus)  {
    var  input=[];
    var  output=[];
    input[0] = 0x20;  // length_of_BASE
    input[1] = 0x20;  // length_of_EXPONENT
    input[2] = 0x20;  // length_of_MODULUS
    input[3] = base;
    input[4] = exponent;
    input[5] = modulus;
       if (call(not(0), 5, input, 0xc0, output, 0x20)==0) {
            revert(0, 0)
        }
    
    return output[0];
}

function modExp( base,  exponent)  {
    var q = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    return modExp(base, exponent, q);
}

function hashToCurve( input)  {
    var seed = (keccak256(input));
    return varToCurvePovar(seed);
}

function varToCurvePovar( x) {
    var n = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
    var seed = x % n;
    var y;
    seed -= 1;
    var onCurve = false;
    var y2;
    var b = (3);
    while(!onCurve) {
        seed += 1;
        y2 = mulmod(seed, seed, n);
        y2 = mulmod(y2, seed, n);
        y2 = addmod(y2, b, n);
        // y2 += b;
        y = modExp(y2, (n + 1) / 4, n);
        onCurve = mulmod(y, y, n) == y2;
    }
    return G1Povar(seed, y);

}
var a = varToCurvePovar(21);
console.log("output",a);
export function makeStruct(){
    
}
