import express, {type Request,type Response,type NextFunction} from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import {errorMiddleware} from "@/shared/middlewares/errorMiddleware";
import taskRouter from "@/services/task/routes/task.routes";
import { ApiResponse } from "@/shared/utils/apiResponse";
import { pingDatabase } from "@/shared/config/database";
import { authHandler } from "@/shared/config/auth.server";
import { corsOrigin } from "@/shared/constants";

const app = express();

app.use(helmet())
app.use(morgan("dev"))
app.use(cors({
    origin:corsOrigin,
    credentials:true,
    methods:["GET",'PUT','POST','DELETE','PATCH'],
}))

// Better Auth reads the raw request body, so it must run before express.json().
app.all("/api/auth/*splat", authHandler);

app.use(express.json({limit:"2mb"}));
app.use(express.urlencoded({extended:true,limit:"2mb"}))

app.use("/api/v1/tasks", taskRouter);

app.get("/health", async (req:Request,res:Response,next:NextFunction)=>{
    const databaseStatus = (await pingDatabase()).state;
    
    const healthcheck = {
        databaseStatus,
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now()
    };
    res.status(200).json(ApiResponse.success(healthcheck,200,'health of project'))
    
});
app.use((req:Request,res:Response)=>{
    res.status(404).json(ApiResponse.error(null,404,`Route not found: ${req.method} ${req.originalUrl}`));
});
app.use(errorMiddleware);

export {app}
