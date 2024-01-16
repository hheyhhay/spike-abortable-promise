import './App.css';
import { useEffect, useState } from 'react';

function AppWithAbortablePromise({ someProcess }) {
  const [someDependency, setSomeDependency] = useState(0);

  function myCoolPromiseAPI(/* …, */ { signal }) {
    return new Promise((resolve, reject) => {
      // If the signal is already aborted, immediately throw in order to reject the promise.
      if (signal.aborted) {
        console.log('Dead on arrival.')
        reject(signal.reason);
      }

      // Perform the main purpose of the API
      setTimeout(resolve, 1000)

      // Watch for 'abort' signals
      signal.addEventListener("abort", () => {
        // Stop the main operation
        // Reject the promise with the abort reason.
        reject('Current process took too long.');
      });
    });
  }
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    myCoolPromiseAPI({ /* …, */ signal })
      .then(() => {
        console.log("Running the main process: ", someDependency);
        someProcess();
      })
      .catch((err) => {
        // if (err.name === "AbortError") return;
        console.log(err)
      })

  }, [someDependency])

  const changeSomeDependency = () => {
    setSomeDependency(someDependency + 1);
  }

  return (
    <div className="AppWithAbortablePromise">
      <button onClick={changeSomeDependency} >Increment Dependency </button>
    </div>
  );
}

export default AppWithAbortablePromise;
