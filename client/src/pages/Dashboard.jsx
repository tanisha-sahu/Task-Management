import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Pagination from '../components/Pagination';
import { Menu, Transition, Dialog } from '@headlessui/react';
import {
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  PencilSquareIcon,
  ChevronUpIcon,
  ChevronUpDownIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt_desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [deletingId, setDeletingId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(
        `/tasks/view?search=${encodeURIComponent(search)}&status=${status}&sortBy=${sortBy}&page=${page}&limit=${limit}`
      );
      setTasks(data.tasks || []);
      setPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount ?? (data.tasks ? data.tasks.length : 0));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [search, status, sortBy, page, limit]);

  useEffect(() => {
    if (!localStorage.getItem('userInfo')) {
      navigate('/login');
      return;
    }
    fetchTasks();
  }, [navigate, fetchTasks]);


  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  
  const deleteTaskHandler = async (id) => {
    if (!id) return;

    setError('');
    setSuccessMsg('');
    setDeletingId(id);

    try {
      const res = await api.delete(`/tasks/delete/${id}`);

      if (selectedTask && selectedTask._id === id) {
        setIsModalOpen(false);
        setSelectedTask(null);
      }

      await fetchTasks();

      toast.success('Task deleted successfully');
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete task';
      setError(msg);
    } finally {
      setDeletingId(null);
      setTaskToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
    setSortBy(`${key}_${direction}`);
    setPage(1);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ChevronUpDownIcon className="inline-block w-4 h-4 ml-1.5 text-slate-400" />;
    if (sortConfig.direction === 'asc') return <ChevronUpIcon className="inline-block w-4 h-4 ml-1.5 text-slate-800" />;
    return <ChevronDownIcon className="inline-block w-4 h-4 ml-1.5 text-slate-800" />;
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const pageStart = tasks.length > 0 ? (page - 1) * limit + 1 : 0;
  const pageEnd = tasks.length > 0 ? pageStart + tasks.length - 1 : 0;

  const StatusBadge = ({ status }) => {
    const baseClasses = 'px-2.5 py-1 text-xs font-semibold rounded-full';
    if (status === 'done') return <span className={`${baseClasses} bg-green-100 text-green-800`}>Done</span>;
    return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
  };

  const openTaskDetail = (task) => {
    if (isDesktop) {
      setSelectedTask(task);
      setIsModalOpen(true);
    } else {
      navigate(`/task/${task._id}/edit`);
    }
  };

  return (
    <div className="bg-gradient-to-b min-h-screen from-slate-100 to-slate-100 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
            <h4 className="text-lg font-semibold text-slate-800 self-start sm:self-center">All Tasks</h4>
            <Link to="/task/new" className="w-full sm:w-auto">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 w-full">
                Add New Task
              </button>
            </Link>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
              <Menu as="div" className="relative inline-block text-left w-full md:w-auto">
                <Menu.Button className="inline-flex justify-center w-full rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none">
                  Show: {limit}
                  <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-left absolute left-0 mt-2 w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1">
                      {[2, 5, 10, 20, 50].map((val) => (
                        <Menu.Item key={val}>
                          {({ active }) => (
                            <button
                              onClick={() => handleLimitChange(val)}
                              className={`${active ? 'bg-slate-100 text-slate-900' : 'text-slate-700'} block px-4 py-2 text-sm w-full text-left`}
                            >
                              {val} entries
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <Menu as="div" className="relative inline-block text-left w-full sm:w-auto">
                  <Menu.Button className="inline-flex justify-center w-full rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none">
                    Status: {status.charAt(0).toUpperCase() + status.slice(1)}
                    <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <div className="py-1">
                        {['all', 'pending', 'done'].map((s) => (
                          <Menu.Item key={s}>
                            {({ active }) => (
                              <button
                                onClick={() => handleStatusChange(s)}
                                className={`${active ? 'bg-slate-100 text-slate-900' : 'text-slate-700'} block px-4 py-2 text-sm w-full text-left`}
                              >
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>

                <div className="flex items-center space-x-2 text-sm text-slate-600 w-full sm:w-auto">
                  <label htmlFor="search-tasks" className="font-medium sr-only sm:not-sr-only">
                    Search:
                  </label>
                  <input
                    id="search-tasks"
                    type="search"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={handleSearchChange}
                    className="p-2 border border-slate-300 rounded-md focus:outline-none w-full"
                  />
                </div>
              </div>
            </div>

            {error && <Message variant="danger">{error}</Message>}
            {successMsg && <Message variant="success">{successMsg}</Message>}

            {/* Mobile Card View */}
            <div className="md:hidden">
              {loading ? (
                <Loader />
              ) : tasks.length > 0 ? (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task._id}
                      className="bg-white p-4 rounded-lg border border-slate-200 cursor-pointer"
                      onClick={() => openTaskDetail(task)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-bold text-slate-800 pr-2">{task.title}</h5>
                        <StatusBadge status={task.status} />
                      </div>
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{task.description}</p>
                      <p className="text-xs text-slate-500 mb-4">Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                      <div className="flex justify-end space-x-3 border-t pt-3">
                        <Link to={`/task/${task._id}/edit`}>
                          <PencilIcon className="h-5 w-5 text-slate-500 hover:text-indigo-600" />
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTaskToDelete(task._id);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <TrashIcon className="h-5 w-5 text-slate-500 hover:text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">No tasks found.</div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                  <tr>
                    <th className="px-6 py-3">S.No.</th>
                    <th onClick={() => handleSort('title')} className="px-6 py-3 cursor-pointer">
                      <span className="flex items-center">
                        Title {getSortIcon('title')}
                      </span>
                    </th>
                    <th className="px-6 py-3">Description</th>
                    <th onClick={() => handleSort('createdAt')} className="px-6 py-3 cursor-pointer">
                      <span className="flex items-center">
                        Created On {getSortIcon('createdAt')}
                      </span>
                    </th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6">
                        <Loader />
                      </td>
                    </tr>
                  ) : tasks.length > 0 ? (
                    tasks.map((task, i) => (
                      <tr
                        key={task._id}
                        className="bg-white border-b hover:bg-slate-50 cursor-pointer"
                        onClick={() => openTaskDetail(task)}
                      >
                        <td className="px-6 py-4">{pageStart + i}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">{task.title}</td>
                        <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{task.description}</td>
                        <td className="px-6 py-4 text-slate-600">{new Date(task.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={task.status} />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center items-center space-x-4">
                            <Link
                              to={`/task/${task._id}/edit`}
                              onClick={(e) => e.stopPropagation()}
                              className="items-center py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setTaskToDelete(task._id);
                                setIsDeleteModalOpen(true);
                              }}
                              className="items-center py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-slate-500">
                        No tasks found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {!loading && tasks.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-slate-600 gap-4">
                <p>
                  Showing {pageStart} to {pageEnd} of {totalCount} entries
                </p>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Task Detail Modal */}
      <Transition appear show={isModalOpen && isDesktop} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                  <div className="flex items-start justify-between px-6 py-4 border-b">
                    <div>
                      <Dialog.Title as="h3" className="text-lg font-semibold text-slate-900">
                        {selectedTask?.title}
                      </Dialog.Title>
                      <p className="text-sm text-slate-500 mt-1">Full task details</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setIsModalOpen(false);
                          setSelectedTask(null);
                        }}
                        className="p-2 rounded hover:bg-slate-100"
                      >
                        <XMarkIcon className="w-5 h-5 text-slate-600" />
                      </button>
                    </div>
                  </div>

                  <div className="px-6 py-6">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-1">Description</h4>
                      <p className="text-slate-700">{selectedTask?.description || '—'}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-slate-700">Status</h5>
                        <div className="mt-2">
                          <StatusBadge status={selectedTask?.status} />
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-slate-700">Dates</h5>
                        <div className="mt-2 text-sm text-slate-600">
                          <div>Created: {selectedTask ? new Date(selectedTask.createdAt).toLocaleString() : '—'}</div>
                          <div className="mt-1">
                            Updated: {selectedTask && selectedTask.updatedAt ? new Date(selectedTask.updatedAt).toLocaleString() : '—'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t flex justify-end gap-3">
                    <Link
                      to={`/task/${selectedTask?._id}/edit`}
                      onClick={() => setIsModalOpen(false)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-200 hover:bg-indigo-50 text-slate-700"
                    >
                      <PencilIcon className="w-4 h-4" /> Edit
                    </Link>
                    <button
                      onClick={() => {
                        if (selectedTask) {
                          setTaskToDelete(selectedTask._id);
                          setIsDeleteModalOpen(true);
                        }
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      <TrashIcon className="w-4 h-4" /> Delete
                    </button>
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        setSelectedTask(null);
                      }}
                      className="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200"
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsDeleteModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 text-center">
                <Dialog.Title className="text-lg font-medium text-slate-900">Delete Task?</Dialog.Title>
                <p className="mt-2 text-sm text-slate-600">Are you sure you want to delete this task? This action cannot be undone.</p>
                <div className="mt-6 flex justify-center gap-4">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteTaskHandler(taskToDelete)}
                    disabled={deletingId === taskToDelete}
                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {deletingId === taskToDelete ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Dashboard;
