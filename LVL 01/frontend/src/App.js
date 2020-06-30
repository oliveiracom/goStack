import React, {useState, useEffect} from "react";
import api from "./services/api";

import "./styles.css";

function App() {
  const [repositories, setRepos] = useState([]);

  useEffect(() => {
    attRepos();
  }, []);

  function attRepos() {
    api.get('/repositories').then(response => {
      setRepos(response.data);
    });
  }

  async function handleAddRepository() {
    // TODO
    const body = {
      title : "Titulo do Repo",
      url : "https://github.com/oliveiracom",
      techs : [
        "node",
        "nodemon",
        "api rest"
      ],
      likes : 0
    }; 
    const response = await api.post('/repositories', body);
    const newRepo = response.data;
    setRepos([... repositories, newRepo]);
  }

  async function handleRemoveRepository(id) {
    const response = await api.delete('/repositories/' + id);
    //attRepos();
    const filteredRepositories = repositories.filter(repository => repository.id !== id);
    setRepos(filteredRepositories);

  }

  return (
    <div>
      <ul data-testid="repository-list">
      {repositories.map(repo => (
            <li key={repo.id}>{repo.title}
            <button onClick={() => handleRemoveRepository(repo.id)}>
              Remover
            </button>
            </li> 
          )
            )}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
