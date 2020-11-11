import React, { Component } from "react";
import ElectionContract from "./contracts/Election.json";
import StorageContract from "./contracts/SimpleStorage.json";

import getWeb3 from "./getWeb3";
import Web3 from 'web3';
import "./App.css";

class App extends Component {
  state = { storageValue: "", web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // await this.onSubmit()
      // // Get network provider and web3 instance.
      // const web3 = await getWeb3();

      // // Use web3 to get the user's accounts.
      // const accounts = await web3.eth.getAccounts();

      // // Get the contract instance.
      // const networkId = await web3.eth.net.getId();
      // const deployedNetwork = SimpleStorageContract.networks[networkId];
      // console.log('asasa',deployedNetwork)

      // const instance = new web3.eth.Contract(
      //   SimpleStorageContract.abi,
      //   deployedNetwork && deployedNetwork.address,
      // );
      // // Set web3, accounts, and contract to the state, and then proceed with an
      // // example of interacting with the contract's methods.
      // this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;
    console.log('asa',accounts)

    // Stores a given value, 5 by default.
    await contract.methods.setElectionName("asssssssssssssss").send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.getElectionName().call();

    await contract.methods.authorize("0x78b71e4281bdb468e2754045968a1438f041ed57").send({from: accounts[0]})
    await contract.methods.addCandidate("Abhay Kesharwani").send({from: accounts[0]})

    await contract.methods.getNumCandidate().call((err, res) => {
      console.log('res',res)
    })
    await contract.methods.candidates(0).call((err, res) => {
      console.log('res1',res)
    })
    // Update state with the result.
    this.setState({ storageValue: response });
  };
  onSubmit = async (event) => 
        {
          console.log('clicked') 
          event.preventDefault();
          window.ethereum.enable()
          //setting up web3 to talk to meta mask
          const web3 = new Web3(Web3.givenProvider);
          const accounts = await web3.eth.getAccounts()
          console.log('accounts', accounts[0])
          const deployedNetwork = StorageContract.networks["5777"];

          // TODO : call constructor when instance is created 
          const instance = new web3.eth.Contract(
            StorageContract.abi,
            deployedNetwork && deployedNetwork.address
          );

          // Set web3, accounts, and contract to the state, and then proceed with an
          // example of interacting with the contract's methods.
          this.setState({ web3, accounts, contract: instance });
            console.log('state', this.state)
        };  
  render() {
    // if (!this.state.accounts) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
    return (
      <div className="App">
        <button onClick={this.onSubmit}>
         hello
       </button>
       <button onClick={this.runExample}>
         send
       </button>
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
    // return(
    //   <div className='container'>
    //     <button onClick={this.onSubmit}>
    //       hello
    //     </button>
    //     asasas
    //   </div>
    // )
  }
}

export default App;
