# Pitfall pack: runbook

*Type-specific traps for runbook drafting. Loaded after WRITING-RULES.md. STYLE-GUIDE.md wins where it conflicts.*

## Audience and stakes

A runbook is read by someone tired, paged at 3am, and under pressure. Optimize for clarity over elegance.

- Marketing language ("seamless", "robust", "world-class"). Cut.
- Friendly conversational asides ("Now, this is the fun part!"). Cut.
- Backstory or history of the system in step bodies. Move to a separate "Context" section.
- Caveats stacked before the action ("Note that in some cases, depending on configuration, you may want to..."). Lead with the action; put caveats after.

## Imperative mood

- Passive voice in steps ("The service should be restarted"). Use active imperative: "Restart the service."
- "We" or "you" mood mixed in the same procedure. Pick one and hold it.
- Conditional verbs disguised as direction ("you might want to consider"). Be direct: "Run X if Y."

## Ambiguity traps

- "Run the script": which script, where, with what flags. Always name the file path and exact command.
- "Restart the service": which service, on which host, with which command.
- "Check the logs": which log, at what path, looking for what string.
- Pronouns without clear antecedents ("it should now be running"). Replace with the noun.
- "Simply" and "just". They are lies told to the reader and signal you have not thought through the step.

## Missing preconditions

Every procedure should declare:
- What state the system must be in before starting
- What credentials, tooling, or access the operator needs
- What environment variables or config must be set
- What other procedures must have completed first

If any of these are missing, the runbook fails the moment someone less senior runs it.

## Verification and rollback

- Steps that change state with no verification step after. Always include "Verify by..." with an exact command and expected output.
- Procedures with no rollback section. Every change-step needs an undo.
- "If something goes wrong, contact X." Inadequate. Spell out the diagnostic flow.

## Ordering pitfalls

- Steps presented as an unordered list when order is required. Number them.
- Steps that bury the destructive action mid-list. Flag destructive steps with a clear warning.
- Steps that branch ("If X, do A; if Y, do B") without a labeled decision point. Use a decision header.

## Stock phrases to avoid

- "Should work"
- "Usually"
- "Most of the time"
- "Try"
- "It depends"

These are the language of guessing. Replace with conditions and exact commands.

## Closing pitfalls

- A "conclusion" section. Runbooks have no conclusion.
- A "thanks for reading" tone. The reader is mid-incident.
- A version stamp without a changelog. Date and reason for last revision belong at the top.
