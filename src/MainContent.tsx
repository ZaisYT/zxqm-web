import React, { useEffect, useState } from 'react';
import './css/MainContent.css';
import './test/css/CardTest.css';
import { Link } from 'react-router-dom';
import Card from './test/Card';


type typeSongData = {
  "releaseURI": string,
  "lyricsURI": string,
  "songArtists": string[],
  "songName": string,
  "songURL": string
}

type typeArtistData = {
  "bannerURL": string,
  "isPartner": boolean,
  "name": string,
  "pfp": string
}

type ContentType = {
  setSongID: React.Dispatch<React.SetStateAction<string[]>>,
  audio: HTMLAudioElement,
}

export const MainContent = ({ setSongID, audio }: ContentType) => {
  const [timeDisplay, setTimeDisplay] = useState("");
  const [songCards, setSongCards] = useState<JSX.Element[]>([]);
  const [artistCards, setArtistCards] = useState<JSX.Element[]>([]);

  const [defaultCards, setDefaultCards] = useState(0);

  function calculateMaximumCards() {
    let screenWidth = window.outerWidth;
    let cardCount = 0;

    if (screenWidth >= 1692){
      cardCount = 7;
    } else if (screenWidth >= 1420 && screenWidth < 1692){
      cardCount = 6;
    } else if (screenWidth >= 1188 && screenWidth < 1420){
      cardCount = 5;
    } else if (screenWidth >= 981 && screenWidth < 1188){
      cardCount = 4;
    } else if (screenWidth >= 721 && screenWidth < 981){
      cardCount = 3;
    } else {
      cardCount = 2;
    }

    return cardCount;
  }

  useEffect(() => {
    const updateCardCount = () => {
      setDefaultCards(calculateMaximumCards());
    };

    // Initial calculation
    updateCardCount();

    // Recalculate on window resize
    window.addEventListener('resize', updateCardCount);

    return () => {
      window.removeEventListener('resize', updateCardCount);
    };
  }, [])

  useEffect(() => {
    setSongCards([]);

    fetch("https://zxqm-rest-api-default-rtdb.firebaseio.com/songs.json")
      .then(res => res.json())
      .then(data => {
        let nofsongs = Object.keys(data).length;
        const uniqueSongIndexes = generateUniqueRandomNumbers(defaultCards, 0, (nofsongs - 1));

        let arrayOfCards = [];

        for (let num in uniqueSongIndexes) {
          let id = Object.keys(data)[uniqueSongIndexes[num]];
          let newCard = generateSongCard(data[id], id);

          arrayOfCards.push(newCard);
        }

        setSongCards(arrayOfCards);
      });

      fetch("https://zxqm-rest-api-default-rtdb.firebaseio.com/artists.json")
      .then(res => res.json())
      .then(data => {
        let nofartists = Object.keys(data).length;

        let cards = defaultCards;
        if (defaultCards <= nofartists) cards = nofartists; else cards = defaultCards;
        const uniqueSongIndexes = generateUniqueRandomNumbers(cards, 0, (nofartists - 1));

        let arrayOfCards = [];

        for (let num in uniqueSongIndexes) {
          let newCard = generateArtistCard(data[Object.keys(data)[uniqueSongIndexes[num]]], Object.keys(data)[uniqueSongIndexes[num]]);

          arrayOfCards.push(newCard);
        }

        setArtistCards(arrayOfCards);
      });
  }, [defaultCards]);

  function generateUniqueRandomNumbers(length: number, min: number, max: number) {
    if (length > (max - min + 1)) {
      throw new Error("Cannot generate unique random numbers. Length exceeds range.");
    }

    const result: number[] = [];
    while (result.length < length) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!result.includes(randomNumber)) {
        result.push(randomNumber);
      }
    }
    return result;
  }

  useEffect(() => {
    const date = new Date();
    const hour = date.getHours();

    if (hour > 5 && hour <= 12) {
      setTimeDisplay("Buenos Dias!");
    } else if (hour > 12 && hour <= 18) {
      setTimeDisplay("Buenas Tardes!");
    } else {
      setTimeDisplay("Buenas Noches!");
    }
  }, []);

  // const locationData = useLocation();

  const fetchPortrait = async (release: string): Promise<string> => {
    try {
      const response = await fetch(`https://zxqm-rest-api-default-rtdb.firebaseio.com/releases/${release}/iconURL.json`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching portrait:', error);
      return '';
    }
  };

  const generateSongCard = (data: typeSongData, id: string) => {
    const [portada, setPortada] = useState(''); // Estado para almacenar la URL de la portada
  
    useEffect(() => {
      const loadPortrait = async () => {
        const url = await fetchPortrait(data.releaseURI);
        setPortada(url); // Actualiza la portada una vez cargada
      };
      loadPortrait(); // Llamar a la función para cargar la portada
    }, [data.releaseURI]); // Se ejecuta cuando `data.releaseURI` cambie
  
    return (
      <Card color='#f50' onclicke={() => {
        audio.pause();
        setSongID([id]);
      }}>
        <img src={portada} draggable="false" alt="Song cover" />
        <h2>{data.songName}</h2>
        <h3>{formatArtists(data.songArtists)}</h3>
      </Card>
    );
  };

  function generateArtistCard(data: typeArtistData, id: string) {
    return (
      <Link to={`artist/${id}`}>
        <Card color='#f50'>
          <img src={data.pfp} draggable="false" />
          <h2>{data.name}</h2>
        </Card>
      </Link>
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
    <div className='mainPage'>
      <h1 id='time'>{timeDisplay}</h1>
      <h2 className="title">{"Canciones para ti"}</h2>
      <div className="cards">
        {songCards}
      </div>

      <h2 className="title">{"Artistas para ti"}</h2>
      <div className="cards">
        {artistCards}
      </div>
    </div>
  )
}
