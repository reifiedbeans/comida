import NextAuth, { NextAuthConfig } from "next-auth";
import Passage from "next-auth/providers/passage";
import { redirect } from "next/navigation";

const config = {
  basePath: "/auth",
  providers: [Passage({})],
  callbacks: {
    async jwt({ profile, token, trigger }) {
      if (profile?.sub) {
        token.passageUserId = profile.sub;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = `${token.passageUserId}`;
      return session;
    },
  },
} satisfies NextAuthConfig;

const { handlers, auth, signIn, signOut } = NextAuth(config);

type AuthorizedSession = {
  readonly user: {
    readonly id: string;
  };
};

async function ensureAuthorization(): Promise<AuthorizedSession> {
  const session = await auth();
  if (!session?.user?.id) redirect("/");
  return {
    user: {
      id: session.user.id,
    },
  };
}

export { auth, ensureAuthorization, handlers, signIn, signOut };
