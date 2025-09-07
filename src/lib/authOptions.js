import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "./mongodb";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    // Google Sign-In
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Email & Password Login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db("RentHub");
        const users = db.collection("users");

        const user = await users.findOne({ email: credentials.email });
        if (!user) throw new Error("No user found with this email");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return { id: user._id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],

  callbacks: {
    // Save the user to the database if signing in with Google
    async signIn({ user, account }) {
      const client = await clientPromise;
      const db = client.db("RentHub");
      const users = db.collection("users");

      if (account.provider === "google") {
        const existingUser = await users.findOne({ email: user.email });
        if (!existingUser) {
          await users.insertOne({
            name: user.name,
            email: user.email,
            image: user.image || null,
            role: "renter", 
            createdAt: new Date(),
          });
        }
      }
      return true;
    },

    // Add role and id to the session
    async session({ session }) {
      const client = await clientPromise;
      const db = client.db("RentHub");
      const users = db.collection("users");

      const dbUser = await users.findOne({ email: session.user.email });
      session.user.role = dbUser?.role || "renter";
      session.user.id = dbUser?._id;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // use JWT strategy for session
  },
  pages: {
    signIn: "/login", // custom login page path
  },
};
