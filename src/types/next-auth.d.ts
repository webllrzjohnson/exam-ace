import "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    id?: string;
    subscriptionTier?: string;
  }

  interface Session {
    user: {
      id?: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role?: string;
      subscriptionTier?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string;
    subscriptionTier?: string;
  }
}
