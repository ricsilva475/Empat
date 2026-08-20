import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Save,
  KeyRound,
  Loader2,
} from "lucide-react";

import { useAuth, supabase } from "../context/AuthContext";
import { FUNCTIONS } from "../js/constants";

export default function Profile() {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    organization: "",
    phone: "",
    bio: "",
  });

  const [pwd, setPwd] = useState({
    current_password: "",
    new_password: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  /*
   * ============================================================
   * CARREGAR DADOS DO UTILIZADOR
   * ============================================================
   */
  useEffect(() => {
    async function loadUser() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        /*
         * Agora usamos diretamente o ID do Auth.
         *
         * public.users.id = auth.users.id
         */
        const { data, error: dbError } = await supabase
          .from("users")
          .select(
            "id, email, name, created_at, role, organization, phone, bio, updated_at"
          )
          .eq("id", user.id)
          .single();

        if (dbError) {
          console.error("Erro ao carregar perfil:", dbError);
          setError("Não foi possível carregar os dados do perfil.");
          return;
        }

        console.log("Dados do perfil:", data);

        setFormData({
          name: data?.name || "",
          role: data?.role || "Treinador",
          organization: data?.organization || "",
          phone: data?.phone || "",
          bio: data?.bio || "",
        });
      } catch (err) {
        console.error("Erro ao carregar utilizador:", err);
        setError("Ocorreu um erro ao carregar o perfil.");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [user?.id]);

  /*
   * ============================================================
   * ALTERAR CAMPOS DO FORMULÁRIO
   * ============================================================
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
   * ============================================================
   * GUARDAR PERFIL
   * ============================================================
   */
  const onSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!user?.id) {
      setError("Utilizador não autenticado.");
      return;
    }

    if (!formData.name.trim()) {
      setError("O nome é obrigatório.");
      return;
    }

    try {
      setSaving(true);

      /*
       * Atualizar public.users
       *
       * O ID usado é exatamente o mesmo ID do auth.users.
       */
      const { data, error: updateError } = await supabase
        .from("users")
        .update({
          name: formData.name.trim(),
          role: formData.role,
          organization: formData.organization.trim(),
          phone: formData.phone.trim(),
          bio: formData.bio.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single();

      if (updateError) {
        console.error("Erro ao atualizar public.users:", updateError);
        setError(
          updateError.message ||
            "Não foi possível guardar as alterações."
        );
        return;
      }

      /*
       * Atualizar também o nome no Supabase Auth.
       *
       * Isto faz com que:
       *
       * user.user_metadata.full_name
       *
       * fique sincronizado com public.users.name
       */
      const { data: authData, error: authError } =
        await supabase.auth.updateUser({
          data: {
            full_name: formData.name.trim(),
          },
        });

      if (authError) {
        console.error("Erro ao atualizar Auth:", authError);

        /*
         * Os dados da tabela já foram guardados.
         * Apenas avisamos que o metadata do Auth não foi atualizado.
         */
        setError(
          "Os dados foram guardados, mas não foi possível atualizar o nome da conta."
        );
        return;
      }

      /*
       * Atualizar o utilizador no AuthContext para a interface
       * refletir imediatamente as alterações.
       */
      if (setUser && authData?.user) {
        setUser(authData.user);
      }

      console.log("Perfil atualizado:", data);

      setSuccess("Perfil atualizado com sucesso.");

      /*
       * Limpar a mensagem de sucesso depois de alguns segundos.
       */
      setTimeout(() => {
        setSuccess("");
      }, 4000);
    } catch (err) {
      console.error("Erro inesperado ao guardar perfil:", err);
      setError("Ocorreu um erro ao guardar as alterações.");
    } finally {
      setSaving(false);
    }
  };

  /*
   * ============================================================
   * ALTERAR PASSWORD
   * ============================================================
   */
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (!user?.email) {
      setPasswordError("Utilizador não autenticado.");
      return;
    }

    if (!pwd.current_password) {
      setPasswordError("Introduz a password atual.");
      return;
    }

    if (!pwd.new_password) {
      setPasswordError("Introduz a nova password.");
      return;
    }

    if (pwd.new_password.length < 6) {
      setPasswordError(
        "A nova password deve ter pelo menos 6 caracteres."
      );
      return;
    }

    if (pwd.new_password !== pwd.confirm) {
      setPasswordError("As novas passwords não coincidem.");
      return;
    }

    /*
     * Não permitimos que a nova password seja igual à atual.
     */
    if (pwd.current_password === pwd.new_password) {
      setPasswordError(
        "A nova password deve ser diferente da password atual."
      );
      return;
    }

    try {
      setSavingPassword(true);

      /*
       * Primeiro verificamos a password atual.
       *
       * O updateUser({ password }) do Supabase não recebe
       * diretamente a password antiga, por isso fazemos
       * uma autenticação antes.
       */
      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email: user.email,
          password: pwd.current_password,
        });

      if (signInError) {
        console.error("Password atual inválida:", signInError);

        setPasswordError("A password atual está incorreta.");
        return;
      }

      /*
       * Agora podemos alterar a password.
       */
      const { error: updatePasswordError } =
        await supabase.auth.updateUser({
          password: pwd.new_password,
        });

      if (updatePasswordError) {
        console.error(
          "Erro ao alterar password:",
          updatePasswordError
        );

        setPasswordError(
          updatePasswordError.message ||
            "Não foi possível alterar a password."
        );
        return;
      }

      setPwd({
        current_password: "",
        new_password: "",
        confirm: "",
      });

      setPasswordSuccess(
        "Password alterada com sucesso."
      );

      setTimeout(() => {
        setPasswordSuccess("");
      }, 4000);
    } catch (err) {
      console.error("Erro inesperado ao alterar password:", err);

      setPasswordError(
        "Ocorreu um erro ao alterar a password."
      );
    } finally {
      setSavingPassword(false);
    }
  };

  /*
   * ============================================================
   * INICIAIS DO UTILIZADOR
   * ============================================================
   */
  const getInitials = () => {
    const name = formData.name || user?.email || "";

    const parts = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length >= 2) {
      return (
        parts[0][0] + parts[parts.length - 1][0]
      ).toUpperCase();
    }

    return name.substring(0, 2).toUpperCase();
  };

  /*
   * ============================================================
   * DATA DE REGISTO
   * ============================================================
   */
  const formatMemberSince = () => {
    if (!user?.created_at) {
      return "Membro desde 2026";
    }

    const date = new Date(user.created_at);

    if (Number.isNaN(date.getTime())) {
      return "Membro desde 2026";
    }

    return `Membro desde ${date.getFullYear()}`;
  };

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */
  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-[400px]"
        data-testid="profile-loading"
      >
        <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  return (
    <div
      className="space-y-6"
      data-testid="profile-page"
    >
      {/* ======================================================
          CABEÇALHO
      ====================================================== */}

      <div>
        <h1 className="font-display text-3xl font-bold tracking-tighter">
          O meu perfil
        </h1>

        <p className="text-slate-500 mt-1">
          Gere a tua informação pessoal e a segurança da conta.
        </p>
      </div>

      {/* ======================================================
          CARD DE IDENTIDADE
      ====================================================== */}

      <div className="rounded-2xl bg-white border border-slate-200 p-6 flex items-center gap-5 flex-wrap">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 via-pink-500 to-orange-500 flex items-center justify-center text-white font-display font-bold text-3xl shadow-md">
          {getInitials()}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-display text-2xl font-bold">
            {formData.name || "Utilizador"}
          </h2>

          <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
            <Mail className="w-4 h-4" />
            {user?.email}
          </div>

          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 font-semibold capitalize">
              {formData.role || "Treinador"}
            </span>

            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold">
              {formatMemberSince()}
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================
          GRID
      ====================================================== */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* ====================================================
            INFORMAÇÕES PESSOAIS
        ==================================================== */}

        <form
          onSubmit={onSubmit}
          className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4"
          data-testid="profile-form"
        >
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-slate-700" />

            <h3 className="font-display text-xl font-bold">
              Informações pessoais
            </h3>
          </div>

          {/* Nome */}

          <div>
            <label className="text-sm font-medium text-slate-700">
              Nome completo
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              data-testid="profile-name"
            />
          </div>

          {/* Email */}

          <div>
            <label className="text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              value={user?.email || ""}
              disabled
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
              data-testid="profile-email"
            />

            <p className="text-xs text-slate-400 mt-1">
              O email não pode ser alterado aqui.
            </p>
          </div>

          {/* Função / Organização */}

          <div className="grid sm:grid-cols-2 gap-4">

            <div>
              <label className="text-sm font-medium text-slate-700">
                Função
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white"
                data-testid="profile-role"
              >
                {FUNCTIONS
                  .filter(
                    (s) => s !== "Selecione uma função"
                  )
                  .map((s) => (
                    <option
                      key={s}
                      value={s}
                      className="capitalize"
                    >
                      {s}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Organização / Clube
              </label>

              <input
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Ex: Escola Básica X"
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200"
                data-testid="profile-org"
              />
            </div>
          </div>

          {/* Telefone */}

          <div>
            <label className="text-sm font-medium text-slate-700">
              Telefone (opcional)
            </label>

            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200"
              data-testid="profile-phone"
            />
          </div>

          {/* Bio */}

          <div>
            <label className="text-sm font-medium text-slate-700">
              Sobre mim
            </label>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Treinador há 5 anos, foco em desenvolvimento de jovens..."
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200"
              data-testid="profile-bio"
            />
          </div>

          {/* Erro */}

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Sucesso */}

          {success && (
            <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* Botão */}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 text-white font-semibold transition btn-hover-green disabled:opacity-60 disabled:cursor-not-allowed"
              data-testid="profile-save"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}

              {saving
                ? "A guardar..."
                : "Guardar alterações"}
            </button>
          </div>
        </form>

        {/* ====================================================
            ALTERAR PASSWORD
        ==================================================== */}

        <form
          onSubmit={handlePasswordSubmit}
          className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 self-start"
          data-testid="password-form"
        >
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-slate-700" />

            <h3 className="font-display text-xl font-bold">
              Segurança
            </h3>
          </div>

          {/* Password atual */}

          <div>
            <label className="text-sm font-medium text-slate-700">
              Password atual
            </label>

            <input
              type="password"
              required
              value={pwd.current_password}
              onChange={(e) =>
                setPwd({
                  ...pwd,
                  current_password: e.target.value,
                })
              }
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200"
              data-testid="password-current"
            />
          </div>

          {/* Nova password */}

          <div>
            <label className="text-sm font-medium text-slate-700">
              Nova password
            </label>

            <input
              type="password"
              required
              minLength={6}
              value={pwd.new_password}
              onChange={(e) =>
                setPwd({
                  ...pwd,
                  new_password: e.target.value,
                })
              }
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200"
              data-testid="password-new"
            />

            <p className="text-xs text-slate-400 mt-1">
              Mínimo 6 caracteres.
            </p>
          </div>

          {/* Confirmar */}

          <div>
            <label className="text-sm font-medium text-slate-700">
              Confirmar nova password
            </label>

            <input
              type="password"
              required
              value={pwd.confirm}
              onChange={(e) =>
                setPwd({
                  ...pwd,
                  confirm: e.target.value,
                })
              }
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200"
              data-testid="password-confirm"
            />
          </div>

          {/* Erro password */}

          {passwordError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {passwordError}
            </div>
          )}

          {/* Sucesso password */}

          {passwordSuccess && (
            <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              {passwordSuccess}
            </div>
          )}

          {/* Botão password */}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingPassword}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold transition btn-hover-green"
              data-testid="password-save"
            >
              {savingPassword ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <KeyRound className="w-4 h-4" />
              )}

              {savingPassword
                ? "A alterar..."
                : "Alterar password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}