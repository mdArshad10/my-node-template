import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import type { Db, MongoClient } from "mongodb";

export type CreateAuthOptions = {
    /** Signing/encryption secret. Minimum 32 characters. */
    secret: string;
    /** Public base URL of the server, e.g. "http://localhost:3000". */
    baseURL: string;
    /** MongoDB database handle. Use `client.db()` to share one connection pool. */
    db: Db;
    /** Native client, required only for transactions. */
    client?: MongoClient;
    /** Mount point for the auth endpoints. Defaults to "/api/auth". */
    basePath?: string;
    /** Origins allowed to call the auth endpoints. */
    trustedOrigins?: string[];
    /** Enable MongoDB transactions (requires a replica set). Defaults to false. */
    transaction?: boolean;
    /** Email + password sign-up/sign-in. Enabled by default for the template. */
    emailAndPassword?: { enabled: boolean };
};

/**
 * Build a Better Auth instance from explicit values instead of reading the
 * environment, so the template can be imported and configured by any app.
 *
 * @example
 * const auth = createAuth({
 *     secret: process.env.AUTH_SECRET!,
 *     baseURL: "http://localhost:3000",
 *     db: client.db(),
 *     client,
 * });
 */
export const createAuth = ({
    secret,
    baseURL,
    db,
    client,
    basePath = "/api/auth",
    trustedOrigins,
    transaction = false,
    emailAndPassword = { enabled: true },
}: CreateAuthOptions) => {
    return betterAuth({
        secret,
        baseURL,
        basePath,
        trustedOrigins,
        emailAndPassword,
        database: mongodbAdapter(db, { client, transaction }),
    });
};

export type Auth = ReturnType<typeof createAuth>;
