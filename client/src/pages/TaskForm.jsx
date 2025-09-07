import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/solid';
import api from '../api/axios';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { toast } from 'react-toastify';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'done', label: 'Done' },
];

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id) && id !== 'new';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id && id !== 'new') {
      const fetchTask = async () => {
        setLoading(true);
        setError('');
        try {
          const { data } = await api.get(`/tasks/view/${id}`);
          setTitle(data.title || '');
          setDescription(data.description || '');
          setStatus(data.status || 'pending');
        } catch (err) {
          if (err.response && err.response.status === 404) {
            setError('Task not found. It may have been deleted.');
            toast.error('Task not found. It may have been deleted.');
          } else {
            setError('Failed to fetch task data.');
            toast.error('Failed to fetch task data.');
          }
        } finally {
          setLoading(false);
        }
      };
      fetchTask();
    } else {
      setTitle('');
      setDescription('');
      setStatus('pending');
      setError('');
      setLoading(false);
    }
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const taskData = { title, description, status };

    try {
      if (isEditMode) {
        await api.put(`/tasks/edit/${id}`, taskData);
        toast.success('Task updated successfully');
      } else {
        await api.post('/tasks/create', taskData);
        toast.success('Task added successfully');
      }
      navigate('/');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'An error occurred';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-slate-50 to-white py-10 mt-6">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="bg-white shadow-xl rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b">
            <h4 className="text-xl font-semibold text-slate-900">
              {isEditMode ? 'Edit Task' : 'Create a New Task'}
            </h4>
            <p className="text-sm text-slate-500 mt-1">
              {isEditMode ? 'Update the details and save changes.' : 'Fill the form to create a new task.'}
            </p>
          </div>

          <form onSubmit={submitHandler} className="p-6">
            {error && <Message variant="danger">{error}</Message>}

            {loading ? (
              <div className="py-8"><Loader /></div>
            ) : (
              <>
                <div className="grid gap-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-700">Title</label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
                      placeholder="Short, descriptive title"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      required
                      className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
                      placeholder="Describe the task in a few sentences"
                    />
                  </div>

                  {/* Stylish Headless UI dropdown for Status */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                    <Menu as="div" className="relative inline-block text-left w-full">
                      <div>
                        <Menu.Button
                          className="w-full flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
                          aria-label="Select task status"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`inline-block w-3 h-3 rounded-full ${status === 'done' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                            <span className="text-slate-800 font-medium">
                              {statusOptions.find((s) => s.value === status)?.label || 'Pending'}
                            </span>
                          </div>
                          <ChevronDownIcon className="w-5 h-5 text-slate-400" />
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-150"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-100"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-full rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-30">
                          <div className="py-2">
                            {statusOptions.map((opt) => (
                              <Menu.Item key={opt.value}>
                                {({ active }) => (
                                  <button
                                    type="button"
                                    onClick={() => setStatus(opt.value)}
                                    className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 ${active ? 'bg-slate-50' : ''}`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className={`inline-block w-3 h-3 rounded-full ${opt.value === 'done' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                                      <span className="text-slate-800">{opt.label}</span>
                                    </div>
                                    {status === opt.value && <CheckIcon className="w-5 h-5 text-indigo-600" />}
                                  </button>
                                )}
                              </Menu.Item>
                            ))}
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                    <p className="mt-2 text-xs text-slate-400">Choose the current status of the task.</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold shadow-md transition"
                  >
                    {isEditMode ? 'Update Task' : 'Add Task'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
