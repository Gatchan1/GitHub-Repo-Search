import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Octokit } from "@octokit/core";

export default function Repos() {
  const [repos, setRepos] = useState<ShortRepo[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<ShortRepo[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [languageFilter, setLanguageFilter] = useState<string>("All");
  const [reposNumber, setReposNumber] = useState<number>(0);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const { username } = useParams();

  interface ShortRepo {
    name: string;
    language: string | null | undefined;
    description: string | null;
    updated_at: string;
    id: number;
  }

  // const octokit = new Octokit({ auth: `${import.meta.env.VITE_GITHUB_TOKEN}` });
  const octokit = new Octokit();

  async function getPaginatedRepos(url: string) {
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

      const parsedData = parseData(
        response.data
          .map((item: ShortRepo) => {
            return { name: item.name, description: item.description, language: item.language, updated_at: item.updated_at, id: item.id };
          })
          .sort((a: ShortRepo, b: ShortRepo) => (a.updated_at < b.updated_at ? 1 : -1))
      );
      /*  .map((item:ShortRepo) => {
          return { name: item.name, description: item.description, language: item.language, updated_at: item.updated_at, id: item.id };
        }).sort((a:ShortRepo, b:ShortRepo) => (a.updated_at < b.updated_at) ? 1 : -1) */
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

    function retrieveUsedLanguages(array: ShortRepo[]) {
      const mappedArray = array.map((item: ShortRepo) => item.language);
      const filteredArray: string[] = mappedArray.filter((item): item is string => typeof item === "string");
      const usedLanguages = filteredArray.reduce((accu: string[], curr: string) => {
        if (!accu.includes(curr)) accu.push(curr);
        return accu;
      }, []);
      return usedLanguages;
    }

    setReposNumber(data.length);
    setRepos(data);
    setSearchResults(data);
    setLanguages(retrieveUsedLanguages(data));
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
    getPaginatedRepos(`/users/${username}/repos`);
    console.log(username);
  }, []);

  function filterByName(data: ShortRepo[]) {
    return data.filter((data) => {
      return data.name.toLowerCase().includes(searchInput.toLowerCase());
    });
  }
  function filterByLanguage(data: ShortRepo[]) {
    return data.filter((data) => {
      return data.language == languageFilter;
    });
  }

  useEffect(() => {
    let newResults;
    if (languageFilter != "All") newResults = filterByName(filterByLanguage(repos));
    else newResults = filterByName(repos);
    setSearchResults(newResults);
    setReposNumber(newResults.length);
  }, [searchInput, languageFilter]);

  function toggleDropdown() {
    //console.log("jskafsjkl", languages);
    setDropdownVisible(!dropdownVisible);
  }

  function languageHandler(language: string) {
    setLanguageFilter(language);
    toggleDropdown();
  }

  return (
    <div id="Repos">
      <div>
        <form>
          <input
            type="text"
            placeholder="Find a repository..."
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
          <div className="relative">
            <button className="toggler" onClick={toggleDropdown} type="button" aria-expanded="false">
              Language: {languageFilter}
            </button>
            <div className="dropdown">
              {!loading && dropdownVisible && (
                <button type="button" onClick={() => languageHandler("All")}>
                  All
                </button>
              )}
              {!loading &&
                dropdownVisible &&
                languages.map((lang, k) => {
                  return (
                    <button type="button" key={k} onClick={() => languageHandler(lang)}>
                      {lang}
                    </button>
                  );
                })}
            </div>
          </div>
        </form>
        {loading && (
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
        <div>
          {!loading &&
            (reposNumber <= 50 || showAll) &&
            searchResults.map((repo) => {
              return <div key={repo.id}>{repo.name}</div>;
            })}

          {!loading &&
            reposNumber > 50 &&
            !showAll &&
            searchResults.slice(0, 50).map((repo) => {
              return <div key={repo.id}>{repo.name}</div>;
            })}
          {!loading && reposNumber > 50 && !showAll && (
            <p>
              Currently showing only the first 50 results. <button onClick={() => setShowAll(true)}>Click here</button> to display all
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
