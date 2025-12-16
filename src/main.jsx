import React from "react";
import ReactDOM from "react-dom/client";

// Global styles (tokens and premium components already imported via index.css)
import "./index.css";

import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
