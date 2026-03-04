/**
 * Article lifecycle hooks
 * - Auto-calculates readTime from blocks content (before create/update)
 * - ~200 words per minute average reading speed
 */
export default {
  beforeCreate(event: any) {
    autoReadTime(event);
  },
  beforeUpdate(event: any) {
    autoReadTime(event);
  },
};

function countWords(blocks: any[]): number {
  if (!Array.isArray(blocks)) return 0;
  let count = 0;
  for (const block of blocks) {
    if (Array.isArray(block.children)) {
      for (const child of block.children) {
        if (typeof child.text === 'string') {
          count += child.text.trim().split(/\s+/).filter(Boolean).length;
        }
      }
    }
  }
  return count;
}

function autoReadTime(event: any) {
  const { data } = event.params;
  // Only auto-calculate if readTime is not explicitly provided
  if (data.readTime != null) return;
  if (!Array.isArray(data.blocks) || data.blocks.length === 0) return;

  // Flatten all text blocks
  const allWords = data.blocks.reduce((total: number, block: any) => {
    if (block.__component === 'page-builder.text-block' && Array.isArray(block.content)) {
      return total + countWords(block.content);
    }
    return total;
  }, 0);

  // 200 wpm, minimum 1 minute
  event.params.data.readTime = Math.max(1, Math.round(allWords / 200));
}
