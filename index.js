const express = require('express')
var morgan = require('morgan')
const cors = require('cors')





let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''; // Solo incluir el cuerpo en POST
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));



app.get('/', (request,response) => {
    response.status(200).send('<h1>server working</h1>')
})

app.get('/api/persons', (request,response) => {
  response.status(200).send(persons)
})

app.get('/info', (request,response) => {

  response.status(200).send(
    `Phonebook has info for ${persons.length} people <br/><br/>
    ${new Date()}`
  )
})

app.get('/api/persons/:id', (request, response )=>{
  const id = Number(request.params.id)
  const person = persons.find(person => person.id===id)
  response.status(302).send(person)
})

app.delete('/api/persons/:id', (request, response )=>{
  const id = Number(request.params.id)
  const person = persons.find(person => person.id===id)
  if(person){
    persons = persons.filter(person => person.id!==id) 
    response.status(204).end()
  } 
  else response.status(404).send({error: "not found"})
  })


  app.post('/api/persons/', (request, response ) =>{
    const body = request.body
    console.log(body)
    if(body.name && body.number){
      if(persons.find(person => person.name === body.name )){
        response.status(409).send({error: "Name must be unique"})
      }
      const newPerson={
        id: Math.floor(Math.random()*10000),
        name: body.name,
        number: body.number
      }
      persons = [...persons, newPerson]
      response.status(201).send(newPerson)
    }else{
      response.status(400).send({error: "Name or number is missing"})
    }
  })

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
