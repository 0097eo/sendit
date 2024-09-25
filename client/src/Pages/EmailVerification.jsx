import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmailVerificationPage = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, verification_code: verificationCode }),
      });
      if (response.ok) {
        navigate('/login');
      } else {
        // Handle error
        console.error('Email verification failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-extrabold text-center mb-6">Verify Your Email</h2>
        <p className="text-center text-gray-600 mb-6">
          Please enter the verification code sent to your email.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Verify Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailVerificationPage;