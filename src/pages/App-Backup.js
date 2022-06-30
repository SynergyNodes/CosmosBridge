import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { spawn } from 'child_process';
//import shellExec from 'shell-exec';
import { AxelarAssetTransfer } from '@axelar-network/axelarjs-sdk'

function App() {

  const [greet, setGreet] = useState('');
  const [balance, setBalance] = useState();
  const [depositValue, setDepositValue] = useState('');
  const [depositAddressValue, setDepositAddressValue] = useState('');
  const [destinationAddressValue, setDestinationAddressValue] = useState('');
  const [greetingValue, setGreetingValue] = useState('');

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_greeting",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "greet",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_greeting",
        "type": "string"
      }
    ],
    "name": "setGreeting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const contract = new ethers.Contract(contractAddress, ABI, signer);

  useEffect(() => {
    const connectWallet = async () => {
      await provider.send("eth_requestAccounts", []);
    }

    const getBalance = async () => {
      const balance = await provider.getBalance(contractAddress);
      const balanceFormatted = ethers.utils.formatEther(balance);
      setBalance(balanceFormatted);
    }

    const getGreeting = async () => {
      const greeting = await contract.greet();
      setGreet(greeting);
    }

    const getDepositAddress = async () => {
      const exec = require('child_process').exec;
      exec('/usr/bin/node /root/transfer.js', (e, stdout, stderr) => {
        if(e instanceof Error) {
          console.error(e);
          throw e;
        }
        console.log('stdout ', stdout);
        console.log('stderr ', stderr);
      });
    }

    connectWallet()
      .catch(console.error);

    getBalance()
      .catch(console.error);

    getGreeting()
      .catch(console.error);

  })

  const handleDepositChange = (e) => {
    setDepositValue(e.target.value);
  }

  const handleDestinationAddressChange = (e) => {
    setDestinationAddressValue(e.target.value);
  }  

  const handleDepositAddressChange = (e) => {
    setDepositAddressValue(e.target.value);
  }

  const handleGreetingChange = (e) => {
    setGreetingValue(e.target.value);
  }

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    console.log(depositValue);
    const ethValue = ethers.utils.parseEther(depositValue);
    const depositEth = await contract.deposit({ value: ethValue });
    await depositEth.wait();
    const balance = await provider.getBalance(contractAddress);
    const balanceFormatted = ethers.utils.formatEther(balance);
    setBalance(balanceFormatted);
    setDepositValue(0);
  }

  const handleDepositAddressSubmit = async (e) => {
    e.preventDefault();
    console.log(depositAddressValue);
    const sdk = new AxelarAssetTransfer({
      environment: "testnet",
      auth: "local",
    });
    const result = await sdk.getDepositAddress(
      "avalanche", // source chain
      "axelar", // destination chain
      destinationAddressValue, // destination address
      "wavax-wei" // asset to transfer
    );
    setDepositAddressValue(result);
  }

  const handleGreetingSubmit = async (e) => {
    e.preventDefault();
    console.log(greetingValue);
    const greetingUpdate = await contract.setGreeting(greetingValue);
    await greetingUpdate.wait();
    setGreet(greetingValue);
    setGreetingValue('');
  }

  return (
    <div className="container">
      <div className="container">
          <div className="row mt-5">
          <div className="col">
          <h3>{greet}</h3>
          <p>Contract balance: {balance} ETH</p>
          <p>Destination Address: {destinationAddressValue}</p>
          <p>Deposit Address: {depositAddressValue}</p>          
            <form onSubmit={handleDepositSubmit} >
              <div className="mb-3">
                <input type="number" className="form-control" onChange={handleDepositChange} placeholder="0" value={depositValue} />
              </div>
              <button type="submit" className="btn btn-success">Deposit</button>
            </form>
            <form onSubmit={handleDepositAddressSubmit} >
              <div className="mb-3">
                <input type="text" className="form-control" onChange={handleDestinationAddressChange} value={destinationAddressValue} />
              </div>
              <button type="submit" className="btn btn-success">Deposit Address</button>
            </form>
            <form className="mt-5" onSubmit={handleGreetingSubmit} >
              <div className="mb-3">
                <input type="text" className="form-control" onChange={handleGreetingChange} value={greetingValue} />
              </div>
              <button type="submit" className="btn btn-dark">Change</button>
            </form>
          </div>
        </div>
      </div>
    </div>

  );
}

export default App;
