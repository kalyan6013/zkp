function Conversion() {

    // function uintToBytes(uint256 self) internal pure returns (bytes memory s) {
        function intToBytes(self) {
        if (self == 0) {
            return "0";
        }
        let maxlength = 100;
        bytes = new bytes(maxlength);
        let i = 0;
        let num = self;
        while (num != 0) {
            let remainder = num % 10;
            num = num / 10;
            reversed[i++] = byte(48 + remainder);
        }
        s = new bytes(i);
        for (let j = 0; j < i; j++) {
            s[j] = reversed[i - 1 - j];
        }
        return s;
    }
}