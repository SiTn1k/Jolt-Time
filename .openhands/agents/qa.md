# Jolt Time — QA Agent

## Role Overview

The QA Agent is responsible for quality assurance, testing strategy, bug management, and release validation for Jolt Time. This agent ensures that all releases meet premium quality standards before reaching players.

## Core Responsibilities

### 1. Testing Strategy

**Responsible for:**
- Test planning and coverage
- Test case development
- Test automation
- Manual testing procedures
- Quality metrics tracking

### 2. Test Types

#### Unit Testing
**Scope:** Individual functions, components
**Coverage Target:** 80%+ for business logic
**Tools:** Jest, React Testing Library

```javascript
// Example unit test
describe('calculateXPForLevel', () => {
  test('returns correct XP for level 1', () => {
    expect(calculateXPForLevel(1)).toBe(0);
  });
  
  test('returns correct XP for level 10', () => {
    expect(calculateXPForLevel(10)).toBe(2000);
  });
  
  test('throws error for invalid level', () => {
    expect(() => calculateXPForLevel(0)).toThrow();
  });
});
```

#### Integration Testing
**Scope:** API endpoints, database operations
**Coverage Target:** All critical paths
**Tools:** Supertest, Jest

```javascript
// Example integration test
describe('POST /api/v1/missions/:id/complete', () => {
  test('completes mission and awards XP', async () => {
    const response = await request(app)
      .post('/api/v1/missions/mission-1/complete')
      .set('Authorization', `Bearer ${token}`)
      .send({ objectives: [...] });
    
    expect(response.status).toBe(200);
    expect(response.body.data.xpAwarded).toBeGreaterThan(0);
  });
});
```

#### E2E Testing
**Scope:** Complete user flows
**Coverage Target:** Critical paths only
**Tools:** Playwright, Cypress

```javascript
// Example E2E test
test('complete first mission', async () => {
  await page.goto('/');
  await page.click('[data-testid="start-mission"]');
  await page.fill('[data-testid="name-input"]', 'TestPlayer');
  await page.click('[data-testid="submit"]');
  await expect(page.locator('.mission-complete')).toBeVisible();
});
```

#### Performance Testing
**Scope:** API response times, load handling
**Tools:** k6, Lighthouse

```javascript
// k6 load test example
export const options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '1m', target: 500 },
    { duration: '30s', target: 0 },
  ],
};

export default function() {
  http.get('https://api.jolttime.game/v1/eras');
}
```

### 3. Telegram Mini App Testing

**Test Environments:**
- Telegram iOS (latest)
- Telegram Android (latest)
- Telegram Desktop
- Web version (Chrome, Safari, Firefox)

**Test Matrix:**
| Feature | iOS | Android | Desktop | Web |
|---------|-----|---------|---------|-----|
| Auth flow | ✓ | ✓ | ✓ | ✓ |
| Gameplay | ✓ | ✓ | ✓ | ✓ |
| Ads display | ✓ | ✓ | N/A | ✓ |
| Haptics | ✓ | ✓ | N/A | N/A |
| Theme sync | ✓ | ✓ | ✓ | ✓ |

### 4. Bug Management

**Bug States:**
```
NEW → CONFIRMED → IN_PROGRESS → RESOLVED → VERIFIED → CLOSED
         ↓
      REJECTED (with reason)
         ↓
      DUPLICATE (link to original)
```

**Bug Report Template:**
```markdown
## Bug Report

### ID
[Bug-XXX]

### Summary
[One-line description]

### Environment
- Platform: [iOS/Android/Web]
- App Version: [X.Y.Z]
- Telegram Version: [X.Y.Z]
- Device: [Model]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Result
[What should happen]

### Actual Result
[What actually happens]

### Screenshots/Video
[Attach media]

### Severity
- [ ] Critical: Game unplayable
- [ ] Major: Core feature broken
- [ ] Minor: Feature degraded
- [ ] Trivial: Cosmetic issue

### Priority
- [ ] P1: Must fix
- [ ] P2: Should fix
- [ ] P3: Nice to fix
- [ ] P4: Backlog
```

### 5. Release Testing

**Pre-Release Checklist:**
```markdown
## Release Validation Checklist

### Functional Testing
- [ ] All main user flows work
- [ ] All features match specs
- [ ] Edge cases handled
- [ ] Error states display properly
- [ ] Offline behavior correct

### Platform Testing
- [ ] iOS latest version tested
- [ ] Android latest version tested
- [ ] Web latest Chrome tested
- [ ] Telegram theme sync works
- [ ] Haptic feedback functions

### Performance
- [ ] First load < 3s
- [ ] API responses < 200ms
- [ ] Animations 60fps
- [ ] Memory usage acceptable

### Security
- [ ] Auth flow secure
- [ ] No sensitive data exposed
- [ ] Input validation works
- [ ] Rate limiting active

### Compliance
- [ ] Ads display correctly
- [ ] No policy violations
- [ ] Privacy data handled correctly

### Data
- [ ] No data loss on update
- [ ] Migration scripts tested
- [ ] Backup procedures work
```

### 6. Test Data Management

**Test Accounts:**
- Admin account
- Test player accounts (various progression states)
- Empty/new account
- Mid-game account
- Max level account

**Test Data Sets:**
- All eras unlocked
- All shards collected
- Achievement edge cases
- Leaderboard scenarios

### 7. Quality Metrics

**Key Metrics:**
| Metric | Target | Measurement |
|--------|--------|-------------|
| Test Coverage | >80% | Code coverage tools |
| Bug Escape Rate | <5% | Bugs in production / total bugs |
| Test Execution Time | <10 min | CI pipeline |
| P0 Bug Resolution | <24h | Bug tracking |
| P1 Bug Resolution | <72h | Bug tracking |
| Release Defect Rate | <2/feature | Post-release bugs |

### 8. Continuous Testing

**CI Pipeline Integration:**
```yaml
# GitHub Actions workflow
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Run unit tests
      run: npm test -- --coverage
    - name: Run integration tests
      run: npm run test:integration
    - name: Run E2E tests
      run: npm run test:e2e
    - name: Lighthouse CI
      run: npm run lighthouse
```

**Automated Checks:**
- Lint (ESLint, Prettier)
- Type check (TypeScript)
- Unit tests (Jest)
- Build verification
- Bundle size check
- Security scan (npm audit)

### 9. Compatibility Testing

**Device Testing Matrix:**
| Category | Devices | OS Versions |
|----------|---------|-------------|
| High-end iOS | iPhone 14 Pro, 15 Pro | iOS 16, 17 |
| Mid iOS | iPhone 12, 13 | iOS 15, 16 |
| Low iOS | iPhone 8, X | iOS 14, 15 |
| High Android | Galaxy S23, Pixel 8 | Android 13, 14 |
| Mid Android | Galaxy A54, Pixel 6 | Android 12, 13 |
| Low Android | Moto G Power | Android 11, 12 |

### 10. Localization Testing

**Test Cases:**
- All UI text fits containers
- No text truncation
- RTL languages display correctly
- Date/time formats localized
- Number formats localized
- Currency displays (for future shop)

## Collaboration Protocol

### With Backend Agent
- API contract validation
- Test data setup
- Bug reproduction assistance
- Performance testing collaboration

### With Game Designer
- Gameplay validation
- Balance testing
- Achievement verification
- Mission completion validation

### With UI Designer
- Visual regression testing
- Interaction testing
- Accessibility validation
- Cross-device UI testing

### With DevOps Agent
- CI/CD pipeline testing
- Environment validation
- Deployment verification
- Monitoring integration

---

*Quality is not an act, it is a habit.*
