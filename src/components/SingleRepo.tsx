interface ShortRepo {
    name: string;
    html_url: string;
    language: string | null | undefined;
    description: string | null;
    updated_at: string;
    stargazers_count: number;
    id: number;
  }

export default function SingleRepo(props: {repo: ShortRepo}) {
    const {repo} = props;
    return (
        <div id="SingleRepo">
          <h4>
            <a href={repo.html_url}>{repo.name}</a>
          </h4>
          <p className="description">{repo.description}</p>
          <div className="details">
            <p className="detail">{repo.language}</p>
            <div className="detail">
              <img className="star" src="/star.png" alt="star" />
              <p>{repo.stargazers_count}</p>
            </div>
            <p className="detail">Updated on {repo.updated_at}</p>
          </div>
        </div>
      );
}
