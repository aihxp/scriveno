const NEXT_COMMANDS_CONTRACT_HEADING = 'Next commands:';

const GENERATED_NEXT_COMMANDS_CONTRACT = `Next commands:
- /scr:next: Inspect the project state and choose the safest next step.
- /scr:help: Show available Scriveno commands for the active work type.
- /scr:progress: Show current project progress.`;

function hasNextCommandsContract(content) {
  return typeof content === 'string' && /^Next commands:\s*$/m.test(content);
}

function ensureNextCommandsContract(content) {
  const source = typeof content === 'string' ? content : String(content || '');
  if (hasNextCommandsContract(source)) return source;
  return `${source.trimEnd()}\n\n${GENERATED_NEXT_COMMANDS_CONTRACT}\n`;
}

module.exports = {
  NEXT_COMMANDS_CONTRACT_HEADING,
  GENERATED_NEXT_COMMANDS_CONTRACT,
  hasNextCommandsContract,
  ensureNextCommandsContract,
};
