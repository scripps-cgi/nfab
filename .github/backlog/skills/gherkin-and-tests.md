# Skill: Gherkin & Test Cases

## Purpose

Translate acceptance criteria into Gherkin and concrete test cases.

## Mandatory Rules

- Use Gherkin for multi-step UI flows
- Provide example inputs and expected outputs
- Map each AC to one or more test cases
- Include API-level test scenarios for server logic

## Preferred Patterns

Scenario: <short title>
Given <precondition>
When <action>
Then <expected result>

## Examples

Scenario: Reorder populates cart
Given user is logged in and has order #123
When user clicks Reorder on order #123
Then cart contains same items with original quantities
