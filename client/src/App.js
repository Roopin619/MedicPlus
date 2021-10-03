import React, { Component } from "react";
import EHRContract from "./contracts/EHR.json";
import getWeb3 from "./getWeb3";
import doctorImage from './images/doctor.png';

import Header from './components/Header';

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      EHRInstance: undefined,
      account: null,
      web3: null,
      isOwner: false
    }
  };

  componentDidMount = async () => {
    // FOR REFRESHING PAGE ONLY ONCE -
    if (!window.location.hash) {
      window.location = window.location + '#loaded';
      window.location.reload();
    }
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EHRContract.networks[networkId];
      const instance = new web3.eth.Contract(
        EHRContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ EHRInstance: instance, web3: web3, account: accounts[1] });

      // const owner = await this.state.VoterInstance.methods.getOwner().call();
      // if (this.state.account === owner) {
      //   this.setState({ isOwner: true });
      // }

      // let start = await this.state.VoterInstance.methods.getStart().call();
      // let end = await this.state.VoterInstance.methods.getEnd().call();

      // this.setState({ start: start, end: end });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return (
        <div>
          <h1>
            Loading Web3, accounts, and contract..
          </h1>
        </div>
      );
    }
    return (
      <div className="App">
        <Header />
        <div className="main">
          <div className="left-container">
            <h1 className="heading-text">Healthcare made secured using Blockchain</h1>
          </div>
          <div className="right-container">
            <img src={doctorImage} alt="doctor-img" className="doctor-img" />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
