import { cleanEnv, port, str } from "envalid";

export const env = cleanEnv(process.env, {
    // Environment.
    NODE_ENV: str({ choices: ["development", "test", "production"] }),
    // Authorization.
    AUTH_JWT_SECRET: str(),
    // Database.
    RDS_DB_HOST: str({ default: "localhost" }),
    RDS_DB_PORT: port({ default: 3306 }),
    RDS_DB_NAME: str(),
    RDS_DB_USER: str({ default: "root" }),
    RDS_DB_PASS: str(),
    // Queue.
    SQS_REGION: str({ default: "eu-west-1" }),
    SQS_ACCOUNT_ID: str({ default: "667195356930" }),
    SQS_QUEUE_NAME: str(),
});
