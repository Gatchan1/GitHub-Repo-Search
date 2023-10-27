import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Octokit } from "@octokit/core";

export default function Repos() {
  const [apiInfo, setApiInfo] = useState<ApiInfoItem[]>([{ id: 1, name: "no repos" }]);
  const [loading, setLoading] = useState<boolean>(true);
  const { username } = useParams();

  interface ApiInfoItem {
    id: number;
    name: string;
  }

  // const octokit = new Octokit({ auth: `${import.meta.env.VITE_GITHUB_TOKEN}` });
  const octokit = new Octokit();

  async function getUserRepos() {
    if (typeof username === "string") {
      const repos = octokit.request("GET /users/{username}/repos", {
        username: username,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
      repos
        .then((resp) => {
          setApiInfo(resp.data);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        })
        .catch((err) => {
          console.log("catch()", err);
        });
    }
  }

  useEffect(() => {
    getUserRepos();
    console.log(username);
  }, []);

  return (
    <div id="Repos">
      <div>
        {loading && (
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
        {!loading &&
          apiInfo.map((repo) => {
            return <div key={repo.id}>{repo.name}</div>;
          })}
      </div>
    </div>
  );
}
