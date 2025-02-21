import { CSSProperties, useEffect, useState } from 'react';
import './css/Player.css';
import { Link, useLocation } from 'react-router-dom';

type PlayerButtonComponent = {
  custom_classes?: string,
  custom_css?: CSSProperties,
  onClickAction: () => void,
  useLink: boolean,
}

type PlayerReq = {
  queue: string[],
  audio: HTMLAudioElement,
  currentSongIndex: number,
  setCurrentSongIndex: React.Dispatch<React.SetStateAction<number>>
}

const SONGFETCHURL = "https://zxqm-rest-api-default-rtdb.firebaseio.com/songs/";
const ARTFETCHURL = "https://zxqm-rest-api-default-rtdb.firebaseio.com/releases/";

export const Player = ({ queue, audio, currentSongIndex, setCurrentSongIndex }: PlayerReq) => {
  const [songData, setSongData] = useState({
    "songArtists": [],
    "songName": "",
    "songURL": "",
    "releaseURI": "",
    "lyricsURI": ""
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingNewSong, setLoadingNewSong] = useState(false);
  const [isRepeatEnabled, setIsRepeatEnabled] = useState(false);
  const [isShuffleEnabled, setIsShuffleEnabled] = useState(false);

  const [artwork, setArtwork] = useState("");

  useEffect(() => {
    audio.addEventListener('ended', handleSongEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
  }, [currentSongIndex]);

  useEffect(() => {
    audio.loop = isRepeatEnabled;
  }, [isRepeatEnabled]);

  useEffect(() => {
    if (queue.length === 0) {
      setSongData({
        "songArtists": [],
        "songName": "",
        "songURL": "",
        "releaseURI": "",
        "lyricsURI": ""
      });
      audio.pause();
      audio.src = "";
      return;
    }

    if (loadingNewSong) {
      audio.pause();
      audio.currentTime = 0;
    }

    const currentSongId = queue[currentSongIndex];
    if (!currentSongId) return;

    fetch(`${SONGFETCHURL}${currentSongId}.json`)
      .then(res => res.json())
      .then(data => { 
        if (data == null) return;

        setSongData(data);
        if (data && data.songURL) {
          audio.src = data.songURL;
        }

        if (loadingNewSong) {
          audio.play();
          setLoadingNewSong(false);
        }
      });
  }, [currentSongIndex, queue, loadingNewSong]);

  useEffect(() => {
    if (isShuffleEnabled) {
      const shuffledQueue = [...queue];
      for (let i = shuffledQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQueue[i], shuffledQueue[j]] = [shuffledQueue[j], shuffledQueue[i]];
      }
      setCurrentSongIndex(0);
    }
  }, [isShuffleEnabled, queue]);

  function toggleRepeat() {
    setIsRepeatEnabled(!isRepeatEnabled);
  }

  function toggleShuffle() {
    setIsShuffleEnabled(!isShuffleEnabled);
  }

  function handlePlay() {
    setIsPlaying(true);
  }

  function handlePause() {
    setIsPlaying(false);
  }

  function handleSongEnded() {
    let newIndex;

    if (queue.length == 0) {
      newIndex = currentSongIndex;
    } else {
      newIndex = (currentSongIndex + 1);
    }
    setCurrentSongIndex(newIndex);
  }

  useEffect(() => {
    fetch(`${ARTFETCHURL}${songData.releaseURI}/iconURL.json`)
    .then(res => res.json())
    .then(data => {
      if (data == null) return;
      setArtwork(data);
    });
  }, [songData]);

  function changeVolume(event: React.ChangeEvent<HTMLInputElement>) {
    audio.volume = Number(event.target.value) / 100;

    let min = 0
    let max = 1
    let val = Number(event.target.value) / 100
    event.target.style.backgroundSize = ((val - min) * 100) / (max - min) + '% 100%'
  }

  function changeSongTime(event: React.ChangeEvent<HTMLInputElement>) {
    audio.currentTime = Math.floor(Number(event.target.value) / 1000);

    let min = 0
    let max = Math.floor(audio.duration * 1000);
    let val = Number(event.target.value) / 100
    event.target.style.backgroundSize = ((val - min) * 10000) / (max - min) + '% 100%'
  }

  const formatArtists = (artists: string[]): string => {
    if (!artists || artists.length == 0) return "";
    const artistCount = artists.length;

    if (artistCount === 1) {
      return artists[0];
    } else if (artistCount === 2) {
      return `${artists[0]} & ${artists[1]}`;
    } else {
      return `${artists.slice(0, -1).join(', ')} & ${artists[artistCount - 1]}`;
    }
  };

  const locationData = useLocation();

  audio.preload = "metadata";

  useEffect(() => {
    const seekslider = document.getElementById("seekSlider") as HTMLInputElement | null;
    const totalTimeIndicator = document.getElementById("totalTime") as HTMLElement | null;
  
    const handleLoadedMetadata = () => {
      if (!seekslider || !totalTimeIndicator) return;
  
      seekslider.max = String(Math.floor(audio.duration * 1000));
  
      const duration = Math.floor(audio.duration);
      const seconds = duration % 60 < 10 ? "0" + (duration % 60) : duration % 60;
      const minutes = Math.floor(duration / 60) < 10 ? "0" + Math.floor(duration / 60) : Math.floor(duration / 60);
  
      totalTimeIndicator.innerHTML = `${minutes}:${seconds}`;
  
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  
    const handleTimeUpdate = () => {
      const curTimeIndicator = document.getElementById("curTime") as HTMLElement | null;
      if (!seekslider || !curTimeIndicator) return;
  
      seekslider.value = String(audio.currentTime * 1000);
  
      const min = 0;
      const max = Math.floor(audio.duration * 1000);
      const val = audio.currentTime;
      seekslider.style.backgroundSize = (val * 100000) / (max - min) + "% 100%";
  
      const currentTime = Math.floor(audio.currentTime);
      const seconds = currentTime % 60 < 10 ? "0" + (currentTime % 60) : currentTime % 60;
      const minutes = Math.floor(currentTime / 60) < 10 ? "0" + Math.floor(currentTime / 60) : Math.floor(currentTime / 60);
  
      curTimeIndicator.innerHTML = `${minutes}:${seconds}`;
    };
  
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
  
    // Cargar audio al montarse el componente
    audio.load();
  
    // Limpiar eventos al desmontar
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [audio, songData]);
  

  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: songData.songName,
        artist: formatArtists(songData.songArtists),
        artwork: [{ src: artwork }],
      });
    }

    navigator.mediaSession.setActionHandler("play", () => {
      audio.play();
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      audio.pause();
    });
    navigator.mediaSession.setActionHandler("previoustrack", () => {
      audio.pause();
      if (audio.currentTime < 3 && currentSongIndex > 0) {
        setCurrentSongIndex(prevIndex => prevIndex - 1);
      } else {
        audio.currentTime = 0;
      }
    });
    navigator.mediaSession.setActionHandler("nexttrack", () => {
      audio.currentTime = audio.duration - 1;
    });
  }, [artwork, audio]);

  return (
    <>
      <div className='player-wrapper'>
        <div className='zxqm-player'>
          <div className="seek">
            <div className="times">
              <p id='curTime'>00:00</p>
              <p id='totalTime'>00:00</p>
            </div>
            <input id="seekSlider" type="range" onChange={changeSongTime} step={100} />
          </div>
          <div>
            <div className="info">
              <img draggable="false" src={artwork ? artwork : ""} />
              <div className="details">
                <h1>{songData && songData.songName ? songData.songName : null}</h1>
                <h2>{songData && songData.songArtists ? formatArtists(songData.songArtists) : null}</h2>
              </div>
            </div>

            <div className="controls">
              <PlayerButton
                custom_classes={isShuffleEnabled ? 'actrandom' : 'random'}
                onClickAction={() => {
                  audio.pause();
                  toggleShuffle()
                }}
                useLink={false}
              />
              <PlayerButton
                custom_classes='back'
                onClickAction={() => {
                  audio.pause();
                  if (audio.currentTime < 3 && currentSongIndex > 0) {
                    setCurrentSongIndex(prevIndex => prevIndex - 1);
                  } else {
                    audio.currentTime = 0;
                  }
                }}
                useLink={false}
              />
              <PlayerButton
                custom_classes={isPlaying ? 'pause' : 'play'}
                onClickAction={() => { isPlaying ? audio.pause() : audio.play() }}
                useLink={false}
              />
              <PlayerButton
                custom_classes='forward'
                onClickAction={() => { audio.currentTime = audio.duration - 1 }}
                useLink={false}
              />
              <PlayerButton
                custom_classes={isRepeatEnabled ? 'actrepeat' : 'repeat'}
                onClickAction={toggleRepeat}
                useLink={false}
              />
            </div>

            <div className="other">
              {songData && songData.lyricsURI != undefined ?
                <PlayerButton
                  custom_classes={locationData.pathname == '/lyrics' ? 'actlyrics' : 'lyrics'}
                  onClickAction={() => { }}
                  useLink={true}
                /> : null}

              <div className="volume">
                <img />
                <input type="range" id="volumeController" onChange={changeVolume} step="0.01" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

type StorageType = "local" | "session";

const PlayerButton = ({ custom_classes, custom_css, onClickAction, useLink }: PlayerButtonComponent) => {
  const locationData = useLocation();

  function getStorage(type: StorageType, storagekey: string): string {
    if (type == "local") return localStorage.getItem(storagekey)!;
    else if (type == "session") return sessionStorage.getItem(storagekey)!;
    else return "Not a valid storagetype";
  }

  return (
    <div className="button" style={custom_css} onClick={onClickAction}>
      {useLink ? <Link to={locationData.pathname == "/lyrics" ? getStorage("local", "lastPage") : "/lyrics"} className={custom_classes}></Link> : <p className={custom_classes}></p>}
    </div>
  )
}