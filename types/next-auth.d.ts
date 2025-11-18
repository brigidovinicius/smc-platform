import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { ProfileRole } from "@/lib/profiles";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      id?: string;
      role?: ProfileRole;
    };
  }

  interface User extends DefaultUser {
    id?: string;
    role?: ProfileRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: ProfileRole;
  }
}
