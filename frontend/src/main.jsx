import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { logout } from './store/authSlice';
import { setOnUnauthorizedCallback } from './services/api';
import App from './App';
import './index.css';

setOnUnauthorizedCallback(() => {
  store.dispatch(logout());
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
