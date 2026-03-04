/**
 * Coverage lifecycle hooks
 * - Sanitizes identifiers to UPPERCASE on create/update
 * - Removes duplicate identifiers
 * - Rejects empty identifier arrays
 */
export default {
  beforeCreate(event: any) {
    sanitizeIdentifiers(event);
  },
  beforeUpdate(event: any) {
    sanitizeIdentifiers(event);
  },
};

function sanitizeIdentifiers(event: any) {
  const { data } = event.params;
  if (!Array.isArray(data.identifiers)) return;

  // Uppercase, trim, deduplicate
  const cleaned = [...new Set(
    data.identifiers
      .map((id: string) => String(id).trim().toUpperCase().replace(/\s+/g, '_'))
      .filter(Boolean)
  )];

  if (cleaned.length === 0) {
    throw new Error('Coverage must have at least one identifier.');
  }

  event.params.data.identifiers = cleaned;
}
