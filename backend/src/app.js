const express = require("express");
const cors = require("cors");
const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const newRepo = { id : uuid(), title, url, techs, likes: 0 }

  repositories.push(newRepo);

  return response.json(newRepo);
});

app.get("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const unique = repositories.findIndex( repo => repo.id === id);

  if (unique < 0) {
    return response.status(400).json({ error: "Repositorio não encontrado"});
  }

  return response.json(repositories[unique]);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const {title, url, techs} = request.body;
  const unique = repositories.findIndex( repo => repo.id === id);

  if (unique < 0) {
    return response.status(400).json({ error: "Repositorio não encontrado"});
  }

  const {likes} = repositories[unique];

  const editRepo = {
    id,
    title,
    url,
    techs,
    likes : likes
  }

  repositories[unique] = editRepo;

  return response.status(202).json(editRepo);  
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const unique = repositories.findIndex( repo => repo.id === id);

  if (unique < 0) {
    return response.status(400).json({ error: "Repositorio não encontrado"});
  }

  repositories.splice(unique, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const unique = repositories.findIndex( repo => repo.id === id);

  if (unique < 0) {
    return response.status(400).json({ error: "Erro ao atualizar contagem"});
  }

  const { title, url, techs, likes } = repositories[unique];

  const newLike = likes + 1;

  const attRepo = {
    id,
    title,
    url,
    techs,
    likes: newLike
  }

  repositories[unique] = attRepo;

  return response.json({likes: newLike});
});

module.exports = app;
