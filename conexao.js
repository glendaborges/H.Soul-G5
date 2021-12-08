const mongodb = require('mongodb').MongoClient
const url = 'mongodb+srv://glendaborges:senha123@cluster0.rmqfw.mongodb.net/Hospital?retryWrites=true&w=majority'

const client = new mongodb(url)

//função assícrona - começa a ser executada mas não para a aplicação, ou seja, continua com a execução das outras rotinas
async function run(){
    try{
        //espera a conexão com o banco, quando essa conexão for estabelecida é impresso no console a mesagem
        await client.connect()
        console.log("Estamos conectados ao Banco")
    }catch(err){
        console.log(err)
    }
}
run()
module.exports = client