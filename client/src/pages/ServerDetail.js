import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ExternalLink, Copy, Check, Star, Code, Database, FileText } from 'lucide-react';

const ServerDetail = () => {
  const { id } = useParams();
  const [server, setServer] = useState(null);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('vscode');
  const [integrationCode, setIntegrationCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchServer();
    fetchClients();
  }, [id]);

  useEffect(() => {
    if (selectedClient && server) {
      fetchIntegrationCode();
    }
  }, [selectedClient, server]);

  const fetchServer = async () => {
    try {
      const response = await axios.get(`/api/servers/${id}`);
      setServer(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching server:', error);
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get('/api/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchIntegrationCode = async () => {
    try {
      const response = await axios.get(`/api/integration/${selectedClient}/${id}`);
      setIntegrationCode(response.data.config);
    } catch (error) {
      console.error('Error fetching integration code:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(integrationCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Development':
        return <Code size={20} />;
      case 'Database':
        return <Database size={20} />;
      case 'File Management':
        return <FileText size={20} />;
      default:
        return <ExternalLink size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading server details...</h2>
      </div>
    );
  }

  if (!server) {
    return (
      <div className="empty-state">
        <h3>Server not found</h3>
        <p>The requested MCP server could not be found.</p>
        <Link to="/">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="server-detail">
      <Link to="/" className="back-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: '#667eea', textDecoration: 'none' }}>
        <ArrowLeft size={20} />
        Back to servers
      </Link>

      <div className="server-detail-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h1 className="server-detail-title">{server.name}</h1>
            <p style={{ fontSize: '1.125rem', color: '#64748b', marginBottom: '1rem' }}>by {server.author}</p>
          </div>
          {server.featured && (
            <span className="featured-badge" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
              <Star size={16} />
              Featured
            </span>
          )}
        </div>

        <p style={{ fontSize: '1.125rem', lineHeight: '1.6', marginBottom: '1.5rem', color: '#475569' }}>
          {server.description}
        </p>

        <div className="server-detail-meta">
          <span className="server-category" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
            {getCategoryIcon(server.category)}
            {server.category}
          </span>
          <span className="server-version" style={{ fontSize: '1rem', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '0.375rem' }}>
            Version {server.version}
          </span>
          <a 
            href={server.repository} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#667eea', textDecoration: 'none', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '0.375rem' }}
          >
            <ExternalLink size={16} />
            Repository
          </a>
          <a 
            href={server.documentation} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#667eea', textDecoration: 'none', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '0.375rem' }}
          >
            <FileText size={16} />
            Documentation
          </a>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>Tags</h3>
          <div className="server-tags">
            {server.tags.map(tag => (
              <span key={tag} className="tag" style={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem' }}>{tag}</span>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>Available Tools</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {server.tools.map(tool => (
              <span key={tool} style={{ background: '#e0e7ff', color: '#3730a3', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500' }}>
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>Resources</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {server.resources.map(resource => (
              <span key={resource} style={{ background: '#dcfce7', color: '#166534', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', fontFamily: 'monospace' }}>
                {resource}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="integration-section">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Integration</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          Choose your MCP client and copy the configuration code below:
        </p>

        <div className="client-tabs">
          {clients.map(client => (
            <button
              key={client.id}
              onClick={() => setSelectedClient(client.id)}
              className={`client-tab ${selectedClient === client.id ? 'active' : ''}`}
            >
              {client.name}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Add this configuration to your <code style={{ background: '#f1f5f9', padding: '0.125rem 0.25rem', borderRadius: '0.25rem' }}>
              {clients.find(c => c.id === selectedClient)?.configFile || 'config file'}
            </code>:
          </p>
        </div>

        <div className="code-block">
          <button onClick={copyToClipboard} className="copy-button">
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
          <pre>{integrationCode}</pre>
        </div>

        <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #f59e0b' }}>
          <p style={{ fontSize: '0.875rem', color: '#92400e' }}>
            <strong>Note:</strong> Make sure to replace any placeholder values (like API keys or connection strings) with your actual credentials before using this configuration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerDetail;
