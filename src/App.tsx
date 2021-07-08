import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
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
    <div className="w-full h-full bg-white">
      <EmojiBrowserPage />
    </div>
  );
}

export default App;
