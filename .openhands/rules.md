# Jolt Time — Development Rules

## Architecture Rules

### Clean Architecture
1. **Separation of Concerns** — UI / Business Logic / Data layers must be clearly separated
2. **Single Responsibility** — Each module/class/function does one thing well
3. **Dependency Inversion** — Depend on abstractions, not concretions
4. **Law of Demeter** — Modules know only about their direct dependencies

### Project Structure
```
src/
├── components/        # Reusable UI components
├── screens/          # Page-level components
├── hooks/            # Custom React hooks
├── services/        # API and external services
├── stores/          # State management
├── utils/           # Helper functions
├── types/           # TypeScript interfaces
├── constants/       # Application constants
└── assets/          # Static assets
```

## Code Quality Rules

### TypeScript Strict Mode
- `strict: true` enabled in tsconfig.json
- No implicit any
- Strict null checks
- Strict function types
- No unsafe optimizations

### Code Standards
1. **No Duplicated Code** — Extract to functions, hooks, or utilities
2. **Descriptive Naming** — Variables and functions must be self-documenting
3. **Small Functions** — Functions should fit on one screen (max ~50 lines)
4. **No Magic Numbers** — Use named constants
5. **Early Returns** — Reduce nesting with early returns

### Documentation Requirements
- All public functions require JSDoc comments
- Complex logic requires inline comments
- README for each major module
- API endpoints documented with examples
- Database schema documented

### Required Documentation
- [ ] README.md with setup instructions
- [ ] API documentation for all endpoints
- [ ] Component library documentation
- [ ] Deployment guide
- [ ] Contributing guidelines
- [ ] Changelog

## Mobile-First Rules

### UI Principles
1. **Touch Targets** — Minimum 44x44px for all interactive elements
2. **Readable Text** — Minimum 14px for body text, 12px for captions
3. **Safe Areas** — Respect iOS notch and Android navigation
4. **Responsive Layout** — Adapt to screens 320px - 428px width
5. **Thumb Zone** — Primary actions in bottom third of screen

### Performance Rules
1. **First Paint** — < 1.5 seconds
2. **Interactive** — < 3 seconds
3. **Frame Rate** — Maintain 60fps
4. **Bundle Size** — < 250KB gzipped
5. **Image Optimization** — WebP preferred, lazy loading

### Network Rules
1. **Offline Support** — Core features work offline
2. **Graceful Degradation** — App works on 3G
3. **Request Batching** — Combine where possible
4. **Caching** — Cache static assets aggressively

## Premium UX Rules

### Visual Standards
- **Consistency** — Same patterns throughout
- **Feedback** — Every action has visual/haptic response
- **Transitions** — Smooth 200-300ms animations
- **Glow Effects** — Subtle cyan/mint glows on premium elements
- **Spacing** — Consistent 8px grid system

### Interaction Standards
1. **Immediate Feedback** — Visual response within 100ms
2. **Loading States** — Skeleton loaders, not spinners
3. **Error States** — Clear, actionable error messages
4. **Empty States** — Encouraging illustrations with CTAs
5. **Success States** — Celebratory feedback for achievements

### Animation Rules
- Use CSS transforms for animations
- Prefer `will-change` for animated elements
- Respect `prefers-reduced-motion`
- Test on low-end devices
- No animation blocks user interaction

## Performance Preservation Rules

### Before Adding New Features
1. **Performance Budget** — New features must fit within budget
2. **Bundle Analysis** — Check impact on bundle size
3. **Render Analysis** — Verify no unnecessary re-renders
4. **Network Impact** — Consider API call overhead
5. **Memory Check** — No memory leaks

### Performance Monitoring
- Lighthouse score > 90
- Core Web Vitals pass
- Real user monitoring (RUM)
- Synthetic testing in CI

### Performance Optimization
1. **Code Splitting** — Load only what's needed
2. **Tree Shaking** — Remove unused code
3. **Memoization** — Cache expensive computations
4. **Virtualization** — For long lists
5. **Web Workers** — For heavy computation

## Testing Rules

### Test Coverage Requirements
- Business logic: 90%+ coverage
- UI components: Key interactions tested
- API services: Success and error paths
- Critical user flows: E2E tested

### Test Types
1. **Unit Tests** — Jest for pure functions
2. **Integration Tests** — API endpoints
3. **Component Tests** — React Testing Library
4. **E2E Tests** — Playwright

## Security Rules

### Always
- Validate input on client AND server
- Use parameterized queries
- Sanitize output
- Use HTTPS only
- Implement rate limiting
- Log security events

### Never
- Trust client data
- Store sensitive data in localStorage
- Expose secrets in client code
- Skip authentication checks
- Hardcode credentials

## Git Rules

### Commits
- Conventional commits format
- Subject: imperative mood, 50 chars max
- Body: explain what and why, not how
- Reference issues/tickets

### Branches
- `main` — Production, protected
- `develop` — Integration branch
- `feature/*` — New features
- `fix/*` — Bug fixes
- `hotfix/*` — Emergency fixes

### Pull Requests
- Small, focused PRs
- Description explains context
- Tests included
- CI passes
- Code review required

---

*Quality is not an act, it is a habit.*
