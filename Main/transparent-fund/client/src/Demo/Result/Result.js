/* eslint-disable no-loop-func */
import React,{useEffect, useState} from 'react';
import {Row, Col, Card, Table, Tabs, Tab, Form, Button} from 'react-bootstrap';
import VoterContract from '../../contracts/Voter.json';
import Web3 from 'web3';

import Aux from "../../hoc/_Aux";
import DEMO from "../../store/constant";

import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../assets/images/user/avatar-3.jpg';

const Dashboard = () =>{
    const [isOwner, setIsOwner] = useState(false)
    const [accounts, setAccounts] = useState(null);
    const [contract, setContract] = useState(null);
    const [memberName, setMemberName] = useState('');
    const [memberAddress, setMemberAddress] = useState('');
    const [memberDesignation, setMemberDesignation] = useState('');
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
        const deployedNetwork = VoterContract.networks["5777"];

        const instance = new web3.eth.Contract(
            VoterContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        console.log('deployed network is', instance)

        // instance.methods.setOwner().send({from: acc[0]})
        //to check if current user is owner
        // instance.methods.owner().call((err, res)=>{
        //   console.log('owner of contract is', res);
        //     // instance.methods.setOwner().send({from: acc[0]})
        //   if(res && res === acc[0]){
        //     setIsOwner(true);
        //   }else{
        //       setIsOwner(false);
        //   }
        // })
        setAccounts(acc[0])
        setContract(instance)

      };
    const tabContent = (
        <Aux>
            <div className="media friendlist-box align-items-center justify-content-center m-b-20">
                <div className="m-r-10 photo-table">
                    <a href={DEMO.BLANK_LINK}><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></a>
                </div>
                <div className="media-body">
                    <h6 className="m-0 d-inline">Silje Larsen</h6>
                    <span className="float-right d-flex  align-items-center"><i className="fa fa-caret-up f-22 m-r-10 text-c-green"/>3784</span>
                </div>
            </div>
            <div className="media friendlist-box align-items-center justify-content-center m-b-20">
                <div className="m-r-10 photo-table">
                    <a href={DEMO.BLANK_LINK}><img className="rounded-circle" style={{width: '40px'}} src={avatar2} alt="activity-user"/></a>
                </div>
                <div className="media-body">
                    <h6 className="m-0 d-inline">Julie Vad</h6>
                    <span className="float-right d-flex  align-items-center"><i className="fa fa-caret-up f-22 m-r-10 text-c-green"/>3544</span>
                </div>
            </div>
            <div className="media friendlist-box align-items-center justify-content-center m-b-20">
                <div className="m-r-10 photo-table">
                    <a href={DEMO.BLANK_LINK}><img className="rounded-circle" style={{width: '40px'}} src={avatar3} alt="activity-user"/></a>
                </div>
                <div className="media-body">
                    <h6 className="m-0 d-inline">Storm Hanse</h6>
                    <span className="float-right d-flex  align-items-center"><i className="fa fa-caret-down f-22 m-r-10 text-c-red"/>2739</span>
                </div>
            </div>
            <div className="media friendlist-box align-items-center justify-content-center m-b-20">
                <div className="m-r-10 photo-table">
                    <a href={DEMO.BLANK_LINK}><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></a>
                </div>
                <div className="media-body">
                    <h6 className="m-0 d-inline">Frida Thomse</h6>
                    <span className="float-right d-flex  align-items-center"><i className="fa fa-caret-down f-22 m-r-10 text-c-red"/>1032</span>
                </div>
            </div>
            <div className="media friendlist-box align-items-center justify-content-center m-b-20">
                <div className="m-r-10 photo-table">
                    <a href={DEMO.BLANK_LINK}><img className="rounded-circle" style={{width: '40px'}} src={avatar2} alt="activity-user"/></a>
                </div>
                <div className="media-body">
                    <h6 className="m-0 d-inline">Silje Larsen</h6>
                    <span className="float-right d-flex  align-items-center"><i className="fa fa-caret-up f-22 m-r-10 text-c-green"/>8750</span>
                </div>
            </div>
            <div className="media friendlist-box align-items-center justify-content-center">
                <div className="m-r-10 photo-table">
                    <a href={DEMO.BLANK_LINK}><img className="rounded-circle" style={{width: '40px'}} src={avatar3} alt="activity-user"/></a>
                </div>
                <div className="media-body">
                    <h6 className="m-0 d-inline">Storm Hanse</h6>
                    <span className="float-right d-flex  align-items-center"><i className="fa fa-caret-down f-22 m-r-10 text-c-red"/>8750</span>
                </div>
            </div>
        </Aux>
    );
    const createCommitteeHandler = async () => {
        if(!memberName || !memberAddress || !memberDesignation){
            alert('kuch daalo to');
            return;
        }else if(!Web3.utils.isAddress(memberAddress)){
            alert('invalid address!');
            return;
        }else{
            if(contract){
                try {
                    await contract.methods.getNumVoter().call(async (err, num) => {
                        const numVoter = parseInt(num);
                        let isAddressPresent = false;
                        console.log('total voters are: ', numVoter)
                        for (let index = 0; index < numVoter; index++) {
                            await contract.methods.voters(index).call((err, voter)=>{
                                console.log(voter);
                                if(voter.myAddress === memberAddress){
                                    isAddressPresent = true;
                                }
                            })
                        }
                        if(!isAddressPresent){
                            const msg = await contract.methods.setVoter(memberName, memberDesignation, memberAddress).send({from: accounts});
                            console.log(msg);
                        }else{
                            alert('voter already present!')
                        }
                    })
                } catch (error) {
                    console.log('error in create Committee: ', error);
                }
            }
        }
    }
    return (
        <Aux>
            <Row>

                <Col md={6} xl={4}>
                    <Card>
                        <Card.Header>
                            <Card.Title as='h5'>Fire System</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div className="row align-items-center justify-content-center m-b-20">
                                <div className="col-6">
                                    <h2 className="f-w-300 d-flex align-items-center float-left m-0">47% </h2>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xl-12">
                                    <h6 className="align-items-center float-left">Contract 1</h6>
                                    <h6 className="align-items-center float-right">84</h6>
                                    <div className="progress m-t-30 m-b-20" style={{height: '6px'}}>
                                        <div className="progress-bar progress-c-theme" role="progressbar" style={{width: '70%'}} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"/>
                                    </div>
                                </div>

                                <div className="col-xl-12">
                                    <h6 className="align-items-center float-left">Contract 2</h6>
                                    <h6 className="align-items-center float-right">45</h6>
                                    <div className="progress m-t-30  m-b-20" style={{height: '6px'}}>
                                        <div className="progress-bar progress-c-theme" role="progressbar" style={{width: '35%'}} aria-valuenow="35" aria-valuemin="0" aria-valuemax="100"/>
                                    </div>
                                </div>

                                <div className="col-xl-12">
                                    <h6 className="align-items-center float-left">Contract 3</h6>
                                    <h6 className="align-items-center float-right">24</h6>
                                    <div className="progress m-t-30  m-b-20" style={{height: '6px'}}>
                                        <div className="progress-bar progress-c-theme" role="progressbar" style={{width: '25%'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"/>
                                    </div>
                                </div>

                                <div className="col-xl-12">
                                    <h6 className="align-items-center float-left">Contract 4</h6>
                                    <h6 className="align-items-center float-right">1</h6>
                                    <div className="progress m-t-30  m-b-20" style={{height: '6px'}}>
                                        <div className="progress-bar progress-c-theme" role="progressbar" style={{width: '10%'}} aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"/>
                                    </div>
                                </div>
                                <div className="col-xl-12">
                                    <h6 className="align-items-center float-left">Contract 5</h6>
                                    <h6 className="align-items-center float-right">15</h6>
                                    <div className="progress m-t-30  m-b-5" style={{height: '6px'}}>
                                        <div className="progress-bar" role="progressbar" style={{width: '0%'}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"/>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Aux>
    );
}

export default Dashboard;