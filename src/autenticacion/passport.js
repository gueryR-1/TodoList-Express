const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const Usuario = require('../modelos/usuario.modelo');

const opcionesJwt = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(
  new JwtStrategy(opcionesJwt, async (payload, done) => {
    try {
      const usuario = await Usuario.findById(payload.id).select('-password');

      if (!usuario) {
        return done(null, false);
      }

      return done(null, usuario);
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;