import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import './SignupPage.css';

function SignupPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
    
        try {
            setIsLoading(true);
    
            const response = await fetch('http://localhost:9090/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });
    
            if (response.ok) {
                const data = await response.json();
    
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', username); 
                localStorage.setItem('email', email)
    
                alert("User registered successfully!!");
            
                window.location.href = '/dashboard';
            } else if (response.status === 400) {
                // User already exists, display an alert
                alert("User already registered. Please login.");
                window.location.href = '/login';
            } else {
                console.error('Signup failed');
            }
        } catch (error) {
            console.error('Error during signup:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signup-container">
            {isLoading && (
                <div className="loader-overlay">
                    <div className="loader"></div>
                </div>
            )}
            <h2>Welcome to our Ticket Booking App</h2>
            <div className={`signup-card ${isLoading ? 'loading' : ''}`}>
                <h3>Sign Up</h3>
                <form onSubmit={handleSignup}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {isLoading ? (
                        <div className="spinner"></div>
                    ) : (
                        <button type="submit">Sign Up</button>
                    )}
                </form>
                <p>
                    Already signed up? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default SignupPage;
