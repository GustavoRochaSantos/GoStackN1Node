const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function CheckValidUuid(request, response, next){
  const { id } = request.params

  if(!isUuid(id))
    return response.status(400).send({error: "This isn't valid UUID."})

  return next()
}

app.use('/repositories/:id', CheckValidUuid)

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body

  const serializedTechs = techs.join().split(',').map(tech=> tech.trim())
  const newRepository = {id: uuid(), title, url, techs: serializedTechs, likes: 0}
  
  repositories.push(newRepository)

  return response.json(newRepository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs} = request.body

  const index = repositories.findIndex(repo => repo.id === id)

  if(index < 0)
    return response.json({error: "Repository not found."})

  repositories[index].title = title
  repositories[index].url = url
  repositories[index].techs = techs
  const updatedRepository = repositories[index]
  return response.json(updatedRepository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const index = repositories.findIndex(repo => repo.id === id)

  if(index < 0)
    return response.json({error: "Repository not found."})

  repositories.splice(index, 1)
  
  return response.status(204).json({message: "Repository deleted."})
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const index = repositories.findIndex(repo => repo.id === id)

  if(index < 0)
    return response.stauts(400).json({error: "Repository not found."})

  repositories[index].likes += 1

  return response.json({likes: repositories[index].likes})
});

module.exports = app;
