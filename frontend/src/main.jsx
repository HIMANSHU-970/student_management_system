import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { AuthProvider } from "./context/AuthContext";

// 🔥 OPTIONAL: global axios config (recommended)
import axios from "axios";
axios.defaults.baseURL = `${import.meta.env.VITE_API_URL || "http://localhost:5002"}`;
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);