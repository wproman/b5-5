import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

interface EnvConfig {
  port: string ;
  database_url: string ;
  node_env: string  ;
  secret_key: string ;
  jwt_expiration?: string ;
  superAdminEmail?: string ;
  superAdminPassword?: string;
  superAdminName?: string  ;
  superAdminRole?: string ;

JWT_REFRESH_SECRET?: string ;
JWT_REFRESH_EXPIRATION?: string;
GOOGLE_CLIENT_ID ?: string;
GOOGLE_CLIENT_SECRET ?:string
GOOGLE_CALLBACK_URL?: string
EXPRESS_SESSION_SECRET ?: string
FRONTEND_URL: string

}


export const envVars: EnvConfig = {
  port: process.env.PORT as string  ,
  database_url: process.env.DATABASE_URL as string ,
  node_env: process.env.NODE_ENV as string,
  secret_key: process.env.JWT_SECRET as string,
  jwt_expiration: process.env.JWT_EXPIRATION,
  superAdminEmail: process.env.SuperAdminEmail,
  superAdminPassword: process.env.SuperAdminPassword,
  superAdminName: process.env.SuperAdminName,
  superAdminRole: process.env.SuperAdminRole,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
EXPRESS_SESSION_SECRET : process.env.EXPRESS_SESSION_SECRET,
FRONTEND_URL: process.env.FRONTEND_URL as string

};
