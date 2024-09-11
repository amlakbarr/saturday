import { useState } from 'react';
import './App.css';
import Player from './components/Player';
import List from './components/List';

function App() {

  const [musicNumber, setMusicNumber] = useState(0);
  const [open, setOpen] = useState(false);

  return (
    <div className="container">
      <div className='shape shape-1'></div>
      <div className='shape shape-2'></div>
      <div className='shape shape-3'></div>
      <main>
        <Player props={{musicNumber, setMusicNumber, setOpen}} />
        <List props={{open, setOpen, musicNumber, setMusicNumber}} />
      </main>
    </div>
  );
}

export default App;
