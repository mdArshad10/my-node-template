import type { ConnectOptions } from "mongoose";

export const corsOrigin: string[] = ["http://localhost:5173"];

export const connectionOptions: ConnectOptions = {
    serverSelectionTimeoutMS: 5_000,
    connectTimeoutMS: 10_000,
    socketTimeoutMS: 45_000,
};
