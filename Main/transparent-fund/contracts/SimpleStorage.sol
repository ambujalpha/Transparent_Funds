// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract SimpleStorage {
    
    struct Voter {
        bool authorized;
        bool voted;
        address votedTo;
    }
    struct Canditate {
        address name;
        uint voteCount;
    }
    struct Tender{
        bool status;
        string name;
        string description;
        uint date;
    }
    
    
    address public owner;
    mapping(address =>Voter) public voters;
    Canditate[] public candidates;
    Tender[] public tenders;
    address[] public votersAddress;

    uint public totalVotes;

    // constructor() public {
    //     owner = msg.sender;
    // }
    
    function setOwner () public{
        require(owner == address(0), "owner is already defined");
        owner = msg.sender;
    }

    modifier ownerOnly(){
        require(msg.sender == owner, "sender is not owner of contract");
        _;
    }

    function setTender (string memory name,string memory description, uint date) ownerOnly public {
        Tender memory newTender = Tender(true, name, description, date);
        tenders.push(newTender);
    }
    function getNumTenders() public view returns (uint) {
        return tenders.length;
    }
    function removeTender(uint _id) public{
        require(_id < tenders.length);
        Tender memory newTender = Tender(false, tenders[_id].name, tenders[_id].description, tenders[_id].date);
        tenders[_id] = newTender;
    }
    
    function authorize(address _person) ownerOnly public {
        voters[_person].authorized = true;
    }
    
    function addCandidate(address _name) ownerOnly public {
        Canditate memory newStruct = Canditate(_name, 0);
        candidates.push(newStruct);
    }

    function getNumCandidate() public view returns (uint) {
        return candidates.length;
    }
    function removeAllCandidates() public {
        delete candidates;
    }
    function vote(address _voteAddress) public{
        require(!voters[msg.sender].voted);
        require(voters[msg.sender].authorized);

        voters[msg.sender].votedTo = _voteAddress;
        voters[msg.sender].voted = true;

    }
}