import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Octokit } from "@octokit/core";

export default function Repos() {
  const [repos, setRepos] = useState<ShortRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const { username } = useParams();

  interface ShortRepo {
    name: string;
    language: string | null | undefined;
    id: number;
  }

  // const octokit = new Octokit({ auth: `${import.meta.env.VITE_GITHUB_TOKEN}` });
  const octokit = new Octokit();

  async function getPaginatedData(url: string) {
    const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;
    let pagesRemaining: string | boolean | undefined = true;
    let data: ShortRepo[] = [];

    while (pagesRemaining) {
      const response = await octokit.request(`GET ${url}`, {
        per_page: 100,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      const parsedData = parseData(response.data.map((item:ShortRepo) => {
                  return { name: item.name, language: item.language, id: item.id };
                }));
      console.log("parsedData: ", parsedData);
      data = [...data, ...parsedData];

      const linkHeader = response.headers.link;
      pagesRemaining = linkHeader && linkHeader.includes(`rel="next"`);
      if (pagesRemaining && typeof linkHeader === "string") {
        url = linkHeader.match(nextPattern)![0];
      }
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    setRepos(data);
  }  

  function parseData(data: ShortRepo[]) {
    // If the data is an array, return that
    if (Array.isArray(data)) {
      return data;
    }
    // Some endpoints respond with 204 No Content instead of empty array
    //   when there is no data. In that case, return an empty array.
    if (!data) {
      return [];
    }
    const namespaceKey = Object.keys(data)[0];
    data = data[namespaceKey];

    return data;
  }

  useEffect(() => {
    getPaginatedData(`/users/${username}/repos`);
    console.log(username);
  }, []);

  function toggleDropdown() {
    setDropdownVisible(!dropdownVisible);
  }

  return (
    <div id="Repos">
      <div>
        <form>
          <input type="text" placeholder="Find a repository..." />
          <div className="relative">
            <button className="toggler" onClick={toggleDropdown} type="button" aria-expanded="false">
              Language
            </button>
            {dropdownVisible && (
              <div className="dropdown">
                <button>C</button>
                <button>JavaScript</button>
                <button>HTML</button>
              </div>
            )}
          </div>
        </form>
        {loading && (
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
        {!loading &&
          repos.map((repo) => {
            return <div key={repo.id}>{repo.name}</div>;
          })}
      </div>
    </div>
  );
}
