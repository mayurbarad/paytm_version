import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Dashboard } from "./pages/Dashboard";
import { Send } from "./pages/Send";
import { TransferComplete } from "./components/TransferComplete";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />

          <Route path="/" element={<Navigate to="/signin" />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/send" element={<Send />} />

          <Route path="/done" element={<TransferComplete />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
