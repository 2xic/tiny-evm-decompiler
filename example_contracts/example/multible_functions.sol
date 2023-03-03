pragma solidity 0.8.13;

contract MultipleFunctions {
    function sayHelloWorld() public pure returns (string memory) {
        return "Hello World, okay";
    }

    function sayHelloEvm() public pure returns (string memory) {
        return "Hello evm";
    }
}
