class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message || 'Unauthorized.');
  }
}

export { UnauthorizedError }