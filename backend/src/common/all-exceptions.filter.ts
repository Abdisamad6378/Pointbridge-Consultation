import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';

function isExposedClientError(error: unknown): error is Error & { status: number } {
  const { status, expose } = (error ?? {}) as { status?: unknown; expose?: unknown };
  return error instanceof Error && expose === true && typeof status === 'number' && status >= 400 && status < 500;
}

// Global last-resort filter. HttpExceptions (validation, 401/403/404/409, throttling)
// already carry a client-safe message and pass through unchanged. Anything else —
// TypeORM QueryFailedError, driver errors, programming bugs — is logged in full on
// the server and answered with a generic 500 so SQL, table names and stack traces
// never reach the client.
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      response
        .status(exception.getStatus())
        .json(typeof body === 'string' ? { statusCode: exception.getStatus(), message: body } : body);
      return;
    }

    // Express body-parser errors (413 too large, 400 malformed JSON) are not HttpExceptions
    // but mark themselves safe to show with `expose: true`.
    if (isExposedClientError(exception)) {
      response.status(exception.status).json({ statusCode: exception.status, message: exception.message });
      return;
    }

    this.logger.error(
      `${request.method} ${request.originalUrl} failed`,
      exception instanceof Error ? exception.stack : String(exception),
    );
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Internal Server Error',
    });
  }
}
