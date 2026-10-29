import { Throttle } from '@nestjs/throttler';

const MINUTE = 60_000;

// Stricter per-route limits layered over the global default in AppModule.
// Keyed per client IP; 429 responses include Retry-After.
export const AuthRateLimit = () => Throttle({ default: { limit: 10, ttl: MINUTE } });
export const SignupRateLimit = () => Throttle({ default: { limit: 5, ttl: 10 * MINUTE } });
export const ProfileWriteRateLimit = () => Throttle({ default: { limit: 20, ttl: 10 * MINUTE } });
export const PublicFormRateLimit = () => Throttle({ default: { limit: 5, ttl: 10 * MINUTE } });
