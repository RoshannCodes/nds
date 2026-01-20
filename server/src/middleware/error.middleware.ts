import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse } from '../utils/response';
import { ApiError } from '../utils/errors';
import { ZodError } from 'zod';

/**
 * Global error handler middleware
 * Handles all errors thrown in the application
 */
export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Handle Zod validation errors
    if (err instanceof ZodError) {
        const errors = err.issues.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }));
        console.log('Validation errors:', errors);
        return sendErrorResponse(res, 'Validation error', 400);
    }

    // Handle custom API errors
    if (err instanceof ApiError) {
        return sendErrorResponse(res, err.message, err.statusCode);
    }

    // Handle unknown errors
    console.error('Unhandled error:', err);
    return sendErrorResponse(res, 'Internal server error', 500);
}

/**
 * 404 handler middleware
 */
export function notFoundHandler(req: Request, res: Response) {
    return sendErrorResponse(res, `Route ${req.method} ${req.path} not found`, 404);
}
