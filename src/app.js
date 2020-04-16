const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.use('/repositories/:id', (request, response, next) =>{
  const { id } = request.params;

  if(!isUuid(id)) return response.status(400).send();

  return next();
})


app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const project = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(project)

  return response.json(project);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const project = repositories.find(proj => proj.id === id);
  if (!project) return response.status(400).send();

  project.title = title
  project.url = url;
  project.techs = techs;

  return response.json(project);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.find(proj => proj.id === id);
  if (projectIndex < 0 ) return response.status(400).send();

  repositories.splice(projectIndex);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const project = repositories.find(proj => proj.id === id);
  if (!project) return response.status(400).send();

  project.likes +=1;

  return response.json(project);
});

module.exports = app;
