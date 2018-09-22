export function SoftBreak() {
  return {
    onKeyDown(event, change) {
      if (event.key !== 'Enter') return;
      if (event.shiftKey === false) return;
      return change.insertText('\n');
    }
  };
}
