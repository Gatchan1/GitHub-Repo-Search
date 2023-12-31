import "../style/ProfilePage.css";
import "../style/Repos.css";
import { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Repos from "../components/Repos";
import { userContext } from "../contexts/user.context";
import Header from "../components/Header";
import UserInfo from "../components/UserInfo";

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const contextValues = useContext(userContext);

  useEffect(() => {
    if (contextValues) {
      if (contextValues.loading && typeof username == "string") {
        contextValues.getUser(username);
      }
      if (contextValues.error != "") {
        contextValues.setError("");
        navigate("/notfound");
      }
    }
  }, [contextValues?.loading, contextValues?.error]);

  return (
    <div>
      {!contextValues?.loading && (
        <div id="ProfilePage">
          <Header />
          <div className="responsive">
            <UserInfo />
            <Repos />
          </div>
        </div>
      )}
    </div>
  );
}
