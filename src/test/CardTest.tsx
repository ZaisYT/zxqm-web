import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import './css/CardTest.css';  // Asegúrate de importar los estilos necesarios

interface typeSongData {
  iconURL: string;
  songName: string;
  songArtists: string[];
}

interface typeArtistData {
  pfp: string;
  name: string;
}

const formatArtists = (artists: string[]) => artists.join(', ');

const CardTest: React.FC = () => {
  const generateSongCard = (data: typeSongData) => (
    <Card color='#f50'>
      <img src={data.iconURL} draggable="false" />
      <h2>{data.songName}</h2>
      <h3>{formatArtists(data.songArtists)}</h3>
    </Card>
  );

  const generateArtistCard = (key: number, data: typeArtistData, id: string) => (
    <Link to={`artist/${id}`} key={key}>
      <Card color='#f50'>
        <img src={data.pfp} draggable="false" />
        <h2>{data.name}</h2>
      </Card>
    </Link>
  );

  // Ejemplo de uso con datos
  const exampleSongData: typeSongData = {
    iconURL: 'https://i.scdn.co/image/ab67616d00001e024e5b3584c8d41b4f75cefcea',
    songName: 'Natanael Cano: BZRP MUSIC SESSION VOL.69',
    songArtists: ['Bizarrap', 'Natanael Cano']
  };

  const exampleArtistData: typeArtistData = {
    pfp: 'https://example.com/pfp.jpg',
    name: 'Example Artist'
  };

  return (
    <div className='cardsContainer'>
      <div className="cards">
        <Card color="#f50"></Card>
        {generateSongCard(exampleSongData)}
        {generateSongCard(exampleSongData)}
        {generateSongCard(exampleSongData)}
        {generateArtistCard(2, exampleArtistData, 'artist-id')}
      </div>
    </div>
  );
};

export default CardTest;
