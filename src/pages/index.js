import React, { useState } from "react";
import styled from "styled-components";

const DropDownContainer = styled("div")`
  width: 100%;
  margin: 0 auto;
`;



const DropDownListContainer = styled("div")``;

const DropDownList = styled("ul")`
cursor: pointer;
text-indent: 10px;
width: 300px;
font-size: 20px;
font-weight: bold;
  padding: 10px;
  margin: 0 auto 0 auto;
  background-color: #161721;
  z-index: 10;
  border-radius: 0 0 0.5rem 0.5rem;
  box-shadow: 0 0 0 1px #607d8b40, 2px 2px 10px #16172159;
  &:first-child {
    padding-top: 0.8em;
  }
`;

const ListItem = styled("li")`
  list-style: none;
  margin-bottom: 0.8em;
`;

const from = [
	{id: 'ethereum', name: <span className="yellow"><img src="../images/ethereum.png"></img> Ethereum</span>},
	{id: 'avalanche', name: <span className="yellow"><img src="../images/avalanche.png"></img> Avalanche</span>},
	{id: 'polygon', name: <span className="yellow"><img src="../images/polygon.png"></img> Polygon</span>},
	{id: 'fantom', name: <span className="yellow"><img src="../images/fantom.png"></img> Fantom</span>}
];

const to = [
	{id: 'kujira', name: <span className="yellow"><img src="../images/kujira.png"></img> Kujira</span>},
	{id: 'osmosis', name: <span className="yellow"><img src="../images/osmosis.png"></img> Osmosis</span>},
];


const Home = () => {

	const [isOpenFrom, setIsOpenFrom] = useState(false);
	const [isOpenTo, setIsOpenTo] = useState(false);	
	const [selectedFrom, setSelectedFrom] = useState(null);
	const [selectedTo, setSelectedTo] = useState(null);
	const [valueFrom, setValueFrom] = useState('ethereum');
	const [valueTo, setValueTo] = useState('kujira');
  
	const togglingFrom = () => setIsOpenFrom(!isOpenFrom);
	const togglingTo = () => setIsOpenTo(!isOpenTo);
  
	const onFromClicked = value => () => {
		console.log("Value From = ", value.id);
		setSelectedFrom(value.name);
		setValueFrom(value.id);
		setIsOpenFrom(false);
	};	

	const onToClicked = value => () => {
		console.log("Value To = ", value.id);
		setSelectedTo(value.name);
		setValueTo(value.id);
		setIsOpenTo(false);
	};
	
    const getURL = () => {
		if(valueFrom === 'ethereum' && valueTo === 'kujira')
			window.location.assign('/#/execute_eth/ETH_KUJI_USDC');
		else if(valueFrom === 'ethereum' && valueTo === 'osmosis')
			window.location.assign('/#/execute_eth/ETH_OSMO_USDC');	
		else if(valueFrom === 'avalanche' && valueTo === 'kujira')
			window.location.assign('/#/execute/AVAX_KUJI_USDC');
		else if(valueFrom === 'avalanche' && valueTo === 'osmosis')
			window.location.assign('/#/execute/AVAX_OSMO_USDC');
		else if(valueFrom === 'polygon' && valueTo === 'kujira')
			window.location.assign('/#/execute/POLYGON_KUJI_USDC');
		else if(valueFrom === 'polygon' && valueTo === 'osmosis')
			window.location.assign('/#/execute/POLYGON_OSMO_USDC');
		else if(valueFrom === 'fantom' && valueTo === 'kujira')
			window.location.assign('/#/execute/FANTOM_KUJI_USDC');
		else if(valueFrom === 'fantom' && valueTo === 'osmosis')
			window.location.assign('/#/execute/FANTOM_OSMO_USDC');
		else
			window.location.assign('/#/execute/ETH_OSMO_USDC');
	}

	return (
	
		<div className='forms contact'>
		<p className="transfer">Transfer <img src="../images/usdc.png"></img> USDC</p>
		<p className="token"></p>
		
		
		<DropDownContainer>
		  <div className="DropDownHeader" onClick={togglingFrom}>
			{selectedFrom || <span className="yellow"><img src="../images/ethereum.png"></img> Ethereum</span>}
			<span className="triangle_down1"></span>
		  </div>
		  {isOpenFrom && (
			<DropDownListContainer>
			  <DropDownList>
				{from.map(option => (
				  <ListItem onClick={onFromClicked(option)} key={option.id}>
					{option.name}
				  </ListItem>
				))}
			  </DropDownList>
			</DropDownListContainer>
		  )}
		</DropDownContainer>

		<span className="triangle_down2"></span>

		<DropDownContainer>
		  <div className="DropDownHeader" onClick={togglingTo}>
			{selectedTo || <span className="yellow"><img src="../images/kujira.png"></img> kujira</span>}
			<span className="triangle_down1"></span>
		  </div>
		  {isOpenTo && (
			<DropDownListContainer>
			  <DropDownList>
				{to.map(option => (
				  <ListItem onClick={onToClicked(option)} key={option.id}>
					{option.name}
				  </ListItem>
				))}
			  </DropDownList>
			</DropDownListContainer>
		  )}
		</DropDownContainer>



		<p><button onClick={getURL} className="btn btn-primary go">Go</button></p>
		</div>

	);
};

export default Home;
