# AGENTS.MD — Operating Manual for cwayassistant

**Version:** v0.1 (Bootstrap Initial - 2026-02-12)  
**Last Updated:** 2026-02-12

## Project Overview

**cwayassistant** is an AI Knowledge Assistant for Google Chat that answers questions based on conversation history in spaces.

### Tech Stack

- **Runtime:** Node.js 22 (LTS)
- **Platform:** Google Cloud Functions gen2 (HTTP + Events triggers via Cloud Run)
- **Architecture:** Controllers/services/model pattern
- **APIs:** Google Chat API, Workspace Events API, Firestore, Vertex AI (Gemini 1.5 Flash)
- **Testing:** Mocha + Supertest + Sinon + proxyquire
- **Quality Tooling:** ESLint 9.x + Prettier 3.x + JSDoc checkJs
- **Package Manager:** npm
- **Deployment:** gcloud CLI via `deploy.sh` script

### Project Purpose

The app monitors Google Chat spaces in real-time, detects questions from users, retrieves relevant conversation history from Firestore, and uses Vertex AI (Gemini) to generate intelligent answers based on context.

## How to Work with This Codebase

### Initial Setup

```bash
# Clone repository
git clone https://github.com/hugo-borba/cwayassistant.git
cd cwayassistant

# Install dependencies
npm install

# Configure environment (edit env.js)
# Configure OAuth2 credentials (copy credentials.json.template, fill in values)
```

### Development Workflow

**Run tests:**
```bash
npm test
```

**Check code quality:**
```bash
npm run lint                # ESLint check (0 errors required)
npm run format:check        # Prettier formatting check
npm run typecheck           # JSDoc type checking (TypeScript checkJs mode)
```

**Auto-fix issues:**
```bash
npm run lint -- --fix       # Auto-fix linting issues where possible
npm run format              # Auto-format code (review diffs before committing)
```

**Quality Gates (run before committing):**
```bash
npm run lint && npm run format:check && npm run typecheck && npm test
```

### Local Development

**Run HTTP function locally:**
```bash
npx functions-framework --target=app --port=8080

# Test with curl
curl -X POST http://localhost:8080/endpoint \
  -H "Content-Type: application/json" \
  -d '{"message":{"text":"Hello"}}'
```

**Run Events function locally:**
```bash
npx functions-framework --target=eventsApp --signature-type=cloudevent --port=8081

# Test with CloudEvents format
curl -X POST http://localhost:8081 \
  -H "Content-Type: application/json" \
  -H "ce-id: 123" \
  -H "ce-source: test" \
  -H "ce-type: google.workspace.chat.message.v1.created" \
  -H "ce-specversion: 1.0" \
  -d '{"message":{"text":"Hello"}}'
```

### Deployment

**Deploy to production:**
```bash
./deploy.sh
```

**Or deploy manually:**
```bash
# HTTP function
gcloud functions deploy app \
  --gen2 \
  --region=us-central1 \
  --runtime=nodejs22 \
  --source=. \
  --entry-point=app \
  --trigger-http \
  --allow-unauthenticated

# Events function
gcloud functions deploy events-app \
  --gen2 \
  --region=us-central1 \
  --runtime=nodejs22 \
  --source=. \
  --entry-point=eventsApp \
  --trigger-topic=events-api
```

## Architecture Conventions

### CRITICAL: Always Respect the Three-Layer Pattern

```
Controllers → Services → Model
```

**Controllers** (`/controllers/`):
- Handle HTTP requests and Pub/Sub events
- Validate request structure (req.body, req.query, req.params)
- Return appropriate HTTP status codes
- **NO business logic** (delegate to services)
- **NO direct API calls** (Firestore, Chat, Vertex AI, etc.)

**Services** (`/services/`):
- Contain ALL business logic
- Make external API calls (Firestore, Chat API, Vertex AI, Events API)
- Receive dependencies via constructor (dependency injection)
- **DO NOT** handle HTTP requests/responses (no req/res parameters)
- Throw descriptive errors (don't return error codes)

**Model** (`/model/`):
- Define data structures and domain entities
- Contain entity-specific validation and business rules
- **Pure functions** (no side effects, no API calls)

### Example Flow

```
User sends message
  → controllers/app.js (HTTP handler)
    - Validates request body
    - Delegates to services
  
  → services/user-auth-chat-service.js (OAuth2 authentication)
    - Validates/refreshes tokens
    - Returns authenticated client
  
  → services/firestore-service.js (store message)
    - Saves message to Firestore
    - Returns document ID
  
  → services/aip-service.js (Vertex AI query)
    - Detects if message is question
    - Generates answer from context
    - Returns AI response
  
  ← Response back to user via Chat API
```

## When to Ask vs Assume

Understanding when to ask for clarification vs proceeding with assumptions is critical for effective collaboration.

### ASK before changing:

- **OAuth2 flows** - Dual auth (user + app) is critical to cwayassistant architecture
- **Firestore schema** - Collections, document IDs, indexes affect queries and performance
- **deploy.sh logic** - GCF deployment configurations, environment variables
- **credentials.json structure** - OAuth2 client configuration
- **API integration patterns** - Chat API, Events API, Vertex AI request/response formats
- **Breaking changes** - Any change that breaks existing APIs or function signatures

### SAFE to assume / proceed:

- **Code style fixes** - ESLint and Prettier enforce standards automatically
- **Test pattern updates** - Follow existing Mocha structure in `test/`
- **JSDoc additions** - 100% coverage on public functions is standard
- **Refactoring within services** - If tests pass, changes are safe (assuming no breaking API changes)
- **Adding helper utilities** - If doesn't change architecture layers
- **Updating inline comments** - For clarity and maintainability
- **Fixing linting errors** - Flagged by `npm run lint`

### Examples

**Ask:**
- "I want to change how we store OAuth2 tokens in Firestore to use a different encryption method."
- "Should we add a new collection for caching Vertex AI responses?"
- "I'm thinking of refactoring the Events handler to process multiple event types in parallel."

**Proceed (with summary in commit):**
- Extract common retry logic to utility function (refactor)
- Add JSDoc to `getUserData` function (documentation)
- Fix ESLint error about unused variable (code quality)
- Update inline comment to explain workaround (documentation)
- Add test for edge case (null input) (testing)

## Keeping Rules and Docs Updated

### Living Documentation Rule

**CRITICAL:** After every task that changes files, you MUST update:

#### 1. Update README.md if:

- File/folder structure changed (add/remove directories or files)
  - **Action:** Refresh repository tree diagram with inline descriptions
- Logical flow changed (new integration, removed feature, architecture shift)
  - **Action:** Update Mermaid flowchart to reflect new flow
- Environment variables changed
  - **Action:** Update Configuration section with new variables
- Deployment process changed
  - **Action:** Update Deployment section with new steps

#### 2. Update package.json if:

- Dependencies added/removed
  - **Action:** Add/remove from `dependencies` or `devDependencies`
- npm scripts added/modified
  - **Action:** Update `scripts` section
- **Maintain consistent pinning policy:** Use `^` for minor compatibility (e.g., `^9.1.0`)

#### 3. Update /.cursor/rules/*.mdc if:

- New patterns emerge (e.g., new Firestore query pattern)
  - **Action:** Add to relevant domain rule file (e.g., `google-apis.mdc`)
- Quality standards change (e.g., coverage requirement increases)
  - **Action:** Update relevant rule (e.g., `testing.mdc`)
- New architectural decisions made
  - **Action:** Update `architecture.mdc` and create ADR in `/docs/adr/`

#### 4. Update /.cursor/imports/PROVENANCE.md if:

- New templates imported from awesome-cursorrules
  - **Action:** Add entry to "Import History" section
- Existing templates re-imported (version update)
  - **Action:** Add entry to "Update History" section with date and rationale

### Task Summary Template

Include in your task summary what was updated:

```
Task: Add retry logic to Chat API calls

Changes:
- Modified: services/chat-service.js (added exponential backoff)
- Modified: README.md (updated architecture flow to show retry)
- Modified: /.cursor/rules/google-apis.mdc (documented retry pattern)
- Tests: npm test passed; coverage 76% → 78%

Quality Gates: ✅ lint ✅ format:check ✅ typecheck ✅ test
```

## Rules Provenance Process

### Guideline: Reuse First, Extend Second, Create Original Last

1. **Reuse:** Always check if [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) has a relevant template BEFORE creating original rules
2. **Extend:** If template exists but needs adaptation, extend in `/.cursor/rules/` and note in `PROVENANCE.md`
3. **Label Original:** If creating 100% new rule, label explicitly with `<!-- ORIGINAL: rationale -->` and explain why no reusable template exists

### Importing New Templates

When you need to import a new template:

1. **Search awesome-cursorrules** for relevant template
2. **Use Cursor Rules extension** (Command Palette → "Cursor Rules: Add .cursorrules")
3. **Snapshot immediately** to `/.cursor/imports/<template-name>.cursorrules.txt`
4. **Update PROVENANCE.md** with:
   - Source path
   - Date imported
   - Applied to (which files/rules)
   - Modifications made
5. **Expand into domain rules** if applicable

### Updating Existing Rules

**Small change** (minor fix, clarification):
- Edit `.mdc` file directly
- Note change in git commit message: `docs(rules): clarify retry logic in google-apis.mdc`

**Large change** (new patterns, significant additions):
- Re-import template if available (check for updates in awesome-cursorrules)
- Or create new `.mdc` version (e.g., `google-apis-v2.mdc`)
- Document rationale in `PROVENANCE.md` under "Update History"

## Troubleshooting

### Common Issues

**Tests Failing:**
```bash
# Check which tests are failing
npm test

# Run specific test file
npx mocha test/services/my-service.test.js

# Check if linting issues
npm run lint

# Common cause: Forgot to restore Sinon mocks
# Fix: Add afterEach(() => sinon.restore()) to test suite
```

**Linting Errors:**
```bash
# See what's wrong
npm run lint

# Auto-fix where possible
npm run lint -- --fix

# If specific rule is problematic, add exception to .eslintrc.json
# (document reason in comment)
```

**Type Checking Errors:**
```bash
# See JSDoc type errors
npm run typecheck

# Fix by adding/correcting JSDoc comments
# Example:
/**
 * @param {string} userId
 * @returns {Promise<Object>}
 */
async function getUser(userId) { ... }
```

**Deployment Failures:**
```bash
# Check gcloud CLI is authenticated
gcloud auth list

# Check project is set
gcloud config get-value project

# Check function logs
gcloud functions logs read app --gen2 --region=us-central1 --limit=50
gcloud functions logs read events-app --gen2 --region=us-central1 --limit=50
```

**OAuth2 Errors:**
```bash
# Check credentials.json exists and is valid
cat credentials.json

# Verify redirect URI matches deployed function URL
# Should be: https://REGION-PROJECT_ID.cloudfunctions.net/app/oauth2

# Check token expiry and refresh
# Tokens stored encrypted in Firestore /tokens collection
```

## Quality Standards Enforcement

This project enforces 8 quality standard categories:

| Category           | Standards                                                                                       | Enforced By                         | Validation                        |
| ------------------ | ----------------------------------------------------------------------------------------------- | ----------------------------------- | --------------------------------- |
| A. Code Quality    | Complexity ≤10, naming conventions, no unused vars, async/await patterns                       | ESLint, Prettier                    | `npm run lint`                    |
| B. Testing         | ≥70% overall coverage, ≥90% services, Mocha structure, mocking                                  | Mocha, nyc                          | `npm test`, `npm run test:coverage` |
| C. Security        | No hardcoded secrets, OAuth2 best practices, input validation                                   | Manual review, SAST checks          | Code review, `npm audit`          |
| D. Documentation   | JSDoc 100% public functions, README maintenance, ADR process                                    | JSDoc checkJs, manual review        | `npm run typecheck`, code review  |
| E. Reliability     | Error handling, retry logic (exponential backoff), timeouts                                     | Manual review, testing              | Tests, code review                |
| F. Performance     | Cold start <3s, caching, Firestore indexing                                                     | Manual review, monitoring           | Cloud Monitoring                  |
| G. Maintainability | Controllers/services/model pattern, DRY, dependency injection                                   | Manual review, architecture rules   | Code review                       |
| H. Git & Workflow  | Conventional commits, PR reviews, semantic versioning                                           | Git hooks (optional), manual review | Commit message format             |

### Pre-Commit Checklist

Before committing code:

- [ ] Run `npm run lint` (0 errors)
- [ ] Run `npm run format:check` (no diffs)
- [ ] Run `npm run typecheck` (0 errors)
- [ ] Run `npm test` (all tests pass)
- [ ] JSDoc comments on all public functions
- [ ] README updated if structure/flow changed
- [ ] Conventional commit message format
- [ ] No hardcoded secrets or credentials

### Pre-PR Checklist

Before opening pull request:

- [ ] Self-review diff (check for debug logs, commented code)
- [ ] Tests added/updated for changes
- [ ] Documentation updated (README, JSDoc, ADR if needed)
- [ ] No linting errors: `npm run lint`
- [ ] All tests passing: `npm test`
- [ ] No merge conflicts with main
- [ ] PR description clear and complete
- [ ] Linked related issues (Closes #123, Fixes #456)

## Versioning

### Current Versions

- **Bootstrap:** v0.1 (initial, 2026-02-12)
- **Quality Standards:** v0.1 (initial, 2026-02-12)
- **Cursor Rules:** 7 templates imported, 8 domain rules active

### Update History

- **2026-02-12:** Initial bootstrap complete (v0.1)
  - 7 templates imported/created
  - 8 domain rules created
  - Root `.cursorrules` assembled
  - README migrated to English
  - AGENTS.md created
  - ESLint + Prettier + JSDoc configured

### Future Updates

When rules/standards change significantly:

1. Increment version (e.g., v0.1 → v0.2)
2. Tag release: `git tag v0.2-rules-update`
3. Update badges in README.md
4. Document changes in `/.cursor/imports/PROVENANCE.md`

## Useful Commands Reference

### Git Workflow
```bash
# Start feature
git checkout -b feature/my-feature

# Commit with conventional format
git commit -m "feat(scope): add feature description"

# Push branch
git push -u origin feature/my-feature

# After PR merge, clean up
git checkout main
git pull origin main
git branch -d feature/my-feature
```

### Testing
```bash
# Run all tests
npm test

# Run specific test file
npx mocha test/services/my-service.test.js

# Run with coverage
npm run test:coverage

# Watch mode (re-run on file changes)
npx mocha --watch test/**/*.test.js
```

### Quality Gates
```bash
# Full quality check
npm run lint && npm run format:check && npm run typecheck && npm test

# Individual checks
npm run lint           # ESLint
npm run format:check   # Prettier (dry run)
npm run typecheck      # JSDoc TypeScript checkJs
npm test               # Mocha

# Auto-fix
npm run lint -- --fix  # Fix linting issues
npm run format         # Format code (review diffs!)
```

### Cloud Functions
```bash
# View logs
gcloud functions logs read app --gen2 --region=us-central1 --limit=50
gcloud functions logs read events-app --gen2 --region=us-central1 --limit=50

# Describe function
gcloud functions describe app --gen2 --region=us-central1

# List functions
gcloud functions list --gen2 --region=us-central1

# Delete function
gcloud functions delete app --gen2 --region=us-central1
```

## Additional Resources

- [Cursor Rules Provenance](.cursor/imports/PROVENANCE.md) - Full template history
- [Domain Rules](.cursor/rules/) - Detailed domain-specific rules
- [ADRs](docs/adr/) - Architecture decision records
- [README](README.md) - Project overview and setup
- [README.pt-BR](README.pt-BR.md) - Portuguese version
- [Bootstrap Plan](.cursor/plans/) - Original bootstrap plan and quality framework

---

**Remember:** This project follows strict quality standards and living documentation principles. Every code change should be accompanied by updates to relevant documentation and passing quality gates.

**When in doubt, ASK!** Refer to "When to Ask vs Assume" section above.
