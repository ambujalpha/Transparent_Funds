/* eslint-disable no-loop-func */
import React,{useState, useEffect} from 'react';
import {Row, Col, Card, Table, Tabs, Tab} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import DEMO from "../../store/constant";
import VoterContract from '../../contracts/Voter.json';
import Web3 from 'web3';

import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../assets/images/user/avatar-3.jpg';

const Dashboard  = () => {
    const [accounts, setAccounts] = useState(null);
    const [contract, setContract] = useState(null);
    const [allVoters, setAllVoters] = useState([]);
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

        setAccounts(acc[0])
        setContract(instance)
    };
    useEffect(() => {
        const getAllVoters = async() => {
            await contract.methods.getNumVoter().call(async (err, num) => {
                const numVoter = parseInt(num);
                const arr = [];
                console.log('total voters are: ', numVoter)
                for (let index = 0; index < numVoter; index++) {
                    await contract.methods.voters(index).call((err, voter)=>{
                        arr.push(voter)
                    })
                }
                setAllVoters(arr);
            })
        }   
        if(contract){
            getAllVoters()
        } 
    }, [contract])
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
                        <h6 >No voter present</h6>
                    </div>
                )
            }
        </Aux>
    );

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
                                <tr className="unread">
                                    <td><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></td>
                                    <td>
                                        <h6 className="mb-1">Fire Alarm System</h6>
                                        <p className="m-0">Includes Smoke Detection and Fire extingusher on each floor</p>
                                    </td>
                                    <td>
                                        <h6 className="text-muted"><i className="fa fa-circle text-c-green f-10 m-r-15"/>10 MAY - 10 July</h6>
                                    </td>
                                    <td>
                                    <form>
                                        <label htmlFor="cars">Choose a contract:</label>
                                        <select id="contract" name="contract">
                                            <option value="volvo">Volvo</option>
                                            <option value="saab">Saab</option>
                                            <option value="fiat">Fiat</option>
                                            <option value="audi">Audi</option>
                                        </select>
                                    </form></td>
                                    {// <td><a href={DEMO.BLANK_LINK} className="label theme-bg2 text-white f-12">Reject</a><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Approve</a></td>
                                    }<td><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Apply</a></td>
                                </tr>
                                <tr className="unread">
                                    <td><img className="rounded-circle" style={{width: '40px'}} src={avatar2} alt="activity-user"/></td>
                                    <td>
                                        <h6 className="mb-1">Water System</h6>
                                        <p className="m-0">Includes work of water tank, water system in whole school and plumber work</p>
                                    </td>
                                    <td>
                                        <h6 className="text-muted"><i className="fa fa-circle text-c-red f-10 m-r-15"/>15 MAY - 15 July </h6>
                                    </td>
                                    <td>
                                    <form>
                                        <label htmlFor="cars">Choose a contract:</label>
                                        <select id="contract" name="contract">
                                            <option value="volvo">Volvo</option>
                                            <option value="saab">Saab</option>
                                            <option value="fiat">Fiat</option>
                                            <option value="audi">Audi</option>
                                        </select>
                                    </form></td>
                                    <td><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Apply</a></td>
                                </tr>
                                <tr className="unread">
                                    <td><img className="rounded-circle" style={{width: '40px'}} src={avatar3} alt="activity-user"/></td>
                                    <td>
                                        <h6 className="mb-1">Basic Contruction</h6>
                                        <p className="m-0">Design whole building as per the contruction designs</p>
                                    </td>
                                    <td>
                                        <h6 className="text-muted"><i className="fa fa-circle text-c-green f-10 m-r-15"/>10 Jan - 10 Jun</h6>
                                    </td>
                                    <td>
                                    <form>
                                        <label htmlFor="cars">Choose a contract:</label>
                                        <select id="contract" name="contract">
                                            <option value="volvo">Volvo</option>
                                            <option value="saab">Saab</option>
                                            <option value="fiat">Fiat</option>
                                            <option value="audi">Audi</option>
                                        </select>
                                    </form></td>
                                    <td><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Apply</a></td>
                                </tr>
                                <tr className="unread">
                                    <td><img className="rounded-circle" style={{width: '40px'}} src={avatar1} alt="activity-user"/></td>
                                    <td>
                                        <h6 className="mb-1">Wooden work</h6>
                                        <p className="m-0">Work regarding wood chairs, tables, wordrobe</p>
                                    </td>
                                    <td>
                                        <h6 className="text-muted f-w-300"><i className="fa fa-circle text-c-red f-10 m-r-15"/>15 Jun - 15 Aug</h6>
                                    </td>
                                    <td>
                                    <form>
                                        <label htmlFor="cars">Choose a contract:</label>
                                        <select id="contract" name="contract">
                                            <option value="volvo">Volvo</option>
                                            <option value="saab">Saab</option>
                                            <option value="fiat">Fiat</option>
                                            <option value="audi">Audi</option>
                                        </select>
                                    </form></td>
                                    <td><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Apply</a></td>
                                </tr>
                                <tr className="unread">
                                    <td><img className="rounded-circle" style={{width: '40px'}} src={avatar2} alt="activity-user"/></td>
                                    <td>
                                        <h6 className="mb-1">Electricity Work</h6>
                                        <p className="m-0">work regarding electricity on each floor, rooms and as per mentioned in map</p>
                                    </td>
                                    <td>
                                        <h6 className="text-muted"><i className="fa fa-circle text-c-green f-10 m-r-15"/>20 Jun - 20 Aug</h6>
                                    </td>
                                    <td>
                                    <form>
                                        <label htmlFor="cars">Choose a contract:</label>
                                        <select id="contract" name="contract">
                                            <option value="volvo">Volvo</option>
                                            <option value="saab">Saab</option>
                                            <option value="fiat">Fiat</option>
                                            <option value="audi">Audi</option>
                                        </select>
                                    </form></td>
                                    <td><a href={DEMO.BLANK_LINK} className="label theme-bg text-white f-12">Apply</a></td>
                                </tr>
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
                    <h3><span className="text-muted">Voting Members</span></h3>
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

export default Dashboard;