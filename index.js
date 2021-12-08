const express = require('express')
const handle = require('express-handlebars')
const client = require('./conexao')
const ObjectId = require('mongodb').ObjectId
const app = express()
const porta = 3000
const {adm1} = require('./helpers/adm')
const {user1} = require('./helpers/user')
const dbo = client.db('Hospital')

const hbs = handle.create({
    partialsDir: ('views/partials/')
})
//dizer para o express que o motor de renderização da página html vai ser o handlebars, através da vairável hbs
app.engine('handlebars', hbs.engine)
//estamos setando o nosso view engine com o motor de rederização handle bars
app.set('view engine', 'handlebars')

//o tráfego de dados pode ser por string
app.use(express.urlencoded({
    extended: true
}))

//o tráfego de daados pode ser por objetos json
app.use(express.json())

//os nossos arquivos estáticos estão na página public
app.use(express.static(__dirname + '/public'))



app.get('/', (req, res) => {
    res.render('home')
})

// rota login
app.get('/login', (req, res) => {
    res.render('login')
})



app.post('/verificarLogin', (req, res) =>{
    const emailDigitado = req.body.email
    const senha = req.body.senha

    dbo.collection('login').findOne({email:emailDigitado}, (erro, resultado) =>{
        if(erro)throw erro

        if(resultado == null){
            const aparecer = 'Usuário ou Senha Incorretos'
            res.render('login',{aparecer})
        }else if(resultado.senha == senha && resultado.perfil == 'adm'){
            global.tipoUsuario = 'adm'
            return res.redirect('/adm')
        }else if(resultado.senha == senha && resultado.perfil == 'user'){
            global.tipoUsuario = 'user'
            return res.redirect('/user')
        }else{
            const aparecer = 'Usuário ou Senha Incorretos'
            res.render('login',{aparecer})
        }
    })
})

// rota adm
app.get('/adm', adm1,(req, res) => {
    dbo.collection('addMedico').find({}).toArray((erro, resultado) => {
        if (erro) throw erro
        console.log(resultado)
        res.render('areaAdm', {
            resultado
        })
    })
})

// rota cadastro

app.get('/cadastro', adm1 ,(req, res) => {
    dbo.collection('especialidades').find({}).toArray((erro, resultado) => {
        if (erro) throw erro
        res.render('register', {
            resultado
        })
    })

})

// cadastro do medico e edição do médico
app.post('/addMedico', adm1 ,(req, res) => {
    const obj = {
        nome: req.body.nome,
        crm: req.body.crm,
        tel: req.body.tel,
        img: req.body.img,
        especialidade: req.body.especialidade,
    }
    if (req.body.id == "") {
    dbo.collection('addMedico').insertOne(obj, (erro, resultado) => {
        if (erro) throw erro
        console.log('Médico cadastrado com sucesso!')
        res.redirect("/adm")
    })
    }
    else{
        const id = req.body.id
        const obj_id = new ObjectId(id)
        dbo.collection('addMedico').updateOne({_id: obj_id},{$set: obj},{upsert:true},(erro,resultado3)=>{
            if (erro) throw erro
            
        })
        res.redirect('/adm')

    }
})


app.get('/deletarMedico/:id',adm1 , (req, res) => {
    let idMedico = req.params.id
    let obj_id = new ObjectId(idMedico)

    dbo.collection('addMedico').deleteOne({
        _id: obj_id
    }, (erro, resultado) => {
        if (erro) throw erro
        console.log(resultado.deletedCount)
        res.redirect('/adm')
    })
})




app.get('/editarMedico/:id',adm1 , (req, res) => {
    const idMedico = req.params.id
    let obj_id = new ObjectId(idMedico)
    dbo.collection('especialidades').find({}).toArray((erro, resultado) => {
        if (erro) throw erro

        dbo.collection('addMedico').findOne({
            _id: obj_id
        }, (err, resultado2) => {
            if (err) throw err
            res.render('register', {
                resultado,
                resultado2
            })

        })
    })

})

// rota user
app.get('/user',user1,(req, res) => {
    dbo.collection('addMedico').find({}).toArray((erro, resultado) => {
        if (erro) throw erro
        console.log(resultado)
        res.render('areaUser', {
            resultado
        })
    })
   
})

app.listen(porta, () => {
    console.log('servidor rodando')
})