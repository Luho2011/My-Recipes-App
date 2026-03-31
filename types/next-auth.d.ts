import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // so kennt TS jetzt .id überall
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}