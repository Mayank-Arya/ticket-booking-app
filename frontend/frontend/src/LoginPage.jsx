import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false); 

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            setIsLoading(true);
    
            const response = await fetch('http://localhost:9090/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            if (response.ok) {
                const data = await response.json();
                const { token } = data;
    
                const username = email.split('@')[0];
    
                localStorage.setItem('token', token);
                localStorage.setItem('username', username);
                localStorage.setItem('email', email)
    
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);
            } else {
                alert("Login failed, please check your credentials")
                console.error('Login failed');
            }
        } catch (error) {
            alert("Login failed, please check your credentials")
            console.error('Error during login:', error);
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
            <h2>Welcome back!</h2>
            <div className={`signup-card ${isLoading ? 'loading' : ''}`}> 
                <h3>Login</h3>
                <form onSubmit={handleLogin}>
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
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p>New user? <Link to="/">Sign up here</Link></p>
            </div>
        </div>
    );
}

export default LoginPage;
