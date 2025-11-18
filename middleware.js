import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/home",
    "/wizard",
    "/profile",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
