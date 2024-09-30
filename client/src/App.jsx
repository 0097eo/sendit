import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/Login';
import HomePage from './Pages/Home';
import SignupPage from './Pages/Signup';
import EmailVerificationPage from './Pages/EmailVerification';
import Parcels from './components/Parcels';
import Quotes from './components/Quotes';

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/parcels" element={<Parcels />} />
        <Route path="/quotes" element={<Quotes />} />
      </Routes>
    </Router>
  )
}

export default App
