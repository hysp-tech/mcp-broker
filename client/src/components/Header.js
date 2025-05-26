import React from 'react';
import { Link } from 'react-router-dom';
import { Server } from 'lucide-react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <Server size={32} />
          <span>MCP Broker</span>
        </Link>
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><a href="https://modelcontextprotocol.io/" target="_blank" rel="noopener noreferrer">Documentation</a></li>
            <li><a href="https://github.com/modelcontextprotocol" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
