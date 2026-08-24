# b_wallet

A conceptual MERN-stack web wallet featuring a retro-terminal UI. 

**Note:** This project is a conceptual UI/UX showcase and does not function as a real financial wallet.

## Features

- **Secure Authentication:** JWT-based user authentication with protected dashboard routing.
- **P2P Transfer Flow:** A conceptual user search and money transfer interface.
- **Interactive 3D UI Elements:** Floating 3D flip-cards that react to mouse movements to display balances and transfer actions.

## Tech Stack

- **Frontend:** React, Vite, Styled Components, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)

## Getting Started

To run this project locally, you will need to start both the backend server and the frontend development server.

### Prerequisites

- Node.js installed
- MongoDB installed and running (or a MongoDB URI)

### 1. Setup Backend

Navigate to the `backend` directory, create a `.env` file using `.env.example`, install dependencies, and start the development server:

```bash
cd backend
npm install
npm run dev
```

### 2. Setup Frontend

Open a new terminal, navigate to the `frontend` directory, install dependencies, and start the Vite development server:

```bash
cd frontend
npm install
npm run dev
```

### 3. Open the App

The frontend should be running at `http://localhost:5173` (or similar). The backend defaults to `http://localhost:3000`.
