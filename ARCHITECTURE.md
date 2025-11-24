# Architecture Documentation

## Project Structure

```
src/
├── components/          # Reusable UI components (all memoized)
│   ├── ChatHeader.tsx
│   ├── ChatInput.tsx
│   ├── ChatMessages.tsx
│   ├── ChatSidebar.tsx
│   ├── ConversationItem.tsx
│   ├── MessageRenderer.tsx
│   ├── ApiErrorBanner.tsx
│   ├── ErrorBoundary.tsx
│   ├── LoadingSpinner.tsx
│   └── SkipToContent.tsx
├── pages/               # Page components (lazy loaded)
│   ├── LandingPage.tsx
│   ├── MainChatPage.tsx
│   ├── ChatHistoryPage.tsx
│   └── AudioUploadPage.tsx
├── hooks/               # Custom React hooks
│   ├── useChatState.ts
│   ├── useChatOperations.ts
│   ├── useAsync.ts
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── services/            # Business logic & API integration
│   ├── chatService.ts
│   ├── config.ts
│   ├── logger.ts
│   └── voiceNoteService.ts
├── utils/               # Utility functions
│   ├── formatting.ts
│   ├── dates.ts
│   ├── validation.ts
│   ├── retry.ts
│   ├── errorHandler.ts
│   ├── responseFormatter.ts
│   └── titleGenerator.ts
├── constants/           # App-wide constants
│   └── index.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── App.tsx              # Router setup
├── main.tsx             # Entry point
├── firebase.ts          # Firebase configuration
└── index.css            # Global styles
```

## Key Design Patterns

### 1. Component Memoization
All components are wrapped with `React.memo()` to prevent unnecessary re-renders:
- Reduces re-renders when props haven't changed
- Improves performance for list items and frequently updated components
- Used in: ChatMessages, ChatInput, ChatHeader, ChatSidebar, ConversationItem, MessageRenderer

### 2. Custom Hooks
Encapsulate complex logic and state management:
- `useChatState`: Manages chat UI state
- `useChatOperations`: Handles chat operations (load, create, select)
- `useAsync`: Generic async operation handler
- `useDebounce`: Debounce values and callbacks
- `useLocalStorage`: Type-safe localStorage access

### 3. Service Layer
Centralized business logic:
- `chatService`: OpenAI API integration with retry logic
- `config`: Configuration management
- `logger`: Structured logging
- `voiceNoteService`: Voice note handling

### 4. Constants
Centralized configuration for easy maintenance:
- UI constants (animations, timeouts, sizes)
- API constants (model, temperature, retries)
- Firestore constants (collections, batch sizes)
- Error messages
- Routes

### 5. Utility Functions
Reusable functions organized by domain:
- `formatting.ts`: Text formatting (dates, truncation, capitalization)
- `dates.ts`: Date operations and grouping
- `validation.ts`: Input validation
- `retry.ts`: Exponential backoff retry logic
- `errorHandler.ts`: Error categorization
- `responseFormatter.ts`: API response formatting

## Performance Optimizations

### Code Splitting
- Pages lazy loaded with React.lazy()
- Vendor chunks separated in Vite config
- Route-based code splitting

### Memoization
- All components use React.memo()
- useCallback for event handlers
- useMemo for derived state

### Bundle Optimization
- Manual chunks for vendors (React, Firebase, OpenAI)
- Tree-shaking enabled
- Tailwind CSS v4 with Vite plugin

## State Management

### Local State
- Component-level state with useState
- Managed through custom hooks (useChatState)

### Derived State
- Computed with useMemo
- Conversation grouping by date
- Message filtering

### Persistence
- Firestore for conversations and messages
- localStorage for UI preferences (via useLocalStorage hook)

## Error Handling

### Strategy
1. Try-catch blocks in async operations
2. Error categorization (client, server, network, timeout)
3. Retry logic with exponential backoff
4. User-friendly error messages
5. Error boundaries for React errors

### Error Recovery
- Automatic retries for transient errors
- User-dismissible error banners
- Graceful degradation

## Type Safety

### TypeScript Configuration
- Strict mode enabled
- Full type coverage
- Domain-specific types in types/index.ts

### Type Organization
- Message types (ChatMessage, ChatMessageInput)
- Conversation types
- API response types
- Error types
- Configuration types

## Accessibility

### Features
- ARIA labels on interactive elements
- Semantic HTML
- Keyboard navigation support
- Focus management
- Screen reader support
- Skip to content link

## Testing Strategy

### Unit Tests
- Utility functions
- Custom hooks
- Service layer

### Integration Tests
- Component interactions
- API integration
- State management

### E2E Tests
- User workflows
- Chat functionality
- Conversation management

