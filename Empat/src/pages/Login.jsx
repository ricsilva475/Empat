
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LOGO_URL } from "../js/constants";
import { toast } from "sooner";
import { Navigate } from "react-router-dom";

export default function Login() {
  const {login, loginWithGoogle, loading} = useAuth();
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

  const handleGoogleLogin = async () => {
    const { error: googleError } = await loginWithGoogle();
    if (googleError) {
      setError(googleError.message || "Erro ao entrar com Google");
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
        
           {/*<button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 text-gray-700 font-medium rounded-full bg-white border border-gray-300 hover:bg-gray-50 hover:shadow-md active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                data-testid="login-google"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29A11.96 11.96 0 000 12c0 1.94.46 3.77 1.29 5.38l3.98-3.09z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
                    />
                  </svg>
                )}
                <span>{loading ? "A entrar..." : "Entrar com Google"}</span>
            </button>*/}
          </form>

          <div className="mt-6 text-sm text-slate-500 text-center">
            Ainda não tens conta? <Link to="/register" className="font-semibold text-cyan-600 hover:text-cyan-700">Cria uma</Link>
          </div>
        </div>
      </div>
    </div>
  );
}