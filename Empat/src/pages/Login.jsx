
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LOGO_URL } from "../constants";
import { toast } from "sooner";
import { Navigate } from "react-router-dom";

export default function Login() {
  const {login, loading} = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { error: loginError } = await login(email, password);
    
    if (loginError) {
      setError(loginError.message || 'Erro ao fazer login');
    } else {
        console.log("Login bem-sucedido, redirecionando para dashboard");
      navigate('/menu');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      <div className="hidden lg:block relative overflow-hidden bg-gradient-to-br from-cyan-500 via-pink-500 to-orange-500 p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_50%)]" />
        <Link to="/" className="relative flex items-center gap-3 text-white">
          <img src={LOGO_URL} alt="Empat" className="w-11 h-11 rounded-xl bg-white p-1" />
          <span className="font-display font-bold text-2xl">Empat.</span>
        </Link>
        <div className="relative mt-auto pt-40 text-white max-w-md">
          <h1 className="font-display text-4xl font-bold tracking-tighter leading-tight">
            A IA não substitui o treinador — transforma observações em informação útil.
          </h1>
          <p className="mt-4 text-white/80">Soft skills pelo desporto. Avalia, planeia e acompanha.</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-6">
            <img src={LOGO_URL} alt="Empat" className="w-9 h-9" />
            <span className="font-display font-bold text-xl">Empat.</span>
          </Link>
          <h2 className="font-display text-3xl font-bold tracking-tighter">Bem-vindo de volta</h2>
          <p className="text-slate-500 mt-2">Entra na tua conta de treinador</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                type="email" required value={email} onChange={e=>setEmail(e.target.value)}
                className="mt-1.5 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                data-testid="login-email" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input
                type="password" required value={password} onChange={e=>setPassword(e.target.value)}
                className="mt-1.5 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                data-testid="login-password" />
            </div>
            {err && <div className="text-sm text-red-600 bg-red-50 rounded-xl p-3" data-testid="login-error">{err}</div>}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-semibold transition"
              data-testid="login-submit">
              {loading ? "A entrar..." : "Entrar"}
            </button>
            <br></br>
            <div className="mt-4 text-sm text-center">
                <a> OU </a>
            </div>
            <button type="submit" disabled={loading}
              className="w-full px-4 py-2 text-white font-medium rounded-full bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300"
              data-testid="login-submit">
              {loading ? "A entrar..." : "Entrar com Google - Em breve"}
            </button>
          </form>

          <div className="mt-6 text-sm text-slate-500 text-center">
            Ainda não tens conta? <Link to="/register" className="font-semibold text-cyan-600 hover:text-cyan-700">Cria uma</Link>
          </div>
        </div>
      </div>
    </div>
  );
}