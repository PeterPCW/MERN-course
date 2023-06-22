import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const signup = async () => {
    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      await createUserWithEmailAndPassword(getAuth(), email, password);
      navigate('/articles');
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <h1>Create Account</h1>
      {error && <p className="error">{error}</p>}
      <input 
        placeholder="Your email address"
        value={email}
        onChange={e => setEmail(e.target.value)} />
      <input 
        type="password"
        placeholder="Enter a password"
        value={password}
        onChange={p => setPassword(p.target.value)} />
      <input 
        type="password"
        placeholder="Re-enter password to confirm"
        value={confirmPassword}
        onChange={c => setConfirmPassword(c.target.value)} />
      <button onClick={signup}>Sign Up</button>
      <Link to="/login">Already have an account? Log in here</Link>
    </>
  )
};