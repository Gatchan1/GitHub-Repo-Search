import { useContext } from "react";
import { userContext } from "../contexts/user.context";

export default function Header() {
  const contextValues = useContext(userContext);
  const user = contextValues?.userInfo;

  return (
    <div id="Header">
      <header id="Header">
        <div className="inactive">
          <button>Overview</button>
        </div>
        <div id="repositories">
          <button>
            Repositories <div className="reposNumber">{user?.public_repos}</div>
          </button>
        </div>
        <div className="inactive">
          <button>Projects</button>
        </div>
      </header>
      <hr />
    </div>
  );
}

// (This component will only show if contextValues?.loading == false,
// as stated in ProfilePage.tsx)
