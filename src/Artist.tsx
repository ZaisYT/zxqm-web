import React, { useEffect, useState } from 'react';
import './test/css/CardTest.css';
import './css/Artist.css';
import { Link, useParams } from 'react-router-dom';
import Card from './test/Card';
import { Fof } from './404';
import SVGVERIFIED from "./svgs/verified.svg";

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

type releaseDataType = {
  "iconURL": string,
  "artistsURIs": string[],
  "name": string,
  "songURIs": string[],
  "type": "Single" | "EP" | "LP" | "Album"
}

export const Artist = (/*{ song, setSongID }: ArtistObj*/) => {
  const ARTISTAPI = "https://zxqm-rest-api-default-rtdb.firebaseio.com/artists/";
  const RELEASESAPI = "https://zxqm-rest-api-default-rtdb.firebaseio.com/releases/";
  const SONGAPI = "https://zxqm-rest-api-default-rtdb.firebaseio.com/songs/";

  const [artistData, setArtistData] = useState({
    "bannerURL": "",
    "isPartner": "",
    "name": "",
    "pfp": "",
    "releases": [],
  });

  const params = useParams();
  const artistID = params.id;

  const [songCards, setSongCards] = useState<JSX.Element[]>([]);
  const [recommendedSongCards, setRecommendedSongCards] = useState<JSX.Element[]>([]);

  useEffect(() => {
    fetch(`${ARTISTAPI}${artistID}.json`)
      .then(res => res.json())
      .then(data => {
        if (data == null) {
          setArtistData({
            "bannerURL": "",
            "isPartner": "",
            "name": "null",
            "pfp": "",
            "releases": [],
          })
        } else {
          setArtistData(data);
        }
      });
  }, []);

  useEffect(() => {
    if (artistData.name == "null") return;

    if (artistData.releases.length > 0) {
      const datas: any = {};
      Promise.all(artistData.releases.map(releaseID =>
        fetch(`${RELEASESAPI}${releaseID}.json`)
          .then(res => res.json())
          .then(data => datas[`${releaseID}`] = data)
      )).then(() => {
        console.log(datas);

        if (songCards.length != 0) return
        if (recommendedSongCards.length != 0) return

        let limit: number;
        if (artistData.releases.length <= 5) {
          limit = artistData.releases.length - 1
        } else {
          limit = 4;
        }

        let arrayOfCards = [];
        for (let i = 0; i <= limit; i++) {
          let id = artistData.releases[i];
          let newCard = generateSongCard(Number(i), datas[id], id);

          arrayOfCards.push(newCard);
        }
        setSongCards(arrayOfCards);

        let urn = generateUniqueRandomNumbers(limit, 0, artistData.releases.length - 1);
        // console.log(urn);

        let recoarrayOfCards = [];
        for (let i = 0; i <= (urn.length - 1); i++) {
          let id = artistData.releases[urn[i]];
          let newCard = generateSongCard(Number(i), datas[id], id);

          recoarrayOfCards.push(newCard);
        }
        setRecommendedSongCards(recoarrayOfCards);
      });
    }
  }, [artistData]);

  function generateSongCard(key: number, data: releaseDataType, id: string) {
    return (
      <Card color='#f50' key={key} onclicke={() => {
        // song.pause();
        // setSongID([id]);
      }}>
        <img src={data.iconURL} draggable="false" />
        <h2>{data.name}</h2>
        {/* <h3>{formatArtists(data.songURIs)}</h3> */}
      </Card>
    )
  }

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
    <>
      {artistData.name == "null" ?
        <Fof /> :
        <div className='artistProfile'>
          <div className="artistContent">
            <div className="recommended">
              <h1>Canciones recomendadas</h1>
            </div>

            <div className="latest">
              <h1>Ultimos Lanzamientos</h1>
            </div>

            <div className="discography">
              <div className="title">
                <h1>Discografia</h1>
                <h1>Ver mas</h1>
              </div>
            </div>
          </div>

          <div className='artistInfo'>
            <div className='topSection'>
              <h1>{artistData.name}</h1>
              {artistData.isPartner ? <img draggable="false" src={SVGVERIFIED} alt=''/> : ""}
            </div>
            <div className='infoSection'>
              <img draggable="false" src={artistData.pfp == "null" ? "" : artistData.pfp} alt="" />
              <p className="bio">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis deserunt soluta odit dolor, nulla consequatur dicta distinctio vel corrupti vitae! Ipsam nihil cupiditate natus maxime itaque, odit magni consequatur voluptatem iste excepturi quia! Autem natus perspiciatis commodi dignissimos quo nulla sed placeat, nesciunt, veniam inventore asperiores distinctio? Quod consequatur ipsum, laboriosam necessitatibus nam sed ut placeat omnis adipisci consectetur id ea exercitationem non eaque, fugit quis minima temporibus doloremque sapiente facilis perspiciatis tempore enim aut? Tenetur consectetur, cupiditate quidem labore, voluptas voluptatum libero magni unde iure vitae aspernatur ipsam dolor exercitationem, similique est! Cumque minima repellat ullam veniam repudiandae quaerat consequuntur iste corrupti assumenda iusto error quod, dolor tempora, magnam consectetur, delectus fugiat nihil maxime officia. Ullam, est. Facilis, consectetur. Aspernatur eos quaerat quam nisi facere ut magni placeat iste dolore provident? Tenetur nisi odio voluptates, cum, ipsum ut natus adipisci eaque aspernatur fuga inventore quaerat, illum quo. Praesentium, alias fuga! Accusamus fuga sed officia nobis dolores quis recusandae suscipit aliquid! Consectetur odit magni ad at iste. Nostrum optio temporibus perspiciatis magnam similique voluptas, modi numquam iste iure odit quas ipsam at consequuntur voluptate facilis voluptates eius doloribus porro nobis. Ea hic voluptatem quos quisquam, possimus nostrum officia molestias laboriosam!</p>
            </div>
          </div>
        </div>
      }
    </>
  )
}

// <div className='contentArtsWrapper'>
{/* {artistData.name == "null" ?
        <Fof/> :
        <>
          <div className="BannerArea">
            <div className='info'>
              <h1>{artistData.name}</h1>
              {artistData.isPartner ? <div className='isVerified'><p className='verified'> </p><p>PARTNER</p></div>
                : ""}
            </div>
            <div className="redes">
              <p>X</p>
              <p>TT</p>
              <p>IG</p>
              <p>YT</p>
            </div>
          </div>

          <div className="BiographyArea">

          </div>

          <div className="MainContentArea">
            <h1>Canciones Recomendadas</h1>
            <div className='cards'>
              {recommendedSongCards}
            </div>
          </div>

          <div className="DiscographyArea">
            <div className='Labels'>
              <h1>Discografia</h1>
              <Link to={`/discography/${artistID}`}>Ver todo</Link>
            </div>
            <div className='cards'>
              {songCards}
            </div>
          </div>
        </>} */}
