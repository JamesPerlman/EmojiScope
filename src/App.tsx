import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import { EmojiBrowserPage, Modals } from './components';
import { EmojiListActionCreator } from './store';

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
        <Route path={['/', '/:emoji']} component={EmojiBrowserPage} />
      </Switch>
      <Modals />
    </div>
  );
}

export default App;
