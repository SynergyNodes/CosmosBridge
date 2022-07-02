import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { AxelarAssetTransfer } from '@axelar-network/axelarjs-sdk'
import tokenABI from '../components/abi/tokenABI.json'
import curveABI from '../components/abi/curveABI.json'

const Poly_USDC = () => {

  const [chainID, setChainID] = useState();
  const [allowance, setAllowance] = useState();
  const [submitVal, setSubmitVal] = useState('');
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState();
  const [depositValue, setDepositValue] = useState('');
  const [depositAddressValue, setDepositAddressValue] = useState('');
  const [destinationAddressValue, setDestinationAddressValue] = useState('');
  const [txValue, setTxValue] = useState('');
  const [approve, setApprove] = useState(false);
  const [execute, setExecute] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [curveReturn, setCurveReturn] = useState(0);
  const [axelarFee, setAxelarFee] = useState(0);
  const [expected, setExpected] = useState(0);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const tokenAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

  //const curveContract = "0xB098Fc457ca37222a60feE7CcCDaD12c03662455";
  const curveAddress = "0xfBA3b7Bb043415035220b1c44FB4756434639392";
  const curveContract = new ethers.Contract(curveAddress, curveABI, signer);

  useEffect(() => {
    const connectWallet = async () => {
      const { chainId } = await provider.getNetwork();
      console.log(`ChainID = ${chainId}`);
      setChainID(chainId);
      if(chainId == 137)
      {
        await provider.send("eth_requestAccounts", []);
        getBalance();
      }
    } 

    const getBalance = async () => {
      const balance = await tokenContract.balanceOf(signer.getAddress());
      console.log(`Balance : ${balance}`);
      const address = await signer.getAddress();
      setAddress(address);
      setBalance(ethers.utils.formatUnits(balance.toString(), "mwei"));
    }

    const getAllowance = async () => {
        const allowance = await tokenContract.allowance(signer.getAddress(), curveAddress);
        console.log(`Allowance : ${allowance}`);
        setAllowance(allowance.toString());
    }    

    connectWallet()
      .catch(console.error);

    getBalance()
      .catch(console.error);

    getAllowance()
      .catch(console.error);      

  })

  const handleDepositChange = async (e) => {
    setDepositValue(e.target.value);
    const curveReturn = await curveContract.get_dy(1, 0, ethers.utils.parseUnits(e.target.value, 6).toString());
    const tempCurve = ethers.utils.formatUnits(curveReturn.toString(), "mwei");
    const finalCurve = tempCurve - (tempCurve / 1000);
    setCurveReturn(parseFloat(finalCurve).toFixed(2));
    let response = await fetch('https://axelartest-lcd.quickapi.com/axelar/nexus/v1beta1/transfer_fee?source_chain=polygon&destination_chain=osmosis&amount=' + ethers.utils.parseUnits(e.target.value, 6).toString() + 'uusdc');
    let responseJson = await response.json();
    let axelarFee = responseJson.fee.amount;
    console.log("AxelarFee = ", axelarFee);
    if(axelarFee == 0) axelarFee = 1500000;
    setAxelarFee(parseFloat(ethers.utils.formatUnits(axelarFee.toString(), "mwei")).toFixed(2));
    const expected = finalCurve - ethers.utils.formatUnits(axelarFee.toString(), "mwei");
    setExpected(parseFloat(expected).toFixed(2));
  }

  const handleDestinationAddressChange = (e) => {
    setDestinationAddressValue(e.target.value);
  }  

  const handleDepositAddressChange = (e) => {
    setDepositAddressValue(e.target.value);
  }

  const handleMax = async (e) => {
    e.preventDefault();
    setDepositValue(balance);
    let response = await fetch('https://axelartest-lcd.quickapi.com/axelar/nexus/v1beta1/transfer_fee?source_chain=polygon&destination_chain=osmosis&amount=' + ethers.utils.parseUnits(balance, 6).toString() + 'uusdc');
    let responseJson = await response.json();
    let axelarFee = responseJson.fee.amount;
    console.log("AxelarFee = ", axelarFee);
    if(axelarFee == 0) axelarFee = 1500000;
    setAxelarFee(ethers.utils.formatUnits(axelarFee.toString(), "mwei"));
    setExpected(0);
  }  

  const handleApprove = async (e) => {
    e.preventDefault();
    if(depositValue.length == 0 || depositValue == 0 || depositValue > balance)
    {
      setError(true)
    }
    else
    {    
      setApprove(true); 
      console.log(depositValue);
      const tokenVal = ethers.utils.parseUnits(depositValue, 6);
      const result = await tokenContract.approve(curveAddress, tokenVal);
      await result.wait();
      //const balance = await provider.getBalance(tokenAddress);
      //const balanceFormatted = ethers.utils.formatEther(balance);
      setAllowance(depositValue);
      setDepositValue(0);
    }
  }  

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    if(depositValue.length == 0 || depositValue == 0 || depositValue > balance)
    {
      setError(true)
    }
    else
    {
      setExecute(true);
      const dx = ethers.utils.parseUnits(depositValue, 6);
      const min_dy = ethers.utils.parseUnits(curveReturn, 6);
      
      try {
        const result = await curveContract.exchange(1, 0, dx, min_dy, depositAddressValue);
        await result.wait();
        setSuccess(true);
        setTxValue('https://polygonscan.com/tx/' + result.hash);
        console.log("txValue = ", result.hash);
      } catch (error) {
        console.error(error);
      }

    }
  }

  const handleDepositAddressSubmit = async (e) => {
    setSubmitVal("submitting");
    e.preventDefault();
    console.log(depositAddressValue);
    const sdk = new AxelarAssetTransfer({
      environment: "mainnet",
      auth: "local",
    });
    const result = await sdk.getDepositAddress(
      "polygon", // source chain
      "osmosis", // destination chain
      destinationAddressValue, // destination address
      "uusdc" // asset to transfer
    );
    setDepositAddressValue(result);
    setSubmitVal("done");
  }

  return (
    <div className="container">
      <div className="container">
          { chainID == "137" ? <div className='network_correct'>Polygon Mainnet</div> : <div className='network_wrong'>Wrong Network. Please choose Polygon mainnet and reload this page.</div> }
            <div className='forms'>
            <h3>Crosschain Bridge to Kujira</h3>
            <p><b>Your Address:</b> {address}</p>
            <p><b>USDC Balance:</b> {balance} USDC</p>
            <p><b>Kujira Address:</b> {destinationAddressValue}</p>
            <p><b>Deposit Address:</b> {depositAddressValue}</p>

            <p className='fees'><span className='secOne'><b>Expected from Curve:</b> {curveReturn} axlUSDC</span><span className='secTwo'><b>Axelar Fees:</b> {axelarFee} USDC</span></p>
            <hr></hr>
            <p className='expected'><b>Expected at Destination:</b> {expected} USDC </p>
            <p className='note'><b>NOTE:</b> Final amount may vary at Destination</p>
            <hr></hr>

            { success ? 
              <div className='success'>
                <p className='head'>Success!</p>
                <p className='body'><a href={txValue} target="_blank">Click Here for Polygon Tx Details</a></p>
                <p className="body">You will received USDC to Your Kujira Wallet in 5 minutes.</p>
                <hr></hr>              
              </div>

              : "" }



            <form onSubmit={handleDepositSubmit} >
              <div className="mb-3">

              {(() => {
                if (submitVal == "") {
                  return (  
                    <div>            
                        <label>Enter Your Kujira Address & Click Generate Deposit Address:</label>
                        <input type="text" className="form-control" onChange={handleDestinationAddressChange} value={destinationAddressValue} />
                    </div>
                 )
                }
              })()}                

                {(() => {
                  if (submitVal == "") {
                    return (
                      <button disabled={(destinationAddressValue.length == 0? true: false)} type="button" onClick={handleDepositAddressSubmit} className="btn btn-success">Generate Deposit Address</button>
                    )
                  } else if (submitVal == "submitting") {
                    return (
                      <button type="submit" disabled className="btn btn-success"><span className="spinner-border spinner-border-sm mr-1"></span> Generate Deposit Address</button>
                    )
                  } else {
                    return (
                      <span>Deposit Address Generated.</span>
                    )
                  }
                })()}  

                <label>Enter USDC Amount:</label>   
                <input type="number" className="form-control" onChange={handleDepositChange} placeholder="0" value={depositValue} />
                {error ? <div className='error'>Please Enter Correct Value</div> : ""}
                <a href='#' onClick={handleMax} className="max">Max: {balance} USDC</a>
              </div>
              {(allowance >= depositValue? <button type="submit" disabled={execute ? true : false } className="btn btn-success">Execute</button>: <button type="button" disabled={approve ? true : false } onClick={handleApprove} className="btn btn-success">Approve</button>)}
            </form>
            
            </div>
            
            <div className="instructions">
              <h3>Instructions</h3>
              <ul>
                <ol>1. Enter Your Kujira Address</ol>
                <ol>2. Click "Generate Deposit Address" button</ol>
                <ol>3. Enter Amount</ol>
                <ol>4. Click "Approve" to grant Allowance</ol>
                <ol>5. Click "Execute" to initiate the Transfer</ol>
              </ul>
            </div>


          
          

      </div>
    </div>

  );
}

export default Poly_USDC;