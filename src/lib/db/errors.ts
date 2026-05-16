export function isDatabaseUnavailableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const details = error as { name?: unknown; message?: unknown };
  const name = typeof details.name === 'string' ? details.name : '';
  const message = typeof details.message === 'string' ? details.message : '';

  return (
    name === 'MongooseServerSelectionError' ||
    /could not connect to any servers|server selection timed out|ip.*whitelist|atlas cluster/i.test(message)
  );
}