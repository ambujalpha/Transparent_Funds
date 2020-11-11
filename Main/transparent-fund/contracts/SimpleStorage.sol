// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract SimpleStorage {
    
    struct Voter {
        bool authorized;
        bool voted;
        uint vote;
    }
    struct Canditate {
        string name;
        uint voteCount;
    }
    
    string public electionName;
    address public owner;
    mapping(address =>Voter) public voters;
    Canditate[] public candidates;
    uint public totalVotes;

    constructor() public {
        owner = msg.sender;
    }

    modifier ownerOnly()
    {
        require(msg.sender == owner);
        _;
    }

    function setElectionName(string memory name) public {
        electionName = name;
    }

    function getElectionName() public view returns (string memory) {
        return electionName;
    }
    
    function authorize(address _person) ownerOnly public {
        voters[_person].authorized = true;
    }
    
    function addCandidate(string memory _name) ownerOnly public {
        Canditate memory newStruct = Canditate(_name, 0);
        candidates.push(newStruct);
    }

    function getNumCandidate() public view returns (uint) {
        return candidates.length;
    }
    
    function vote(uint _voteIndex) public{
        require(!voters[msg.sender].voted);
        require(voters[msg.sender].authorized);

        voters[msg.sender].vote = _voteIndex;
        voters[msg.sender].voted = true;

        candidates[_voteIndex].voteCount += 1;
        totalVotes += 1;
    }
}