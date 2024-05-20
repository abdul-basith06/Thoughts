import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear();
  return <RegisterPage />;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="/logout" element={<Logout />}/>
          <Route path="/" element={<HomePage />}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
