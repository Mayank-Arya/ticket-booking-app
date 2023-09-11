import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            // Set loading state to true
            setIsLoading(true);
    
            // Make an API request to your backend for user login
            const response = await fetch('http://localhost:9090/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            if (response.ok) {
                // Login was successful
                const data = await response.json();
                const { token } = data;
    
                // Save the token to localStorage
                localStorage.setItem('token', token);
    
                // Simulate a 2-second delay before redirecting to the dashboard
            
                    window.location.href = '/dashboard';
          
            } else {
                alert("Login failed, please check your credentials")
                console.error('Login failed');
            }
        } catch (error) {
            alert("Login failed, please check your credentials")
            console.error('Error during login:', error);
        } finally {
            // Set loading state back to false, whether login succeeds or fails
            setIsLoading(false);
        }
    };
    

    return (
        <div className="signup-container">
            {isLoading && (
                // Show loading spinner when isLoading is true
                <div className="loader-overlay">
                    <div className="loader"></div>
                </div>
            )}
            <h2>Welcome back!</h2>
            <div className={`signup-card ${isLoading ? 'loading' : ''}`}> {/* Reusing the signup card styles */}
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
