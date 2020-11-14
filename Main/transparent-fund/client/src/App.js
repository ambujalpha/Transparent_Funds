import React,{useState, useEffect}  from "react";
import StorageContract from "./contracts/SimpleStorage.json";

import Web3 from 'web3';
import "./App.css";



const App = () => {
  const [val, setVal] = useState(null)
  const [tenderName, setTenderName] = useState("");
  const [authorize, setAuthorize] = useState("");
  const [candidate, setCandidate] = useState("");
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [allTenders, setAllTenders] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]);
  const [isTenderActive, setIsTenderActive] = useState(false)

  const initMetamask = async () => {
    console.log('clicked') 
    window.ethereum.enable()
    //setting up web3 to talk to meta mask
    const web3 = new Web3(Web3.givenProvider);
    const acc = await web3.eth.getAccounts()
    console.log('accounts', acc)
    const deployedNetwork = StorageContract.networks["5777"];

    const instance = new web3.eth.Contract(
      StorageContract.abi,
      deployedNetwork && deployedNetwork.address
    );
    instance.methods.owner().call((err, res)=>{
      console.log('owner of contract is', res);
    })
    setAccounts(acc[0])
    setContract(instance)
  };  

  const _setTenderNameHelper = async() => {
    if(!accounts){
      alert('account not set');
      return;
    }
    if(!contract){
      alert('contract not set');
      return;
    }
    if(!tenderName){
      alert('set name please!')
      return;
    }

    await contract.methods.getNumTenders().call(async (err,res)=>{
      console.log('total: ', res);
      let index = parseInt(res);
      if(index===0){
        try {
          const response = await contract.methods.setTender(tenderName, Date.now()).send({from: accounts});
          setAllTenders([])
          setVal('')
          console.log('tender creation success', response);
        } catch (error) {
          console.log('error in creation', error)
        }
      }else{
        await contract.methods.tenders(index-1).call(async (err, res) => {
          console.log('tender-', index-1,res);
          if(res.status === true){
            alert(`complete ${res.name} first `);
            // contract.methods.removeTender(index-1).send({from: accounts});
          }else{
            try {
              const response = await contract.methods.setTender(tenderName, Date.now()).send({from: accounts});
              setAllTenders([])
              setVal('')
              console.log('tender creation success', response);
            } catch (error) {
              console.log('error in creation', error.message)
            }
          }
        })
      }

    });
  }
  const _removeTenderHelper = async (index) =>{
    await contract.methods.removeTender(index).send({from: accounts});
    await contract.methods.getNumCandidate().call(async (err, res) =>{
      if(parseInt(res) > 0){
        await contract.methods.removeAllCandidates().send({from: accounts})
      }
    })
    setIsTenderActive(false);
    setAllCandidates(null);
  }
  useEffect(() => {
    async function getRecentTender(){
      await contract.methods.getNumTenders().call(async (err,res)=>{
        if(err && err.message ==='Returned values aren\'t valid, did it run Out of Gas?'){
          alert('Configure your wallet');
          return;
        }
        let index = parseInt(res);
        if(index>0){
          await contract.methods.tenders(index-1).call(async (err, tender) => {
            if(tender.status === true){
              setVal(tender.name);
              setIsTenderActive(true);
            }else{
              setVal("No active tenders")
            }
          })
        }
      }) 
    }
    if(contract){
      console.log('contract is', contract)
      getRecentTender();
    }
  }, [contract, val])
  // const _setAuthorizeNameHelper = async() => {
  //   try {
  //     const res = await contract.methods.authorize(authorize).send({from: accounts})
  //     console.log('ress',res);
  //   } catch (error) {
  //     alert(error.reason)
  //   }
  // }
  const _setCandidateNameHelper = async() => {
    if(!candidate){
      alert('kuch daal to');
      return;
    }
    try {
      await contract.methods.addCandidate(candidate).send({from: accounts})
      // console.log('resss',res);
    } catch (error) {
      console.log('error in adding candidate',error);
    }
  }

  useEffect(() => {
    async function setCandidatesNames(){
      await contract.methods.getNumCandidate().call(async (err,res)=>{
        let numCandidates = parseInt(res);
        console.log(numCandidates)
        let arr = [];
        for (let index = 0; index < numCandidates; index++) {
          await contract.methods.candidates(index).call((err, res) => {
            console.log(`candidate ${index} is`, res);
            arr.push(res);
          })
        }
        setAllCandidates(arr);
      })
    }
    if(contract && isTenderActive){
      setCandidatesNames();
    }
  }, [contract, isTenderActive])

  useEffect(() => {
    async function setNames(){
      await contract.methods.getNumTenders().call(async (err,res)=>{
        let numTenders = parseInt(res);
        let arr = [];
        for (let index = 0; index < numTenders; index++) {
          await contract.methods.tenders(index).call((err, res) => {
            // console.log(`tender ${index} is`, res);
            arr.push(res);
          })
        }
        setAllTenders(arr);
        // console.log('arr is',arr)
      })
    }
    if(contract){
      setNames();
    }
  }, [contract, allTenders])


  useEffect(() => {
    async function intialize(){
      await initMetamask();
    }
    intialize();
    window.ethereum.on('accountsChanged', intialize)
  }, [])
  return(
    <div className='App'>
      <h2>Tender name is: {val}</h2>
      <input value={tenderName} onChange={(e)=>{setTenderName(e.target.value)}} type="text" id="electionName" />
      <button onClick={_setTenderNameHelper} >set election name</button>
      <br/><br/>

      {
        (allTenders)?
        (
          <table style={{width:'100%'}}>
            <thead>
              <tr>
                <th>name</th>
                <th>status</th> 
                <th>creation date</th>
              </tr>
            </thead>
            <tbody>
              {
                (allTenders).map((key, val) =>(
                  <tr key={val}>
                    <td>{key.name}</td>
                    {
                      (key.status)?
                      (
                        <td>
                          <button onClick={()=>_removeTenderHelper(val)} >close tender</button>
                        </td>
                      )
                      :
                      (
                        <td >completed</td>
                      )
                    }
                      <td>{key.date}</td>
                  </tr>
                ))
              }
            </tbody> 
              
          </table>
        )
        :
        (
          null
        )
      }
      {
        (isTenderActive)?
        (
          <div>
            <br/><br/>  
            <input value={candidate} onChange={(e)=>{setCandidate(e.target.value)}} type="text" id="candName" />
            <button onClick={_setCandidateNameHelper} >add candidate</button>
            <br/><br/>  
          </div>
        )
        :
        (
          <p>tender not active</p>
        )
      }
      {allCandidates?(<h5>Candidate Names</h5>):(null)}
      {
        (allCandidates)?
        (
          allCandidates.map((key, val) =>(
            <p key={val} >{key.name}</p>
          ))
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
