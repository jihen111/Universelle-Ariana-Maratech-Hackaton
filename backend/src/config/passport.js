import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import { query } from './database.js';
import dotenv from 'dotenv';

dotenv.config();

// Local Strategy for email/password login
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        // Find user by email
        const users = await query(
          'SELECT * FROM users WHERE email = ?',
          [email]
        );

        if (users.length === 0) {
          return done(null, false, { message: 'Email ou mot de passe incorrect' });
        }

        const user = users[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return done(null, false, { message: 'Email ou mot de passe incorrect' });
        }

        // Update last signed in
        await query(
          'UPDATE users SET last_signed_in = CURRENT_TIMESTAMP WHERE id = ?',
          [user.id]
        );

        // Remove password from user object
        delete user.password;

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// JWT Strategy for protected routes
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your_super_secret_jwt_key'
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      // Find user by ID from JWT payload
      const users = await query(
        'SELECT id, email, name, role, phone, avatar, bio, is_verified, created_at FROM users WHERE id = ?',
        [payload.id]
      );

      if (users.length === 0) {
        return done(null, false);
      }

      return done(null, users[0]);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
