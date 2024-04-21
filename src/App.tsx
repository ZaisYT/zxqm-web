import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './Header.tsx';
import { MainContent } from './MainContent.tsx';
import { Player } from './Player.tsx';
import { useRef, useState } from 'react';
import { Lyrics } from './Lyrics.tsx';

function App() {
  const audioRef = useRef(new Audio());
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [songID, setSongID] = useState(["-NpWm6-Lt_ahdpOmZ0Ku"]); 
  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<MainContent setSongID={setSongID} audio={audioRef.current}/>} />
          <Route path="/lyrics" element={<Lyrics currentSongIndex={currentSongIndex} queue={songID} audio={audioRef.current}/>} />
        </Routes>

        <Player queue={songID} currentSongIndex={currentSongIndex} setCurrentSongIndex={setCurrentSongIndex} audio={audioRef.current}/>
      </BrowserRouter>
    </>
  )
}

export default App
