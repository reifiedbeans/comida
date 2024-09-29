abstract class ApplicationError extends Error {
  public abstract readonly statusCode: number;

  protected constructor(
    public readonly internalMessage: string,
    public readonly externalMessage: string,
  ) {
    super(internalMessage);
  }
}

export class BadRequestError extends ApplicationError {
  readonly statusCode = 400;

  constructor(internalMessage: string, externalMessage?: string) {
    super(internalMessage, externalMessage ?? "The request submitted is invalid");
  }
}

export class InternalServerError extends ApplicationError {
  readonly statusCode = 500;

  constructor(internalMessage: string, externalMessage?: string) {
    super(internalMessage, externalMessage ?? "Something went wrong. Please try again later.");
  }
}
