const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Load MCP servers data from index.json
let mcpServersData;
try {
  const indexPath = path.join(__dirname, '../index.json');
  const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  mcpServersData = indexData;
} catch (error) {
  console.error('Error loading index.json:', error);
  mcpServersData = { servers: [] };
}

const mcpServers = mcpServersData.servers;

// Integration examples for different clients
const integrationExamples = {
  vscode: {
    name: 'VS Code',
    config: `{
  "mcpServers": {
    "{{serverName}}": {
      "command": "{{command}}",
      "args": {{args}},
      "env": {{env}}
    }
  }
}`,
    configFile: 'settings.json'
  },
  cursor: {
    name: 'Cursor',
    config: `{
  "mcpServers": {
    "{{serverName}}": {
      "command": "{{command}}",
      "args": {{args}},
      "env": {{env}}
    }
  }
}`,
    configFile: 'settings.json'
  },
  anthropic: {
    name: 'Anthropic Desktop',
    config: `{
  "mcpServers": {
    "{{serverName}}": {
      "command": "{{command}}",
      "args": {{args}},
      "env": {{env}}
    }
  }
}`,
    configFile: 'claude_desktop_config.json'
  },
  cline: {
    name: 'Cline',
    config: `{
  "mcpServers": {
    "{{serverName}}": {
      "command": "{{command}}",
      "args": {{args}},
      "env": {{env}}
    }
  }
}`,
    configFile: 'settings.json'
  }
};

// API Routes
app.get('/api/servers', (req, res) => {
  const { category, featured, search } = req.query;
  let filteredServers = [...mcpServers];

  if (category) {
    filteredServers = filteredServers.filter(server => 
      server.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (featured === 'true') {
    filteredServers = filteredServers.filter(server => server.featured);
  }

  if (search) {
    const searchTerm = search.toLowerCase();
    filteredServers = filteredServers.filter(server =>
      server.name.toLowerCase().includes(searchTerm) ||
      server.description.toLowerCase().includes(searchTerm) ||
      server.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  res.json(filteredServers);
});

app.get('/api/servers/:id', (req, res) => {
  const server = mcpServers.find(s => s.id === req.params.id);
  if (!server) {
    return res.status(404).json({ error: 'Server not found' });
  }
  res.json(server);
});

app.get('/api/integration/:client/:serverId', (req, res) => {
  const { client, serverId } = req.params;
  const server = mcpServers.find(s => s.id === serverId);
  const clientConfig = integrationExamples[client];

  if (!server || !clientConfig) {
    return res.status(404).json({ error: 'Server or client not found' });
  }

  // Generate integration config based on server type
  let command, args, env = {};
  
  if (server.installation.npm) {
    command = 'npx';
    args = [server.installation.npm];
  } else if (server.installation.python) {
    command = 'python';
    args = ['-m', server.installation.python];
  } else if (server.installation.go) {
    command = 'go';
    args = ['run', server.installation.go];
  } else {
    command = 'node';
    args = ['path/to/server'];
  }

  // Add server-specific environment variables
  switch (server.id) {
    case 'github':
      env.GITHUB_PERSONAL_ACCESS_TOKEN = 'your_github_token_here';
      break;
    case 'gitlab':
      env.GITLAB_PERSONAL_ACCESS_TOKEN = 'your_gitlab_token_here';
      break;
    case 'postgresql':
      env.POSTGRES_CONNECTION_STRING = 'postgresql://user:password@localhost:5432/database';
      break;
    case 'slack':
      env.SLACK_BOT_TOKEN = 'your_slack_bot_token_here';
      break;
    case 'google-drive':
      env.GOOGLE_APPLICATION_CREDENTIALS = 'path/to/credentials.json';
      break;
    case 'google-maps':
      env.GOOGLE_MAPS_API_KEY = 'your_google_maps_api_key_here';
      break;
    case 'brave-search':
      env.BRAVE_SEARCH_API_KEY = 'your_brave_search_api_key_here';
      break;
    case 'sentry':
      env.SENTRY_AUTH_TOKEN = 'your_sentry_auth_token_here';
      env.SENTRY_ORG = 'your_sentry_org';
      break;
    case 'cloudflare':
      env.CLOUDFLARE_API_TOKEN = 'your_cloudflare_api_token_here';
      break;
    case 'bigquery':
      env.GOOGLE_APPLICATION_CREDENTIALS = 'path/to/credentials.json';
      env.GOOGLE_CLOUD_PROJECT = 'your_project_id';
      break;
    case 'mongodb':
      env.MONGODB_CONNECTION_STRING = 'mongodb://localhost:27017/database';
      break;
    case 'exa':
      env.EXA_API_KEY = 'your_exa_api_key_here';
      break;
    case 'tavily':
      env.TAVILY_API_KEY = 'your_tavily_api_key_here';
      break;
    case 'perplexity':
      env.PERPLEXITY_API_KEY = 'your_perplexity_api_key_here';
      break;
    case 'search1api':
      env.SEARCH1API_KEY = 'your_search1api_key_here';
      break;
    case 'notion':
      env.NOTION_API_KEY = 'your_notion_api_key_here';
      break;
    case 'bluesky':
      env.BLUESKY_USERNAME = 'your_bluesky_username';
      env.BLUESKY_PASSWORD = 'your_bluesky_password';
      break;
    case 'ns-travel':
      env.NS_API_KEY = 'your_ns_api_key_here';
      break;
    case 'everart':
      env.EVERART_API_KEY = 'your_everart_api_key_here';
      break;
    default:
      // No specific environment variables needed
      break;
  }

  const config = clientConfig.config
    .replace('{{serverName}}', server.id)
    .replace('{{command}}', `"${command}"`)
    .replace('{{args}}', JSON.stringify(args, null, 2))
    .replace('{{env}}', JSON.stringify(env, null, 2));

  res.json({
    client: clientConfig.name,
    configFile: clientConfig.configFile,
    config: config,
    server: server
  });
});

app.get('/api/categories', (req, res) => {
  const categories = [...new Set(mcpServers.map(server => server.category))];
  res.json(categories);
});

app.get('/api/clients', (req, res) => {
  res.json(Object.keys(integrationExamples).map(key => ({
    id: key,
    name: integrationExamples[key].name,
    configFile: integrationExamples[key].configFile
  })));
});

// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`MCP Broker server running on port ${PORT}`);
});
