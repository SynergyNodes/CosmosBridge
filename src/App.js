import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route, HashRouter}
	from 'react-router-dom';
import Home from './pages';
import Avalanche from './pages/Avalanche';
import Polygon from './pages/Polygon';
import Fantom from './pages/Fantom';
import Contact from './pages/contact';

function App() {

return (
	<HashRouter>
	<Navbar />
	<Routes>
		<Route exact path='/' element={<Home />} />
		<Route path='/avalanche' element={<Avalanche />} />
		<Route path='/polygon' element={<Polygon />} />
		<Route path='/fantom' element={<Fantom />} />
		<Route path='/contact' element={<Contact/>} />
	</Routes>
	</HashRouter>
);
}

export default App;
