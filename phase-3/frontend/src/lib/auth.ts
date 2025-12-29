import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { jwt } from "better-auth/plugins";

// Ensure we handle quotes if they were included in the .env file literally
const dbUrl = process.env.DATABASE_URL?.replace(/['"]/g, "");

export const auth = betterAuth({
  database: new Pool({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false
    }
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    jwt()
  ]
});
