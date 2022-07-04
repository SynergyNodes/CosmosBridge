import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { AxelarAssetTransfer } from '@axelar-network/axelarjs-sdk'
import tokenABI from '../components/abi/tokenABI.json'
import curveABI from '../components/abi/curveABI.json'
import { config } from '../components/Wallets/Config';


const Execute_Transfer = ({ id }) => {

  const network = 'mainnet';
  const tokenAddress = id.values.tokenAddress;
  const curveAddress = id.values.curveAddress;
  const source = id.values.source;
  const destination = id.values.destination;
  const denom = id.values.denom;
  const denom_name = id.values.denom_name;
  const evmChain = id.values.evmChain;
  const keplrChainID = id.values.keplrChainID;
  const axelarFeeURL = 'https://lcd-axelar.synergynodes.com/axelar/nexus/v1beta1/transfer_fee?source_chain=' + source + '&destination_chain=' + destination + '&amount=';
  const evmExplorer = id.values.evmExplorer;
  const source_image = id.values.source_image;
  const destination_image = id.values.destination_image;
  const source_name = id.values.source_name;
  const destination_name = id.values.destination_name;


  const [chainID, setChainID] = useState();
  const [allowance, setAllowance] = useState();
  const [submitVal, setSubmitVal] = useState('');
  const [address, setAddress] = useState('');
  const [keplraddress, setKeplrAddress] = useState('');
  const [accbalance, setBalance] = useState();
  const [depositValue, setDepValue] = useState('');
  const [depositAddressValue, setDepositAddressValue] = useState('');
  const [txValue, setTxValue] = useState('');
  const [spinner, setSpinnerVal] = useState('');
  const [executeVal, setExecuteVal] = useState('');
  const [approve, setApprove] = useState(false);
  const [execute, setExecute] = useState(false);
  const [success, setSuccess] = useState(false);
  const [valerror, setError] = useState('');
  const [allowanceFlag, setAllowanceFlag] = useState(false);
  const [curveReturn, setCurveReturn] = useState(0);
  const [axelarFee, setAxelarFee] = useState(0);
  const [expected, setExpected] = useState(0);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
  const curveContract = new ethers.Contract(curveAddress, curveABI, signer);

    useEffect(() => {
      const connectWallet = async () => {
      const { chainId } = await provider.getNetwork();
      setChainID(chainId);
      if(chainId === evmChain)
      {
        getBalance();
      }
    } 

    const getBalance = async () => {
      const balance = await tokenContract.balanceOf(signer.getAddress());
      const address = await signer.getAddress();
      setAddress(address);
      setBalance(parseFloat(ethers.utils.formatUnits(balance.toString(), "mwei")).toFixed(2));
    }

    const getAllowance = async () => {
        const allowance = await tokenContract.allowance(signer.getAddress(), curveAddress);
        setAllowance(allowance.toString());
    } 

    connectWallet()
      .catch(console.error);

    getBalance()
      .catch(console.error);

    getAllowance()
      .catch(console.error);         

  })

  const connectMetaMask = async () => {
    const { chainId } = await provider.getNetwork();
    if(chainId === evmChain)
    {
      await provider.send("eth_requestAccounts", []);
      getAccount();
    }
  }

  const getAccount = async () => {
    const balance = await tokenContract.balanceOf(signer.getAddress());
    const address = await signer.getAddress();
    setAddress(address);
    setBalance(parseFloat(ethers.utils.formatUnits(balance.toString(), "mwei")).toFixed(2));
    const allowance = await tokenContract.allowance(signer.getAddress(), curveAddress);
    setAllowance(allowance.toString());    
  }

  const getAllowance = async (e) => {
    setAllowanceFlag(false);
    console.log("Inside Get Allowance = ", depositValue);
    const allowance = await tokenContract.allowance(signer.getAddress(), curveAddress);
    setAllowance(allowance.toString());
    if(allowance.gt(ethers.utils.parseUnits(depositValue, 6)) || allowance.eq(ethers.utils.parseUnits(depositValue, 6)))
    {
      setAllowanceFlag(true);
    }
  }   

  const connectKeplr = async (e) => {
    e.preventDefault();
    const { keplr } = window
    if (!keplr) {
        alert("You need to install Keplr")
        return
    }

    const getConfig = config.find(obj => {
      return obj.id === destination;
    });

    if(getConfig) {
      await keplr.experimentalSuggestChain(getConfig.values);
    }

    const chainId = keplrChainID;
    await window.keplr.enable(chainId);
    const offlineSigner = window.keplr.getOfflineSigner(chainId);
    const accounts = await offlineSigner.getAccounts();
    setKeplrAddress(accounts[0].address);
    
  }   

  const handleDepositChange = async (e) => {
    e.preventDefault();
    setError('');
    setDepValue(e.target.value);

    if(address === "" || keplraddress === "")
    {
      setError('Please connect both Metamask & Keplr');
    }

    const curveReturn = await curveContract.get_dy(1, 0, ethers.utils.parseUnits(e.target.value, 6).toString());
    const tempCurve = ethers.utils.formatUnits(curveReturn.toString(), "mwei");
    
    ///// calculate min_dy
    const finalCurve = tempCurve - (tempCurve * ( 0.1 / 100 ));
    
    setCurveReturn(parseFloat(finalCurve).toFixed(2));
    let response = await fetch(axelarFeeURL + ethers.utils.parseUnits(e.target.value, 6).toString() + denom);
    let responseJson = await response.json();
    let axelarFee = responseJson.fee.amount;
    if(axelarFee == 0) axelarFee = 1500000;
    setAxelarFee(parseFloat(ethers.utils.formatUnits(axelarFee.toString(), "mwei")).toFixed(2));
    const expected = finalCurve - ethers.utils.formatUnits(axelarFee.toString(), "mwei");
    setExpected(parseFloat(expected).toFixed(2));
    setAllowanceFlag(false);
    //console.log("Inside Get Allowance = ", e.target.value);
    const allowance = await tokenContract.allowance(signer.getAddress(), curveAddress);
    setAllowance(allowance.toString());
    if(allowance.gt(ethers.utils.parseUnits(e.target.value, 6)) || allowance.eq(ethers.utils.parseUnits(e.target.value, 6)))
    {
      setAllowanceFlag(true);
    }
  }

  const handleMax = async (e) => {
    e.preventDefault();
    setDepValue(accbalance);

    const curveReturn = await curveContract.get_dy(1, 0, ethers.utils.parseUnits(accbalance, 6).toString());
    const tempCurve = ethers.utils.formatUnits(curveReturn.toString(), "mwei");
    
    ///// calculate min_dy
    const finalCurve = tempCurve - (tempCurve * ( 0.1 / 100 ));

    setCurveReturn(parseFloat(finalCurve).toFixed(2));
    let response = await fetch(axelarFeeURL + ethers.utils.parseUnits(accbalance, 6).toString() + denom);
    let responseJson = await response.json();
    let axelarFee = responseJson.fee.amount;
    if(axelarFee == 0) axelarFee = 1500000;
    setAxelarFee(ethers.utils.formatUnits(axelarFee.toString(), "mwei"));
    const expected = finalCurve - ethers.utils.formatUnits(axelarFee.toString(), "mwei");
    setExpected(parseFloat(expected).toFixed(2));

    setAllowanceFlag(false);
    //console.log("Inside Get Allowance = ", accbalance);
    const allowance = await tokenContract.allowance(signer.getAddress(), curveAddress);
    setAllowance(allowance.toString());
    if(allowance.gt(ethers.utils.parseUnits(accbalance, 6)) || allowance.eq(ethers.utils.parseUnits(accbalance, 6)))
    {
      setAllowanceFlag(true);
    }
  }  

  const handleApprove = async (e) => {
    e.preventDefault();
    if(depositValue.length === 0 || depositValue === 0)
    {
      setError('Please enter correct value.');
    }
    else if(depositValue < 10)
    {
      setError('Minimum 10' + denom_name + ' required.');
    }
    else if(ethers.utils.parseUnits(depositValue, 6).gt(ethers.utils.parseUnits(accbalance, 6)))
    {
      setError('Not enough balance.');
    }
    else if(depositAddressValue === "")
    {
      setError('Connect Keplr & Generate Deposit Address.');
    }    
    else
    {  
      setError(''); 
      setSpinnerVal('spinner-border spinner-border-sm mr-1');
      setApprove(true); 
      const tokenVal = ethers.utils.parseUnits(depositValue, 6);
      const result = await tokenContract.approve(curveAddress, tokenVal);
      await result.wait();
      setAllowance(depositValue);
      getAllowance(); 
    }
  }  

  const handleDepositSubmit = async (e) => {
    e.preventDefault();

    if(depositValue.length === 0 || depositValue === 0)
    {
      setError('Please enter correct value.');
    }
    else if(depositValue < 10)
    {
      setError('Minimum 10 ' + denom_name + 'required.');
    }
    else if(ethers.utils.parseUnits(depositValue, 6).gt(ethers.utils.parseUnits(accbalance, 6)))
    {
      setError('Not enough balance.');
    }
    else if(depositAddressValue === "")
    {
      setError('Connect Keplr & Generate Deposit Address.');
    }
    else
    {
      setExecute(true);
      setError('');
      setExecuteVal('spinner-border spinner-border-sm mr-1');
      const dx = ethers.utils.parseUnits(depositValue, 6).toString();
      const min_dy = ethers.utils.parseUnits(curveReturn, 6).toString();

      //console.log("Execute...............");
      //console.log("dx dx dx dx = ", dx.toString());
      //console.log("dy dy dy dy = ", min_dy.toString());
      
      try {
        const result = await curveContract.exchange(1, 0, dx, min_dy, depositAddressValue);
        await result.wait();
        setSuccess(true);
        setTxValue(evmExplorer + result.hash);
        setExecute(false);
        setExecuteVal('');
      } catch (error) {
        console.error(error);
      }

    }
  }

  const handleDepositAddressSubmit = async (e) => {
    setSubmitVal("submitting");
    e.preventDefault();
    const sdk = new AxelarAssetTransfer({
      environment: network,
      auth: "local",
    });
    const result = await sdk.getDepositAddress(
      source, // source chain
      destination, // destination chain
      keplraddress, // destination address
      denom // asset to transfer
    );
    setDepositAddressValue(result);
    setSubmitVal("done");
  }

  return (

      <div className="container">   

        <hr></hr>

          { chainID === evmChain ? <div className='network_correct'><img src={source_image}></img> {source_name} Mainnet</div> : <div className='network_wrong'>Wrong Network. Please choose {source_name} mainnet and reload this page.</div> }

          <div className='buttons'>
            
          { address ? <span className="box bLeft"><img src="../images/MetaMask.png"></img>Metamask Connected</span> : <button type="button" onClick={connectMetaMask} className="btn btn-primary bLeft"><img src="../images/MetaMask.png"></img>Connect MetatMask</button> }

          { keplraddress ? <span className="box bRight"><img src="../images/Keplr.png"></img>Keplr Connected</span> : <button type="button" onClick={connectKeplr} className="btn btn-primary bRight"><img src="../images/Keplr.png"></img>Connect Keplr</button> }          

          </div>
          
            <div className='forms'>
            <a className="fa fa-home" aria-hidden="true" href="/"></a>
            <h3>Crosschain Bridge to <img src={destination_image}></img> {destination_name}</h3>
            <p><b>Your Address:</b> {address}</p>
            <p><b>{denom_name} Balance:</b> {accbalance} {denom_name}</p>
            <p><b>Kujira Address:</b> {keplraddress}</p>
            <p><b>Deposit Address:</b> {depositAddressValue}</p>

            <p className='fees'><span className='secOne'><b>Expected from Curve:</b> {curveReturn} axlUSDC</span><span className='secTwo'><b>Axelar Fees:</b> {axelarFee} USDC</span></p>
            <hr></hr>
            <p className='expected'><b>Expected at Destination:</b> {expected} USDC </p>
            <p className='note'><b>NOTE:</b> Final amount may vary at Destination</p>
            <hr></hr>

            { success ? 
              <div className='success'>
                <p className='head'>Success!</p>
                <p className='body'><a href={txValue} target="_blank">Click Here for {source_name} Tx Details</a></p>
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
                        <label>Click Generate Deposit Address:</label>
                    </div>
                 )
                }
              })()}                

                {(() => {
                  if (submitVal == "") {
                    return (
                      <button disabled={(keplraddress.length == 0? true: false)} type="button" onClick={handleDepositAddressSubmit} className="btn btn-primary">Generate Deposit Address</button>
                    )
                  } else if (submitVal == "submitting") {
                    return (
                      <button type="submit" disabled className="btn btn-primary"><span className="spinner-border spinner-border-sm mr-1"></span> Generate Deposit Address</button>
                    )
                  } else {
                    return (
                      <span>Deposit Address Generated.</span>
                    )
                  }
                })()}  

                <label>Enter {denom_name} Amount:</label>   
                <input type="number" className="form-control" onChange={handleDepositChange} placeholder="0" value={depositValue} />
                {valerror ? <div className='error'>{valerror}</div> : '' }
                <a href='#' onClick={handleMax} className="max">Max: {accbalance} {denom_name}</a>
              </div>


              {(allowanceFlag ? <button type="submit" disabled={execute ? true : false } className="btn btn-primary"><span className={executeVal}></span> Execute</button>: <button type="button" disabled={approve ? true : false } onClick={handleApprove} className="btn btn-primary"> <span className={spinner}></span> Approve</button>)}
            
            
            </form>
            
            </div>
            
            <div className="instructions">
              <h3>Instructions</h3>
              <ul>
                <ol>1. Connect Metamask and Keplr Wallets</ol>
                <ol>2. Click "Generate Deposit Address" button</ol>
                <ol>3. Enter Amount</ol>
                <ol>4. Click "Approve" to grant Allowance</ol>
                <ol>5. Click "Execute" to initiate the Transfer</ol>
              </ul>
            </div>


          
          

      </div>

  );
}

export default Execute_Transfer;