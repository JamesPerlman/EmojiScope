import React from 'react';
import './App.css';
import { ReactiveGrid } from './components';

function App() {
  return (
    <div className="App">
      <ReactiveGrid itemRadius={20} itemSpacing={5} />
    </div>
  );
}

export default App;
