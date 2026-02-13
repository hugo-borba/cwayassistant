# Cursor Rules Provenance

This document tracks all imported `.cursorrules` templates and their usage in the cwayassistant project.

## Snapshot Information

- **Creation Date:** 2026-02-12
- **Bootstrap Version:** v0.1
- **Method:** Direct GitHub fetch from PatrickJS/awesome-cursorrules repository

## Import History

### 1. JavaScript/Node.js Template

- **Source:** PatrickJS/awesome-cursorrules → `/rules/es-module-nodejs-guidelines-cursorrules-prompt-fil/`
- **Date Imported:** 2026-02-12
- **Snapshot File:** `javascript-nodejs.cursorrules.txt`
- **Applied To:**
  - Root `/.cursorrules` → General JavaScript patterns, Async/Await, Error Handling, Module System
  - `/.cursor/rules/architecture.mdc` → Code organization patterns, module structure
  - `/.cursor/rules/code-style.mdc` → Naming conventions, ES6+ features, best practices
- **Modifications:** Adapted for serverless context (Google Cloud Functions gen2); added emphasis on cold start optimization and global variable reuse

### 2. Google Cloud Functions Template

- **Source:** Created from GCP best practices (awesome-cursorrules does not have specific GCF gen2 template)
- **Date Imported:** 2026-02-12
- **Snapshot File:** `google-cloud-functions.cursorrules.txt`
- **Applied To:**
  - Root `/.cursorrules` → GCF Gen2 deployment specifics, HTTP/Events functions
  - `/.cursor/rules/cloud-functions.mdc` → Serverless patterns, cold start optimization, event handling
- **Modifications:** Original template based on official Google Cloud Functions documentation and gen2 best practices
- **Note:** _Template marked as "Original" - created from GCP docs as no specific GCF template exists in awesome-cursorrules_

### 3. Testing/Mocha Template

- **Source:** Adapted from Jest template at PatrickJS/awesome-cursorrules → `/rules/jest-unit-testing-cursorrules-prompt-file/`
- **Date Imported:** 2026-02-12
- **Snapshot File:** `testing-mocha.cursorrules.txt`
- **Applied To:**
  - Root `/.cursorrules` → Testing conventions, coverage requirements
  - `/.cursor/rules/testing.mdc` → Mocha-specific patterns, Sinon mocking, Supertest API testing
- **Modifications:** Converted from Jest patterns to Mocha equivalents (describe/it maintained, converted jest.mock to proxyquire, adapted assertions to Chai syntax)

### 4. API/Backend Template

- **Source:** Extracted from PatrickJS/awesome-cursorrules → `/rules/nodejs-mongodb-cursorrules-prompt-file-tutorial/`
- **Date Imported:** 2026-02-12
- **Snapshot File:** `api-backend.cursorrules.txt`
- **Applied To:**
  - Root `/.cursorrules` → RESTful API principles, HTTP status codes
  - `/.cursor/rules/architecture.mdc` → Controllers/services separation, middleware patterns
  - `/.cursor/rules/google-apis.mdc` → API integration patterns (Chat, Firestore, Vertex AI, Workspace Events)
- **Modifications:** Expanded REST principles; added authentication/authorization patterns; included Google-specific API guidance

### 5. ESLint + Prettier Template

- **Source:** Created from industry best practices (awesome-cursorrules has framework-specific linting templates but not generic ESLint+Prettier)
- **Date Imported:** 2026-02-12
- **Snapshot File:** `eslint-prettier.cursorrules.txt`
- **Applied To:**
  - Root `/.cursorrules` → Code quality gates, formatting standards
  - `/.cursor/rules/code-style.mdc` → ESLint configuration, Prettier configuration, integration workflows
- **Modifications:** Original template based on ESLint recommended config and Prettier defaults for Node.js projects
- **Note:** _Template marked as "Original" - synthesized from ESLint/Prettier official docs_

### 6. Documentation Template

- **Source:** Created from JSDoc best practices and documentation standards (awesome-cursorrules lacks comprehensive documentation template)
- **Date Imported:** 2026-02-12
- **Snapshot File:** `documentation.cursorrules.txt`
- **Applied To:**
  - Root `/.cursorrules` → JSDoc requirements, README structure
  - `/.cursor/rules/documentation.mdc` → JSDoc syntax, inline comments, README sections, ADR format
- **Modifications:** Original template based on JSDoc official specification and documentation best practices
- **Note:** _Template marked as "Original" - created from JSDoc docs and README best practices_

### 7. Git Workflow Template

- **Source:** PatrickJS/awesome-cursorrules → `/rules/git-conventional-commit-messages/`
- **Date Imported:** 2026-02-12
- **Snapshot File:** `git-workflow.cursorrules.txt`
- **Applied To:**
  - Root `/.cursorrules` → Commit message format, conventional commits
  - `/.cursor/rules/workflow.mdc` → Git branching strategy, PR guidelines, versioning, code review process
- **Modifications:** Extended with branching strategy, PR templates, semantic versioning, and code review guidelines beyond just commit messages

## Template Mapping

| Template               | Root Section in /.cursorrules                    | Domain Rules Influenced           | Quality Standards |
| ---------------------- | ------------------------------------------------ | --------------------------------- | ----------------- |
| JavaScript/Node.js     | Project Facts, Async Patterns, Module System     | architecture.mdc, code-style.mdc  | A, D, G           |
| Google Cloud Functions | GCF Gen2 Specifics, Cold Start, Event Handling   | cloud-functions.mdc               | E, F              |
| Testing/Mocha          | Testing Requirements, Coverage Standards         | testing.mdc                       | B                 |
| API/Backend            | HTTP Handlers, RESTful Principles, Error Formats | architecture.mdc, google-apis.mdc | E, G              |
| ESLint+Prettier        | Code Quality Gates, Formatting Rules             | code-style.mdc                    | A                 |
| Documentation          | JSDoc, README, ADR                               | documentation.mdc                 | D                 |
| Git Workflow           | Commit Conventions, Branching                    | workflow.mdc                      | H                 |

**Quality Standards Legend:**

- A: Code Quality
- B: Testing
- C: Security
- D: Documentation
- E: Reliability
- F: Performance
- G: Maintainability
- H: Git & Workflow

## Original Rules (Not From awesome-cursorrules Templates)

### google-cloud-functions.cursorrules.txt

- **Rationale:** awesome-cursorrules lacks specific template for Google Cloud Functions gen2 with HTTP/Events triggers, cold start optimization, and Cloud Logging integration
- **Based On:** Official Google Cloud Functions documentation, GCP best practices guides, and gen2 migration guides
- **Label:** Sections marked with `<!-- ORIGINAL: GCP Official Documentation -->` in domain rules
- **Why Created:** Project uses GCF gen2 extensively; needed comprehensive serverless patterns not available in generic templates

### eslint-prettier.cursorrules.txt

- **Rationale:** awesome-cursorrules has framework-specific linting rules but not generic ESLint 9.x + Prettier 3.x integration
- **Based On:** ESLint official recommended config, Prettier default configuration, eslint-config-prettier integration guide
- **Label:** Sections marked with `<!-- ORIGINAL: ESLint/Prettier Official Docs -->` in domain rules
- **Why Created:** Project requires Node.js-specific linting standards with modern ESLint 9.x flat config compatibility

### documentation.cursorrules.txt

- **Rationale:** awesome-cursorrules lacks comprehensive documentation template covering JSDoc + README + ADR formats together
- **Based On:** JSDoc official specification, README best practices, ADR template format (Michael Nygard)
- **Label:** Sections marked with `<!-- ORIGINAL: Documentation Best Practices -->` in domain rules
- **Why Created:** Project needs living documentation that evolves with code; comprehensive template ensures consistency

### security.mdc (partial - to be created in Phase 2)

- **Rationale:** cwayassistant has dual OAuth2 flows (user + app authentication) specific to Google Workspace APIs
- **Based On:** Google Workspace OAuth2 documentation, security best practices for credentials.json handling
- **Label:** Sections marked with `<!-- ORIGINAL: cwayassistant-specific OAuth2 patterns -->` in domain rules
- **Why Created:** Unique authentication architecture not covered by generic security templates

### google-apis.mdc (partial - to be created in Phase 2)

- **Rationale:** Integration with Google Chat API + Workspace Events API + Vertex AI + Firestore is unique to this project
- **Based On:** Official API documentation for each service, integration patterns documentation
- **Label:** Sections marked with `<!-- ORIGINAL: cwayassistant-specific integration patterns -->` in domain rules
- **Why Created:** Specific combination of Google APIs requires custom integration guidance

## Template Source URLs

For reference and updates:

1. **JavaScript/Node.js:** https://github.com/PatrickJS/awesome-cursorrules/tree/main/rules/es-module-nodejs-guidelines-cursorrules-prompt-fil
2. **Google Cloud Functions:** N/A (original - based on https://cloud.google.com/functions/docs)
3. **Testing/Mocha:** Adapted from https://github.com/PatrickJS/awesome-cursorrules/tree/main/rules/jest-unit-testing-cursorrules-prompt-file
4. **API/Backend:** https://github.com/PatrickJS/awesome-cursorrules/tree/main/rules/nodejs-mongodb-cursorrules-prompt-file-tutorial
5. **ESLint+Prettier:** N/A (original - based on https://eslint.org/ and https://prettier.io/)
6. **Documentation:** N/A (original - based on https://jsdoc.app/)
7. **Git Workflow:** https://github.com/PatrickJS/awesome-cursorrules/tree/main/rules/git-conventional-commit-messages

## Update History

- **2026-02-12:** Initial bootstrap complete (v0.1)
  - 7 templates imported/created
  - 3 original templates created for gaps
  - 4 templates reused from awesome-cursorrules
  - All templates snapshotted in `/.cursor/imports/`

## Future Updates

When updating templates:

1. **Re-import from awesome-cursorrules:** Check if new versions available; compare with current snapshot; document changes
2. **Version increment:** Update "Bootstrap Version" above; tag git commit with version
3. **Document rationale:** Add entry to "Update History" with date, templates updated, and reason
4. **Refresh snapshots:** Replace `.cursorrules.txt` files with new content; preserve old version in `/.cursor/imports/archive/` if significant changes
5. **Update domain rules:** Propagate changes from templates to relevant `.mdc` files in `/.cursor/rules/`
6. **Test validation:** Run `npm run lint && npm run typecheck && npm test` to ensure rules don't break build
