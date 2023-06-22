import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Articles } from './pages/Articles';
import { ArticlePage } from './pages/ArticlePage';
import { NotFound } from './pages/NotFound';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import './App.css';

function App() {
	return (
		<BrowserRouter>
			<div className="app">
				<NavBar />
				<div id="page-body">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/about"element={<About />} />
						<Route path="/articles" element={<Articles />} />
						<Route path="/articles/:name" element={<ArticlePage />} />
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<SignUp />} />
						<Route element={<NotFound />} />
					</Routes>
				</div>
			</div>
		</BrowserRouter>
	);
}

export default App;
