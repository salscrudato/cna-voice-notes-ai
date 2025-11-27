# Component Reference Guide

## InnovativeStreamingLoader

### Purpose
Advanced animated loader for streaming AI responses with multi-layer animations.

### Props
```typescript
interface InnovativeStreamingLoaderProps {
  stage?: 'thinking' | 'generating' | 'finalizing'
}
```

### Usage
```tsx
import { InnovativeStreamingLoader } from '@/components/InnovativeStreamingLoader'

<InnovativeStreamingLoader stage="thinking" />
<InnovativeStreamingLoader stage="generating" />
<InnovativeStreamingLoader stage="finalizing" />
```

### Visual Layers
1. **Outer Ring**: Pulsing scale animation (pulse-ring)
2. **Rotating Border**: Smooth 360° rotation (spin-smooth)
3. **Center Icon**: React Icon (FiCpu, FiZap, FiCheck)
4. **Background**: Radial pulse effect (pulse-scale)
5. **Activity Dots**: Bouncing indicators (bounce-dots)

### Animations
- pulse-ring: 2s cubic-bezier
- spin-smooth: 2s linear
- pulse-scale: 2s ease-in-out
- bounce-dots: 1.4s ease-in-out

### Accessibility
- ✅ role="status"
- ✅ aria-live="polite"
- ✅ aria-hidden on decorative elements

---

## AdvancedSkeletonLoader

### Purpose
Enhanced skeleton loader with shimmer and pulse effects for content placeholders.

### Props
```typescript
interface AdvancedSkeletonLoaderProps {
  variant?: 'message' | 'card' | 'list'
  count?: number
}
```

### Usage
```tsx
import { AdvancedSkeletonLoader } from '@/components/AdvancedSkeletonLoader'

<AdvancedSkeletonLoader variant="message" count={3} />
<AdvancedSkeletonLoader variant="card" count={2} />
<AdvancedSkeletonLoader variant="list" count={5} />
```

### Variants
- **message**: 80px height, 75% width, rounded-2xl
- **card**: 128px height, full width, rounded-lg
- **list**: 48px height, full width, rounded-md

### Animations
- shimmer-advanced: 2s infinite
- pulse-overlay: 2s ease-in-out infinite

### Features
- Gradient shimmer effect
- Pulse overlay for depth
- Configurable count
- Accent color integration
- Dark mode support

---

## StreamingLoadingIndicator

### Purpose
Streaming indicator with stage-specific animations and React Icons.

### Props
```typescript
interface StreamingLoadingIndicatorProps {
  stage?: 'thinking' | 'generating' | 'finalizing'
  isStreaming?: boolean
}
```

### Usage
```tsx
import { StreamingLoadingIndicator } from '@/components/StreamingLoadingIndicator'

<StreamingLoadingIndicator stage="thinking" />
<StreamingLoadingIndicator stage="generating" />
<StreamingLoadingIndicator stage="finalizing" />
```

### Stages
- **thinking**: FiCpu icon, animated dots
- **generating**: FiZap icon, wave bars
- **finalizing**: FiCheck icon, scale animation

### Animations
- ai-thinking-dots: 1.4s ease-in-out
- ai-generating-bars: 0.8s ease-in-out
- ai-check-scale: 0.6s cubic-bezier

---

## LoadingSpinner

### Purpose
Simple, elegant loading spinner with activity indicator.

### Usage
```tsx
import { LoadingSpinner } from '@/components/LoadingSpinner'

<LoadingSpinner />
```

### Features
- FiActivity icon with pulse-glow
- Bouncing dots indicator
- Thinking text with ellipsis
- Accent color integration
- Smooth animations

### Animations
- pulse-glow: 2s cubic-bezier
- bounce-dots: 1.4s ease-in-out

---

## Animation Utilities

### Available Classes
```css
.animate-pulse-glow
.animate-pulse-ring
.animate-pulse-scale
.animate-spin-smooth
.animate-bounce-dots
.animate-shimmer-advanced
.animate-pulse-overlay
```

### Custom Animation
```css
@keyframes custom-animation {
  0% { /* start */ }
  100% { /* end */ }
}

.animate-custom {
  animation: custom-animation 2s ease-in-out infinite;
}
```

---

## Color Integration

### Accent Colors
All components use the accent color system:
```typescript
const accentHex = getAccentColor(accentColor, '600')
```

### Supported Colors
- Blue (default)
- Purple
- Pink
- Red
- Orange
- Green
- Teal
- Cyan

### Usage
```tsx
import { getAccentColor } from '@/utils/accentColors'

const color = getAccentColor('blue', '600')
```

---

## Performance Tips

1. **Memoization**: All components use React.memo()
2. **GPU Acceleration**: Use transform and opacity
3. **Animation Timing**: Keep under 2s for user attention
4. **Responsive**: Animations scale on mobile
5. **Accessibility**: Respect prefers-reduced-motion

---

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers
- ✅ Dark mode support

---

## Troubleshooting

### Animation Not Smooth
- Check GPU acceleration
- Verify browser support
- Test on real device
- Monitor Core Web Vitals

### Colors Not Showing
- Verify accent color prop
- Check getAccentColor function
- Ensure Tailwind CSS loaded
- Test in different themes

### Accessibility Issues
- Verify ARIA labels
- Test with screen reader
- Check keyboard navigation
- Test reduced motion

---

## Examples

### Complete Streaming Flow
```tsx
const [stage, setStage] = useState('thinking')

useEffect(() => {
  setStage('thinking')
  setTimeout(() => setStage('generating'), 2000)
  setTimeout(() => setStage('finalizing'), 4000)
}, [])

return <InnovativeStreamingLoader stage={stage} />
```

### Skeleton Loading
```tsx
const [isLoading, setIsLoading] = useState(true)

return (
  <>
    {isLoading && <AdvancedSkeletonLoader variant="message" count={3} />}
    {!isLoading && <ChatMessages messages={messages} />}
  </>
)
```

---

**Last Updated**: 2025-11-27
**Version**: 1.0.0
**Status**: Production Ready

