import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './Header.tsx';
import { MainContent } from './MainContent.tsx';
import { Player } from './Player.tsx';
import { useRef, useState } from 'react';
import { Lyrics } from './Lyrics.tsx';
import { Search } from './Search.tsx';
import { Fof } from './404.tsx';
import { Artist } from './Artist.tsx';
import { Discography } from './Discography.tsx';
import CardTest from './test/CardTest.tsx';

function App() {
  const audioRef = useRef(new Audio());
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [songID, setSongID] = useState([]); 

  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<MainContent setSongID={setSongID} audio={audioRef.current}/>} />
          <Route path="/test/cards" element={<CardTest/>} />
          <Route path="/lyrics" element={<Lyrics currentSongIndex={currentSongIndex} queue={songID} audio={audioRef.current}/>} />
          <Route path="/search" element={<Search song={audioRef.current} setSongID={setSongID}/>} />
          <Route path="/artist/:id" element={<Artist song={audioRef.current} setSongID={setSongID} />} />
          <Route path="/discography/:id" element={<Discography song={audioRef.current} setSongID={setSongID} />} />

          {/* <Route path="/about" element={<Fof />} />
          <Route path="/config" element={<Fof />} />
          <Route path="/account" element={<Fof />} /> */}
          <Route path="*" element={<Fof />}/> 
        </Routes>

        <Player queue={songID} currentSongIndex={currentSongIndex} setCurrentSongIndex={setCurrentSongIndex} audio={audioRef.current}/>
      </BrowserRouter>
    </>
  )
}

export default App
