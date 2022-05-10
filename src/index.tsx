import React from 'react';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { createRoot } from 'react-dom/client';
import { store } from './store';
import { Provider } from 'react-redux';
import axios from 'axios';
import { BACKEND_URL } from './constants';
const root = document.getElementById('root');
if (!root) throw new Error('Failed to find the root element');
if (!localStorage['searchHistory']) {
  localStorage['searchHistory'] = JSON.stringify([]);
}

axios.defaults.baseURL = BACKEND_URL;

createRoot(root).render(
    <Provider store={store}>
    <App />
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
