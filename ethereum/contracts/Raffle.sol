//SPDX-License-Identifier: UNLICENSED
pragma solidity >= 0.5.0 <= 0.9.0;

contract RaffleFactory {

    address payable[] public deployedRaffles;

    function createRaffle(uint contribution) public {
        address newRaffle = address(new Raffle(contribution, msg.sender));
        deployedRaffles.push(payable(newRaffle));
    }

    function deployedCampaigns() public view returns (address payable[] memory){
        return deployedRaffles;
    }

}

contract Raffle {

    uint public contribution;
    address payable public manager;
    address payable[] partecipants;

    constructor(uint _contribution, address _manager ) {
        manager = payable(_manager);
        contribution = _contribution;
    }

    modifier restricted() {
        assert(msg.sender == manager);
        _;
    }

    function partecipantsList() public view returns (address payable[] memory) {
        return partecipants;
    }

    function enterRaffle() public payable{
        assert(contribution == msg.value && msg.sender != manager);
        partecipants.push(payable(msg.sender));
    }

    function randomNumber() private view returns (uint){
               return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, partecipants))) % partecipants.length;
    }

    function pickWinner() public payable restricted{
        assert(partecipants.length >= 1);
        manager.transfer(address(this).balance / 5);
        partecipants[randomNumber()].transfer(address(this).balance);
        partecipants = new address payable[](0);
    }

}
