module.exports = {
    user1: function (req, res, next) {
      if (global.tipoUsuario == "user") {
        return next();
      } else {
        const aparecer = 'Acesso apenas para usuários devidamente logados'
        res.render('login',{aparecer})
      }
    }
  };
  