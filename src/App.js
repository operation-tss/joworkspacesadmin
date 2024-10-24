import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Til from "./pages/Til";
import Diary from "./pages/Diary";
import { Login } from "./pages/Auth/Login/Login";
import { DeleteAccount } from "./pages/DeleteAccount/DeleteAccount";
import Error from "./pages/component/Error";

const AppLayout = () => {
  const user = localStorage.getItem("user");

  return (
    <div className="app">
      <Header user={user} />
      <Outlet />
    </div>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login", // Changed to lowercase
        element: <Login />,
      },
      {
        path: "/deleteaccount", // Changed to lowercase
        element: <DeleteAccount />,
      },
     
    
      {
        path: "/about", // Changed to lowercase
        element: <About />,
      },
      {
        path: "/til", // Changed to lowercase
        element: <Til />,
      },
      {
        path: "/diary", // Changed to lowercase
        element: <Diary />,
      },
    ],
  },
]);

const App = () => {
  return (
    <RouterProvider router={appRouter} />
    // <BrowserRouter>
    //   <div className="App">
    //     <Header user={user} />
    //     <Routes>
    //       <Route path="/login" element={<Login />} />
    //       <Route path="/" element={<Home />} />
    //       <Route path="/deleteAccount" element={<DeleteAccount />} />
    //       <Route path="/about" element={<About />} />
    //       <Route path="/projects" element={<Projects />} />
    //       <Route path="/til" element={<Til />} />
    //       <Route path="/diary" element={<Diary />} />
    //       <Route path="*" element={<Error />} /> {/* Catch all unmatched routes */}
    //     </Routes>
    //   </div>
    // </BrowserRouter>

  );
};

export default App;
