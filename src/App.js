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
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoutes/ProtectedRoute";

export default function App() {
  const user = localStorage.getItem("user");
  console.log("on", { user });
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* <Header user={user} /> */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/deleteAccount" element={<DeleteAccount />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/pendingPayment" element={<ProtectedRoute><PendingPayment /></ProtectedRoute>} />
          <Route path="*" element={<About />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
