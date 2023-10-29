export default function Alert({message, setError}) {
    const dismissErrorHandler = () => {
        setError("");
      };
  
    return (
    <div id="Alert">
      <p>{message}</p>
      <button type="button" onClick={dismissErrorHandler}>
        Okay
      </button>
    </div>
  )
}
