import React from "react";
import { Nav, NavLink, NavMenu }
	from "./NavbarElements";

const Navbar = () => {
return (
	<>
	<div className="header">
		CosmosBridge <small class="flow-left">Beta</small> from <img src="../images/SynergyNodes.png"></img>SynergyNodes.com
		<p>Powered by <a href="https://axelar.network" target="_blank">Axelar</a></p>
	</div>
	</>
);
};

export default Navbar;
