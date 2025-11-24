# Developer Guide

## Quick Start for AI Agents

This guide helps AI agents (like Augment) understand and extend the codebase efficiently.

## Code Organization Principles

### 1. Constants First
All magic strings/numbers go in `src/constants/index.ts`:
```typescript
// ❌ Bad
const timeout = 2000
const maxLength = 4000

// ✅ Good
import { UI } from '../constants'
const timeout = UI.COPY_FEEDBACK_DURATION
const maxLength = UI.MAX_MESSAGE_LENGTH
```

### 2. Utility Functions
Extract reusable logic to utils:
```typescript
// ❌ Bad - in component
const formatted = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

// ✅ Good - use utility
import { formatTime } from '../utils/formatting'
const formatted = formatTime(date)
```

### 3. Custom Hooks
Encapsulate complex state/logic:
```typescript
// ❌ Bad - in component
const [data, setData] = useState(null)
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

// ✅ Good - use hook
const { data, loading, error, execute } = useAsync(fetchData)
```

### 4. Component Memoization
Always wrap components with memo:
```typescript
// ❌ Bad
export const MyComponent: React.FC<Props> = ({ ... }) => { ... }

// ✅ Good
const MyComponentComponent: React.FC<Props> = ({ ... }) => { ... }
export const MyComponent = memo(MyComponentComponent)
```

### 5. useCallback for Handlers
Prevent unnecessary re-renders:
```typescript
// ❌ Bad
const handleClick = () => { ... }

// ✅ Good
const handleClick = useCallback(() => { ... }, [deps])
```

## Adding New Features

### Adding a New Utility Function
1. Create/edit file in `src/utils/`
2. Add JSDoc comments
3. Export function
4. Use in components

### Adding a New Custom Hook
1. Create file in `src/hooks/useMyHook.ts`
2. Follow naming convention: `use*`
3. Add JSDoc comments
4. Export hook

### Adding a New Component
1. Create file in `src/components/MyComponent.tsx`
2. Use memo wrapper
3. Add useCallback to handlers
4. Export with memo

### Adding a New Page
1. Create file in `src/pages/MyPage.tsx`
2. Add route in `App.tsx`
3. Lazy load in App.tsx
4. Add to ROUTES constant

### Adding a New Service
1. Create file in `src/services/myService.ts`
2. Export singleton instance
3. Add error handling
4. Add logging

## Common Patterns

### Async Operations
```typescript
const { data, loading, error, execute } = useAsync(
  async () => await chatService.sendMessage(msg),
  { onSuccess: (data) => console.log(data) }
)
```

### Debounced Search
```typescript
const [query, setQuery] = useState('')
const debouncedQuery = useDebounce(query, UI.DEBOUNCE_DELAY)

useEffect(() => {
  // Search with debouncedQuery
}, [debouncedQuery])
```

### Local Storage
```typescript
const [theme, setTheme, clearTheme] = useLocalStorage('theme', 'light')
```

### Date Grouping
```typescript
import { getDateGroupLabel } from '../utils/dates'
const label = getDateGroupLabel(conversation.createdAt)
```

### Input Validation
```typescript
import { validateMessage } from '../utils/validation'
const { isValid, errors } = validateMessage(input, 4000)
```

## Performance Tips

1. **Memoize expensive computations**: Use useMemo
2. **Memoize callbacks**: Use useCallback
3. **Lazy load pages**: Already done in App.tsx
4. **Avoid inline functions**: Extract to useCallback
5. **Use constants**: Avoid magic strings/numbers
6. **Batch state updates**: Use multiple setState calls
7. **Optimize re-renders**: Use memo on components

## Testing Guidelines

### Unit Tests
- Test utility functions in isolation
- Test custom hooks with renderHook
- Mock external dependencies

### Integration Tests
- Test component interactions
- Test state management
- Test API integration

### E2E Tests
- Test user workflows
- Test chat functionality
- Test error scenarios

## Debugging Tips

1. **Enable React DevTools**: Check component renders
2. **Use logger service**: Structured logging
3. **Check constants**: Verify configuration
4. **Inspect Firestore**: Check data persistence
5. **Monitor API calls**: Check OpenAI integration
6. **Check error boundaries**: Catch React errors

## Code Review Checklist

- [ ] Uses constants for magic values
- [ ] Components wrapped with memo
- [ ] Handlers use useCallback
- [ ] Expensive computations use useMemo
- [ ] Error handling implemented
- [ ] Logging added for debugging
- [ ] TypeScript types correct
- [ ] Accessibility attributes present
- [ ] No console.log in production code
- [ ] Performance optimized

## Common Mistakes to Avoid

1. ❌ Inline functions in render
2. ❌ Missing dependency arrays
3. ❌ Magic strings/numbers
4. ❌ Unhandled promise rejections
5. ❌ Missing error boundaries
6. ❌ Unnecessary re-renders
7. ❌ Missing accessibility attributes
8. ❌ Hardcoded configuration

