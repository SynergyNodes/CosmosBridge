import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route, HashRouter}
	from 'react-router-dom';
import Home from './pages';
import Execute from './pages/Execute';
import Contact from './pages/contact';
import Fees from './pages/Fees';
import How_It_Works from './pages/How_It_Works';
import Execute_ETH from './pages/Execute_ETH';

function App() {

return (
	<HashRouter>
	<Navbar />
	<Routes>
		<Route exact path='/' element={<Home />} />
		<Route path='/execute/:id' element={<Execute />} />
		<Route path='/execute_eth/:id' element={<Execute_ETH />} />
		<Route path='/how_it_works' element={<How_It_Works />} />
		<Route path='/fees' element={<Fees />} />
		<Route path='/contact' element={<Contact/>} />
	</Routes>
	</HashRouter>
);
}

export default App;
