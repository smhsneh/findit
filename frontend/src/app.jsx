import React, { useState } from 'react';
import Home from './pages/home';
import Landing from './pages/landing';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <div className="w-full h-full min-h-screen">
      {!hasStarted ? (
        <Landing onEnter={() => setHasStarted(true)} />
      ) : (
        <Home />
      )}
    </div>
  );
}
