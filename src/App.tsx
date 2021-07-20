import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import { EmojiBrowserPage } from './components';
import { EmojiListActionCreator } from './store/emojiList/actionCreators';

function App() {
  const dispatch = useDispatch();

  // app startup effects
  useEffect(() => {
    // load all emojis
    dispatch(EmojiListActionCreator.fetchAll());
  });

  return (
    <div className="w-full h-full bg-black">
      <Switch>
        <Route exact path="/" component={EmojiBrowserPage} />
      </Switch>
    </div>
  );
}

export default App;
