import React, { useState, useEffect } from 'react';
import './css/Search.css';
import Card from './test/Card';

type Objparams = {
  song: HTMLAudioElement,
  setSongID: React.Dispatch<React.SetStateAction<string[]>>,
}

type songObj = {
  releaseURI: string,
  lyricsURI: string,
  songArtists: string[],
  songName: string,
  songURL: string,
}

export const Search = ({ song, setSongID }: Objparams) => {
  const [songs, setSongs] = useState<Record<string, songObj>>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<songObj[]>([]);
  const [songKeys, setSongKeys] = useState<string[]>([]);
  const [portraits, setPortraits] = useState<Record<string, string>>({});
  const apiUrl = 'https://zxqm-rest-api-default-rtdb.firebaseio.com/songs.json';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data: Record<string, songObj> = await response.json();
        setSongs(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      const trimmedSearchTerm = searchTerm.replace(/^\s+/g, '');

      const filteredSongs = Object.keys(songs).filter(uri =>
        songs[uri].songName.toLowerCase().includes(trimmedSearchTerm.toLowerCase()) ||
        songs[uri].songArtists.some(artist => artist.toLowerCase().includes(trimmedSearchTerm.toLowerCase()))
      );
      setSearchResults([]);
      setSongKeys([]);

      const songsKeys = filteredSongs.slice(0, 6);
      setSongKeys(songsKeys);

      const firstFiveResults = songsKeys.map(uri => songs[uri]);
      setSearchResults(firstFiveResults);

      // Fetch portraits for filtered songs
      songsKeys.forEach(async (uri) => {
        const portraitUrl = await fetchPortrait(songs[uri].releaseURI);
        setPortraits(prevPortraits => ({ ...prevPortraits, [uri]: portraitUrl }));
      });
    } else {
      setSearchResults([]);
      setSongKeys([]);
    }
  }, [searchTerm, songs]);

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

  return (
    <div className='contentWrapper'>
      <input className='searchinput' type="text" placeholder="Buscar canciones por nombre o artista" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

      <div className='resultsWrapper'>
        {searchResults.length > 0 ? (
          <>
            <h1>Resultados de la búsqueda:</h1>
            <div className='cards'>
              {searchResults.map((result, index) => (
                <Card color='#f50' key={index} onclicke={() => { 
                  song.pause();
                  setSongID([songKeys[index]]);
                  }}>
                  <img 
                    draggable={false} 
                    src={portraits[songKeys[index]] || ''} 
                    alt={result.songName} 
                  />
                  <h2 className='name'>{result.songName}</h2>
                  <h3 className='arts'>{formatArtists(result.songArtists)}</h3>
                </Card>
              ))}
            </div>
          </>
        ) : (
          searchTerm.trim() !== "" && (
            <>
              <h1>Resultados de la búsqueda:</h1>
              <div className='results'>
                <h2 className='noneresult'>No se encontraron resultados para "{searchTerm}"</h2>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
