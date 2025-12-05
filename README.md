# Sonic - AI Chat Application

A modern Angular chat application powered by Ollama local LLMs, providing a streamlined interface for conversational AI.

## Quick Start

### Prerequisites
- Node.js 18+ and npm 11+
- Ollama installed and running (`http://localhost:11434`)

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The app reloads automatically on file changes.

### Build for Production

```bash
npm run build
```

Output artifacts are in the `dist/` directory.

### Run Tests

```bash
npm test
```

---

## Feature Roadmap

### Phase 1: Foundation (Current)
Core chat functionality with basic UI and Ollama integration.

**Features:**
- ✅ Chat interface with message display
- ✅ Ollama API integration with streaming responses
- ✅ Model selection
- ✅ Message history in current session
- Basic Angular Material styling

**Status:** In Development

---

### Phase 2: Production Ready (Priority)
Enhance stability, reliability, and user experience.

**Features:**
- **Error Handling & Resilience**
  - Network error handling with retry logic
  - Connection timeout management
  - User-friendly error messages
  - CORS configuration support

- **Configuration Management**
  - Environment-based API URL configuration (dev/prod)
  - Configurable model defaults and timeouts
  - Settings panel for users to customize behavior

- **Type Safety**
  - Complete TypeScript interfaces for API responses
  - Input validation for messages
  - Better error type definitions

- **UI/UX**
  - Improved chat component styling with Angular Material
  - Loading indicators and skeleton states
  - Message timestamps and user avatars
  - Auto-scroll to latest messages
  - Accessibility (ARIA labels, keyboard navigation)

- **Testing & Quality**
  - Unit tests for OllamaService (80%+ coverage)
  - Component tests for chat functionality
  - Integration tests for API communication
  - ESLint configuration and code linting

- **Documentation**
  - API integration guide
  - Setup instructions (Ollama, environment variables)
  - Architecture overview
  - Deployment guide

---

### Phase 3: Enhanced Features
Improve functionality and user capabilities.

**Features:**
- **Chat Management**
  - Persistent message history (local storage or backend)
  - Conversation saving/loading
  - Message export (text/JSON)
  - Conversation search functionality
  - Clear/delete message history

- **Advanced Interactions**
  - Image upload and analysis (if model supports)
  - Code syntax highlighting in responses
  - Copy/edit messages
  - Message reactions or feedback
  - Regenerate responses

- **Model Management**
  - Real-time model availability detection
  - Model switching mid-conversation
  - Display model information (parameters, context size)
  - Pull/download new models from UI

- **Performance**
  - Message pagination for large histories
  - Virtual scrolling for long conversations
  - Caching of model information
  - Message compression in storage

---

### Phase 4: Advanced Capabilities
Next-level features and integrations.

**Features:**
- **Multi-Session Support**
  - Concurrent chat tabs/windows
  - Session management sidebar
  - Session switching and restoration
  - Session metadata (created date, title, summary)

- **AI Features**
  - Temperature/parameter adjustment per request
  - System prompt customization
  - Custom instruction sets
  - Chat summarization

- **Integrations**
  - Markdown rendering in responses
  - LaTeX math equation support
  - Code execution capability
  - Integration with external APIs

- **User Management**
  - User accounts and authentication
  - Profile preferences
  - Conversation sharing (with other users)
  - Usage statistics and analytics

---

### Phase 5: Scale & Monetization (Optional)
Enterprise features and deployment.

**Features:**
- **Backend Services**
  - Node.js/Express backend for chat persistence
  - Database integration (MongoDB/PostgreSQL)
  - User authentication & authorization
  - API rate limiting and usage tracking

- **Deployment**
  - Docker containerization
  - CI/CD pipeline (GitHub Actions/GitLab CI)
  - Cloud deployment (AWS/GCP/Azure)
  - Environment configuration management

- **Monitoring & Analytics**
  - Error tracking (Sentry)
  - Performance monitoring
  - User analytics
  - Logging system

- **Monetization**
  - Usage-based pricing tiers
  - Token counting and billing
  - Pro/Premium features
  - API access for third-party developers

---

## Development Commands

| Command | Description |
|---------|-------------|
| `npm start` | Run dev server on localhost:4200 |
| `npm run build` | Production build |
| `npm test` | Run unit tests |
| `npm run watch` | Watch mode for development |
| `ng generate component name` | Scaffold new component |

## Project Structure

```
src/
├── app/
│   ├── components/         # UI components
│   ├── services/           # Business logic (OllamaService)
│   ├── app.ts              # Root component
│   ├── app.routes.ts       # Route configuration
│   └── app.config.ts       # App configuration
├── main.ts                 # Entry point
└── styles.sass             # Global styles
```

## Requirements

- **Angular:** 21.0.0+
- **Node.js:** 18+
- **Ollama:** Latest version running locally
- **npm:** 11.6.2+

## Configuration

Create a `.env` file for environment variables:

```env
OLLAMA_API_URL=http://localhost:11434/api
DEFAULT_MODEL=llama2
API_TIMEOUT=30000
```

## Contributing

Follow Angular style guide and maintain test coverage above 80%.

## License

MIT
