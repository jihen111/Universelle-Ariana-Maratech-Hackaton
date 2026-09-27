import passport from '../config/passport.js';

// Authenticate user with JWT
export function authenticate(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Erreur d\'authentification'
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé - Token invalide ou expiré'
      });
    }

    req.user = user;
    next();
  })(req, res, next);
}

// Check if user has specific role
export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès interdit - Permissions insuffisantes'
      });
    }

    next();
  };
}

// Optional authentication (doesn't fail if no token)
export function optionalAuth(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
}
