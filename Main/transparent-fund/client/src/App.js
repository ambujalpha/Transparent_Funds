import React,{useState, useEffect}  from "react";
import StorageContract from "./contracts/SimpleStorage.json";

import Web3 from 'web3';
import "./App.css";



const App = () => {
  const [val, setVal] = useState(null)
  const [tenderName, setTenderName] = useState("");
  const [authAddr, setAuthAddr] = useState("");
  const [candidate, setCandidate] = useState("");
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [allTenders, setAllTenders] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]);
  const [isTenderActive, setIsTenderActive] = useState(false)
  const [isOwner, setIsOwner] = useState(true)
  const [isVoter, setIsVoter] = useState(false)
  const [isCandidate, setIsCandidate] = useState(false)
  const initMetamask = async () => {
    console.log('clicked') 
    window.ethereum.enable()
    //setting up web3 to talk to meta mask
    const web3 = new Web3(Web3.givenProvider);
    const acc = await web3.eth.getAccounts()
    console.log('accounts', acc)
    const deployedNetwork = StorageContract.networks["5777"];
    console.log('deployed network is', deployedNetwork)

    const instance = new web3.eth.Contract(
      StorageContract.abi,
      deployedNetwork && deployedNetwork.address
    );

    //to check if current user is voter
    instance.methods.owner().call((err, res)=>{
      console.log('owner of contract is', res);
        // instance.methods.setOwner().send({from: acc[0]})
      if(res && res !== acc[0]){
        // alert('you are not owner of contract');
        setIsOwner(false);
        instance.methods.voters(acc[0]).call((err, res) => {
          if(res && res.authorized){
            setIsVoter(true);
          }else{
            setIsVoter(false);
          }
        })
      }
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
          setIsOwner(false)
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
    if(contract && isOwner){
      console.log('contract is', contract)
      getRecentTender();
    }
  }, [contract, val])
  const _setAuthorizeNameHelper = async() => {
    if(Web3.utils.isAddress(authAddr) && contract){
      const res = await contract.methods.authorize(authAddr).send({from: accounts});
      console.log('abcdef', res);
    }
  }
  const _setCandidateNameHelper = async() => {
    if(!candidate){
      alert('kuch daal to');
      return;
    }
    try {
      if(Web3.utils.isAddress(candidate)){
        await contract.methods.addCandidate(candidate).send({from: accounts})
      }
      else{
        alert('Invalid Address!');
        return;
      }
      // console.log('resss',res);
    } catch (error) {
      console.log('error in adding candidate',error);
    }
  }

  
  useEffect(() => {
    const isCandidateHelper = async ()=>{
      contract.methods.getNumCandidate().call(async (err, len) => {
        let numCandidates = parseInt(len);
        for (let index = 0; index < numCandidates; index++) {
          await contract.methods.candidates(index).call((err, cand) => {
            // console.log('kya ',cand);
            if(cand.name === accounts){
              setIsCandidate(true);
              return;
            }
          })
        }
      })
    }

    if(contract){
      isCandidateHelper();
    }
  }, [contract])

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
    if(contract && isTenderActive && isOwner){
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
    if(contract && isOwner){
      setNames();
    }
  }, [contract, allTenders])


  useEffect(() => {
    async function intialize(){
      await initMetamask();
    }
    if(isOwner){
      intialize();
      window.ethereum.on('accountsChanged', intialize)
    }
  }, [])
  if(isOwner){
    return(
      <div className='App'>
        <input placeholder='enter valid address' value={authAddr} onChange={(e)=>{setAuthAddr(e.target.value)}} type="text" id="authAddr" />
        <button onClick={() => {_setAuthorizeNameHelper()}} >Authorize</button>
        <br/><br/>

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
  }else{
    if(isVoter){
      return(
        <div className='App'>
          You can vote now
        </div>
      )
    }else{
      if(isCandidate){
        return (
          <div className='App' >
            You can submit your bid
            <br/><br/>
            <form>
              <input placeholder='bid amount' type='number' /><br/><br/>
              <textarea id="abcd"  rows="4" cols="50">
                tender implementation
              </textarea><br/>
              <input type='submit' />
            </form>
          </div>
        )
      }else{
        return (
          <div className='App' >
            You are not authorized to view this page
          </div>
        )
      }
    }
    
  }
  
}


export default App;
