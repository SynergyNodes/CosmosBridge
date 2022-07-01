import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import Fantom_USDC from './Fantom_USDC';

const Fantom = () => {

  const [chainID, setChainID] = useState();

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  useEffect(() => {
    const connectWallet = async () => {
      const { chainId } = await provider.getNetwork();
      console.log(`ChainID = ${chainId}`);
      setChainID(chainId);
    }
    connectWallet()
      .catch(console.error);

  })

  return (
            <div>
              {(() => {
                if (chainID == "250") {
                  return (
                    <Fantom_USDC />
                  )
                } else {
                  return (
                    <div className='network_wrong'>Wrong Network. Please choose Fantom mainnet in Metamask and reload this page.</div>
                  )
                }
              })()}
            </div>
  );
}

export default Fantom;