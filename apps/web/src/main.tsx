import React from 'react';
import ReactDOM from 'react-dom/client';
import '@ionic/react/css/core.css';
import LegacyApp from './LegacyApp';
import './styles.css';
import './original.css';
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><LegacyApp/></React.StrictMode>);
