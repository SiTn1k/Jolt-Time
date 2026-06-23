# Jolt Time — UI Designer Agent

## Role Overview

The UI Designer Agent is responsible for user interface design, user experience, visual design system, component library, and interaction patterns for Jolt Time.

## Core Responsibilities

### 1. Visual Design
- Define design system
- Create component library
- Design screen layouts
- Create iconography
- Design animations and transitions
- Maintain visual consistency

### 2. User Experience
- Map user journeys
- Design navigation patterns
- Create interaction patterns
- Ensure accessibility
- Optimize for mobile
- User testing

### 3. Screen Design
- Home screen
- Mission screens
- Collection screens
- Artifact detail screen
- Profile screens
- Settings screens
- Modal dialogs

### 4. Component Library
- Button components
- Card components
- Input components
- Navigation components
- Feedback components
- Layout components

### 5. Design System
- Color system
- Typography scale
- Spacing system
- Shadow system
- Animation tokens
- Responsive breakpoints

## Goals

### Primary Goals
1. **Premium Feel** — Every screen feels polished
2. **Intuitive** — Users know what to do
3. **Consistent** — Same patterns everywhere
4. **Performant** — Fast loading, smooth animations
5. **Accessible** — Usable by everyone

### Secondary Goals
1. Reduce user friction
2. Increase engagement
3. Support multiple languages
4. Maintain brand identity
5. Enable rapid development

## Quality Standards

### Design Tokens
```css
:root {
  /* Colors */
  --bg-primary: #0A0E17;
  --bg-card: #131B2E;
  --primary: #00D9FF;
  --accent: #00FFE5;
  --premium: #FFD700;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  
  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  
  /* Shadows */
  --shadow-glow: 0 0 20px rgba(0, 217, 255, 0.3);
  
  /* Typography */
  --font-family: 'Inter', sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 20px;
  --font-size-xl: 24px;
  --font-size-2xl: 28px;
}
```

### Component Standards
```css
/* Button Component */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  height: 48px;
  padding: 0 var(--space-6);
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: var(--font-size-base);
  transition: all var(--duration-fast) ease;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: var(--bg-primary);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.btn-primary:active {
  transform: scale(0.98);
}

/* Card Component */
.card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(0, 217, 255, 0.1);
  padding: var(--space-4);
  transition: all var(--duration-normal) ease;
}

.card:hover {
  border-color: rgba(0, 217, 255, 0.3);
  box-shadow: var(--shadow-glow);
}

/* Input Component */
.input {
  height: 48px;
  background: var(--bg-primary);
  border: 2px solid var(--bg-card);
  border-radius: var(--radius-md);
  padding: 0 var(--space-4);
  color: white;
  transition: border-color var(--duration-fast) ease;
}

.input:focus {
  border-color: var(--primary);
  outline: none;
}

/* Progress Bar */
.progress {
  height: 8px;
  background: var(--bg-primary);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  border-radius: var(--radius-sm);
  transition: width var(--duration-slow) ease;
}
```

### Screen Layouts
```css
/* Mobile-first container */
.container {
  padding: 0 var(--space-4);
  max-width: 428px;
  margin: 0 auto;
}

/* Safe area handling */
.safe-top {
  padding-top: calc(var(--space-4) + env(safe-area-inset-top));
}

.safe-bottom {
  padding-bottom: calc(var(--space-4) + env(safe-area-inset-bottom));
}

/* Bottom nav spacing */
.page-content {
  padding-bottom: calc(72px + env(safe-area-inset-bottom) + var(--space-4));
}

/* Touch targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}
```

## Collaboration Rules

### With Game Designer
1. **Screen Requirements** — Define needed screens
2. **User Flow** — Map player journeys
3. **Feedback** — Design feedback systems
4. **Content** — Ensure content fits

**Communication:**
- Share screen requirements
- Review user flows
- Iterate on feedback
- Coordinate content

### With Backend Agent
1. **Data Display** — Define data needs
2. **Loading States** — Design loading UI
3. **Error States** — Design error handling
4. **Forms** — Coordinate form inputs

**Communication:**
- Share UI requirements
- Request data shapes
- Design error handling
- Coordinate forms

### With Architect Agent
1. **Performance** — Keep UI performant
2. **Components** — Define reusable components
3. **Technical** — Ensure feasibility
4. **Scale** — Plan for growth

**Communication:**
- Review component architecture
- Share performance needs
- Discuss technical approach
- Plan reusable patterns

### With Documentation Agent
1. **Design Docs** — Document design system
2. **Component Docs** — Document components
3. **Guidelines** — Create usage guidelines
4. **Localization** — Plan for translations

**Communication:**
- Share design documentation
- Review component docs
- Create usage guidelines
- Support localization

## Deliverables

### Design System
- Color palette
- Typography scale
- Spacing system
- Component library
- Animation guidelines
- Icon set

### Screen Designs
- All screen mockups
- Responsive variants
- Dark/light variants (if needed)
- State variations
- Animation specs

### Documentation
- Component usage guide
- Design guidelines
- Interaction patterns
- Accessibility guide
- Handoff specs

## Accessibility Standards

### WCAG 2.1 AA Compliance
- Color contrast 4.5:1 for text
- Color contrast 3:1 for UI elements
- Focus indicators visible
- Keyboard navigable
- Screen reader compatible

### Touch Optimization
- Minimum touch target 44x44px
- Adequate spacing between targets
- No precision required
- Gesture alternatives available

### Motion
- Respect prefers-reduced-motion
- Provide animation alternatives
- No essential info in animation only

---

## Artifact Detail Screen

### Layout Structure
- Header: Back button, title "DETAILS", favorite toggle
- Hero section: Large artifact image with rarity glow border
- Info chips: Quick stats (type, era, rarity)
- Description block: Short artifact description
- Historical education block: Expandable facts, importance, trivia
- Stats section: Power, level, fragments progress
- Acquisition info: Date obtained, source, quantity
- Action buttons: Share, View in Museum
- Future buttons: Upgrade, Fuse, NFT, Sell (initially disabled)

### Rarity Visual System
Each rarity tier has distinct visual treatment:
- Common: Gray border, no effects
- Rare: Blue border with subtle shimmer
- Epic: Purple border with pulsing aura
- Legendary: Gold border with animated gradient
- Mythic: Rainbow prismatic border with 3D effects

### Accessibility Requirements
- Semantic HTML with ARIA labels
- 44x44px minimum touch targets
- Keyboard navigation support
- Screen reader announcements
- Color contrast WCAG 2.1 AA compliance
- Reduced motion support

### Performance Targets
- Initial paint: < 200ms
- Interactive: < 500ms
- Image load: < 300ms
- Full render: < 800ms

### Future Compatibility
- Feature flags for upgrade, fusion, NFT, marketplace, evolution
- Placeholder UI for future buttons (disabled state)
- Data schema prepared for future fields

---

## Screen Consistency Standards

### Design Language Enforcement

All screens must follow consistent visual patterns defined in `knowledge/ui-style.md`:

#### Color Application
```css
/* Background layers */
.bg-primary { background: var(--bg-primary); }      /* #0A0E17 */
.bg-secondary { background: var(--bg-secondary); }  /* #0F1525 */
.bg-card { background: var(--bg-card); }            /* #131B2E */
.bg-elevated { background: var(--bg-elevated); }    /* #1A2540 */

/* Accent colors */
.accent-primary { color: var(--primary); }         /* #00D9FF */
.accent-accent { color: var(--accent); }            /* #00FFE5 */
.accent-premium { color: var(--premium); }          /* #FFD700 */

/* State colors */
.state-success { color: var(--success); }            /* #00FF88 */
.state-warning { color: var(--warning); }           /* #FFB800 */
.state-error { color: var(--error); }               /* #FF4757 */
```

#### Spacing & Layout
```css
/* Consistent page structure */
.page {
  padding: var(--space-4);
  padding-bottom: calc(72px + env(safe-area-inset-bottom) + var(--space-4));
  min-height: 100vh;
}

.card {
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  border: 1px solid rgba(0, 217, 255, 0.1);
}

/* Section spacing */
.section {
  margin-bottom: var(--space-6);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-3);
  color: var(--text-primary);
}
```

#### Component States
```css
/* Consistent button states */
.btn {
  height: 48px;
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all var(--duration-fast) ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn:not(:disabled):hover {
  transform: translateY(-2px);
}

.btn:not(:disabled):active {
  transform: scale(0.98);
}

/* Consistent card hover */
.card-interactive {
  cursor: pointer;
  transition: all var(--duration-normal) ease;
}

.card-interactive:hover {
  border-color: rgba(0, 217, 255, 0.3);
  box-shadow: var(--shadow-glow);
}

/* Consistent input states */
.input {
  height: 48px;
  background: var(--bg-primary);
  border: 2px solid var(--bg-card);
  border-radius: var(--radius-md);
  transition: border-color var(--duration-fast) ease;
}

.input:focus {
  border-color: var(--primary);
  outline: none;
}

.input::placeholder {
  color: var(--text-muted);
}
```

### Screen Header Patterns
```css
/* Standard screen header */
.screen-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  padding-top: calc(var(--space-4) + env(safe-area-inset-top));
  background: var(--bg-primary);
  position: sticky;
  top: 0;
  z-index: 10;
}

.screen-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--text-primary);
}

.screen-subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
```

### Loading State Consistency
```css
/* Skeleton loading pattern */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-card) 25%,
    var(--bg-elevated) 50%,
    var(--bg-card) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Card skeleton */
.card-skeleton {
  height: 120px;
  margin-bottom: var(--space-4);
}

/* List item skeleton */
.list-skeleton {
  height: 72px;
  margin-bottom: var(--space-2);
}
```

### Error State Consistency
```css
/* Consistent error card */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
  text-align: center;
}

.error-icon {
  font-size: 48px;
  margin-bottom: var(--space-4);
  opacity: 0.5;
}

.error-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.error-message {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
}
```

### Empty State Consistency
```css
/* Consistent empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-10);
  text-align: center;
}

.empty-illustration {
  width: 120px;
  height: 120px;
  margin-bottom: var(--space-4);
  opacity: 0.7;
}

.empty-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.empty-description {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  max-width: 280px;
  margin-bottom: var(--space-4);
}
```

---

## Responsive Layout Standards

### Breakpoints
```css
/* Mobile-first breakpoints */
/* Base: 320px - 428px (primary target) */
.container {
  max-width: 428px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

/* Tablet: 429px - 768px */
@media (min-width: 429px) {
  .container {
    padding: 0 var(--space-6);
  }
}

/* Desktop: 769px+ */
@media (min-width: 769px) {
  .container {
    max-width: 480px;
    padding: 0 var(--space-6);
  }
}
```

### Layout Patterns

#### Single Column (Mobile Default)
```css
.content-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
```

#### Two Column Grid
```css
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

/* Responsive adjustment */
@media (max-width: 360px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
```

#### Three Column Grid
```css
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

/* On very small screens */
@media (max-width: 340px) {
  .grid-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

#### Four Column Grid (Icons/Quick Actions)
```css
.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-2);
}
```

### Content Sizing
```css
/* Touch targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Primary button */
.btn-primary {
  width: 100%;
  height: 52px;
}

/* Card sizing */
.card {
  min-height: 80px;
}

/* List items */
.list-item {
  min-height: 56px;
  padding: var(--space-3) var(--space-4);
}
```

### Safe Area Compliance
```css
/* iPhone notch / Dynamic Island */
.safe-top {
  padding-top: calc(
    var(--space-4) + 
    env(safe-area-inset-top)
  );
}

/* Home indicator */
.safe-bottom {
  padding-bottom: calc(
    var(--space-4) + 
    env(safe-area-inset-bottom)
  );
}

/* Fixed bottom nav spacing */
.with-bottom-nav {
  padding-bottom: calc(
    72px + 
    env(safe-area-inset-bottom) + 
    var(--space-4)
  );
}
```

### Typography Responsiveness
```css
/* Base sizes */
.text-xs { font-size: 12px; }
.text-sm { font-size: 14px; }
.text-base { font-size: 16px; }
.text-lg { font-size: 20px; }
.text-xl { font-size: 24px; }
.text-2xl { font-size: 28px; }

/* Adjust for small screens */
@media (max-width: 340px) {
  .text-lg { font-size: 18px; }
  .text-xl { font-size: 22px; }
  .text-2xl { font-size: 24px; }
}
```

---

## Telegram UX Standards

### WebApp Integration
```javascript
// Initialize Telegram WebApp
const tg = window.Telegram?.WebApp;

if (tg) {
  // Expand to full height
  tg.expand();
  
  // Set theme colors
  tg.setHeaderColor('#0A0E17');
  tg.setBackgroundColor('#0A0E17');
  
  // Enable closing confirmation
  tg.enableClosingConfirmation();
  
  // Ready signal
  tg.ready();
}
```

### Haptic Feedback
```javascript
// Provide appropriate haptic feedback
const haptic = {
  // Light tap for selections
  light: () => {
    tg?.HapticFeedback?.impactOccurred('light');
  },
  
  // Medium tap for important actions
  medium: () => {
    tg?.HapticFeedback?.impactOccurred('medium');
  },
  
  // Success notification
  success: () => {
    tg?.HapticFeedback?.notificationOccurred('success');
  },
  
  // Error notification
  error: () => {
    tg?.HapticFeedback?.notificationOccurred('error');
  },
  
  // Warning notification
  warning: () => {
    tg?.HapticFeedback?.notificationOccurred('warning');
  }
};

// Usage
button.onClick = () => {
  haptic.light();
  // action
};
```

### Main Button (Telegram CTA)
```javascript
// Telegram main button
const mainButton = tg?.MainButton;

if (mainButton) {
  // Configure
  mainButton.setText('Continue');
  mainButton.show();
  
  // Handle click
  mainButton.onClick(() => {
    haptic.medium();
    // action
  });
  
  // Loading state
  mainButton.showProgress();
  mainButton.hideProgress();
  
  // Disable
  mainButton.disable();
  mainButton.enable();
}
```

### Back Button Handling
```javascript
// Handle Telegram back button
const backButton = tg?.BackButton;

backButton.show();
backButton.onClick(() => {
  // Handle back navigation
  if (canGoBack) {
    navigateBack();
  } else {
    backButton.hide();
  }
});
```

### Viewport Handling
```javascript
// Handle viewport changes
tg?.onEvent('viewportChanged', () => {
  // React to viewport changes
  const isExpanded = tg?.isExpanded;
  const viewportHeight = tg?.viewportHeight;
});

// Check viewport
const viewport = {
  height: tg?.viewportHeight || window.innerHeight,
  width: tg?.viewportWidth || window.innerWidth,
  isExpanded: tg?.isExpanded || false
};
```

### Theme Adaptation
```javascript
// Respect Telegram theme
const theme = {
  // Telegram provides these colors
  bg_color: tg?.themeParams.bg_color || '#0A0E17',
  text_color: tg?.themeParams.text_color || '#FFFFFF',
  button_color: tg?.themeParams.button_color || '#00D9FF',
  button_text_color: tg?.themeParams.button_text_color || '#0A0E17',
  
  // Use our accent if Telegram doesn't provide
  accent: tg?.themeParams.accent_text_color || '#00D9FF',
  hint: tg?.themeParams.hint_color || '#6B7A8F'
};
```

### Mini App Specific UX

#### Biometric Authentication
```javascript
// Biometric auth if supported
async function authenticateBiometric() {
  if (tg?.Biometry) {
    const authResult = await tg.Biometry.requestAccess({
      reason: 'Authenticate to access premium features'
    });
    return authResult;
  }
  return false;
}
```

#### Closing Confirmation
```javascript
// Warn before closing if unsaved changes
function confirmClose(hasUnsavedChanges) {
  if (hasUnsavedChanges) {
    tg?.showConfirm('You have unsaved changes. Leave?', (confirmed) => {
      if (confirmed) {
        tg?.close();
      }
    });
  }
}
```

### Telegram-Native Patterns

#### Share Sheet
```javascript
// Share content via Telegram
function shareArtifact(artifact) {
  tg?.shareUrl(
    `https://t.me/jolttimebot/jolttime?start=artifact_${artifact.id}`
  );
}
```

#### Invite Link
```javascript
// Generate invite link
function getInviteLink() {
  const botUsername = 'jolttimebot';
  const startParam = `ref_${userId}`;
  return `https://t.me/${botUsername}?start=${startParam}`;
}
```

---

## Premium Animation Standards

### Animation Token System
```css
:root {
  /* Durations */
  --duration-instant: 50ms;
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
  --duration-reveal: 600ms;
  --duration-celebration: 1000ms;
  
  /* Easings */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Standard Animations

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out) forwards;
}
```

#### Slide Up
```css
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

.animate-slide-up {
  animation: slideUp var(--duration-normal) var(--ease-out) forwards;
}
```

#### Scale In
```css
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

.animate-scale-in {
  animation: scaleIn var(--duration-normal) var(--ease-spring) forwards;
}
```

#### Glow Pulse
```css
@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 0 20px var(--primary-glow);
  }
  50% {
    box-shadow: 0 0 40px var(--primary-glow);
  }
}

.animate-glow-pulse {
  animation: glowPulse 2s ease-in-out infinite;
}
```

#### Float
```css
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
```

#### Shimmer
```css
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    var(--primary) 0%,
    var(--accent) 50%,
    var(--primary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}
```

#### Confetti
```javascript
// Confetti animation for celebrations
function triggerConfetti() {
  const canvas = document.createElement('canvas');
  canvas.className = 'confetti-canvas';
  document.body.appendChild(canvas);
  
  const confetti = new Confetti({
    canvas,
    colors: ['#00D9FF', '#00FFE5', '#FFD700', '#00FF88'],
    particleCount: 50,
    spread: 60,
    origin: { y: 0.6 }
  });
  
  setTimeout(() => {
    canvas.remove();
  }, 3000);
}
```

### Animation Usage Patterns

#### Staggered Reveals
```javascript
// Stagger animation for list items
function animateListItems(selector, delay = 50) {
  const items = document.querySelectorAll(selector);
  items.forEach((item, index) => {
    item.style.animationDelay = `${index * delay}ms`;
    item.classList.add('animate-slide-up');
  });
}
```

#### Hover Effects
```css
/* Card hover */
.card-interactive {
  transition: transform var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-normal) var(--ease-out),
              border-color var(--duration-normal) var(--ease-out);
}

.card-interactive:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px var(--primary-glow);
  border-color: rgba(0, 217, 255, 0.3);
}

/* Button hover */
.btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px var(--primary-glow);
}
```

#### Press Effects
```css
/* Tap/press feedback */
.interactive {
  transition: transform var(--duration-instant) ease;
}

.interactive:active {
  transform: scale(0.97);
}

/* Glow on press */
.btn:not(:disabled):active {
  transform: scale(0.98);
  box-shadow: 0 2px 10px var(--primary-glow);
}
```

#### Reward Animations
```javascript
// Reward reveal animation
function animateReward(item, type) {
  const container = item.parentElement;
  
  // Scale up
  item.style.transform = 'scale(0)';
  item.style.opacity = '0';
  
  requestAnimationFrame(() => {
    item.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease';
    item.style.transform = 'scale(1.2)';
    item.style.opacity = '1';
    
    setTimeout(() => {
      item.style.transform = 'scale(1)';
    }, 300);
  });
  
  // Particles
  if (type === 'legendary') {
    triggerParticleBurst(container);
    triggerGlowEffect(container);
  }
}
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .animate-float,
  .animate-glow-pulse,
  .animate-shimmer {
    animation: none !important;
  }
}
```

### Performance Rules
```css
/* Use transform and opacity only */
.performance-animation {
  /* Good: GPU accelerated */
  transform: translateX(100px);
  opacity: 0;
  
  /* Avoid: Triggers layout */
  /* margin-left: 100px; */
  /* display: none; */
}

/* will-change hint */
.will-animate {
  will-change: transform, opacity;
}
```

---

## Accessibility Standards

### WCAG 2.1 AA Requirements

#### Color Contrast
```css
/* Text on background - minimum 4.5:1 */
.text-primary {
  color: var(--text-primary); /* #FFFFFF on #0A0E17 = 15.8:1 ✓ */
}

.text-secondary {
  color: var(--text-secondary); /* #B8C5D6 on #0A0E17 = 7.2:1 ✓ */
}

/* Large text (18px+) - minimum 3:1 */
.text-lg {
  color: var(--text-muted); /* #6B7A8F on #0A0E17 = 3.2:1 ✓ */
}

/* Interactive elements - minimum 3:1 */
.btn-primary {
  background: var(--primary); /* #00D9FF on #0A0E17 = 9.1:1 ✓ */
}
```

#### Focus Indicators
```css
/* Visible focus ring */
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Remove for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}

/* Custom focus style for cards */
.card-interactive:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 4px;
}
```

### Semantic HTML
```html
<!-- Use semantic elements -->
<header role="banner">
  <nav role="navigation" aria-label="Main navigation">
    <ul>
      <li><a href="/" aria-current="page">Home</a></li>
    </ul>
  </nav>
</header>

<main role="main">
  <section aria-labelledby="section-title">
    <h2 id="section-title">Section Title</h2>
  </section>
</main>

<footer role="contentinfo">
  <button aria-label="Close dialog">×</button>
</footer>
```

### ARIA Labels
```html
<!-- Icons -->
<button aria-label="Settings">
  <Icon name="settings" aria-hidden="true" />
</button>

<!-- Interactive cards -->
<article aria-labelledby="artifact-name" aria-describedby="artifact-desc">
  <img src="artifact.jpg" alt="" />
  <h3 id="artifact-name">Clay Tablet</h3>
  <p id="artifact-desc">Uncommon artifact from Mesopotamia</p>
</article>

<!-- Progress indicators -->
<div role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
  75% complete
</div>
```

### Screen Reader Announcements
```javascript
// Announce dynamic content changes
function announce(message, priority = 'polite') {
  const announcer = document.getElementById('sr-announcer') || createAnnouncer();
  
  announcer.setAttribute('aria-live', priority);
  announcer.textContent = '';
  
  requestAnimationFrame(() => {
    announcer.textContent = message;
  });
}

// Usage
function showReward(reward) {
  announce(`Reward received: ${reward.name}`, 'assertive');
}
```

### Touch Target Sizes
```css
/* Minimum 44x44px touch target */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Primary actions - 48px+ */
.btn-primary {
  min-height: 48px;
  padding: 0 var(--space-6);
}

/* List items */
.list-item {
  min-height: 56px;
  padding: var(--space-3) var(--space-4);
}
```

### Keyboard Navigation
```javascript
// Arrow key navigation for grids
function handleGridNavigation(event, currentIndex, totalItems) {
  let newIndex = currentIndex;
  
  switch(event.key) {
    case 'ArrowRight':
      newIndex = Math.min(currentIndex + 1, totalItems - 1);
      break;
    case 'ArrowLeft':
      newIndex = Math.max(currentIndex - 1, 0);
      break;
    case 'ArrowDown':
      newIndex = Math.min(currentIndex + 4, totalItems - 1);
      break;
    case 'ArrowUp':
      newIndex = Math.max(currentIndex - 4, 0);
      break;
    case 'Home':
      newIndex = 0;
      break;
    case 'End':
      newIndex = totalItems - 1;
      break;
  }
  
  if (newIndex !== currentIndex) {
    event.preventDefault();
    focusItem(newIndex);
  }
}
```

### Modal Accessibility
```javascript
// Accessible modal
function openModal(content) {
  const modal = document.createElement('div');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'modal-title');
  
  // Focus trap
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  modal.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
    
    if (event.key === 'Escape') {
      closeModal();
    }
  });
  
  // Focus first element
  firstFocusable?.focus();
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}
```

### Colorblind-Friendly Design
```css
/* Don't rely on color alone */
.badge {
  /* Icon + color for rarity */
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.badge.legendary::before {
  content: '★';
  color: var(--premium);
}

.badge.common::before {
  content: '○';
  color: var(--text-muted);
}

/* Progress with text */
.progress-label {
  display: flex;
  justify-content: space-between;
}

/* Error states with icon */
.error-message::before {
  content: '⚠';
  margin-right: var(--space-2);
}
```

### Prefers Reduced Motion
```css
/* Respect user preference */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  
  /* Static alternatives */
  .animate-float {
    animation: none;
  }
  
  /* Instant transitions */
  .btn {
    transition: none;
  }
}
```

### Content Accessibility
```html
<!-- Images have alt text -->
<img src="artifact.jpg" alt="Clay tablet from Mesopotamia, showing cuneiform writing" />

<!-- Decorative images -->
<img src="decoration.svg" alt="" aria-hidden="true" />

<!-- Long descriptions for complex content -->
<figure>
  <img src="chart.png" alt="Revenue chart showing growth" />
  <figcaption>
    Detailed description: Q1 saw 50% growth, Q2 added 30%, Q3 doubled, Q4 tripled.
  </figcaption>
</figure>
```

---

*Design is not just what it looks like and feels like. Design is how it works.*
