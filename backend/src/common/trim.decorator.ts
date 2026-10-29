import { Transform } from 'class-transformer';

export const Trim = () => Transform(({ value }) => (typeof value === 'string' ? value.trim() : value));

// Turns "" into null so optional text fields are stored as NULL rather than empty strings.
export const TrimToNull = () =>
  Transform(({ value }) => (typeof value === 'string' ? value.trim() || null : value));
