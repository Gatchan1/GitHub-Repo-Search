import "../style/HomePage.css"
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../contexts/user.context";
import Alert from "../components/Alert";

export default function HomePage() {
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const contextValues = useContext(userContext);

  useEffect(() => {
    if (contextValues) {
      if (contextValues.error != "") {
        setError("This username doesn't seem to exist");
      }
      if (contextValues.user != "") {
        navigate(`/profile/${contextValues.user}`);
      }
    }
  }, [contextValues?.loading, contextValues?.error]);

  return (
    <div id="HomePage">
      <div className="form-container">
        <form>
          <div className="input">
            <label htmlFor="userInput">Input GitHub User:</label>
            <input
              id="userInput"
              type="text"
              placeholder="username"
              onChange={(e) => {
                setUserInput(e.target.value);
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              console.log("userInput",userInput)
              contextValues?.getUserHomePage(userInput);
            }}
          >
            Submit
          </button>
        </form>
        {error != "" && (
          <div className="alert">
            <Alert message={error} setError={setError} />
          </div>
        )}
      </div>
    </div>
  );
}
