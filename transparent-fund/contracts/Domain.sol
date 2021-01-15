// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract Domain {
    
    struct domain {
        uint id;
        string name;
        string description;
        string date;
        bool enabled;
    }
    
    domain [] public domains;
    
    constructor() public{
        domains.push(domain(0, "Drainage pattern renewal","To improve the drainage pattern system in Mawaiya area","10 MAY - 10 July", true));
        domains.push(domain(1, "School building","Construction of new primary school building in Bhola Khera village","10 MAY - 10 July", true));
        domains.push(domain(2, "Road construction","Maintenance of 2 lane road for 10km stretch","10 MAY - 10 July", true));
        domains.push(domain(3,"Park and playground","Renewal of old park under Nigar Nigam Lucknow","10 MAY - 10 July", true));
        domains.push(domain(4, "Hospital building construction","Govt hospital near Munnu Khera village area for basic treatment","10 MAY - 10 July", true));
    }
    
    function getNumDomain() public view returns (uint) {
        return domains.length;
    }
    
    function enableDomain(uint _id) public {
        for(uint i=0;i<domains.length;i++){
           if(domains[i].id == _id){
               domains[i].enabled = true;
           } 
        }
    }
    function disableDomain(uint _id) public {
        for(uint i=0;i<domains.length;i++){
           if(domains[i].id == _id){
               domains[i].enabled = false;
           } 
        }
    }
}