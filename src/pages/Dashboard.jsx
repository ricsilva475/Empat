import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await logout();
    if (!error) {
      navigate('/');
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <Link to="/" className="dashboard-logo">Empat.</Link>
        <div className="nav-actions">
          <span className="user-email">{user?.email}</span>
          <button onClick={handleLogout} className="logout-button">Sair</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-box">
          <h1>Bem-vindo! 👋</h1>
          <p>Estás autenticado como:</p>
          <p className="user-info">{user?.email}</p>
          
          <div className="user-details">
            <h2>Informações da Conta</h2>
            <div className="detail-item">
              <span className="label">Email:</span>
              <span className="value">{user?.email}</span>
            </div>
            <div className="detail-item">
              <span className="label">ID do Utilizador:</span>
              <span className="value">{user?.id}</span>
            </div>
            <div className="detail-item">
              <span className="label">Última autenticação:</span>
              <span className="value">{new Date(user?.last_sign_in_at).toLocaleString('pt-PT')}</span>
            </div>
          </div>

          <button onClick={handleLogout} className="logout-button-large">
            Sair da Conta
          </button>
        </div>
      </div>
    </div>
  );
}
