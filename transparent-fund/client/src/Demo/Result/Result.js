/* eslint-disable no-loop-func */
import React,{useEffect, useState} from 'react';
import {Row, Col, Card, Table, Tabs, Tab, Form, Button} from 'react-bootstrap';
import DomainContract from '../../contracts/Domain.json';
import BiddingContract from '../../contracts/Bidding.json';
import Web3 from 'web3';

import Aux from "../../hoc/_Aux";
import DEMO from "../../store/constant";

import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../assets/images/user/avatar-3.jpg';

const Dashboard = () =>{
    const [accounts, setAccounts] = useState(null);
    const [domainContract, setDomainContract] = useState(null);
    const [biddingContract, setBiddingContract] = useState(null);
    const [allDomains, setAllDomains] = useState([]);
    const [allBidders, setAllBidders] = useState([]);

    useEffect(() => {
        async function intialize(){
          await initMetamask();
        }
        intialize();
        window.ethereum.on('accountsChanged', intialize)

      }, [])
      const initMetamask = async () => {
        console.log('clicked')
        window.ethereum.enable()
        //setting up web3 to talk to meta mask
        const web3 = new Web3(Web3.givenProvider);
        const acc = await web3.eth.getAccounts()
        console.log('accounts', acc)
        const deployedDomainNetwork = DomainContract.networks["5777"];
        const deployedBiddingNetwork = BiddingContract.networks["5777"];

        const domainInstance = new web3.eth.Contract(
            DomainContract.abi,
            deployedDomainNetwork && deployedDomainNetwork.address
        );
        const biddingInstance = new web3.eth.Contract(
            BiddingContract.abi,
            deployedBiddingNetwork && deployedBiddingNetwork.address
        );
        console.log('bidding contract is: ', biddingInstance);
        console.log('domain contract is: ', domainInstance);
        setAccounts(acc[0])
        setDomainContract(domainInstance);
        setBiddingContract(biddingInstance);

    };
    useEffect(() => {
        const getAllDomains = async () => {
            await domainContract.methods.getNumDomain().call(async (err, num) => {
                const numDomains = parseInt(num);
                const arr = [];
                console.log('total domains are: ', numDomains)
                for (let index = 0; index < numDomains; index++) {
                    await domainContract.methods.domains(index).call((err, domain)=>{
                        arr.push(domain)
                    //  console.log('tender: ',tender)
                    })
                }
                setAllDomains(arr);
                console.log(arr)
            })
        }

        const getAllBidders = async () => {
            await biddingContract.methods.getNumBids().call(async (err, num) => {
                const numBidders = parseInt(num);
                const arr = [];
                console.log('total bids are: ', numBidders)
                for (let index = 0; index < numBidders; index++) {
                    await biddingContract.methods.topBids(index).call((err, domain)=>{
                        arr.push(domain)
                        //  console.log('tender: ',tender)
                    })
                }
                
                console.log(arr);
                setAllBidders(arr);
            })
        }
        if(domainContract && biddingContract){
             getAllDomains();
             getAllBidders();
        }
    }, [domainContract, biddingContract]) 
    
    const card = (title, bidders) => {
        return (
            <Card>
                <Card.Header>
                    <Card.Title as='h5'>Fire System</Card.Title>
                </Card.Header>
                <Card.Body>
                    <div className="row align-items-center justify-content-center m-b-20">
                        <div className="col-6">
                            <h2 className="f-w-300 d-flex align-items-center float-left m-0">{}</h2>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xl-12">
                            <h6 className="align-items-center float-left">{}</h6>
                            <h6 className="align-items-center float-right">{}</h6>
                            <div className="progress m-t-30 m-b-20" style={{height: '6px'}}>
                                <div className="progress-bar progress-c-theme" role="progressbar" style={{width: '70%'}} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"/>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        )
    }
    const findWinner = (name) => {
        let winner = Number.MAX_SAFE_INTEGER;
        let ans = null;
        for (let index = 0; index < allBidders.length; index++) {
            const cost = parseInt(allBidders[index].Cost);
            if(cost < winner && name === allBidders[index].domain){
                winner = cost;
                ans = allBidders[index].CompanyName;
            }
        
        }
        return {ans, winner};
    }
    return (
        <Aux>
            <Row>

                <Col md={6} xl={4}>
                    {
                        allDomains.map((domain, index) => (
                            domain.enabled ?
                            (null):
                            (
                                <Card key={index}>
                                    <Card.Header>
                                        <Card.Title as='h5'>{domain.name}</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="row align-items-center justify-content-center m-b-20">
                                            <div className="col-6">
                                                <h2 className="f-w-300 d-flex align-items-center float-left m-0">{findWinner(domain.name).ans}</h2>
                                            </div>
                                            <span>{"Winner"}</span>
                                        </div>
                                        <div>
                                            {
                                                (allBidders.map((bidder, i) => (
                                                    bidder.domain === domain.name ?
                                                    (<div key={i} className="row">
                                                        <div className="col-xl-12">
                                                            <h6 className="align-items-center float-left">{bidder.CompanyName}</h6>
                                                            <h6 className="align-items-center float-right">{bidder.Cost}</h6>
                                                            <div className="progress m-t-30 m-b-20" style={{height: '6px'}}>
                                                                <div className="progress-bar progress-c-theme" role="progressbar" style={{width: parseInt(findWinner(domain.name).winner*100/bidder.Cost).toString() + "%"}} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"/>
                                                            </div>
                                                        </div>
                                                    </div>)
                                                    :(null)
                                                ))) 
                                            }
                                        </div>
                                            
                                        
                                    </Card.Body>
                                </Card>)
                            
                        ))

                    }
                    
                </Col>
            </Row>
        </Aux>
    );
}

export default Dashboard;