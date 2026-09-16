import { useEffect, useState } from "react";
import { api } from "./services/api";

function App() {
  const [message, setMessage] = useState("Connecting to backend...");

  useEffect(() => {
    api.get("/").then((data) => {
      setMessage(data.message);
    });
  }, []);

  return (
    <div>
      <h1>Pathology Laboratory Management System</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
