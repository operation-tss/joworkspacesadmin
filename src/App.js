import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import Menu from "./components/Menu/Menu";
import CreateUser from "./pages/CreateUser/CreateUser";
import ActiveUsers from "./pages/ActiveUsers/ActiveUsers";
import PaymentDetails from "./pages/PaymentDetails/PaymentDetails";

export default function App() {
  const user = localStorage.getItem("user");
  const location = useLocation();
  const hideMenuRoutes = ['/login', '/deleteAccount'];

  return (
    <AuthProvider>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {!hideMenuRoutes.includes(location.pathname) && <Menu user={user} />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/deleteAccount" element={<DeleteAccount />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/pendingPayment" element={<ProtectedRoute><PendingPayment /></ProtectedRoute>} />
          <Route path="/createUser" element={<ProtectedRoute><CreateUser /></ProtectedRoute>} />
          <Route path="/activeUsers" element={<ProtectedRoute><ActiveUsers /></ProtectedRoute>} />
          <Route path="/paymentDetails" element={<ProtectedRoute><PaymentDetails /></ProtectedRoute>} />
          <Route path="*" element={<About />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
