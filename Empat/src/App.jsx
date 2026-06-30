import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Navbar";
import Athletes from "./pages/Athletes";
import AthleteDetail from "./pages/AthletesDetail";
import Assessments from "./pages/Formulario";
import Exercises from "./pages/Exercises";
import Observations from "./pages/Observations";
import Planner from "./pages/Planner";
import Goals from "./pages/Goals";
import Profile from "./pages/Perfil";
import Calendar from "./pages/Calendar";
import Groups from "./pages/Groups";
import Ola from "./pages/Ola";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center text-slate-500">A carregar...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {

  const isAdmin = window.location.hostname.startsWith("admin.");

  return (
    <AuthProvider>
      <BrowserRouter>
      <ToastContainer />
        <Routes>
          <Route path="/" element={isAdmin ? <Ola /> : <Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/menu" element={<Protected><Layout /></Protected>}>
          <Route index element={<Dashboard />} />
          <Route path="/menu/perfil" element={<Profile />} />
          <Route path="/menu/atletas" element={<Athletes />} />
          <Route path="/menu/atletas/:id" element={<AthleteDetail />} />
          <Route path="/menu/turmas" element={<Groups />} />
          <Route path="/menu/avaliacoes" element={<Assessments />} />
          <Route path="/menu/exercicios" element={<Exercises />} />
          <Route path="/menu/observacoes" element={<Observations />} />
          <Route path="/menu/planos" element={<Planner />} />
          <Route path="/menu/metas" element={<Goals />} />
          <Route path="/menu/calendario" element={<Calendar />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    
  );
}