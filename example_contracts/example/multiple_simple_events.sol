
pragma solidity 0.8.13;

contract MultipleSimpleEvents {
    event Transfer(address indexed _from, uint256 value);

    event LongTransfer(address indexed _from, uint256 value, uint256 fee, uint256 currency);

    function transfer(uint256 _value) public {
        emit Transfer(msg.sender, _value);
    }

    function longTransfer(uint256 _value) public {
        emit LongTransfer(msg.sender, _value, 50, 10);
    }
}
