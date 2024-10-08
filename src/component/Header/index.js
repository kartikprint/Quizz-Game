import "./index.css";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <nav className="header-container">
      <ul className="death-card">
        <div className="log-card">
          <h1 className="header">DEATH NOTE</h1>
        </div>
        <Link to="/">
          <li className="nav-item">Home</li>
        </Link>
        <Link to="/contact">
          <li className="nav-item">Contact</li>
        </Link>
      </ul>
    </nav>
  );
};

export default Header;
