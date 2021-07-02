import React from 'react';
import logo from './logo.svg';
import './App.css';
import { NodeField } from './components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const FA = require('react-fontawesome');

function App() {
  return (
    <div className="App">
      <FA name="rocket"></FA>
      <NodeField n="abcdefg"></NodeField>
    </div>
  );
}

export default App;
