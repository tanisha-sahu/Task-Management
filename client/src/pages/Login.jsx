import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('userInfo')) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            const { data } = await api.post('/users/login', { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success("Login successful");
            navigate('/');
        } catch (err) {
            console.error("Login Error:", err);
            toast.error(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-slate-50">
            <div className="w-full max-w-md">
                <div className="bg-white shadow-md rounded-lg p-8">
                    <h3 className="text-2xl font-bold text-center text-slate-800 mb-6">Sign In</h3>

                    {error && <Message variant="danger">{error}</Message>}

                    <form onSubmit={submitHandler}>
                        <div className="mb-4">
                            <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg focus:outline-none focus:shadow-outline flex items-center justify-center"
                                disabled={loading}
                            >
                                {loading ? <Loader className="w-5 h-5 text-white" /> : 'Sign In'}
                            </button>

                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-slate-600">
                                Don&apos;t have an account?{' '}
                                <Link to="/register" className="font-bold text-indigo-600 hover:underline">
                                    Register here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
