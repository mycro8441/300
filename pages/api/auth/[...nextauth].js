import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials';
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter'
import { Redis } from '@upstash/redis'
import { signIn } from 'next-auth/react';

//const redis = Redis.fromEnv()

export const authOptions = {
  // adapter: UpstashRedisAdapter(redis),
  providers: [
    CredentialsProvider({
      name:"Credentials",
      credentials:{
        email:{label:"Email", type:"email", placeholder:"이메일"},
        password:{label:"Password", type:"password"}
      },
      async authorize(credentials, req) {
        // get user from db
        const user = {};

        if(user) {
          return user;
        } else {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async session(session) {
      return {
        ...session.session,
        user: {
          ...session.user,
          role:
            process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(',').some(e => e.trim() === session.user.email)
              ? 'admin'
              : 'user'
        }
      }
    }
  },
  pages:{
    signIn:'/auth/login',
  },
  secret: process.env.JWT_SECRET,
  //database: 
}

export default NextAuth(authOptions)
