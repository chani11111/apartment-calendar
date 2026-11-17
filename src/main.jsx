import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import AuthGate from './components/auth/AuthGate';
import CheckoutPage from './components/checkout/CheckoutPage';
import { checkoutTokenFromUrl } from './lib/checkout';
import './index.css';

// קישור יציאה של אורח (?checkout=...) פותח רק את דף היציאה, בלי התחברות
const token = checkoutTokenFromUrl();
ReactDOM.createRoot(document.getElementById('root')).render(token ? <CheckoutPage token={token} /> : <AuthGate><App /></AuthGate>);
