const express = require('express')
const bodyParser = require('body-parser')
const connection = require('./database/database')
const PerguntasModel = require('./database/Pergunta')
const RespostasModel = require('./database/Resposta')


// Database
connection.authenticate().then(()=>{
    console.log('conexao feita com o Banco de Dados!')
}).catch((msgError)=>{
    console.log('Ocorreu um erro. ' + msgError)
})


const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))
//------------------------------------


// body-Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// setando a porta 
const port = process.env.PORT || 8080




// ROTAS
app.get('/', (req, res)=>{ 
    PerguntasModel.findAll({ raw: true, order:[
        ['id', 'DESC']
    ]}).then(perguntas =>{
        
    // SELECT * From Perguntas
    res.render('index',{
        title: "Página Inícial",
        perguntas: perguntas
    })
   })
})
app.get('/perguntas', (req, res)=>{ 
 
    res.render('perguntas',{
        title: "Página de Perguntas",
        
    })
})

app.post('/salvarpergunta', (req, res)=>{
   let  titulo = req.body.titulo
   let  descricao = req.body.descricao
   PerguntasModel.create({
       titulo : titulo,
       descricao: descricao
   }).then(()=>{
       res.redirect('/')
   })
})

app.get('/pergunta/:id', (req, res) => {
  let _id = req.params.id
  PerguntasModel.findOne({
      where: {id: _id}
  }).then(pergunta =>{
      if(pergunta != undefined){

        RespostasModel.findAll({
            where: {perguntaId : pergunta.id},
            order:[['id', 'DESC']]
        }).then(respostas =>{
            res.render('pergunta',{
                title: "Resultados de Pesquisa",
                pergunta: pergunta,
                respostas: respostas
            })
        })
      } else{
        res.redirect('/')
      }
  })
})

app.post('/responder',(req, res)=>{
    let corpo = req.body.corpo
    let perguntaId = req.body.pergunta
    RespostasModel.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(()=>{
        res.redirect("/pergunta/"+perguntaId)
        // console.log('respondido')
    })
})




//  startando o servidor
app.listen(port,() => {console.log(`Server is running on ${port}`)})