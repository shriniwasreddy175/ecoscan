import { useState } from "react";
import './App.css'
import { analyzeProduct } from "./api/productApi";

function App() {
  const [result, setResult] = useState(null);

  const testAPI = async () => {
    const data = {
      name: "Test Product",
      category: "Clothing",
      price: 1000,
      weight: 1,
      material: "Cotton",
      description: "Organic Polyester Jacket",
      transportDistance: 100,
    };

    const res = await analyzeProduct(data);
    setResult(res);
  };

  return (
    <div>
      <h1>EcoScan Dashboard</h1>
      <button onClick={testAPI}>Analyze Product</button>

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}

export default App;