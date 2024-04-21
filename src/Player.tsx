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

const FETCHURL = "https://zxqm-rest-api-default-rtdb.firebaseio.com/songs/";

export const Player = ({ queue, audio, currentSongIndex, setCurrentSongIndex }: PlayerReq) => {
  const [songData, setSongData] = useState({
    "iconURL": "",
    "lyricsURI": "",
    "songArtists": [],
    "songName": "",
    "songURL": ""
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingNewSong, setLoadingNewSong] = useState(false);
  const [isRepeatEnabled, setIsRepeatEnabled] = useState(false);
  const [isShuffleEnabled, setIsShuffleEnabled] = useState(false);

  useEffect(() => {
    audio.addEventListener('ended', handleSongEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    return () => {
      audio.removeEventListener('ended', handleSongEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [currentSongIndex]);

  useEffect(() => {
    audio.loop = isRepeatEnabled;
  }, [isRepeatEnabled]);

  useEffect(() => {
    if (loadingNewSong) {
      audio.pause();
      audio.currentTime = 0;
    }

    fetch(`${FETCHURL}${queue[currentSongIndex]}.json`)
      .then(res => res.json())
      .then(data => {
        setSongData(data);
        audio.src = data.songURL;

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
    if (isShuffleEnabled) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      newIndex = randomIndex !== currentSongIndex ? randomIndex : (randomIndex + 1) % queue.length;
    } else {
      if (queue.length == 1){
        newIndex = currentSongIndex;
      } else {
        newIndex = (currentSongIndex + 1) % queue.length;
      }
    }
    setCurrentSongIndex(newIndex);
  }

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

  const locationData = useLocation();

  audio.preload = "metadata";

  useEffect(() => {
    let seekslider = document.getElementById("seekSlider")! as HTMLInputElement;
    let totalTimeIndicator = document.getElementById("totalTime")!;


    const handleLoadedMetadata = () => {
      seekslider.max = String(Math.floor(audio.duration * 1000));

      let duration = Math.floor(audio.duration);
      let seconds;
      if (duration % 60 <= 9) {
        seconds = "0"+duration % 60; 
      } else {
        seconds = duration % 60;
      }

      let minutes;
      if (Math.floor(duration / 60) <= 9) {
        minutes = "0"+Math.floor(duration / 60); 
      } else {
        minutes = Math.floor(duration / 60);
      }

      totalTimeIndicator.innerHTML = `${minutes+":"+seconds}`; 

      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };

    audio.addEventListener('timeupdate', () => {
      let curTimeIndicator = document.getElementById("curTime")!;
      seekslider.value = String(audio.currentTime * 1000);

      let min = 0
      let max = Math.floor(audio.duration * 1000);
      let val = (audio.currentTime);
      seekslider.style.backgroundSize = (val * 100000) / (max - min) + '% 100%'

      let currentTime = Math.floor(audio.currentTime);
      let seconds;
      if (currentTime % 60 <= 9) {
        seconds = "0"+currentTime % 60; 
      } else {
        seconds = currentTime % 60;
      }

      let minutes;
      if (Math.floor(currentTime / 60) <= 9) {
        minutes = "0"+Math.floor(currentTime / 60); 
      } else {
        minutes = Math.floor(currentTime / 60);
      }

      curTimeIndicator.innerHTML = `${minutes+":"+seconds}`; 
    });

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.load();

    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: songData.songName,
        artist: songData.songArtists[0],
        artwork: [{ src: songData.iconURL }],
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

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };

  }, [audio, songData]);

  return (
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
            <img draggable="false" src={songData.iconURL} />
            <div className="details">
              <h1>{songData.songName}</h1>
              <h2>{songData.songArtists[0]}</h2>
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
            <PlayerButton
              custom_classes={locationData.pathname == '/lyrics' ? 'actlyrics' : 'lyrics'}
              onClickAction={() => { }}
              useLink={true}
            />
            <div className="volume">
              <img />
              <input type="range" id="volumeController" onChange={changeVolume} step="0.01" />
            </div>
          </div>
        </div>
      </div>
    </div>
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
