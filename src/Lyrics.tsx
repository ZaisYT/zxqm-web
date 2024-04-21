import React, { useEffect, useState } from 'react';
import RabbitLyrics from 'rabbit-lyrics'
import "./css/Lyrics.css";

type LyricsArgs = {
  audio: HTMLAudioElement,
  queue: String[],
  currentSongIndex: number,
}
const SONGDATAFETCHURL = "https://zxqm-rest-api-default-rtdb.firebaseio.com/songs/";
const LYRICSFETCHURL = "https://zxqm-rest-api-default-rtdb.firebaseio.com/lyrics/";

export const Lyrics = ({audio, queue, currentSongIndex} : LyricsArgs) => {
  const [songData, setSongData] = useState("");

  const [lyricsFetched, setLyricsFetched] = useState({
    "lyrics": `placeholder`,
  });

  const [rabitLyricsLoaded, setRabitLyricsLoaded] = useState(false);

  useEffect(() => {
    fetch(`${SONGDATAFETCHURL}${queue[currentSongIndex]}/lyricsURI.json`)
      .then(res => res.json())
      .then(data => {
        setSongData(data)
        setRabitLyricsLoaded(false);
      });
  }, [currentSongIndex, queue]);

  useEffect(() => {
    if (rabitLyricsLoaded) return;
    if (songData == "") return;
    fetch(`${LYRICSFETCHURL}${songData}.json`)
      .then(res => res.json())
      .then(data => {
        setLyricsFetched(data);
      });
  }, [songData]);

  useEffect(()=> {
    if (rabitLyricsLoaded) return;
    if (lyricsFetched.lyrics == "placeholder") return;
    generateLyrics();
    setRabitLyricsLoaded(true);
  },[lyricsFetched])


  function generateLyrics(){
    let exists = document.getElementById("lyrics-holder");
    if (exists != null){
      exists.remove();
    }

    let wrapper = document.getElementById("lyricsWrapper")!;

    let newDiv = document.createElement("div");
    newDiv.innerHTML = lyricsFetched.lyrics;
    newDiv.id = "lyrics-holder";

    wrapper.append(newDiv);

    let rlHandler = new RabbitLyrics(newDiv, audio);
  }

  return (
    <div className='wrapper'>
      <div id="lyricsWrapper">
      </div>
    </div>
  )
}
