pragma solidity >=0.4.21 <0.7.0;

contract Bidding {
    
    struct Bid{
        uint Cost;
        string CompanyName;
        string prevWork;
        string domain;
    }
    
    Bid [] public topBids;
    
    function setTopBids(uint _cost, string memory _companyName, string memory _prevWork, string memory _domain) public {
        topBids.push(Bid(_cost, _companyName, _prevWork, _domain));
    }
    function getNumBids() public view returns(uint){
        return topBids.length;
    }
}

