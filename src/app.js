const express = require("express");
const cors = require("cors");
const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.json());

const repositories = [];
const countLikes = [];

app.get("/repositories", (request, response) => {
  const show = [];

  repositories.forEach(function(repo, index) {
    const likes = countLikes[index].likes
    show.push({
      repo,
      likes
    })
  });
  return  response.json(show);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const newRepo = {id : uuid(), title, url, techs }
  const newLike = {id : newRepo.id, likes: 0};

  repositories.push(newRepo);
  countLikes.push (newLike)

  const result = {
    newRepo,
    likes : 0
  }

  return response.json(result);
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
    return response.json({ error: "Repositorio não encontrado"});
  }

  const editRepo = {
    id,
    title,
    url,
    techs
  }

  repositories[unique] = editRepo;

  return response.status(202).json(editRepo);  
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const unique = repositories.findIndex( repo => repo.id === id);

  if (unique < 0) {
    return response.json({ error: "Repositorio não encontrado"});
  }

  repositories.splice(unique, 1);
  countLikes.splice(unique, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const unique = countLikes.findIndex( like => like.id === id);

  if (unique < 0) {
    return response.json({ error: "Erro ao atualizar contagem"});
  }

  countLikes[unique] = {
    id,
    likes: (countLikes[unique].likes + 1)
  };

  return response.send();
});

module.exports = app;
