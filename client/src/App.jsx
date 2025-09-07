import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskForm from './pages/TaskForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <Router>
            <Header />
            <main className="bg-slate-100 min-h-screen">
                
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/task/new" element={<TaskForm />} />
                    <Route path="/task/:id/edit" element={<TaskForm />} />

                </Routes>
            </main>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar style={{ zIndex: 100 }} />
        </Router>
    );
}

export default App;