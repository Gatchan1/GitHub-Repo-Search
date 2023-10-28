export default function Alert({message, setError}) {
    const dismissErrorHandler = () => {
        setError("");
      };
  
    return (
    <div id="Alert">
      <p>{message}</p>
      <button type="button" className="btn btn-outline-light" onClick={dismissErrorHandler}>
        Okay
      </button>
    </div>
  )
}
