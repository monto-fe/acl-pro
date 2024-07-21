import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

console.log("current environment is", process.env.NODE_ENV)

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { 
    NODE_ENV, PORT, DB_HOST, DB_PORT, DB_USER="root", 
    DB_PASSWORD, DB_DATABASE="uacl", 
    LOG_FORMAT, LOG_DIR, ORIGIN,
    SECRET_ID, SECRET_KEY,
    BUCKET_NAME, BUCKET_REGION
} = process.env;
