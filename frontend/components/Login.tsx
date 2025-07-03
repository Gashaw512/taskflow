import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import i18n from 'i18next'; 
import { useTranslation } from 'react-i18next';
import { User } from '../entities/User'; 

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); 

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include' 
      });

      // It's good practice to always parse the JSON response, even if the request was not 'ok'
      // as the backend might send error details in JSON format.
      const data: { user?: User, errors?: string[] } = await response.json();

      if (response.ok) {
        // If login is successful and user data includes a language, change i18n language
        if (data.user && data.user.language) {
          await i18n.changeLanguage(data.user.language);
        }
        
        // Dispatch custom event to notify other parts of the app (like useAuth) that a user has logged in
        window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: data.user }));
        
        // Navigate to the dashboard. Use 'replace: true' to prevent going back to the login page
        // with the browser's back button after a successful login.
        navigate('/today', { replace: true });
      } else {
        // Display backend error message if available, otherwise use a generic translated message
        setError(data.errors?.[0] || t('auth.loginFailed', 'Login failed. Please try again.'));
      }
    } catch (err) {
      console.error('Error during login:', err);
      // Provide a generic, user-friendly, and translated error message for network/unforeseen errors
      setError(t('auth.errorOccurred', 'An error occurred. Please try again.'));
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center min-h-screen px-4 dark:bg-gray-900">
      <h1 className="text-5xl font-bold text-gray-300 mb-6 dark:text-gray-600">
        Taskflow
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm dark:bg-gray-800">
        {error && (
          <div className="mb-4 text-center text-red-500">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate> 
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-600 mb-1 dark:text-gray-300"
            >
              {t('auth.email', 'Email')}
            </label>
            <input
              type="email"
              id="email"
              name="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-600 mb-1 dark:text-gray-300"
            >
              {t('auth.password', 'Password')}
            </label>
            <input
              type="password"
              id="password"
              name="password" // Good for accessibility and form submission
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {t('auth.login', 'Login')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;