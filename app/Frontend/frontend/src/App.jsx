import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
