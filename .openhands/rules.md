# Jolt Time — Development Rules

## Code Quality Rules

1. **Mobile-First Development**
   - Design for mobile screens first (320px-428px width)
   - Touch-friendly UI elements (minimum 44px tap targets)
   - Optimize assets for mobile data usage
   - Test on low-end devices

2. **Performance Standards**
   - First Contentful Paint < 1.5s
   - Time to Interactive < 3s
   - Bundle size < 250KB gzipped
   - Lighthouse score > 90

3. **Security Requirements**
   - All API calls over HTTPS only
   - Input validation on client AND server
   - No sensitive data in localStorage
   - Rate limiting on all endpoints
   - SQL injection prevention
   - XSS prevention

4. **Code Organization**
   - Feature-based folder structure
   - Separation of concerns (UI/Business/Data)
   - Consistent naming conventions
   - Comprehensive comments for complex logic
   - Documentation for public APIs

## Telegram Mini App Specific Rules

1. **Telegram Integration**
   - Use official Telegram Web App SDK
   - Support both light/dark themes
   - Handle viewport changes gracefully
   - Implement proper back button handling
   - Test in Telegram app on iOS/Android

2. **User Experience**
   - Seamless authentication via Telegram
   - Haptic feedback on interactions
   - Smooth animations (60fps target)
   - Graceful error states
   - Loading states for all async operations

## Data Management Rules

1. **Supabase Integration**
   - Use Row Level Security (RLS)
   - Implement proper indexing
   - Cache static data locally
   - Handle offline scenarios
   - Sync data on reconnection

2. **Privacy Compliance**
   - Minimal data collection
   - Clear data retention policies
   - GDPR-compliant user consent
   - Secure data deletion procedures

## Game Design Rules

1. **Educational Value**
   - Historical accuracy in content
   - Engaging learning mechanics
   - Progressive difficulty curve
   - Clear educational objectives
   - Reward learning behavior

2. **Fair Play**
   - No pay-to-win mechanics
   - Cosmetic items only in shop
   - Equal experience for free/paid users
   - Transparent odds for random rewards

3. **Content Rules**
   - Age-appropriate content
   - Cultural sensitivity
   - No violence or harmful content
   - Positive educational messaging
   - Diverse representation

## Revenue Rules

1. **AdsGram Implementation**
   - Non-intrusive ad placement
   - Clear ad labeling
   - Respect user ad preferences
   - No forced ad viewing
   - Reward optional ad watching

2. **Monetization Ethics**
   - No predatory monetization
   - No loot boxes with real money
   - Clear pricing for any purchases
   - Parental controls for spending

## Testing Requirements

1. **QA Process**
   - Unit tests for business logic
   - Integration tests for APIs
   - E2E tests for critical flows
   - Cross-device testing
   - Accessibility testing

2. **Release Process**
   - Version control with semantic versioning
   - Staging environment testing
   - Gradual rollout strategy
   - Rollback procedures
   - Post-release monitoring

## Documentation Rules

1. **Required Documentation**
   - README with setup instructions
   - API documentation
   - Deployment guides
   - Contributing guidelines
   - Changelog

2. **Code Documentation**
   - JSDoc for all public functions
   - README for each module
   - Inline comments for complex logic
   - Architecture decision records

## Version Control Rules

1. **Git Workflow**
   - Feature branches from develop
   - PR reviews before merge
   - Squash commits for clean history
   - Tag releases properly
   - Protect main/master branches

2. **Commit Messages**
   - Conventional commits format
   - Clear description of changes
   - Reference issues/tickets
   - Breaking changes clearly marked

## Communication Rules

1. **GitHub Repository**
   - Issue templates for bugs/features
   - PR templates
   - Clear contribution guidelines
   - Active maintenance and responses

2. **Telegram Bot**
   - Clear command documentation
   - Helpful error messages
   - User consent for notifications
   - Privacy-first messaging
