import { useRef } from "react";

type SearchReposProps = {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  dropdownVisible: boolean;
  languages: string[];
  languageFilter: string;
  propsFunctions: {
    toggleDropdown(): void;
    languageHandler(language: string): void;
    clearFilters(): void;
  };
};

export default function SearchRepos(props: SearchReposProps) {
  const { searchInput, setSearchInput, loading, dropdownVisible, languages, languageFilter, propsFunctions } = props;
  const { languageHandler, toggleDropdown, clearFilters } = propsFunctions;
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <div id="SearchRepos">
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
              <button
                className="clearFilters"
                type="button"
                onClick={() => {
                  clearFilters();
                  if (searchInputRef.current) searchInputRef.current.value = "";
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
