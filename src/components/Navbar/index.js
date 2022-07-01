import React from "react";
import { Nav, NavLink, NavMenu }
	from "./NavbarElements";

const Navbar = () => {
return (
	<>
	<div className="header">
		####### Testing - DO NOT USE ####### <br></br>
		Crosschain Bridge by SynergyNodes.com
		<p>Powered by <a href="https://axelar.network" target="_blank">Axelar</a></p>
	</div>
	<Nav>
		<NavMenu>
		<NavLink to="/avalanche" activeStyle>
			Avalanche
		</NavLink>
		<NavLink to="/polygon" activeStyle>
			Polygon
		</NavLink>
		<NavLink to="/fantom" activeStyle>
			Fantom
		</NavLink>			
		<NavLink to="/contact" activeStyle>
			Contact Info
		</NavLink>
		</NavMenu>
	</Nav>
	</>
);
};

export default Navbar;
