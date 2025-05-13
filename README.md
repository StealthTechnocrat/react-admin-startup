
# React Admin Startup

A modern full-stack admin panel boilerplate built using:

- ⚡ **React** for the frontend
- 🚀 **Fastify** as the backend framework
- 🍞 **Bun** as the JavaScript runtime
- 🍃 **MongoDB** for the database
- 🛡️ Auto-creates a default admin user on startup

---

## 📁 Project Structure

react-admin-startup/
├── api/ # Fastify backend powered by Bun
│ ├── config/
│ ├── modules
│ ├── shared/
│ └── index.ts # Entry point for Fastify server
├── client/ # React frontend (Vite or CRA)
│ ├── src/
│ └── ...
├── .env # Environment variables
└── README.md



---

## 🛠️ Tech Stack

| Tech       | Description                               |
|------------|-------------------------------------------|
| React      | Frontend framework for building UI        |
| Fastify    | Fast and low-overhead backend framework   |
| Bun        | All-in-one JavaScript runtime             |
| MongoDB    | NoSQL database                            |
| Mongoose   | ODM for MongoDB                           |

---

## 🚀 Getting Started

### 1. Clone the Repository

```
git clone https://github.com/your-username/react-admin-startup.git
cd react-admin-startup
```

### 2. Setup Environment Variables
    Create a .env file in the api/ directory:
    based on .env.template
    MONGO_URI=mongodb://localhost:27017/react-admin
    PORT=5000
    ADMIN_EMAIL=admin@example.com
    ADMIN_PASSWORD=admin123

    
### 3. Start Backend
    ```
    cd api
    bun install
    bun index.ts```

