# Task Management App

A full-stack task management application built with **React** (frontend) and **Node.js/Express** (backend), using **MongoDB** for data storage. Users can register, log in, and manage their personal tasks with features like search, filtering, sorting, and pagination.

---

## Features

- User registration and authentication (JWT)
- Create, view, edit, and delete tasks
- Task status management (pending/done)
- Search, filter, sort, and paginate tasks
- Responsive UI with React, Tailwind CSS, and Headless UI
- Toast notifications for feedback
- Secure API with protected routes

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Headless UI, Axios, React Router, React Toastify
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, dotenv, cors

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Clone the Repository

```sh
git clone https://github.com/tanisha-sahu/Task-Management.git
cd task-management-app
```

---

## Backend Setup

1. Go to the `server` directory:

    ```sh
    cd server
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file (see `.env` example):

    ```
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    ```

4. Start the backend server:

    ```sh
    npm run dev
    ```

    The server runs on [http://localhost:5000](http://localhost:5000).

---

## Frontend Setup

1. Open a new terminal and go to the `client` directory:

    ```sh
    cd client
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Start the frontend development server:

    ```sh
    npm run dev
    ```

    The app runs on [http://localhost:5173](http://localhost:5173) by default.

---

## Usage

- Register a new account or log in.
- Add, edit, or delete your tasks.
- Use search, filter, and sort options to manage tasks efficiently.
- Log out securely from the header menu.

---

## Folder Structure

```
client/   # React frontend
server/   # Node.js/Express backend
```

---

## License

This project is licensed under the MIT License.

---

## Author

- [tanisha-sahu](https://github.com/tanisha-sahu)

---

## Acknowledgements

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)