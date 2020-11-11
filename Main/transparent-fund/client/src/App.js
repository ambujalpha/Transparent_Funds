import React,{useState, useEffect}  from "react";
import StorageContract from "./contracts/SimpleStorage.json";

import Web3 from 'web3';
import "./App.css";



const App = () => {
  const [val, setVal] = useState(null)
  const [electionName, setElectionName] = useState("");
  const [authorize, setAuthorize] = useState("");
  const [candidate, setCandidate] = useState("");
  const [accounts, setAccounts] = useState(null)
  const [contract, setContract] = useState(null)
  const [num, setNum] = useState(0)
  const [id, setId] = useState(0)
  const [allCandidates, setAllCandidates] = useState([])

  const _setElectionNameHelper = async() => {
    if(!accounts){
      alert('account not set');
      return;
    }
    if(!contract){
      alert('contract not set');
      return;
    }
    if(!electionName){
      alert('set name please!')
      return;
    }
    await contract.methods.setElectionName(electionName).send({ from: accounts });

    const response = await contract.methods.getElectionName().call();

    setVal(response);

  }
  const _setAuthorizeNameHelper = async() => {
    try {
      const res = await contract.methods.authorize(authorize).send({from: accounts})
      console.log('ress',res);
    } catch (error) {
      alert(error.reason)
    }
  }
  const _setCandidateNameHelper = async() => {
    if(!candidate){
      alert('kuch daal to');
      return;
    }
    try {
      const res = await contract.methods.addCandidate(candidate).send({from: accounts})
      console.log('resss',res);
    } catch (error) {
      alert(error.reason)
    }
  }

  useEffect(() => {
    async function getInfo(){
      if(contract && accounts){
        await contract.methods.getNumCandidate().call((err, res) => {
          console.log('resssss',res)
          setNum(res);
        })
      }
    }
    getInfo()
  }, [accounts, contract])

  useEffect(() => {
    async function setNames(){
      let arr = [];
      for (let index = 0; index < num; index++) {
        await contract.methods.candidates(index).call((err, res) => {
          // console.log(res);
          arr.push(res);
        })
      }
      setAllCandidates(arr);
      console.log(allCandidates)
    }
    setNames();
  }, [num])

  const _getCandidateInfo = async () => {
    try {
      await contract.methods.candidates(id).call((err, res) => {
        alert(`name: ${res.name}  votes: ${res.voteCount}`);
      })
    } catch (error) {
      console.log(error)
    }
  }
  const onSubmit = async () => {
          console.log('clicked') 
          window.ethereum.enable()
          //setting up web3 to talk to meta mask
          const web3 = new Web3(Web3.givenProvider);
          const acc = await web3.eth.getAccounts()
          console.log('accounts', acc[0])
          const deployedNetwork = StorageContract.networks["5777"];

          // TODO : call constructor when instance is created 
          const instance = new web3.eth.Contract(
            StorageContract.abi,
            deployedNetwork && deployedNetwork.address
          );
          setAccounts(acc[0])
          setContract(instance)
  };  
  useEffect(() => {
    async function intialize(){
      await onSubmit();
    }
    intialize();
  }, [])
  return(
    <div className='App'>
      <h2>Election name is: {val}</h2>
      <h2>total candidates are: {num}</h2>
      <input value={electionName} onChange={(e)=>{setElectionName(e.target.value)}} type="text" id="electionName" />
      <button onClick={_setElectionNameHelper} >set election name</button>
      <br/><br/>
      <input value={authorize} onChange={(e)=>{setAuthorize(e.target.value)}} type="text" id="authAddr" />
      <button onClick={_setAuthorizeNameHelper} >authorize address</button>
      <br/><br/>
      <input value={candidate} onChange={(e)=>{setCandidate(e.target.value)}} type="text" id="candName" />
      <button onClick={_setCandidateNameHelper} >add candidate</button>
      <br/><br/>
      <input value={id} onChange={(e)=>{setId(e.target.value)}} type="number" id="id" />
      <button onClick={_getCandidateInfo} >get Info</button>
      <br/><br/>

      {
        (allCandidates)?
        (
          <table style={{width:'100%'}}>
            <thead>
              <tr>
                <th>name</th>
                <th>votes</th> 
              </tr>
            </thead>
            <tbody>
              {
                (allCandidates).map((key, val) =>(
                  <tr key={val}>
                    <td>{key.name}</td>
                    <td>{key.voteCount}</td>
                  </tr>
                ))
              }
            </tbody> 
              
          </table>
            // messages.map((key, val) => (
            //     // console.log(key.msg)
            //     <div key={val} className="container">
            //         <ul className="collapsible">
            //             <Notification 
            //                 message = {key.msg}
            //                 time = {key.time}
            //                 index = {val}
            //             />
            //         </ul>
            //     </div>
            // ))
        )
        :
        (
          null
        )
      }
    </div>
  )
}


export default App;
