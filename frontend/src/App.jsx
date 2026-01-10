import { useState, useEffect } from 'react'
import ServicePackages from './components/ServicePackages'
import BookingsList from './components/BookingsList'
import Login from './components/Login'
import './App.css'

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="App">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <nav className="main-nav">
            <div className="nav-content">
              <div className="nav-logo">Vehicle Service System</div>
              <div className="nav-user">
                <span>Welcome, <strong>{user.name}</strong></span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            </div>
          </nav>
          <ServicePackages />
          <BookingsList />
        </>
      )}
    </div>
  )
}

export default App
