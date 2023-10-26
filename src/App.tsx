import { useState, useEffect } from "react";
import "./App.css";
import { Octokit } from "@octokit/core";

// const octokit = new Octokit({ auth: `${import.meta.env.VITE_GITHUB_TOKEN}` });
const octokit = new Octokit();

function App() {
  const [apiInfo, setApiInfo] = useState<ApiInfoItem[]>([{ id: 1, name: "no repos" }]);

  interface ApiInfoItem {
    id: number;
    name: string;
  }

  async function getUserRepos() {
    const patata = octokit.request("GET /users/Gatchan1/repos", {
      // username: "USERNAME",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    patata
      .then((resp) => {
        setApiInfo(resp.data);
      })
      .catch((err) => {
        console.log("catch()", err);
      });
  }

  useEffect(() => {
    getUserRepos();
  }, []);

  return (
    <>
      <div>
        {apiInfo.map((repo) => {
          return <div key={repo.id}>{repo.name}</div>;
        })}
      </div>

      <p>Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
