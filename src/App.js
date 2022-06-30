import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route}
	from 'react-router-dom';
import Home from './pages';
import Avalanche from './pages/Avalanche';
import Avax_USDC from './pages/Avax_USDC';
import About from './pages/about';
import Blogs from './pages/blogs';
import Contact from './pages/contact';
import { useState } from 'react';
import { ethers } from 'ethers';

function App() {

return (
	<Router>
	<Navbar />
	<Routes>
		<Route exact path='/' element={<Home />} />
		<Route path='/avalanche' element={<Avalanche />} />
		<Route path='/about' element={<About/>} />
		<Route path='/contact' element={<Contact/>} />
		<Route path='/blogs' element={<Blogs/>} />
	</Routes>
	</Router>
);
}

export default App;
