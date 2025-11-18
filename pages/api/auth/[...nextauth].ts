import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { ensureProfileForSessionUser } from "@/lib/profiles";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session }) {
      if (!session?.user) {
        return session;
      }

      try {
        const profile = await ensureProfileForSessionUser(session.user);
        if (profile && session.user) {
          session.user.id = profile.id;
          session.user.role = profile.role;
        }
      } catch (error) {
        console.error("Failed to sync profile with database", error);
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/dashboard`;
      }

      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      try {
        const target = new URL(url);
        if (target.origin === baseUrl) {
          return url;
        }
      } catch {
        return baseUrl;
      }

      return baseUrl;
    },
  },
  events: {
    async signIn({ user }) {
      try {
        await ensureProfileForSessionUser(user);
      } catch (error) {
        console.error("Failed to persist profile on sign-in", error);
      }
    },
  },
};

export default NextAuth(authOptions);
