import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Navbar";
import Athletes from "./pages/Athletes";
import AthleteDetail from "./pages/AthletesDetail";
import Assessments from "./pages/Assessments";
import Exercises from "./pages/Exercises";
import Observations from "./pages/Observations";
import Planner from "./pages/Planner";
import Goals from "./pages/Goals";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";


function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center text-slate-500\">A carregar...</div>;
  if (!user) return <Navigate to="/login\" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/menu" element={<Protected><Layout /></Protected>}>
          <Route index element={<Dashboard />} />
          <Route path="/menu/atletas" element={<Athletes />} />
          <Route path="/menu/atletas/:id" element={<AthleteDetail />} />
          <Route path="/menu/avaliacoes" element={<Assessments />} />
          <Route path="/menu/exercicios" element={<Exercises />} />
          <Route path="/menu/observacoes" element={<Observations />} />
          <Route path="/menu/planos" element={<Planner />} />
          <Route path="/menu/metas" element={<Goals />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}