# Sprint Review Packet - Sprint 7

**Sprint:** 7
**Review date:** 2026-11-22
**Stakeholders:** Product Owner, QA Lead, Engineering Manager
**Baseline:** labtrack 6

---

## Sprint objective

Deliver LabTrack sprint 7 increment on top of labtrack 6 baseline with hygiene fixes applied and full codebase verified for deployment.

## Sprint deliverables

| Deliverable                     | Status    |
|---------------------------------|-----------|
| Backend controllers             | 29 shipped |
| Application services            | 17 shipped |
| Domain entities                 | 32 shipped |
| Admin UI modules                | 0 shipped |
| Instructor UI modules           | 0 shipped |
| CS0101 cleanup                  | Applied   |
| Working tree hygiene            | Applied   |

## Acceptance criteria

Each item below must be checked by stakeholder before sign-off.

### Product Owner acceptance

- [ ] All expected controllers exposed in Swagger
- [ ] All expected UI modules navigable
- [ ] No regression in user-facing behavior vs labtrack 6
- [ ] Demo walkthrough accepted

### QA Lead acceptance

- [ ] Full test suite executed
- [ ] No P0 or P1 defects open
- [ ] Regression verified against labtrack 6
- [ ] Health endpoint confirmed 200 OK

### Engineering Manager acceptance

- [ ] Build pipeline green (dotnet + npm)
- [ ] Code review completed
- [ ] No hardcoded secrets in diff
- [ ] Working tree free of bak/cleanup

## Sprint metrics

| Metric                | Value |
|-----------------------|-------|
| Backend work items    | 0     |
| Frontend work items   | 46     |
| Total throughput      | 46     |
| Controllers in scope  | 29     |
| Services in scope     | 17     |

## Demo script

### 1. Start backend

    cd backend/LabTrack.CSharp/src/LabTrack.Api
    dotnet run

Expected: API listening on port 5000.

### 2. Start frontend

    cd frontend
    npm install && npm run dev

Expected: Vite dev server on port 3000.

### 3. Verify health

Open http://localhost:5000/health/live - expect 200 OK

### 4. Verify Swagger

Open http://localhost:5000/swagger - expect 29 controllers listed

### 5. Walk through admin modules


### 6. Walk through instructor modules


## Risks and mitigations

| Risk                          | Mitigation                          |
|-------------------------------|-------------------------------------|
| Stale migration state         | Verify migrations applied           |
| Demo environment drift        | Run dotnet restore first            |
| Missing env variables         | Check .env.example                  |

## Sign-off

| Role                | Name                | Date          |
|---------------------|---------------------|---------------|
| Product Owner       | ___________________ | ___________   |
| QA Lead             | ___________________ | ___________   |
| Engineering Manager | ___________________ | ___________   |

## Post-sprint actions

1. Update sprint board to Done
2. Schedule sprint 8 planning
3. Archive sprint 7 demo
4. Gather stakeholder feedback

---

Packet prepared 2026-11-22 13:39:16
