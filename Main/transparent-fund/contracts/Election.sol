pragma solidity ^0.5.0;

contract Election {

    struct Canditate {
        string name;
        uint voteCount;
    }
    struct Voter {
        bool authorized;
        bool voted;
        uint vote;
    }

    address payable public owner;
    string public electionName;

    mapping(address =>Voter) public voters;
    Canditate[] public candidates;
    uint public totalVotes;

    modifier ownerOnly()
    {
        require(msg.sender == owner);
        _;
    }

    // constructor(string memory _name) public{
    //     owner = msg.sender;
    //     electionName = _name;
    // }
    constructor() public {
        owner = msg.sender;
    }

    function setElectionName(string memory name) public{
        electionName = name;
    }

    function addCandidate(string memory _name) ownerOnly public {
        Canditate memory newStruct = Canditate(_name, 0);
        candidates.push(newStruct);
    }

    function getNumCandidate() public view returns (uint) {
        return candidates.length;
    }

    function authorize(address _person) ownerOnly public {
        voters[_person].authorized = true;
    }

    function vote(uint _voteIndex) public{
        require(!voters[msg.sender].voted);
        require(voters[msg.sender].authorized);

        voters[msg.sender].vote = _voteIndex;
        voters[msg.sender].voted = true;

        candidates[_voteIndex].voteCount += 1;
        totalVotes += 1;
    }

    function end() ownerOnly public { 
    selfdestruct(owner);
    }
}

