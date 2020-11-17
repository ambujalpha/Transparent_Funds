// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract Voter {
    
    struct voter {
        string name;
        string designation;
        bool voted;
        address votedTo;
        address myAddress;
    }
    
    voter [] public voters;
    
    function setVoter(string memory _name, string memory _designation, address _voter) public {
        voters.push(voter(_name, _designation, false, address(0), _voter ));
    }
    
    function getNumVoter() public view returns(uint){
        return voters.length;
    }
    
}