import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import { EmojiBrowserPage } from './components';
import { EmojiDetailModal } from './components/modals';
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
        <Route exact path="/:emoji" component={EmojiBrowserPage} />
        {/* TODO: Make this nice!
        <Route exact path="/:emoji" component={EmojiDetailModal} />
        */}
      </Switch>
    </div>
  );
}

export default App;
