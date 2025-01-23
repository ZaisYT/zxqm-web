import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import './css/Discography.css';

type ArtistObj = {
  song: HTMLAudioElement,
  setSongID: React.Dispatch<React.SetStateAction<string[]>>,
}

type songDataType = {
  "iconURL": string,
  "lyricsURI": string,
  "songArtists": string[],
  "songName": string,
  "songURL": string,
}

export const Discography = ({ song, setSongID }: ArtistObj) => {
  const params = useParams();
  const artistID = params.id;

  const ARTISTAPI = "https://zxqm-rest-api-default-rtdb.firebaseio.com/artists/";
  const SONGAPI = "https://zxqm-rest-api-default-rtdb.firebaseio.com/songs/";

  const [songData, setSongData] = useState<String[]>([]);
  const [songCards, setSongCards] = useState<JSX.Element[]>([]);


  useEffect(() => {
    fetch(`${ARTISTAPI}${artistID}/songs.json`)
      .then(res => res.json())
      .then(data => {
        if (data == null) {
          setSongData(["null"]);
        } else {
          setSongData(data);
        }
      });
  }, []);

  useEffect(() => {
    if (songData.length > 0) {
      const datas: any = {};
      Promise.all(songData.map(songID =>
        fetch(`${SONGAPI}${songID}.json`)
          .then(res => res.json())
          .then(data => datas[`${songID}`] = data)
      )).then(() => {
        console.log(datas);

        let arrayOfCards: any = [];
        for (let i = 0; i <= songData.length - 1; i++) {
          let id = String(songData[i]);

          let newCard = generateSongCard(Number(i), datas[id], id);

          arrayOfCards.push(newCard);

          console.log(datas[id]);
        }
        setSongCards(arrayOfCards);
      });
    }
  }, [songData]);

  function generateSongCard(key: number, data: songDataType, id: string) {
    return (
      <div key={key} className="card" onClick={() => {
        song.pause();
        setSongID([id]);
      }}>
        <img src={data.iconURL} draggable="false" />
        <h2>{data.songName}</h2>
        <h3>{formatArtists(data.songArtists)}</h3>
      </div>
    )
  }

  const formatArtists = (artists: string[]): string => {
    const artistCount = artists.length;

    if (artistCount === 1) {
      return artists[0];
    } else if (artistCount === 2) {
      return `${artists[0]} & ${artists[1]}`;
    } else {
      return `${artists.slice(0, -1).join(', ')} & ${artists[artistCount - 1]}`;
    }
  };

  return (
    <div className='discoWrapper'>
      <h1>Discografia</h1>
      <div className='cardsHolder'>{songCards}</div>
    </div>
  )
}
