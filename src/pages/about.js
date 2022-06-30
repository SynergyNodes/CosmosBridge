import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { AxelarAssetTransfer } from '@axelar-network/axelarjs-sdk'
import tokenABI from '../components/abi/tokenABI.json'

 

const About = () => {

  const [chainID, setChainID] = useState();
  const [submitVal, setSubmitVal] = useState('');
  const [balance, setBalance] = useState();
  const [depositValue, setDepositValue] = useState('');
  const [depositAddressValue, setDepositAddressValue] = useState('');
  const [destinationAddressValue, setDestinationAddressValue] = useState('');

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const tokenAddress = "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664";
  const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);

  useEffect(() => {
    const connectWallet = async () => {
      const { chainId } = await provider.getNetwork();
      console.log(`ChainID = ${chainId}`);
      setChainID(chainId);
      if(chainId == 43114)
        await provider.send("eth_requestAccounts", []);
    }

    const getBalance = async () => {
      const balance = await tokenContract.balanceOf(signer.getAddress());
      console.log(`Balance : ${balance}`);
      setBalance(ethers.utils.formatUnits(balance.toString(), "mwei"));
    }

    connectWallet()
      .catch(console.error);

    getBalance()
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

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    console.log(depositValue);
    const ethValue = ethers.utils.parseEther(depositValue);
    const depositEth = await tokenContract.deposit({ value: ethValue });
    await depositEth.wait();
    const balance = await provider.getBalance(tokenAddress);
    const balanceFormatted = ethers.utils.formatEther(balance);
    setBalance(balanceFormatted);
    setDepositValue(0);
  }

  const handleDepositAddressSubmit = async (e) => {
    setSubmitVal("submitting");
    e.preventDefault();
    console.log(depositAddressValue);
    const sdk = new AxelarAssetTransfer({
      environment: "testnet",
      auth: "local",
    });
    const result = await sdk.getDepositAddress(
      "avalanche", // source chain
      "kujira", // destination chain
      destinationAddressValue, // destination address
      "wavax-wei" // asset to transfer
    );
    setDepositAddressValue(result);
    setSubmitVal("done");
  }

  return (
    <div className="container">
      <div className="container">
          { chainID == "43114" ? <span>Avalanche Mainnet</span> : <span>Wrong Network. Please choose Avalanche mainnet and reload this page.</span> }
          <div className="row mt-5">
            <div className="col">
            <p>Contract balance: {balance} ETH</p>
            <p>Destination Address: {destinationAddressValue}</p>
            <p>Deposit Address: {depositAddressValue}</p>          
            <form onSubmit={handleDepositAddressSubmit} >
              <div className="mb-3">
                <input type="text" className="form-control" onChange={handleDestinationAddressChange} value={destinationAddressValue} />
              </div>
              
              {(() => {
                if (submitVal == "") {
                  return (
                    <button type="submit" className="btn btn-success">Deposit Address</button>
                  )
                } else if (submitVal == "submitting") {
                  return (
                    <button type="submit" disabled className="btn btn-success"><span className="spinner-border spinner-border-sm mr-1"></span> Deposit Address</button>
                  )
                } else {
                  return (
                    <span>Deposit Address Generated.</span>
                  )
                }
              })()}              

            </form>
            <br></br>
            <form onSubmit={handleDepositSubmit} >
              <div className="mb-3">
                <input type="number" className="form-control" onChange={handleDepositChange} placeholder="0" value={depositValue} />
              </div>
              <button type="submit" className="btn btn-success">Deposit</button>
            </form>            
          </div>
          
          

        </div>
      </div>
    </div>

  );
}

export default About;