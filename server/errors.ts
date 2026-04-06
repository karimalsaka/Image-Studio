import logger from './logger';

/**
 * An error whose message is safe to show to the user.
 * Throw this from anywhere in the server when the message is user-facing.
 * All other errors get replaced with a generic fallback.
 */
export class AppError extends Error {
    status: number;

    constructor(message: string, status = 500) {
        super(message);
        this.name = 'AppError';
        this.status = status;
    }
}

/**
 * Returns a user-safe error message and status code.
 * - AppError: pass message through as-is
 * - Everything else: log the real error, return a generic message
 */
export function toErrorResponse(error: unknown, fallback: string) {
    if (error instanceof AppError) {
        return { status: error.status, message: error.message };
    }
    logger.error(fallback, { error });
    return { status: 500, message: fallback };
}
