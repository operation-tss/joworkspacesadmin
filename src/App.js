import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Til from "./pages/Til";
import Diary from "./pages/Diary";
import { Login } from "./pages/Auth/Login/Login";
import { DeleteAccount } from "./pages/DeleteAccount/DeleteAccount";
import { PendingPayment } from "./pages/PendingPayment/PendingPayment";

export default function App() {
  const user = localStorage.getItem("user");
  console.log("on", { user });
  return (
    <BrowserRouter>
      <div className="App">
        <Header user={user} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/deleteAccount" element={<DeleteAccount />} />
          <Route path="/pendingPayment" element={<PendingPayment />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/Til" element={<Til />} />
          <Route path="/diary" element={<Diary />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
