import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/firebaseAdmin';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.toLowerCase().trim();
        const password = credentials.password;

        // 1. Check Owner Hardcoded Account
        const ownerEmail = process.env.OWNER_EMAIL?.toLowerCase().trim();
        const ownerPassword = process.env.OWNER_PASSWORD;
        if (email === ownerEmail && ownerPassword && password === ownerPassword) {
          return {
            id: 'owner',
            name: 'Owner',
            email: ownerEmail,
            role: 'owner',
          };
        }

        // 2. Query Firestore 'users' collection
        try {
          const usersRef = db.collection('users');
          const snapshot = await usersRef.where('email', '==', email).limit(1).get();

          if (snapshot.empty) {
            return null;
          }

          const userDoc = snapshot.docs[0];
          const userData = userDoc.data();

          // Compare password using bcryptjs
          const isValid = await bcrypt.compare(password, userData.password);
          if (!isValid) {
            return null;
          }

          return {
            id: userDoc.id,
            name: userData.name,
            email: userData.email,
            role: userData.role || 'staff',
            staffCardId: userData.staffCardId || null,
          };
        } catch (error) {
          console.error('Error during authorize:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.staffCardId = user.staffCardId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.staffCardId = token.staffCardId;
        session.user.id = token.sub;
      }
      return session;
    }
  },
  events: {
    async signIn({ user }) {
      if (user && user.staffCardId !== undefined && user.staffCardId !== null) {
        const staffCardId = parseInt(user.staffCardId, 10);
        const { mockDb } = require('@/lib/mockData');
        const staffIndex = mockDb.staff.findIndex(s => s.id === staffCardId);
        if (staffIndex !== -1) {
          mockDb.staff[staffIndex].onShift = true;
        }

        // Log the clocked-on event to the Operations Feed
        if (!mockDb.operationsFeed) {
          mockDb.operationsFeed = [];
        }
        const opId = `OP-${Date.now()}`;
        mockDb.operationsFeed.unshift({
          id: opId,
          type: 'add',
          message: `${user.name} clocked on shift`,
          timestamp: new Date()
        });
      }
    }
  },

  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
