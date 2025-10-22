import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // ← Make sure this line exists
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/autoplay";

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <BrowserRouter>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </BrowserRouter>
  </Provider>
);
