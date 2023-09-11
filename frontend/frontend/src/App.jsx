import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import Events from './Events';

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path='/dashboard' element={<Dashboard/>}/>
                    <Route path='/events' element={<Events/>}/>
                    {/* Add more routes for other components as needed */}
                </Routes>
            </Router>
        </div>
    );
}

export default App;


