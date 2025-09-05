/**
 * Minimal seeding entry point.
 * Ensures admin employee exists by invoking create-admin script.
 * The underlying script handles idempotency.
 */
import './scripts/create-admin';
