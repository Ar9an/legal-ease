import { useState, useEffect } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Count changed!");
  }, [count]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Counter App</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increase
      </button>
    </div>
  );
}