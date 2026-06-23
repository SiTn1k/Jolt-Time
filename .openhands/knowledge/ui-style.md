# Jolt Time — UI/UX Style Guide

## Design Overview

Premium dark futuristic style with soft glowing elements, smooth animations, and mobile-first approach. The interface combines sleek futuristic technology with intuitive historical theming.

## Color System

### Base Colors
```css
:root {
  /* Background */
  --bg-primary: #0A0E17;      /* Main background */
  --bg-secondary: #0F1525;    /* Secondary surfaces */
  --bg-card: #131B2E;         /* Card backgrounds */
  --bg-elevated: #1A2540;     /* Elevated elements */
  
  /* Primary */
  --primary: #00D9FF;         /* Cyan - main accent */
  --primary-dim: #00A8C6;     /* Dimmed cyan */
  --primary-glow: rgba(0, 217, 255, 0.3);
  
  /* Accent */
  --accent: #00FFE5;          /* Mint - secondary accent */
  --accent-dim: #00CCB8;      /* Dimmed mint */
  --accent-glow: rgba(0, 255, 229, 0.3);
  
  /* Premium */
  --premium: #FFD700;        /* Gold - rare/premium elements */
  --premium-dim: #CCB000;     /* Dimmed gold */
  --premium-glow: rgba(255, 215, 0, 0.3);
  
  /* Text */
  --text-primary: #FFFFFF;    /* Primary text */
  --text-secondary: #B8C5D6;  /* Secondary text */
  --text-muted: #6B7A8F;     /* Muted/disabled text */
  
  /* Semantic */
  --success: #00FF88;        /* Success states */
  --warning: #FFB800;        /* Warning states */
  --error: #FF4757;          /* Error states */
  
  /* Effects */
  --glow-soft: 0 0 20px;
  --glow-medium: 0 0 40px;
  --glow-strong: 0 0 60px;
}
```

### Glow Effects
```css
/* Primary glow */
.box-glow-primary {
  box-shadow: var(--glow-soft) var(--primary-glow);
}

/* Accent glow */
.box-glow-accent {
  box-shadow: var(--glow-soft) var(--accent-glow);
}

/* Premium glow */
.box-glow-premium {
  box-shadow: var(--glow-soft) var(--premium-glow);
}

/* Text glow */
.text-glow {
  text-shadow: 0 0 10px currentColor;
}
```

## Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Type Scale
| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| H1 | 28px | 700 | 1.2 | -0.02em |
| H2 | 24px | 600 | 1.3 | -0.01em |
| H3 | 20px | 600 | 1.4 | 0 |
| Body | 16px | 400 | 1.5 | 0 |
| Body Small | 14px | 400 | 1.5 | 0 |
| Caption | 12px | 400 | 1.4 | 0.02em |
| Button | 16px | 500 | 1 | 0.01em |

### Special Typography
```css
/* Futuristic headers */
.font-display {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}

/* Monospace for data */
.font-mono {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}
```

## Spacing System

### Base Unit: 8px
```css
:root {
  --space-1: 4px;   /* Tight spacing */
  --space-2: 8px;   /* Default small */
  --space-3: 12px;  /* Small-medium */
  --space-4: 16px;  /* Default */
  --space-5: 20px;  /* Medium-large */
  --space-6: 24px;  /* Large */
  --space-8: 32px;  /* Extra large */
  --space-10: 40px; /* Section spacing */
  --space-12: 48px; /* Page margins */
}
```

## Components

### Cards
```css
.card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: var(--space-4);
  border: 1px solid rgba(0, 217, 255, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  border-color: rgba(0, 217, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.1);
}

/* Premium card variant */
.card-premium {
  border-color: rgba(255, 215, 0, 0.3);
  background: linear-gradient(135deg, var(--bg-card), rgba(255, 215, 0, 0.05));
}
```

### Buttons
```css
.btn {
  height: 48px;
  min-width: 120px;
  border-radius: 12px;
  font-weight: 500;
  padding: 0 var(--space-6);
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: var(--bg-primary);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px var(--primary-glow);
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-secondary {
  background: transparent;
  border: 2px solid var(--primary);
  color: var(--primary);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}
```

### Progress Bars
```css
.progress-bar {
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* Animated progress */
.progress-animated {
  background: linear-gradient(
    90deg,
    var(--primary),
    var(--accent),
    var(--primary)
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Navigation
```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 72px;
  background: rgba(10, 14, 23, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 217, 255, 0.1);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--text-muted);
  transition: all 0.2s ease;
  padding: 8px 16px;
}

.nav-item.active {
  color: var(--primary);
}

.nav-item.active::before {
  content: '';
  position: absolute;
  top: 0;
  width: 40px;
  height: 3px;
  background: var(--primary);
  border-radius: 0 0 3px 3px;
  box-shadow: 0 0 10px var(--primary-glow);
}
```

### Modals & Overlays
```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 14, 23, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: var(--bg-card);
  border-radius: 20px;
  border: 1px solid rgba(0, 217, 255, 0.2);
  box-shadow: 0 0 40px rgba(0, 217, 255, 0.1);
  max-width: 90vw;
  max-height: 85vh;
  overflow: auto;
  animation: slideUp 0.3s ease;
}
```

## Animations

### Standard Timings
```css
:root {
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
  --duration-reveal: 600ms;
  
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Key Animations
```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

/* Scale in */
@keyframes scaleIn {
  from { 
    opacity: 0; 
    transform: scale(0.9); 
  }
  to { 
    opacity: 1; 
    transform: scale(1); 
  }
}

/* Glow pulse */
@keyframes glowPulse {
  0%, 100% { 
    box-shadow: 0 0 20px var(--primary-glow); 
  }
  50% { 
    box-shadow: 0 0 40px var(--primary-glow); 
  }
}

/* Float */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

### Interaction Feedback
```css
/* Tap effect */
.tap-effect {
  transition: transform 0.1s ease;
}

.tap-effect:active {
  transform: scale(0.95);
}

/* Hover glow */
.hover-glow {
  transition: box-shadow 0.2s ease;
}

.hover-glow:hover {
  box-shadow: 0 0 30px var(--primary-glow);
}
```

## Layout

### Mobile-First Grid
```css
/* Base: single column */
.container {
  padding: 0 var(--space-4);
}

/* Cards stack vertically */
.card-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* Responsive: 2 columns on larger screens */
@media (min-width: 768px) {
  .container {
    padding: 0 var(--space-6);
  }
  
  .card-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }
}
```

### Safe Areas
```css
/* Respect device safe areas */
.safe-top {
  padding-top: calc(var(--space-4) + env(safe-area-inset-top));
}

.safe-bottom {
  padding-bottom: calc(72px + env(safe-area-inset-bottom));
}

/* Fixed bottom nav spacing */
.page-content {
  padding-bottom: calc(72px + env(safe-area-inset-bottom) + var(--space-4));
}
```

## Iconography

### Style
- Stroke width: 2px
- Corner radius: 4px (rounded style)
- Size: 24px default, 20px small, 32px large
- Color: currentColor (inherits from parent)

### Usage
```css
.icon {
  width: 24px;
  height: 24px;
  stroke-width: 2;
  fill: none;
  stroke: currentColor;
}

/* Glow variant */
.icon-glow {
  filter: drop-shadow(0 0 4px currentColor);
}
```

## Shadows

```css
:root {
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 20px var(--primary-glow);
}
```

## Border Radius

```css
:root {
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;
}
```

## Accessibility

### Color Contrast
- Text on background: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- Interactive elements: 3:1 against adjacent colors

### Focus States
```css
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Hide outline for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Touch Targets
- Minimum: 44x44px
- Recommended: 48x48px
- Critical actions: 52x52px

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Telegram WebApp Integration

```javascript
// Theme colors
if (window.Telegram?.WebApp) {
  const tg = window.Telegram.WebApp;
  
  // Request native colors
  tg.ready();
  tg.expand();
  
  // Use platform colors where appropriate
  tg.setHeaderColor('#0A0E17');
  tg.setBackgroundColor('#0A0E17');
}
```

---

*Premium dark futuristic design with soft glowing elements.*
