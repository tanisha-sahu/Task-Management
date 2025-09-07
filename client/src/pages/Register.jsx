import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('userInfo')) {
            navigate('/');
        }
    }, [navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post('/users/register', { name, email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Registration successful');
            navigate('/');
        } catch (err) {
            const errMsg = err.response?.data?.message || 'An error occurred';
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white shadow-md rounded-lg p-8">
                    <h3 className="text-2xl font-bold text-center text-slate-800 mb-6">Create an Account</h3>

                    <form onSubmit={submitHandler}>
                        <div className="mb-4">
                            <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="name">Full Name</label>
                            <input type="text" placeholder="John Doe"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>

                        <div className="mb-4">
                            <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="email">Email Address</label>
                            <input type="email" placeholder="you@example.com"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>

                        <div className="mb-4">
                            <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                            <input type="password" placeholder="••••••••"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>

                        <div className="mb-6">
                            <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password" placeholder="••••••••"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg focus:outline-none focus:shadow-outline flex items-center justify-center"
                                disabled={loading}
                            >
                                {loading ? <Loader /> : 'Register'}
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                           <p className="text-sm text-slate-600">
                                Already have an account? <Link to="/login" className="font-bold text-indigo-600 hover:underline">Sign In</Link>
                           </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
