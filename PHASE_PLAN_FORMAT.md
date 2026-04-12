# 🎯 PHASE-BASED DEVELOPMENT PLAN FORMAT
## Aksesa - Task Breakdown for AI Agents

---

## 📐 Template Structure for Each Phase

Setiap phase memiliki struktur standar agar mudah di-assign ke AI agents:

```
# Phase [N]: [Name]

**Duration**: [X weeks]  
**Target Completion**: [Date]  
**Dependencies**: [Previous phases/external tasks]  
**Success Criteria**: [Measurable outcomes]  

## Overview
[Brief description of phase goals and impact]

## Components

### Component 1: [Name]
**Status**: [Not Started / In Progress / Complete]  
**Owner**: [Agent/Person name]  
**Est. Time**: [X days]

#### Tasks
- [ ] Task 1.1 - [Detailed description]
  - **What**: Specific action
  - **Why**: Business/technical reason
  - **How**: Approach/tools to use
  - **Acceptance Criteria**: How to verify completion
  
- [ ] Task 1.2 - [Detailed description]
  - **What**: ...
  
#### Deliverables
- [ ] [Specific output/artifact]
- [ ] [Code/documentation/feature]

#### Technical Details
- **Technologies**: [Tools/libraries]
- **Dependencies**: [Other tasks/components]
- **Testing**: [How to test]

---

## Quality Gates
- [ ] All acceptance criteria met
- [ ] Code reviewed
- [ ] Tests passing
- [ ] Documentation complete

## Rollover Items
[Items moving to next phase, if any]
```

---

## 🔄 Checklist for AI Agent Execution

Setiap task harus memenuhi:

```
BEFORE START:
[ ] Read this entire phase document
[ ] Understand all dependencies
[ ] Clarify unclear requirements (ask in PR comments)
[ ] Check if previous tasks are complete

DURING EXECUTION:
[ ] Create feature branch: `feature/phase-[N]-component-[X]`
[ ] Commit frequently with meaningful messages
[ ] Update task status in markdown
[ ] Follow .agents/rules/general.instructions.md

BEFORE SUBMITTING:
[ ] All acceptance criteria met
[ ] Code follows repository style
[ ] Tests written and passing
[ ] Documentation updated
[ ] Commit message includes Co-authored-by trailer

SUBMISSION:
[ ] Create Pull Request with:
    - Phase and component name in title
    - Link to this document
    - Checklist of completed tasks
    - Test results/screenshots if applicable
    - Any blockers or notes
```

---

## ✅ Task Atomicity Rules

Setiap task harus:

1. **Self-contained** - Bisa dikerjain tanpa task lain (kecuali dependencies jelas)
2. **Measurable** - Ada acceptance criteria yang jelas
3. **Achievable** - Bisa selesai dalam 1-2 hari kerja
4. **Testable** - Ada cara untuk verify completion
5. **Documented** - Clear what, why, dan how

---

## 📋 Status Labels

Gunakan di setiap task:
- `[ ]` - Not Started
- `[WIP]` - Work In Progress
- `[BLOCKED]` - Blocked (note reason)
- `[✓]` - Complete
- `[REVIEW]` - Awaiting Review

---

## 🔗 Dependencies Format

Format untuk dependencies:

```
**Blocks**: Phase X > Component Y > Task Z  
**Blocked By**: Phase X > Component Y > Task Z  
**Related To**: Phase X > Component Y > Task Z
```

---

Sekarang saya akan bikin Phase 2 dengan format ini untuk bisa langsung di-assign ke agents!
