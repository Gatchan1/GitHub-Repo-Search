import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Octokit } from "@octokit/core";
import { DateTime } from "luxon";

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
  const searchInputRef = useRef<HTMLInputElement>(null);

  interface ShortRepo {
    name: string;
    html_url: string;
    language: string | null | undefined;
    description: string | null;
    updated_at: string;
    stargazers_count: number;
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
          .sort((a: ShortRepo, b: ShortRepo) => (a.updated_at < b.updated_at ? 1 : -1))
          .map((item: ShortRepo) => {
            return { name: item.name, html_url: item.html_url, description: item.description, language: item.language, updated_at: DateTime.fromISO(item.updated_at).toFormat("LLL dd yyyy"), stargazers_count: item.stargazers_count, id: item.id };
          })
      );
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

  useEffect(() => {
    let newResults;
    if (languageFilter != "All") newResults = filterByName(filterByLanguage(repos));
    else newResults = filterByName(repos);
    setSearchResults(newResults);
    setReposNumber(newResults.length);
  }, [searchInput, languageFilter]);

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

  function toggleDropdown() {
    setDropdownVisible(!dropdownVisible);
  }

  function languageHandler(language: string) {
    setLanguageFilter(language);
    toggleDropdown();
  }

  function clearFilters() {
    if (searchInputRef.current) searchInputRef.current.value = "";
    setLanguageFilter("All");
    setSearchInput("");
  }

  function displayRepo(repo: ShortRepo) {
    return (
      <div className="repo" key={repo.id}>
        <h4>
          <a href={repo.html_url}>{repo.name}</a>
        </h4>
        <p className="description">{repo.description}</p>
        <div className="details">
          <p className="detail">{repo.language}</p>
          <div className="detail"><img className="star" src="/star.png" alt="star" /><p>{repo.stargazers_count}</p></div>
          <p className="detail">Updated on {repo.updated_at}</p>
        </div>
      </div>
    );
  }

  return (
    <div id="Repos">
      <div className="reposContainer">
        <form>
          <div className="flex">
            <input
              type="text"
              placeholder="Find a repository..."
              ref={searchInputRef}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
            />
            <div className="buttonsContainer">
              <div className="dropdown">
                <button className="toggler" onClick={toggleDropdown} type="button" aria-expanded="false">
                  <img src="/arrow-down.svg" alt="arrow pointing down" /> Language: {languageFilter}
                </button>
                <div className="options">
                  {!loading && dropdownVisible && (
                    <button className="option" type="button" onClick={() => languageHandler("All")}>
                      All
                    </button>
                  )}
                  {!loading &&
                    dropdownVisible &&
                    languages.map((lang, k) => {
                      return (
                        <button className="option" type="button" key={k} onClick={() => languageHandler(lang)}>
                          {lang}
                        </button>
                      );
                    })}
                </div>
              </div>
              {(searchInput != "" || languageFilter != "All") && (
                <button className="clearFilters" type="button" onClick={clearFilters}>
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </form>

        {loading && (
          <div className="spinnerContainer">
            <span className="spinner" role="status"></span>
          </div>
        )}
        <div className="reposContainer">
          {!loading && (reposNumber <= 30 || showAll) && searchResults.map(displayRepo)}

          {!loading && reposNumber > 30 && !showAll && searchResults.slice(0, 30).map(displayRepo)}

          {!loading && reposNumber > 30 && !showAll && (
            <div className="pageLimit">
              <p className="currently">Currently showing only the first 30 results.</p>
              <p>
                <a onClick={() => setShowAll(true)}>Click here</a> to display all.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
