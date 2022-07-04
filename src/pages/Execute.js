import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { useParams } from "react-router-dom";
import Execute_Transfer from './Execute_Transfer';
import { assets } from '../components/Assets/assets';

const Execute = () => {

  const { id } = useParams();

  const [chainID, setChainID] = useState();
  const [evmChain, setEVMChain] = useState();
  const [source_name, setSourceName] = useState();

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    provider.on("network", (newNetwork, oldNetwork) => {
        console.log("oldNetwork = ", oldNetwork);
        console.log("newNetwork = ", newNetwork);
        setChainID(newNetwork.chainId);
        if (oldNetwork) {
            window.location.reload();
        }
    });
    const asset = assets.find(obj => {
      return obj.id === id;
    });
    console.log("evmChain = ", asset.values.evmChain);
    setEVMChain(asset.values.evmChain);
    setSourceName(asset.values.source_name);
  })

  const asset = assets.find(obj => {
    return obj.id === id;
  });

  return (
            <div>          
              {(() => {
                if (chainID === evmChain) {
                  return (
                      <Execute_Transfer id={asset}/>                
                  )
                } else {
                  return (
                    <div className='network_wrong'>Wrong Network. Please choose {source_name} mainnet in Metamask and reload this page.</div>
                  )
                }
              })()}
            </div>
  );
}

export default Execute;