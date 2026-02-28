import mongoose from 'mongoose';

// ----------------------------------------------------------------
// Singleton Mongoose connection — safe for Next.js hot-reload.
// The connection is cached on the `global` object so it is reused
// across module re-evaluations in development.
// ----------------------------------------------------------------

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    'Please define MONGODB_URI in your .env.local file. See .env.example for reference.'
  );
}

// Extend the Node.js global to hold the cached connection.
declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const cached = global._mongooseConn ?? { conn: null, promise: null };
global._mongooseConn = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}
