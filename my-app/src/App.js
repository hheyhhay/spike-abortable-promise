import './App.css';
import { useEffect, useState } from 'react';

function App({ someProcess }) {
  const [someDependency, setSomeDependency] = useState(0);

  useEffect(() => {
    someProcess();
  }, [someDependency])

  const changeSomeDependency = () => {
    setSomeDependency(someDependency + 1);
  }

  return (
    <div className="App">
      <button onClick={changeSomeDependency} >Increment Dependency </button>
    </div>
  );
}

export default App;
