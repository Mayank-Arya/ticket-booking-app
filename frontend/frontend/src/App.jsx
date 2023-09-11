import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import Events from './Events';
import CreateEvent from './CreateEvent';

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path='/dashboard' element={<Dashboard/>}/>
                    <Route path='/events' element={<Events/>}/>
                    <Route path='/create' element={<CreateEvent/>}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;


