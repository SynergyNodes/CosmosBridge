import React from 'react';

const Fees = () => {
return (
	<div className='forms fee'>
	<h3>We DO NOT charge any fees.</h3>
		<p>Please note we DO NOT charge any fees. However, there are swap fees involved at Curve Finance and Relayer fees involved with Axlear. These details are displayed at realtime before you initiate a Transfer.</p>
        <p>You can support Synergy Nodes by delegating your respective Tokens to any of our following Validator Nodes.</p>

		<div className='nodes'>
			<span className='node'><img src='../images/kujira.png'></img><a href='https://blue.kujira.app/stake/kujiravaloper1lcgzkqstk4jjtphfdfjpw9dd9yfczyzmcyxvj9' target='_blank'>Kujira</a></span>
			<span className='node'><img src='../images/luna.svg'></img><a href='https://station.terra.money/validator/terravaloper1tm0xkark2ufecmdhgaaw7gqsycyt4qag6py8x6' target='_blank'>Terra V2</a></span>
			<span className='node'><img src='../images/provenance.svg'></img><a href='https://explorer.provenance.io/validator/pbvaloper170h0kkjlphjk7qg46qx7uuatfpfpr0nh70kcq4' target='_blank'>Provenance</a></span>
			<span className='node'><img src='../images/nym.png'></img><a href='https://mixnet.explorers.guru/mixnode/58VJVZJxJ19xGtaJH8GWCpWuczdCKHEEzQoYn2XUwdkU' target='_blank'>Nym Mixnode</a></span>
			<span className='node'><img src='../images/oraichain.png'></img><a href='https://oraiscan.io/validators/oraivaloper1xesqr8vjvy34jhu027zd70ypl0nnev5euy9nyl' target='_blank'>Oraichain</a></span>
		</div>

	</div>
);
};

export default Fees;
