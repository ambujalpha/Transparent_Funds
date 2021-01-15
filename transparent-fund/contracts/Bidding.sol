pragma solidity >=0.4.21 <0.7.0;

contract Bidding {
    
    struct Bid{
        uint Cost;
        string CompanyName;
        string prevWork;
        string domain;
        string contractID;
    }
    
    Bid [] public topBids;
    
    function setTopBids(uint _cost, string memory _companyName, string memory _prevWork, string memory _domain, string memory _contractID) public {
        topBids.push(Bid(_cost, _companyName, _prevWork, _domain, _contractID));
    }
    function getNumBids() public view returns(uint){
        return topBids.length;
    }
}

