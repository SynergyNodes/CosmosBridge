import React from "react";
import { Nav, NavLink, NavMenu }
	from "./NavbarElements";

const Navbar = () => {
return (
	<>
	<div className="header">
		Crosschain Bridge by SynergyNodes.com
		<p>Powered by <a href="https://axelar.network" target="_blank">Axelar</a></p>
	</div>
	<Nav>
		<NavMenu>
		<NavLink to="/avalanche" activeStyle>
			Avalanche
		</NavLink>		
		<NavLink to="/about" activeStyle>
			About
		</NavLink>
		<NavLink to="/contact" activeStyle>
			Contact Us
		</NavLink>
		<NavLink to="/blogs" activeStyle>
			Blogs
		</NavLink>
		<NavLink to="/sign-up" activeStyle>
			Sign Up
		</NavLink>
		</NavMenu>
	</Nav>
	</>
);
};

export default Navbar;
