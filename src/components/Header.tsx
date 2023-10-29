import { useContext } from "react";
import { userContext } from "../contexts/user.context";

export default function Header() {
  const contextValues = useContext(userContext);
  const user = contextValues?.userInfo;

  return (
    <div id="Header">
      <header>
        <div id="repositories">
            Public repositories:<div className="reposNumber">{user?.public_repos}</div>
        </div>
      </header>
    </div>
  );
}

// (This component will only show if contextValues?.loading == false,
// as stated in ProfilePage.tsx)
