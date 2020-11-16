pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

contract Bidding {
    
    struct Bid{
        uint Cost;
        string[] Form;
    }
    Bid [] public topBids;
    address public owner;
    
    function setOwner () public{
        owner = msg.sender;
    }
    function setTopBids(uint cost, string[] memory form) public {
        Bid memory newBid = Bid(cost, form);
        topBids.push(newBid);
    }
    function getNumBids() public view returns(uint){
        return topBids.length;
    }
}

