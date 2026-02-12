# ADR 0001: Cursor Rules Bootstrap with Quality Standards

## Status
**Accepted** (2026-02-12)

## Context

cwayassistant is a Google Chat AI Assistant built with Node.js 22 and Google Cloud Functions gen2. The codebase lacked:

- Structured Cursor AI rules for consistent agent behavior
- Explicit quality standards and enforcement mechanisms
- Tooling configurations for linting, formatting, and type checking
- Living documentation that evolves with code changes
- Provenance tracking for where rules and patterns originated

The project needed a comprehensive bootstrap to establish these foundational elements while maintaining the existing architecture and codebase.

## Decision

Bootstrap a layered instruction system in 4 phases:

### Phase 1: Discovery & Import
- Import and reuse 7 fundamental templates from [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules)
- Snapshot each template to `/.cursor/imports/*.cursorrules.txt`
- Create comprehensive provenance tracking in `/.cursor/imports/PROVENANCE.md`

### Phase 2: Foundation
- Assemble root `/.cursorrules` by combining and deduplicating imported templates
- Expand imported guidance into 8 domain-specific rules in `/.cursor/rules/*.mdc`:
  - `architecture.mdc` - Controllers/services/model conventions
  - `code-style.mdc` - ESLint, Prettier, JSDoc standards
  - `testing.mdc` - Mocha patterns, coverage requirements
  - `cloud-functions.mdc` - GCF gen2 patterns, HTTP/Events triggers
  - `google-apis.mdc` - Chat API, Firestore, Vertex AI, Events API
  - `documentation.mdc` - JSDoc requirements, README maintenance
  - `security.mdc` - OAuth2 flows, credentials management
  - `workflow.mdc` - Git commits, branching, PR guidelines

### Phase 3: Documentation
- Migrate README.md to English (preserve Portuguese as README.pt-BR.md)
- Enhance README with improved diagrams:
  - Repository tree with inline descriptions
  - Mermaid flowchart for logical flow
  - Rules provenance section
- Create `AGENTS.md` as operating manual for developers and AI agents

### Phase 4: Tooling & Validation
- Add devDependencies: ESLint 9.x, Prettier 3.x, related plugins
- Add npm scripts: lint, format, format:check, typecheck, test:coverage
- Create tooling configs: `.eslintrc.json`, `.prettierrc.json`, `jsconfig.json`
- Install dependencies: `npm install` (0 vulnerabilities)
- Create this ADR to document decisions

### Quality Standards Framework

Established 8 quality standard categories:

| Category           | Standards                                                      | Enforced By                  |
| ------------------ | -------------------------------------------------------------- | ---------------------------- |
| A. Code Quality    | Complexity ≤10, naming conventions, async/await                | ESLint, Prettier             |
| B. Testing         | ≥70% overall, ≥90% services, Mocha structure                   | Mocha, nyc                   |
| C. Security        | No hardcoded secrets, OAuth2 best practices                    | Manual review, SAST          |
| D. Documentation   | JSDoc 100% public functions, README maintenance                | JSDoc checkJs, manual review |
| E. Reliability     | Error handling, retry logic (exponential backoff)              | Manual review, tests         |
| F. Performance     | Cold start <3s, caching, Firestore indexing                    | Manual review, monitoring    |
| G. Maintainability | Controllers/services/model pattern, DRY                        | Architecture rules           |
| H. Git & Workflow  | Conventional commits, PR reviews, semantic versioning          | Manual review                |

### Living Documentation Rules

Established requirement to update after every code change:
1. **README.md** - Update repo tree/flowchart if structure/flow changes
2. **package.json** - Update dependencies/scripts if changed
3. **/.cursor/rules/*.mdc** - Update if new patterns emerge
4. **/.cursor/imports/PROVENANCE.md** - Update if templates imported/updated

## Architecture Kept

**No breaking changes** to existing architecture:

- **Node.js 22** - LTS runtime (compatible with GCF gen2)
- **Controllers/services/model pattern** - Maintained existing three-layer separation
- **npm package manager** - No migration to pnpm/yarn
- **Mocha testing framework** - No migration to Jest
- **Existing dependencies** - All maintained, only devDependencies added

## Tooling Added

### ESLint 9.x
- **Config:** `.eslintrc.json` with `eslint:recommended` + `prettier` extends
- **Rules:** `no-unused-vars`, `no-var`, `prefer-const`, `eqeqeq`, `curly`, etc.
- **Scripts:** `npm run lint` (check), `npm run lint:fix` (auto-fix)

### Prettier 3.x
- **Config:** `.prettierrc.json` with `singleQuote: true`, `semi: true`, `trailingComma: "es5"`
- **Scripts:** `npm run format` (auto-format), `npm run format:check` (dry run)

### JSDoc + TypeScript checkJs
- **Config:** `jsconfig.json` with `checkJs: true`, `target: "ES2022"`
- **Requirement:** JSDoc on 100% of public functions with @param, @returns, @throws
- **Scripts:** `npm run typecheck` (validate JSDoc types)

### Coverage Reporting
- **Tool:** nyc (Istanbul)
- **Scripts:** `npm run test:coverage`
- **Targets:** ≥70% overall, ≥90% services

## Provenance Tracking

### Templates Reused (from awesome-cursorrules)
1. **JavaScript/Node.js** - ES Module patterns, async/await
2. **API/Backend** - RESTful principles, HTTP status codes
3. **Testing/Mocha** (adapted from Jest) - Test structure, mocking
4. **Git Workflow** - Conventional commits

### Templates Created (Original)
1. **Google Cloud Functions** - GCF gen2 patterns, cold start optimization
2. **ESLint + Prettier** - Code quality standards
3. **Documentation** - JSDoc, README, ADR formats
4. **Security** - Dual OAuth2 flows (cwayassistant-specific)
5. **Google APIs** - Chat, Firestore, Vertex AI, Events API (cwayassistant-specific)

Full mapping documented in: `/.cursor/imports/PROVENANCE.md`

## Consequences

### Positive
- **Consistent AI agent behavior** - Explicit rules prevent inconsistent code generation
- **Automated quality enforcement** - ESLint/Prettier/JSDoc catch issues before commit
- **Improved developer experience** - Clear standards, auto-fix, pre-commit validation
- **Traceable decisions** - Provenance system shows where rules originated
- **Living documentation** - README/AGENTS stay in sync with code
- **Reduced cognitive load** - Agents and developers follow same standards

### Negative
- **Initial overhead** - ~17 new files created during bootstrap
- **Maintenance burden** - Rules and provenance must be updated over time
- **Learning curve** - Team must learn Cursor rules system and quality framework
- **Slower commits initially** - Quality gates (lint/format/typecheck/test) add time

### Mitigation Strategies
- **AGENTS.md provides clear guidance** - "When to Ask vs Assume" reduces uncertainty
- **Quality validation automated** - `npm run lint && npm run format:check && npm run typecheck && npm test`
- **Living updates rule explicit** - Clear when/how to update README, package.json, rules
- **Provenance simplifies updates** - Template history makes rule evolution transparent
- **Pre-commit hooks optional** - Can automate quality gates with husky/lint-staged in future

## Alternatives Considered

### Alternative 1: No Cursor rules, rely on code review only
**Rejected because:**
- Inconsistent AI agent behavior across sessions
- No automated enforcement of standards
- Review fatigue from catching same issues repeatedly
- Onboarding slower without explicit guidelines

### Alternative 2: TypeScript migration instead of JSDoc
**Rejected because:**
- Too disruptive for existing JavaScript codebase
- Requires rewriting all files with type annotations
- Higher learning curve for team
- JSDoc + checkJs provides 80% of benefits with 20% of effort

### Alternative 3: Use existing template without customization
**Rejected because:**
- No single template covers Node.js + GCF + Google APIs + dual OAuth2
- cwayassistant has unique patterns requiring original rules
- Provenance tracking requires snapshot and adaptation

### Alternative 4: Create all original rules, no template reuse
**Rejected because:**
- Reinventing the wheel for common patterns (JavaScript, testing, git)
- Loses benefit of community-vetted templates
- More time-consuming than reuse-first approach

## Future Considerations

### Potential Enhancements
1. **Pre-commit hooks** - Automate quality gates with husky + lint-staged
2. **CI/CD pipeline** - GitHub Actions for automated testing on PRs
3. **Coverage enforcement** - Fail builds if coverage <70%
4. **Dependency updates** - Renovate/Dependabot for automated updates
5. **Rules versioning** - Semantic versioning for rules (v0.1 → v0.2 on breaking changes)
6. **TypeScript migration** - Gradual migration if type safety becomes critical

### Review Schedule
- **Quarterly:** Review and update quality standards
- **Per major feature:** Check if new patterns require rule updates
- **Annually:** Re-import templates from awesome-cursorrules to get updates

## References

- [Cursor Rules Bootstrap Plan](/.cursor/plans/bootstrap_cursor_rules_node.js_*.plan.md)
- [Rules Provenance](/.cursor/imports/PROVENANCE.md)
- [Domain Rules](/.cursor/rules/)
- [AGENTS.md Operating Manual](/AGENTS.md)
- [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules)

---

**Decision Date:** 2026-02-12  
**Implemented By:** Cursor AI Agent (autonomous mode)  
**Status:** Accepted and implemented  
**Next Review:** 2026-05-12 (3 months)
