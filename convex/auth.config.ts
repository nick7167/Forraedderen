export default {
  providers: [
    {
      // Set CLERK_JWT_ISSUER_DOMAIN in the Convex dashboard
      // (Settings -> Environment Variables) to your Clerk Frontend API URL,
      // i.e. the "Issuer" of the Clerk JWT template named "convex".
      // See https://docs.convex.dev/auth/clerk
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
