import { useEffect, useState } from 'react';

interface HealthResponse {
  status: string;
  application: string;
}

function App() {

  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {

    fetch('http://localhost:8080/api/health')
      .then(response => response.json())
      .then(data => {
        setHealth(data);
      })
      .catch(error => {
        console.error('Error connecting with API:', error);
      });

  }, []);

  return (
    <main>

      <h1>Finance Tracker</h1>

      {!health && (
        <p>Connecting with backend...</p>
      )}

      {health && (
        <section>

          <h2>Backend connected</h2>

          <p>Status: {health.status}</p>

          <p>
            Application: {health.application}
          </p>

        </section>
      )}

    </main>
  );
}

export default App;