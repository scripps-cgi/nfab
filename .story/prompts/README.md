These prompts define standard agent workflows for working
against the imported Jira backlog.

Rules:

- Use exactly one prompt per agent invocation
- Do not modify prompts during execution
- Prompts operate only on imported Jira stories
- Prompts do not change scope or acceptance criteria
- Prompts are authoritative procedures.
- Agents must follow them exactly.
- Do not improvise or deviate.
- Each prompt includes mandatory rules that must be followed.
- If multiple prompts conflict, ask for clarification before proceeding.
- Each prompt includes a scope definition.
- Agents must confirm the scope before proceeding.
- Prompts may reference skills in `.story/skills`.
- Agents must read and follow all referenced skills.
- Agents must confirm which skills apply before proceeding.
