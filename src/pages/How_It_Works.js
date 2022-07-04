import React from 'react';

const How_It_Works = () => {
return (
	<div className='forms2 how'>
	<h3>How does this Actually Work?</h3>
        <p>Axelar provides an effortless and convenient Bridge to transfer Assets from popular EVM Chains such as Ethereum, Avalanche, Polygon, Fantom, etc.</p>
        <p>However, on Avalanche, Polygon, and Fantom, if you want to transfer stable coins such as USDC and USDT, you need to swap them to Axelar version of USDC and USDT and then use Axelar to transfer these to Cosmos chains.</p>
        <p>We are developing this App to simplify this process so users can transfer their USDC directly with one transaction. We are starting with USDC transfers from Avalanche, Polygon, and Fantom to Kujira. When you use our App, the Transfer goes through the following steps.</p>

        <hr></hr>

        <h4>Frontend Process:</h4>

        <p>Example: Transfer 1000 USDC.e from Avalanche to Kujira.</p>
        
        <p></p>
        <p>1. Connect both Metamask and Keplr. This will fetch your Avalanche address from Metamask with USDC.e balance and your Kujira address from Keplr, respectively.</p>
        <p>2. Generate a one-time Deposit Address on Avalanche Blockchain. Axelar generates this in the backend.</p>
        <p>3. Approve the amount of USDC.e that you would like to Transfer. In this case, its 1000 USDC.e</p>
        <p>4. Initiate the transfer by clicking on Execute button.</p>

        <hr></hr>

        <h4>The following steps take place in the backend.</h4>

        <p>1. When You Initiate the transfer, the USDC.e is swapped to axlUSDC at Curve Finance.</p>
        <p>2. axlUSDC is directly deposited to the One Time Deposit address generated above.</p>
        <p>3. Axelar automatically picks up this axlUSDC deposit and transfers it to Kujira.</p>
        <p>4. This transfer can take 5 to 10 minutes to complete.</p>
        <p></p>

        <p>If you have initiated a transfer and did not receive your USDC at Kujira in less than 20 minutes, please contact us through Discord and we will help you.</p>

	</div>
);
};

export default How_It_Works;
