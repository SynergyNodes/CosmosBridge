import React from 'react';

const Fees = () => {
return (
	<div className='forms fee'>
	<h3>We DO NOT charge any fees.</h3>
		<p>Please note we DO NOT charge any fees. However, there are swap fees involved at Curve Finance and Relayer fees involved with Axlear. These details are displayed at realtime before you initiate a Transfer.</p>
        <p>You can support Synergy Nodes by delegating your respective Tokens to any of our following Validator Nodes.</p>

		<div className='nodes'>
			<span className='node'><img src='../images/kujira.png'></img><a href=''>Kujira</a></span>
			<span className='node'><img src='../images/luna.svg'></img><a href=''>Terra V2</a></span>
			<span className='node'><img src='../images/provenance.svg'></img><a href=''>Provenance</a></span>
			<span className='node'><img src='../images/nym.png'></img><a href=''>Nym Mixnode</a></span>
			<span className='node'><img src='../images/oraichain.png'></img><a href=''>Oraichain</a></span>
		</div>

	</div>
);
};

export default Fees;
