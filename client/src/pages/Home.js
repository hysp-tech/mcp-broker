import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Star, ExternalLink, Code, Database } from 'lucide-react';

const Home = () => {
  const [servers, setServers] = useState([]);
  const [filteredServers, setFilteredServers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  useEffect(() => {
    fetchServers();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterServers();
  }, [servers, searchTerm, selectedCategory, showFeaturedOnly]);

  const fetchServers = async () => {
    try {
      const response = await axios.get('/api/servers');
      setServers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching servers:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterServers = () => {
    let filtered = [...servers];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(server =>
        server.name.toLowerCase().includes(term) ||
        server.description.toLowerCase().includes(term) ||
        server.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(server => server.category === selectedCategory);
    }

    if (showFeaturedOnly) {
      filtered = filtered.filter(server => server.featured);
    }

    setFilteredServers(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Development':
        return <Code size={16} />;
      case 'Database':
        return <Database size={16} />;
      default:
        return <ExternalLink size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading MCP servers...</h2>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>MCP Broker</h1>
          <p>
            Discover and integrate Model Context Protocol servers with ease. 
            Find the perfect MCP server for your needs and get integration code for your favorite clients.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="search-content">
          <form onSubmit={handleSearch} className="search-bar">
            <input
              type="text"
              placeholder="Search MCP servers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <Search size={20} />
              Search
            </button>
          </form>

          <div className="filters">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
              />
              Featured only
            </label>
          </div>
        </div>
      </section>

      {/* Servers Section */}
      <section className="servers-section">
        <div className="servers-content">
          <h2 className="section-title">
            {showFeaturedOnly ? 'Featured ' : ''}
            MCP Servers ({filteredServers.length})
          </h2>

          {filteredServers.length === 0 ? (
            <div className="empty-state">
              <h3>No servers found</h3>
              <p>Try adjusting your search criteria or browse all servers.</p>
            </div>
          ) : (
            <div className="servers-grid">
              {filteredServers.map(server => (
                <Link
                  key={server.id}
                  to={`/server/${server.id}`}
                  className="server-card"
                >
                  <div className="server-header">
                    <div>
                      <h3 className="server-title">{server.name}</h3>
                      <p className="server-author">by {server.author}</p>
                    </div>
                    {server.featured && (
                      <span className="featured-badge">
                        <Star size={12} />
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="server-description">{server.description}</p>

                  <div className="server-meta">
                    <span className="server-category">
                      {getCategoryIcon(server.category)}
                      {server.category}
                    </span>
                    <span className="server-version">v{server.version}</span>
                  </div>

                  <div className="server-tags">
                    {server.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                    {server.tags.length > 3 && (
                      <span className="tag">+{server.tags.length - 3} more</span>
                    )}
                  </div>

                  <div className="server-tools">
                    <strong>Tools:</strong> {server.tools.slice(0, 3).join(', ')}
                    {server.tools.length > 3 && ` +${server.tools.length - 3} more`}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
