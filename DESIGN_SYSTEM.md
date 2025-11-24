# Design System - Dark Theme

## Color Palette

### Primary Colors
- **Cyan-400**: `#22d3ee` - Vibrant accent, hover states, highlights
- **Cyan-500**: `#06b6d4` - Primary accent, borders, shadows
- **Cyan-300**: `#06e6f7` - Light accent for text

### Secondary Colors
- **Blue-500**: `#3b82f6` - Complementary accent
- **Blue-400**: `#60a5fa` - Light blue for gradients
- **Purple-500**: `#a855f7` - Tertiary accent
- **Purple-400**: `#c084fc` - Light purple for gradients

### Neutral Colors
- **Slate-950**: `#030712` - Darkest background
- **Slate-900**: `#0f172a` - Dark background
- **Slate-800**: `#1e293b` - Cards, containers
- **Slate-700**: `#334155` - Hover states
- **Slate-300**: `#cbd5e1` - Body text
- **Slate-400**: `#94a3b8` - Secondary text
- **White**: `#ffffff` - Headings, primary text

## Typography

### Headings
- **H1**: 6xl-8xl, bold, white, tracking-tight
- **H2**: 5xl-7xl, bold, white, mb-6
- **H3**: xl-2xl, bold, white, group-hover:cyan-300

### Body Text
- **Primary**: lg-xl, slate-300, font-medium
- **Secondary**: sm-base, slate-400, font-normal
- **Accent**: cyan-300, cyan-400 for highlights

## Component Patterns

### Buttons
- **Primary CTA**: Cyan-to-blue gradient, slate-950 text, cyan glow shadow
- **Secondary CTA**: Dark slate bg, cyan border, cyan text on hover
- **Hover**: Scale 105%, enhanced shadow, color shift

### Cards
- **Background**: `from-slate-800/50 to-slate-900/50` gradient
- **Border**: `border-cyan-500/20` with hover to `cyan-400/50`
- **Shadow**: `shadow-lg shadow-slate-950/50` with hover glow
- **Backdrop**: `backdrop-blur-sm` for glassmorphism

### Badges
- **Background**: `from-cyan-500/10 to-blue-500/10` gradient
- **Border**: `border-cyan-500/30`
- **Text**: `text-cyan-300`
- **Backdrop**: `backdrop-blur-sm`

### Gradients
- **Text**: `from-cyan-400 via-blue-400 to-purple-400`
- **Button**: `from-cyan-500 to-blue-500`
- **Stats**: `from-cyan-400 to-blue-400`
- **Background**: `from-slate-950 via-slate-900 to-slate-950`

## Animations

### Blob Animation
- Duration: 7s infinite
- Transform: translate + scale
- Blend mode: mix-blend-screen
- Opacity: 0.2-0.3

### Fade-in-up
- Duration: 0.5s ease-out
- Transform: translateY(16px) → 0
- Staggered delays: 50-100ms

### Hover Effects
- Scale: 1 → 1.05
- Shadow: Enhanced with cyan glow
- Color: Shift to lighter cyan
- Duration: 300ms

## Spacing & Layout

### Sections
- Padding: py-24 sm:py-32 lg:py-40
- Max-width: max-w-7xl
- Gap: gap-16 lg:gap-24

### Cards
- Padding: p-8 sm:p-10 lg:p-12
- Border-radius: rounded-2xl to rounded-3xl
- Gap: gap-8 sm:gap-10

## Accessibility

### Focus States
- Ring: 2px cyan-500
- Offset: 2px slate-950
- Visible on keyboard navigation

### Contrast Ratios
- Headings: White on slate-950 (21:1)
- Body: Slate-300 on slate-950 (7.5:1)
- Accents: Cyan-400 on slate-950 (8:1)

### Motion
- Respects `prefers-reduced-motion`
- All animations have 0.01ms duration when reduced
- No auto-playing videos or animations

---
**Theme**: Dark, Modern, Innovative  
**Accessibility**: WCAG AA Compliant  
**Performance**: GPU-Accelerated Animations

