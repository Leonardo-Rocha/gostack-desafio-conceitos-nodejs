const express = require('express');
const cors = require('cors');
const { v4 } = require('uuid');

const validateProjectId = require('./middlewares/validate');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.use('/repositories/:id', validateProjectId);

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: v4(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = findRepositoryIndexWithId(id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found.' });
  }

  const repository = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = findRepositoryIndexWithId(id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found.' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = findRepositoryIndexWithId(id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found.' });
  }

  const likes = ++repositories[repositoryIndex].likes;

  return response.json(likes);
});

function findRepositoryIndexWithId(id) {
  return repositories.findIndex((repository) => repository.id === id);
}

module.exports = app;
