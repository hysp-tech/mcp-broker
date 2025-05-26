# MCP Broker

A professional developer-friendly hub for Model Context Protocol (MCP) servers, similar to Hugging Face's models hub. MCP Broker provides a comprehensive list of MCP servers with quick integration code for popular MCP clients.

## Features

- 🔍 **Server Discovery**: Browse and search through available MCP servers
- 📋 **Integration Guides**: Get ready-to-use configuration code for different MCP clients
- 🏷️ **Categorization**: Servers organized by categories (File Management, Development, Database, etc.)
- ⭐ **Featured Servers**: Highlighted popular and recommended servers
- 🔧 **Multiple Clients**: Support for VS Code, Cursor, Anthropic Desktop, Cline, and more
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Supported MCP Clients

- **VS Code** - Microsoft Visual Studio Code
- **Cursor** - AI-powered code editor
- **Anthropic Desktop** - Claude desktop application
- **Cline** - AI coding assistant

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mcp-broker
```

2. Install dependencies for both server and client:
```bash
npm run install-all
```

### Development

Run both server and client in development mode:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend React app on `http://localhost:3000`

### Production

1. Build the React app:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

The application will be available at `http://localhost:5000`

## API Endpoints

### Get All Servers
```
GET /api/servers
Query Parameters:
- category: Filter by category
- featured: true/false - Show only featured servers
- search: Search term for name, description, or tags
```

### Get Server Details
```
GET /api/servers/:id
```

### Get Integration Code
```
GET /api/integration/:client/:serverId
```

### Get Categories
```
GET /api/categories
```

### Get Supported Clients
```
GET /api/clients
```

## Project Structure

```
mcp-broker/
├── server/                 # Express.js backend
│   └── index.js           # Main server file with API routes
├── client/                # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── package.json           # Root package.json with scripts
├── .env                   # Environment variables
└── README.md
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -am 'Add some feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## Adding New MCP Servers

To add a new MCP server to the broker:

1. Edit `server/index.js`
2. Add your server object to the `mcpServers` array
3. Include all required fields: id, name, description, author, category, etc.
4. Test the integration with different clients

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation at [Model Context Protocol](https://modelcontextprotocol.io/)

---

Built with ❤️ for the MCP community
