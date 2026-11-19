import { toNodeHandler } from "better-auth/node";
import type { RequestHandler } from "express";
import mongoose from "mongoose";
import { createAuth, type Auth } from "@/shared/config/auth";
import { env } from "@/shared/config/env";
import { corsOrigin } from "@/shared/constants";

let authInstance: Auth | null = null;
let nodeHandler: ReturnType<typeof toNodeHandler> | null = null;

/**
 * Auth instance wired to this app's env vars and the shared Mongoose
 * connection. Created lazily because the connection does not exist at import
 * time.
 */
export const getAuth = (): Auth => {
    if (authInstance) {
        return authInstance;
    }

    const client = mongoose.connection.getClient();
    if (!client) {
        throw new Error(
            "Auth requires an active MongoDB connection. Call connectDatabase() before handling requests.",
        );
    }

    authInstance = createAuth({
        secret: env.BETTER_AUTH_SECRET,
        baseURL: env.BETTER_AUTH_URL,
        db: client.db(),
        client,
        trustedOrigins: corsOrigin,
    });

    return authInstance;
};

/** Express handler that serves every Better Auth endpoint under basePath. */
export const authHandler: RequestHandler = (req, res, next) => {
    nodeHandler ??= toNodeHandler(getAuth());
    void nodeHandler(req, res).catch(next);
};
