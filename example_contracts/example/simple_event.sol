
pragma solidity 0.8.13;

contract EventsExample {
    event Transfer(address indexed _from, uint256 value);

    function transfer(uint256 _value) public {
        emit Transfer(msg.sender, _value);
    }
}
