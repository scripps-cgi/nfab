# How We Use Agents in Refinement

## Purpose

We use planning agents to support consistent, high-quality backlog refinement.

Agents help us:

- surface ambiguity and risk earlier
- improve testability and readiness
- make refinement outcomes explicit and repeatable

Agents do **not** replace human judgement or decision-making. They are used to
structure and document thinking, not to automate decisions.

---

## What an Agent Is

In this context, an agent is a **defined planning role** with an explicit purpose,
constraints, and expected outputs.

Agents:

- challenge stories in a consistent way
- highlight gaps, risks, and assumptions
- structure planning artefacts for reuse and review

Agents do **not**:

- design solutions
- invent requirements
- expand story scope
- make prioritisation or commitment decisions

Agent definitions are stored in `.github/agents` and are versioned and reviewed
like any other delivery artefact.

---

## Agents Used in Refinement

We currently use three agents during refinement.

### Story Challenger

**Purpose:**  
Validate that the story is clear, testable, and sufficiently understood.

**Responsibilities:**

- Assess clarity of user or business value
- Review acceptance criteria for testability
- Identify ambiguous or subjective language
- Surface assumptions, risks, and open questions

**Out of scope:**

- Proposing solutions
- Modifying or rewriting the story
- Creating new acceptance criteria

This agent helps answer:  
**“Do we clearly understand what is being asked?”**

---

### Test Strategist

**Purpose:**  
Define an appropriate, risk-based test approach for the story.

**Responsibilities:**

- Identify relevant test levels (unit, integration, end-to-end, UAT)
- Propose test scenarios aligned to acceptance criteria
- Highlight testability risks and constraints
- Identify environment or data considerations

**Out of scope:**

- Inventing requirements
- Assuming technical implementations
- Defining scenarios unrelated to acceptance criteria

This agent helps answer:  
**“How would this fail, and how would we detect that failure?”**

---

### Story Synthesiser

**Purpose:**  
Consolidate planning outputs into a single, decision-ready summary.

**Responsibilities:**

- Combine outputs from other agents
- Deduplicate questions and risks
- Make story readiness explicit (Ready / Not Ready)
- Present a neutral, factual planning summary

**Out of scope:**

- Resolving disagreements
- Adding judgement or recommendations
- Modifying story content

This agent helps answer:  
**“Is this story ready to be committed to a sprint?”**

---

## How Agents Are Used in Refinement

Agents support refinement; they do not replace discussion.

A typical flow is:

1. **Initial refinement discussion**
   - Humans review the story and identify early concerns

2. **Story Challenger**
   - Gaps, ambiguity, and assumptions are identified
   - The story is clarified or risks are explicitly accepted

3. **Test Strategist**
   - Test approach and scenarios are defined based on the refined story

4. **Story Synthesiser**
   - A consolidated planning summary is produced
   - Readiness is explicitly stated

Agents may be run selectively depending on story size, risk, and maturity.

---

## Definition of Ready

A story is considered _Ready_ when:

- Acceptance criteria are testable
- Open questions are resolved or explicitly accepted
- A test approach has been defined
- Key risks and dependencies are understood

The Story Synthesiser makes readiness explicit.  
The decision remains with the team.

---

## Governance and Evolution

- Agent definitions are versioned and reviewed via pull requests
- Behaviour changes must be explicit and intentional
- Agents should evolve as team practices mature
- Agents may be retired when they no longer add value

If an agent output appears incorrect or unhelpful, it should be challenged.

---

## Summary

Agents provide a shared, repeatable way to approach refinement.  
They improve consistency and transparency while keeping ownership with the team.

Their role is to **support good decisions, not to make them**.
