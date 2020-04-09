const express = require('express');
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(request, response, next) {

  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;    // Middleware 
 
  console.log(logLabel);

  return next();
}
function validateRepositoreId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ erro: 'Invalid repositore ID'});
}
return next();
}
app.use(logRequests);
app.use('/repositories/:id', validateRepositoreId);

  app.get('/repositories', (request, response) => { // metodo GET listando informações do back-end
    const {title} = request.query;
    const results = title
        ? repositories.filter(repositorie => repositorie.title.includes(title))
        : repositories;
    
    return response.json(results);
});

app.post("/repositories", (request, response) => {
  const {title , url, techs } = request.body;
  const repositorie = {id: uuid(), title, url, techs };

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
    const {id} = request.params;
    const { title, url, techs} = request.body;

    const repositorieIndex = repositories.findIndex( repositore => repositore.id == id);

    if (repositorieIndex < 0){
      return response.status(400).json({ erro: 'Repositore not found'});

    }
    const repositore = {
      id,
      title,
      url,
      techs,
    };
    repositories[repositorieIndex] = repositore;

    return response.json(repositore);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositore => repositore.id == id);

  if (repositorieIndex < 0){
    return response.status(400).json({erro: 'Repositore not found'});
  }

  repositories.splice(repositorieIndex, 1);
  
  return response.status(204).send();
 
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
});

module.exports = app;
