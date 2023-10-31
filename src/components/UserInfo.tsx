import { useContext } from "react";
import { userContext } from "../contexts/user.context";

export default function UserInfo() {
  const contextValues = useContext(userContext);
  const user = contextValues?.userInfo;

  return (
    <div id="UserInfo">
      <div className="user">
        <div className="avatar">
          <img src={user?.avatar_url} alt={`${user?.login} avatar image`} />
        </div>
        <div className="naming">
          <h2>{user?.name}</h2>
          <h3>{user?.login}</h3>
        </div>
      </div>
      <p className="bio">{user?.bio}</p>
      <div className="follows">
        <img src="/icon-followers.png" alt="followers icon" />
        <p>
          <strong>{user?.followers}</strong> followers · <strong>{user?.following}</strong> following
        </p>
      </div>
      <hr />
    </div>
  );
}
