import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { db } from '@/lib/db';
import { getUserByEmail, createUser } from '@/lib/db-utils';
import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        isSignUp: { label: 'Is Sign Up', type: 'hidden' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const isSignUp = credentials.isSignUp === 'true';

        if (isSignUp) {
          const existingUser = await getUserByEmail(credentials.email);
          if (existingUser) {
            throw new Error('User already exists');
          }

          const hashedPassword = await bcrypt.hash(credentials.password, 12);

          const user = await createUser({
            email: credentials.email,
            name: credentials.name || 'User',
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatar,
          };
        } else {
          const user = await getUserByEmail(credentials.email);
          if (!user) {
            throw new Error('No user found');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatar,
          };
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};
