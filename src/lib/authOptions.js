import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "./mongodb";
import bcrypt from "bcryptjs";

async function getUserRole(email) {
    const client = await clientPromise;
    const db = client.db('RentHub');
    const user = await db.collection('users').findOne({ email });
    return user?.role || 'renter';
}

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

        // Generic "Invalid credentials" message to prevent user enumeration
        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(), 
          email: user.email,
          role: user.role,
          // name: user.name
        };
      },
    }),
  ],

  callbacks: {
    // This callback runs when a user signs in with Google
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const client = await clientPromise;
        const db = client.db("RentHub");
        const users = db.collection("users");

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

    // This callback adds the user's role and id to the JWT token
    async jwt({ token, user }) {
      // The "user" object is only available on the first sign-in
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      if (token.email) {
          token.role = await getUserRole(token.email);
      }
      return token;
    },

    // This callback reads the role and id from the JWT token
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = await getUserRole(token.email);
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};