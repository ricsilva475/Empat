import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LOGO_URL } from "../constants";
import { useAuth } from "../context/AuthContext";
import { toast } from "sooner";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("O nome é obrigatório.");
      return;
    }

    if (!formData.email.trim()) {
      setError("O email é obrigatório.");
      return;
    }

    if (formData.password.length < 6) {
      setError("A palavra-passe deve ter pelo menos 6 caracteres.");
      return;
    }

    const { error: signupError } = await signup(
      formData.email,
      formData.password,
      formData.name
    );

    if (signupError) {
      const message = signupError.message || "Erro ao criar conta. Tenta novamente.";
      setError(message);
      toast.error(message);
      return;
    }

    //console.warn("Conta criada com sucesso!");
    toast.success("Conta criada com sucesso!");
    navigate("/app");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      <div className="hidden lg:block relative overflow-hidden bg-gradient-to-br from-lime-400 via-cyan-500 to-pink-500 p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.3),transparent_50%)]" />
        <Link to="/" className="relative flex items-center gap-3 text-white">
          <img src={LOGO_URL} alt="Empat" className="w-11 h-11 rounded-xl bg-white p-1" />
          <span className="font-display font-bold text-2xl">Empat.</span>
        </Link>
        <div className="relative mt-auto pt-40 text-white max-w-md">
          <h1 className="font-display text-4xl font-bold tracking-tighter leading-tight">
            Treina pessoas, não só atletas.
          </h1>
          <p className="mt-4 text-white/80">Soft skills desenvolvidas em cada treino, com o apoio da IA.</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-6">
            <img src={LOGO_URL} alt="Empat" className="w-9 h-9" />
            <span className="font-display font-bold text-xl">Empat.</span>
          </Link>
          <h2 className="font-display text-3xl font-bold tracking-tighter">Criar conta</h2>
          <p className="text-slate-500 mt-2">Começa grátis em menos de 1 minuto</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Nome</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1.5 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                data-testid="register-name"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1.5 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                data-testid="register-email"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="mt-1.5 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                data-testid="register-password"
              />
            </div>
            
            {error && (
              <div className="text-sm text-red-600 bg-red-50 rounded-xl p-3" data-testid="register-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-semibold transition"
              data-testid="register-submit"
            >
              {loading ? "A criar..." : "Criar conta"}
            </button>
          </form>

          <div className="mt-6 text-sm text-slate-500 text-center">
            Já tens conta? <Link to="/login" className="font-semibold text-cyan-600 hover:text-cyan-700">Entra</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
