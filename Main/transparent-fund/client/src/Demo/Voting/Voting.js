/* eslint-disable no-loop-func */
import React,{useState, useEffect} from 'react';
import {Row, Col, Card, Table, Tabs, Tab, Form} from 'react-bootstrap';
// import domains from '../../assets/Domains'
import Aux from "../../hoc/_Aux";
import DEMO from "../../store/constant";
import VoterContract from '../../contracts/Voter.json';
import BidContract from '../../contracts/Bidding.json';
import DomainContract from '../../contracts/Domain.json';
import Web3 from 'web3';

import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../assets/images/user/avatar-3.jpg';

const Dashboard  = () => {
    const [accounts, setAccounts] = useState(null);
    const [votingContract, setVotingContract] = useState(null);
    const [bidContract, setBidContract] = useState(null);
    const [domainContract, setDomainContract] = useState(null)  
    const [allVoters, setAllVoters] = useState([]);
    const [allTenders, setAllTenders] = useState([]);
    const [allDomains, setAllDomains] = useState([]);
    const [voteTo, setVoteTo] = useState(null);
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
        const deployedVoterNetwork = VoterContract.networks["5777"];
        const deployedBidNetwork = BidContract.networks["5777"];
        const deployedDomainNetwork = DomainContract.networks["5777"];

        const VoterInstance = new web3.eth.Contract(
            VoterContract.abi,
            deployedVoterNetwork && deployedVoterNetwork.address
        );
        const BidInstance = new web3.eth.Contract(
            BidContract.abi,
            deployedBidNetwork && deployedBidNetwork.address
        );
        const DomainInstance = new web3.eth.Contract(
            DomainContract.abi,
            deployedDomainNetwork && deployedDomainNetwork.address
        );
        console.log('voter deployed network is', VoterInstance)
        console.log('bidder deployed network is', BidInstance)
        console.log('Domain network is', DomainInstance)

        setAccounts(acc[0]);
        setBidContract(BidInstance);
        setVotingContract(VoterInstance);
        setDomainContract(DomainInstance);
    };
    useEffect(() => {
        const getAllVoters = async() => {
            await votingContract.methods.getNumVoter().call(async (err, num) => {
                const numVoter = parseInt(num);
                const arr = [];
                console.log('total voters are: ', numVoter)
                for (let index = 0; index < numVoter; index++) {
                    await votingContract.methods.voters(index).call((err, voter)=>{
                        arr.push(voter)
                    })
                }
                setAllVoters(arr);
                console.log('all voters',arr);
            })
        }   
        if(votingContract){
            getAllVoters()
        } 
    }, [votingContract])
    useEffect(() => {
        const getAllTenders = async() => {
            await bidContract.methods.getNumBids().call(async (err, num) => {
                const numTender = parseInt(num);
                const arr = [];
                console.log('total tenders are: ', numTender)
                for (let index = 0; index < numTender; index++) {
                    await bidContract.methods.topBids(index).call((err, tender)=>{
                        arr.push(tender)
                    //  console.log('tender: ',tender)
                    })
                }
                setAllTenders(arr);
            //    console.log(arr)
            })
        }   
        if(bidContract){
            getAllTenders()
        } 
    }, [bidContract])
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
            //    console.log(arr)
            })
        }
        if(domainContract){
            getAllDomains();
        }
    }, [domainContract])
    const tabContent = (
        <Aux>
            {
                (allVoters && allVoters.length)?
                (
                    allVoters.map((key, val) =>(
                        <div key={val} className="media friendlist-box align-items-center justify-content-center m-b-20">
                            <div className="m-r-10 photo-table">
                                <a href={DEMO.BLANK_LINK}><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></a>
                            </div>
                            <div className="media-body">
                                <h6 className="m-0 d-inline">{key.name}</h6><br/>
                                <span className="m-0 d-inline">{key.designation}</span><br/>
                                <span className="m-0 d-inline">{key.myAddress}</span>
                                <span className="float-right d-flex  align-items-center"><i className={(key.voted)?"fa fa-check-circle-o f-22 m-r-10 text-c-green":"fa fa-times f-22 m-r-10 text-c-red"}/></span>
                            </div>
                        </div>
                    ))
                )
                :
                (
                    <div >
                        <h6 >No committee members present</h6>
                    </div>
                )
            }
        </Aux>
    );
    const _voteCandidate = (domain) => {
        if(!voteTo){
            alert('please select an option');
            return;
        }
        if(!accounts){
            alert('unable to get accounts credentials from metamask!');
            return;
        }
        let found = false;
        if(allVoters && accounts){
            allVoters.forEach(async (v, i) => {
                console.log(v);
                if(v.myAddress === accounts){
                    found = true;
                    if(!v.voted){
                        await votingContract.methods.voteTo(accounts, voteTo ).send({from: accounts});
                        return;
                    }else{
                        alert('you have already voted!');
                        return;
                    }
                }
            })
            if(!found)
                alert('you are not authorized to vote!')
        }
        console.log(domain, voteTo);
    }
    // const _helper = (b) => {
    //     console.log(b)
    // }
    return (
        <Aux>
            <Row>
                <Col md={6} xl={12}>
                    <Card className='Recent-Users'>
                        <Card.Header>
                            <Card.Title as='h5'>Domains</Card.Title>
                        </Card.Header>
                        <Card.Body className='px-0 py-2'>
                            <Table responsive hover>
                                <tbody>
                                {
                                    allDomains && (
                                    allDomains.map((key, val)=>(
                                        <tr style={(!key.enabled)?stylesheet.domains:null} key={val} className="unread">
                                            <td><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></td>
                                            <td>
                                                <h6 className="mb-1">{key.name}</h6>
                                                <p className="m-0">{key.description}</p>
                                            </td>
                                            <td>
                                                <h6 className="text-muted"><i className="fa fa-circle text-c-green f-10 m-r-15"/>{key.date}</h6>
                                            </td>
                                            <td>
                                            <form>
                                                <label htmlFor="cars">Total responses: {allTenders.filter(tender => tender.domain === key.name).length}</label>
                                                {/* <label htmlFor="cars">Choose a contract: </label> */}
                                                {/* <select  style={{width:'60px'}} id="contract" name="contract"> */}
                                                {/* <select defaultValue={'DEFAULT'} onChange={(e) =>{setVoteTo(e.target.value)}} as="select"> */}
                                                    {/* <option value="DEFAULT" disabled> -- select an option -- </option> */}
                                                    {
                                                        // allTenders.map((tender, index)=>(
                                                                
                                                        //         (tender.domain === key.name) ? 
                                                        //         (<option key={index} >
                                                        //             {tender.CompanyName}
                                                        //         </option>) : 
                                                        //         (null)
                                                            
                                                        // ))
                                                    }
                                                {/* </select> */}
                                                {/* </select> */}
                                            </form>
                                            </td>
                                            {// <td><a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a></td>
                                            }
                                            {/* <td>
                                                <a href={DEMO.BLANK_LINK} onClick={() => {_voteCandidate(key.name)}} className="label theme-bg text-white f-12">Vote</a>
                                            </td> */}
                                        </tr>
                                    )))
                                }
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} xl={4}>
                    <Card className='card-event'>
                        <Card.Body>
                            <div className="row align-items-center justify-content-center">
                                <div className="col">
                                    <h5 className="m-0">Time Left</h5>
                                </div>
                            </div>
                            <h2 className="mt-2 f-w-300">45<sub className="text-muted f-14">hours left</sub></h2>
                            <i className="fa fa-angellist text-c-purple f-50"/>
                        </Card.Body>
                    </Card>
                    <Card>
                    </Card>
                </Col>

                <Col md={6} xl={8} className='m-b-30'>
                    <h3><span className="text-muted">Committee Members</span></h3>
                    <Tabs defaultActiveKey="today" id="uncontrolled-tab-example">
                        <Tab eventKey="today" title="Today">
                            {tabContent}
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </Aux>
    );
}

const stylesheet = {
    domains:{
        backgroundColor:'#f2f2f2', 
        pointerEvents:"none"
    }
}

export default Dashboard;