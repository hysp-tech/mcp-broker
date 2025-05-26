const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Sample MCP servers data
const mcpServers = [
  {
    id: 'filesystem',
    name: 'Filesystem MCP Server',
    description: 'Provides secure file system operations for reading, writing, and managing files and directories.',
    author: 'Anthropic',
    category: 'File Management',
    tags: ['filesystem', 'files', 'directories'],
    version: '1.0.0',
    repository: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem',
    documentation: 'https://modelcontextprotocol.io/docs/servers/filesystem',
    featured: true,
    tools: ['read_file', 'write_file', 'create_directory', 'list_directory', 'move_file', 'search_files'],
    resources: ['file://', 'directory://'],
    installation: {
      npm: '@modelcontextprotocol/server-filesystem',
      python: 'mcp-server-filesystem'
    }
  },
  {
    id: 'github',
    name: 'GitHub MCP Server',
    description: 'Interact with GitHub repositories, issues, pull requests, and more through the GitHub API.',
    author: 'Anthropic',
    category: 'Development',
    tags: ['github', 'git', 'repositories', 'issues'],
    version: '1.2.0',
    repository: 'https://github.com/modelcontextprotocol/servers/tree/main/src/github',
    documentation: 'https://modelcontextprotocol.io/docs/servers/github',
    featured: true,
    tools: ['create_issue', 'create_pull_request', 'get_repository', 'search_repositories', 'get_file_contents'],
    resources: ['github://'],
    installation: {
      npm: '@modelcontextprotocol/server-github',
      python: 'mcp-server-github'
    }
  },
  {
    id: 'postgres',
    name: 'PostgreSQL MCP Server',
    description: 'Connect to PostgreSQL databases and execute queries, manage schemas, and perform database operations.',
    author: 'Anthropic',
    category: 'Database',
    tags: ['postgresql', 'database', 'sql'],
    version: '1.1.0',
    repository: 'https://github.com/modelcontextprotocol/servers/tree/main/src/postgres',
    documentation: 'https://modelcontextprotocol.io/docs/servers/postgres',
    featured: false,
    tools: ['execute_query', 'list_tables', 'describe_table', 'create_table'],
    resources: ['postgres://'],
    installation: {
      npm: '@modelcontextprotocol/server-postgres',
      python: 'mcp-server-postgres'
    }
  },
  {
    id: 'slack',
    name: 'Slack MCP Server',
    description: 'Send messages, manage channels, and interact with Slack workspaces through the Slack API.',
    author: 'Anthropic',
    category: 'Communication',
    tags: ['slack', 'messaging', 'communication'],
    version: '1.0.0',
    repository: 'https://github.com/modelcontextprotocol/servers/tree/main/src/slack',
    documentation: 'https://modelcontextprotocol.io/docs/servers/slack',
    featured: false,
    tools: ['send_message', 'list_channels', 'create_channel', 'get_user_info'],
    resources: ['slack://'],
    installation: {
      npm: '@modelcontextprotocol/server-slack',
      python: 'mcp-server-slack'
    }
  },
  {
    id: 'weather',
    name: 'Weather MCP Server',
    description: 'Get current weather conditions, forecasts, and weather alerts for locations worldwide.',
    author: 'Community',
    category: 'Utilities',
    tags: ['weather', 'forecast', 'api'],
    version: '0.9.0',
    repository: 'https://github.com/mcp-community/weather-server',
    documentation: 'https://github.com/mcp-community/weather-server/blob/main/README.md',
    featured: false,
    tools: ['get_current_weather', 'get_forecast', 'get_weather_alerts'],
    resources: ['weather://'],
    installation: {
      npm: 'mcp-weather-server',
      python: 'mcp-weather-server'
    }
  }
];

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
  let command, args, env;
  
  if (server.installation.npm) {
    command = 'npx';
    args = [server.installation.npm];
    env = {};
  } else if (server.installation.python) {
    command = 'python';
    args = ['-m', server.installation.python];
    env = {};
  } else {
    command = 'node';
    args = ['path/to/server'];
    env = {};
  }

  // Add server-specific environment variables
  if (server.id === 'github') {
    env.GITHUB_PERSONAL_ACCESS_TOKEN = 'your_github_token_here';
  } else if (server.id === 'postgres') {
    env.POSTGRES_CONNECTION_STRING = 'postgresql://user:password@localhost:5432/database';
  } else if (server.id === 'slack') {
    env.SLACK_BOT_TOKEN = 'your_slack_bot_token_here';
  } else if (server.id === 'weather') {
    env.WEATHER_API_KEY = 'your_weather_api_key_here';
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
