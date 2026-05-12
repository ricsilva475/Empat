import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import logoImage from "./images/logo.png";

const NAV_LINKS = ["Sobre", "Metodologia", "Impacto", "Contacto"];

const SKILLS = [
  { icon: "🤝", title: "Comunicação", desc: "Aprender a ouvir, expressar e colaborar dentro e fora do campo." },
  { icon: "🧠", title: "Inteligência Emocional", desc: "Gerir emoções sob pressão e transformá-las em força." },
  { icon: "🎯", title: "Liderança", desc: "Liderar pelo exemplo, motivar equipas e tomar decisões." },
  { icon: "🔄", title: "Resiliência", desc: "Transformar a derrota em aprendizagem e crescimento contínuo." },
  { icon: "🌍", title: "Empatia", desc: "Compreender o outro, respeitar diferenças e construir pontes." },
  { icon: "⚡", title: "Trabalho em Equipa", desc: "O desporto ensina que ninguém vence sozinho." },
];

const STATS = [
  { value: "500+", label: "Jovens impactados" },
  { value: "30+", label: "Clubes parceiros" },
  { value: "12", label: "Modalidades" },
  { value: "96%", label: "Taxa de satisfação" },
];

const STEPS = [
  { num: "01", title: "Vivência Desportiva", desc: "O campo é a sala de aula. Cada jogo, treino e derrota tem uma lição." },
  { num: "02", title: "Reflexão Guiada", desc: "Facilitadores transformam experiências em aprendizagem estruturada." },
  { num: "03", title: "Transferência de Competências", desc: "As soft skills ganhas no desporto aplicam-se na vida, escola e trabalho." },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <img src={logoImage} alt="Logo" style={{ width: 50, height: 50 }} />
      <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 22, color: "#1a1a2e", letterSpacing: "-0.5px" }}>
        Empat.
      </span>
    </div>
  );
}

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(255,252,248,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "none",
      transition: "all 0.4s ease",
      padding: "0 5vw",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Logo />
        </Link>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {NAV_LINKS.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500,
              color: "#3a3a4a", textDecoration: "none", letterSpacing: "0.01em",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = "#E8633A"}
              onMouseLeave={e => e.target.style.color = "#3a3a4a"}
            >{l}</a>
          ))}
          
          {user ? (
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Link to="/dashboard" style={{
                background: "#667eea", color: "#fff", padding: "10px 22px",
                borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                fontWeight: 600, textDecoration: "none", letterSpacing: "0.02em",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 18px rgba(102,126,234,0.3)",
              }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 24px rgba(102,126,234,0.4)"; }}
                onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 18px rgba(102,126,234,0.3)"; }}
              >Dashboard</Link>
              <button onClick={handleLogout} style={{
                background: "transparent", color: "#E8633A", padding: "10px 22px",
                border: "1px solid #E8633A", borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                fontWeight: 600, cursor: "pointer", letterSpacing: "0.02em",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.target.style.background = "#E8633A"; e.target.style.color = "#fff"; }}
                onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#E8633A"; }}
              >Sair</button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 12 }}>
              <Link to="/login" style={{
                background: "#E8633A", color: "#fff", padding: "10px 22px",
                borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                fontWeight: 600, textDecoration: "none", letterSpacing: "0.02em",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 18px rgba(232,99,58,0.3)",
              }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 24px rgba(232,99,58,0.4)"; }}
                onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 18px rgba(232,99,58,0.3)"; }}
              >Entrar</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);
  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      background: "linear-gradient(145deg, #FFFCF8 0%, #FFF5EE 40%, #F0EFFE 100%)",
      position: "relative", overflow: "hidden", padding: "100px 5vw 60px",
    }}>
      {/* Decorative blobs */}
      <div style={{ position: "absolute", top: "10%", right: "8%", width: 420, height: 420, borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%", background: "rgba(232,99,58,0.08)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "5%", left: "5%", width: 300, height: 300, borderRadius: "40% 60% 30% 70% / 60% 40% 60% 40%", background: "rgba(107,79,187,0.07)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "45%", right: "20%", width: 200, height: 200, borderRadius: "50%", background: "rgba(59,191,163,0.08)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(232,99,58,0.1)",
            borderRadius: 100, padding: "6px 16px", marginBottom: 28,
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8633A", display: "inline-block" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#E8633A", letterSpacing: "0.06em", textTransform: "uppercase" }}>Soft skills pelo desporto</span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(42px, 5vw, 68px)",
            fontWeight: 700, lineHeight: 1.08, color: "#1a1a2e", marginBottom: 24,
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.7s ease 0.1s",
          }}>
            O desporto<br />
            <span style={{ color: "#E8633A", fontStyle: "italic" }}>transforma</span><br />
            quem somos.
          </h1>

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 18, lineHeight: 1.7,
            color: "#5a5a6a", marginBottom: 40, maxWidth: 440,
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.7s ease 0.2s",
          }}>
            A Empat. usa o desporto como laboratório vivo para desenvolver as competências humanas que o futuro exige.
          </p>

          <div style={{
            display: "flex", gap: 16,
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.7s ease 0.3s",
          }}>
            <a href="#sobre" style={{
              background: "#1a1a2e", color: "#fff", padding: "14px 32px",
              borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontSize: 15,
              fontWeight: 600, textDecoration: "none",
              boxShadow: "0 6px 24px rgba(26,26,46,0.25)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 10px 30px rgba(26,26,46,0.35)"; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 6px 24px rgba(26,26,46,0.25)"; }}
            >Conhecer o projeto</a>
            <a href="#metodologia" style={{
              border: "1.5px solid rgba(26,26,46,0.2)", color: "#1a1a2e", padding: "14px 32px",
              borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontSize: 15,
              fontWeight: 500, textDecoration: "none", background: "transparent",
              transition: "background 0.2s, border-color 0.2s",
            }}
              onMouseEnter={e => { e.target.style.background = "rgba(26,26,46,0.05)"; }}
              onMouseLeave={e => { e.target.style.background = "transparent"; }}
            >Ver metodologia</a>
          </div>
        </div>

        {/* Visual side */}
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0.92)",
          transition: "all 0.9s ease 0.2s",
        }}>
          <div style={{ position: "relative", width: 380, height: 420 }}>
            {/* Main card */}
            <div style={{
              position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
              width: 280, background: "#fff", borderRadius: 24, padding: "28px 24px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.1)", border: "1px solid rgba(0,0,0,0.04)",
            }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                {["#E8633A", "#6B4FBB", "#3BBFA3"].map(c => (
                  <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
                ))}
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>+96%</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888", marginBottom: 20 }}>jovens reportam maior confiança</div>
              <div style={{ height: 3, background: "#f0f0f0", borderRadius: 2, marginBottom: 4 }}>
                <div style={{ width: "96%", height: "100%", background: "linear-gradient(90deg, #E8633A, #6B4FBB)", borderRadius: 2 }} />
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#bbb" }}>taxa de satisfação 2024</div>
            </div>

            {/* Floating skill pills */}
            {[
              { label: "🤝 Empatia", top: 160, left: -20, color: "#FFF5EE", border: "#E8633A" },
              { label: "🎯 Foco", top: 260, right: -10, color: "#F0EFFE", border: "#6B4FBB" },
              { label: "⚡ Equipa", top: 350, left: 20, color: "#E8F9F5", border: "#3BBFA3" },
            ].map(({ label, top, left, right, color, border }) => (
              <div key={label} style={{
                position: "absolute", top, left, right,
                background: color, border: `1.5px solid ${border}`,
                borderRadius: 100, padding: "8px 16px",
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                color: "#1a1a2e", whiteSpace: "nowrap",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}>{label}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        opacity: visible ? 0.5 : 0, transition: "opacity 1s ease 0.8s",
      }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase" }}>scroll</span>
        <div style={{ width: 1.5, height: 40, background: "linear-gradient(to bottom, #888, transparent)" }} />
      </div>
    </section>
  );
}

function Stats() {
  const [ref, inView] = useInView();
  return (
    <section ref={ref} style={{ background: "#1a1a2e", padding: "60px 5vw" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40 }}>
        {STATS.map(({ value, label }, i) => (
          <div key={label} style={{
            textAlign: "center",
            opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)",
            transition: `all 0.6s ease ${i * 0.1}s`,
          }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 700, color: "#fff", letterSpacing: "-2px" }}>{value}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Sobre() {
  const [ref, inView] = useInView();
  return (
    <section id="sobre" ref={ref} style={{ padding: "100px 5vw", background: "#FFFCF8" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <div style={{
          opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(-40px)",
          transition: "all 0.8s ease",
        }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#E8633A", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>Sobre nós</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: 700, color: "#1a1a2e", lineHeight: 1.2, marginBottom: 24 }}>
            Nascemos do campo.<br />Crescemos com as pessoas.
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 1.8, color: "#5a5a6a", marginBottom: 20 }}>
            A Empat. nasceu da convicção de que o desporto é muito mais do que resultados. É um espaço único onde jovens aprendem a falhar, a comunicar, a liderar — muitas vezes sem dar conta.
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 1.8, color: "#5a5a6a", marginBottom: 32 }}>
            A nossa missão é tornar esse processo consciente: transformar vivências desportivas em competências para a vida.
          </p>
          <div style={{ display: "flex", gap: 32 }}>
            {[{ v: "2020", l: "Fundação" }, { v: "8", l: "Municípios" }, { v: "15+", l: "Facilitadores" }].map(({ v, l }) => (
              <div key={l}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "#E8633A" }}>{v}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{
          opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(40px)",
          transition: "all 0.8s ease 0.2s",
        }}>
          <div style={{ position: "relative" }}>
            <div style={{
              background: "linear-gradient(135deg, #FFF5EE, #F0EFFE)",
              borderRadius: 24, padding: 40, height: 360,
              display: "flex", flexDirection: "column", justifyContent: "flex-end",
              overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 30, right: 30, width: 120, height: 120, borderRadius: "50%", background: "rgba(232,99,58,0.12)" }} />
              <div style={{ position: "absolute", top: 60, right: 60, width: 70, height: 70, borderRadius: "50%", background: "rgba(107,79,187,0.15)" }} />
              <blockquote style={{
                fontFamily: "'Playfair Display', serif", fontSize: 22, fontStyle: "italic",
                color: "#1a1a2e", lineHeight: 1.5, margin: 0,
              }}>
                "O desporto ensina mais soft skills do que qualquer sala de aula — se soubermos olhar para ele."
              </blockquote>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888", marginTop: 16 }}>— Equipa Empat.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metodologia() {
  const [ref, inView] = useInView();
  return (
    <section id="metodologia" ref={ref} style={{ padding: "100px 5vw", background: "#F7F4FF" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 70 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#6B4FBB", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>Metodologia</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: 700, color: "#1a1a2e", lineHeight: 1.2 }}>
            Como transformamos<br />experiências em competências
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
          {STEPS.map(({ num, title, desc }, i) => (
            <div key={num} style={{
              background: "#fff", borderRadius: 20, padding: "40px 32px",
              border: "1px solid rgba(107,79,187,0.1)",
              opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(40px)",
              transition: `all 0.7s ease ${i * 0.15}s`,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: -20, right: -10,
                fontFamily: "'Playfair Display', serif", fontSize: 100, fontWeight: 700,
                color: "rgba(107,79,187,0.06)", lineHeight: 1,
              }}>{num}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#6B4FBB", marginBottom: 16 }}>{num}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1a1a2e", marginBottom: 16, lineHeight: 1.3 }}>{title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.7, color: "#5a5a6a", margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const [ref, inView] = useInView();
  return (
    <section id="impacto" ref={ref} style={{ padding: "100px 5vw", background: "#FFFCF8" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 70 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#E8633A", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>Competências</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: 700, color: "#1a1a2e", lineHeight: 1.2 }}>
            Soft skills que o desporto<br />desenvolve naturalmente
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {SKILLS.map(({ icon, title, desc }, i) => (
            <div key={title}
              style={{
                background: "#fff", borderRadius: 20, padding: "32px 28px",
                border: "1px solid rgba(0,0,0,0.06)",
                cursor: "default",
                opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)",
                transition: `all 0.6s ease ${i * 0.1}s, box-shadow 0.3s, transform 0.3s`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(232,99,58,0.12)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 16 }}>{icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#1a1a2e", marginBottom: 10 }}>{title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.7, color: "#666", margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const [ref, inView] = useInView();
  return (
    <section id="contacto" ref={ref} style={{ padding: "100px 5vw", background: "#1a1a2e", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "20%", left: "10%", width: 300, height: 300, borderRadius: "50%", background: "rgba(232,99,58,0.08)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "15%", width: 200, height: 200, borderRadius: "50%", background: "rgba(107,79,187,0.1)", pointerEvents: "none" }} />
      <div style={{
        maxWidth: 700, margin: "0 auto", textAlign: "center",
        opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: "all 0.8s ease",
      }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 24 }}>
          Pronto para transformar<br />
          <span style={{ color: "#E8633A", fontStyle: "italic" }}>o teu clube?</span>
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, lineHeight: 1.7, color: "rgba(255,255,255,0.6)", marginBottom: 48 }}>
          Trabalha connosco e descobre como o desporto pode ser o maior professor de soft skills da tua comunidade.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <a href="mailto:hello@empat.pt" style={{
            background: "#E8633A", color: "#fff", padding: "16px 36px",
            borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontSize: 15,
            fontWeight: 600, textDecoration: "none",
            boxShadow: "0 6px 24px rgba(232,99,58,0.4)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 10px 30px rgba(232,99,58,0.5)"; }}
            onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 6px 24px rgba(232,99,58,0.4)"; }}
          >Entrar em contacto</a>
          <a href="#sobre" style={{
            border: "1.5px solid rgba(255,255,255,0.2)", color: "#fff", padding: "16px 36px",
            borderRadius: 100, fontFamily: "'DM Sans', sans-serif", fontSize: 15,
            fontWeight: 500, textDecoration: "none", background: "transparent",
            transition: "background 0.2s",
          }}
            onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.07)"; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; }}
          >Saber mais</a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#111120", padding: "40px 5vw", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: "#fff" }}>Empat<span style={{ color: "#E8633A" }}>.</span></span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)", marginLeft: 8 }}>Soft skills pelo desporto</span>
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>© 2025 Empat. Todos os direitos reservados.</div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #FFFCF8; }
      `}</style>
      <NavBar />
      <Hero />
      <Stats />
      <Sobre />
      <Metodologia />
      <Skills />
      <CTA />
      <Footer />
    </div>
  );
}
