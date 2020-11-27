import React,{useState, useEffect} from 'react';
import {Row, Col, Card, Form, Button} from 'react-bootstrap';
import Bidding from '../../contracts/Bidding.json';
import Web3 from 'web3';
import domains from '../../assets/Domains'
import Aux from "../../hoc/_Aux";

const FormsElements = () => {

    
    const [accounts, setAccounts] = useState(null);
    const [contract, setContract] = useState(null);
    const [companyName, setCompanyName] = useState('')
    const [amount, setAmount] = useState('')
    const [prevWork, setPrevWork] = useState('')
    const [domain, setDomain] = useState()

    const initMetamask = async () => {  
        console.log('clicked') 
        window.ethereum.enable()
        //setting up web3 to talk to meta mask
        const web3 = new Web3(Web3.givenProvider);
        const acc = await web3.eth.getAccounts()
        const deployedNetwork = Bidding.networks["5777"];
        console.log('deployed network is: ', deployedNetwork)
        const instance = new web3.eth.Contract(
          Bidding.abi,
          deployedNetwork && deployedNetwork.address
        );
            
        console.log('contract is',instance);
        console.log('account is',acc);
        setAccounts(acc[0])
        setContract(instance)
    
    }; 
    useEffect(() => {
        async function intialize(){
            await initMetamask();
        }
        intialize();
        window.ethereum.on('accountsChanged', intialize)
    }, [])

    const formResponse = async (event) => {
        if(!domain){
            alert('select domain');
            return;
        }
        if(!companyName || !amount || !prevWork){
            alert('fill all the fields');
            return;
        }
        if(contract){
            console.log('domain is', domain);
           const x = await contract.methods.setTopBids(parseInt(amount), companyName, prevWork, domain).send({from: accounts});
           console.log('respo is:',x);
           contract.methods.getNumBids().call((err, res) => {
               console.log('number is', res);
           })
        }else if(!contract){
            alert('metamask not configured');
        }
    }
    // console.log(domains)
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Fill the form to apply for contract</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <h6>Fill the form Only Once, we will notify results via mail</h6>
                                <hr/>
                                <Row>
                                    <Col md={6}>
                                            <Form >
                                                <Form.Group controlId="formBasicEmail">
                                                    <Form.Label>Email address</Form.Label>
                                                    <Form.Control type="email" placeholder="Enter email" />
                                                    <Form.Text className="text-muted">
                                                        We'll never share your email with anyone else.
                                                    </Form.Text>
                                                </Form.Group>

                                                <Form.Group controlId="formBasicPassword">
                                                    <Form.Label>Company Name</Form.Label>
                                                    <Form.Control value={companyName} onChange={(e)=>{setCompanyName(e.target.value)}} type="text" placeholder="Company Name" />
                                                </Form.Group>
                                                <Form.Group controlId="formBasicPassword">
                                                    <Form.Label>Amount Proposed</Form.Label>
                                                    <Form.Control value={amount} onChange={(e)=>{setAmount(e.target.value)}} type="number" placeholder="Amount" />
                                                </Form.Group>
                                            </Form>
                                        
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="exampleForm.ControlInput1">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control type="email" placeholder="Name" />
                                        </Form.Group>
                                        <Form.Group controlId="exampleForm.ControlSelect1">
                                            <Form.Label>Select Domain</Form.Label>
                                            <Form.Control onChange={(e) => {setDomain(e.target.value)}} as="select">
                                                <option disabled selected value> -- select an option -- </option>
                                                {
                                                    domains && (
                                                    domains.map((key, val) => (
                                                        <option key={val}>{key.name}</option>
                                                    )))
                                                }
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>Tell us about your previous work</Form.Label>
                                            <Form.Control value={prevWork} onChange={(e)=>{setPrevWork(e.target.value)}} as="textarea" rows="3" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} >
                                        <Button onClick={formResponse}  variant="primary" >
                                            Submit
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Aux>
        );
    
}

export default FormsElements;
