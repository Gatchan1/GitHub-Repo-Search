import { useContext } from "react";
import { userContext } from "../contexts/user.context";

export default function Header() {
  const contextValues = useContext(userContext);
  const user = contextValues?.userInfo;

  return (
    <header id="Header">
      <a href="/"><img src="/undo.png" alt="arrow pointing back" /> Back to Homepage</a>
      <div className="container">
        <div id="repositories">
          Public repositories:<div className="reposNumber">{user?.public_repos}</div>
        </div>
      </div>
    </header>
  );
}