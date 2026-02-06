# Accessibility Testing Guidelines

## Purpose

This document defines accessibility testing guidelines to be used when
analyzing user stories and defining test strategies and test cases.

The goal is to ensure features are **usable by people with disabilities**
and align with **WCAG 2.1 AA** standards unless otherwise specified.

These guidelines apply to **web and mobile user interfaces**.

---

## When to Apply Accessibility Testing

Accessibility testing MUST be considered when a user story involves:

- User interfaces (UI)
- Forms or data input
- Navigation or menus
- Interactive components (buttons, links, modals)
- Content consumption (text, images, media)
- Authentication or error handling
- Any feature used directly by end users

If a user story has _no UI_, accessibility testing may be marked **out of scope**.

---

## Core Accessibility Principles (POUR)

All accessibility testing should align with the four WCAG principles:

### Perceivable

Users must be able to perceive the information presented.

### Operable

Users must be able to operate the interface.

### Understandable

Users must be able to understand the information and UI behavior.

### Robust

Content must be compatible with assistive technologies.

---

## Accessibility Test Coverage Areas

### 1. Keyboard Accessibility

- All interactive elements are reachable via keyboard
- Logical and visible focus order
- No keyboard traps
- Actions possible using Enter / Space

### 2. Screen Reader Compatibility

- Proper semantic HTML (headings, landmarks, lists)
- Meaningful labels for form fields
- Buttons and links announce correct role and name
- Dynamic content updates announced appropriately

### 3. Forms & Inputs

- All inputs have associated labels
- Required fields clearly indicated
- Error messages are:
  - Descriptive
  - Programmatically associated with inputs
- Instructions are not color-only

### 4. Visual Design & Contrast

- Text contrast meets WCAG AA minimums:
  - Normal text: 4.5:1
  - Large text: 3:1
- UI elements are distinguishable without relying on color alone
- Content remains usable when zoomed to 200%

### 5. Images & Media

- Informative images have meaningful alt text
- Decorative images use empty alt attributes
- Video content includes captions
- Audio-only content includes transcripts

### 6. Navigation & Structure

- Consistent navigation across pages
- Clear page titles and headings
- Headings follow a logical hierarchy
- Skip navigation links available where applicable

### 7. Error Handling & Feedback

- Errors are clearly described
- Error messages suggest how to fix the issue
- Success and status messages are accessible to assistive technologies

---

## Accessibility Test Scenarios (Examples)

- Navigate the entire feature using keyboard only
- Complete form submission using a screen reader
- Identify and correct errors without visual cues
- Use the feature at 200% zoom
- Use the feature with high-contrast mode enabled

---

## Accessibility Testing Techniques

- Manual exploratory testing with keyboard only
- Screen reader testing (e.g., NVDA, VoiceOver)
- Browser accessibility tree inspection
- Automated tools (supporting, not replacing, manual testing)

---

## Accessibility Risk Indicators

Accessibility testing should be prioritized when:

- The feature is customer-facing
- The feature is business-critical
- The feature handles authentication or payments
- The feature introduces new UI components
- The feature replaces existing functionality

---

## Reporting & Traceability

When accessibility testing is in scope:

- Include accessibility-specific test scenarios
- Tag test cases as **Accessibility**
- Reference relevant WCAG success criteria where applicable

---

## Assumptions & Constraints

- WCAG 2.1 Level AA is the default compliance target
- Accessibility testing supplements, but does not replace, usability testing
- Accessibility defects are considered **functional defects**, not cosmetic

---

## Output Expectations for Copilot Agents

When using this skill:

- Explicitly include accessibility coverage in the test strategy
- Add dedicated accessibility test scenarios
- Flag accessibility risks or unknowns
- Clearly state when accessibility testing is out of scope and why
