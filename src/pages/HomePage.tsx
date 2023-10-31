import "../style/HomePage.css";
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../contexts/user.context";
import Alert from "../components/Alert";

export default function HomePage() {
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  const contextValues = useContext(userContext);

  useEffect(() => {
    if (contextValues?.error != "") {
      contextValues?.setError("");
    }
    if (inputRef && inputRef.current) {
      inputRef.current.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && submitRef && submitRef.current) {
          e.preventDefault();
          submitRef.current.click();
        }
      });
    }
  }, []);

  useEffect(() => {
    if (contextValues) {
      console.log("el maldito error: ", contextValues.error)
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
              ref={inputRef}
              onChange={(e) => {
                setUserInput(e.target.value);
              }}
            />
          </div>
          <button
            type="button"
            ref={submitRef}
            onClick={() => {
              contextValues?.getUser(userInput);
            }}
          >
            Submit
          </button>
        </form>
        {contextValues?.error != "" && (
          <div className="alert">
            <Alert message={error} />
          </div>
        )}
      </div>
    </div>
  );
}
