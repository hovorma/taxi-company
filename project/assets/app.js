import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './react/HomePage';
import CarPage from './react/car/CarPage';
import CarFormPage from './react/car/CarFormPage';
import DriverPage from './react/driver/DriverPage';
import DriverFormPage from './react/driver/DriverFormPage';
import DriverHistoryPage from './react/driver/DriverHistoryPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cars" element={<CarPage />} />
                <Route path="/cars/new" element={<CarFormPage />} />
                <Route path="/cars/:id/edit" element={<CarFormPage />} />
                <Route path="/drivers" element={<DriverPage />} />
                <Route path="/drivers/new" element={<DriverFormPage />} />
                <Route path="/drivers/:id/edit" element={<DriverFormPage />} />
                <Route path="/drivers/:id/history" element={<DriverHistoryPage />} />
            </Routes>
        </Router>
    );
}

ReactDOM.render(<App />, document.getElementById('react-app'));
