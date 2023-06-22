import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { useUser } from '../hooks/useUser';

export const NavBar = () => {
	const { user } = useUser();
	const navigate = useNavigate();

	return (
		<nav>
			<ul>
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/about">About</Link>
				</li>
				<li>
					<Link to="/articles">Articles</Link>
				</li>
			</ul>
			<div classname="nav-right">
				{user
					? <button onClick={() => {
						signOut(getAuth());
					}}>Log Out</button>
					: <button onClick={() => {
						navigate('/login');
					}}>Log In</button>
				}
			</div>
		</nav>
	)
};