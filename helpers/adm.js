module.exports = {
  adm1: function (req, res, next) {
    if (global.tipoUsuario == "adm") {
      return next();
    } else {
      const aparecer = 'Acesso não permitido'
      res.render('login',{aparecer})
     
      
    }
  }
}


