// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract Voter {
    
    struct voter {
        string name;
        string designation;
        bool voted;
        string votedTo;
        address myAddress;
    }
    
    voter [] public voters;
    
    function setVoter(string memory _name, string memory _designation, address _voter) public {
        voters.push(voter(_name, _designation, false, '', _voter ));
    }
    
    function getNumVoter() public view returns(uint){
        return voters.length;
    }
    function voteTo(address _votedBy, string memory _votedTo) public {
        for(uint i=0;i<voters.length; i++){
            if(voters[i].myAddress == _votedBy){
                voters[i].voted = true;
                voters[i].votedTo = _votedTo;
            }
        }
    }
}