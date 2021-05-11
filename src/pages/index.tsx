import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { episodes } from "../services/episodes";
import { convertDurationToTimeString } from "../helpers/convertDurationToTimeString";
import { usePlayer } from "../contexts/PlayerContext";

import styles from "./home.module.scss";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  url: string;
};

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
};

const Home = ({ latestEpisodes, allEpisodes }: HomeProps) => {
  const { playList } = usePlayer();

  const episodeList = [...latestEpisodes, ...allEpisodes];

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map((episode, index) => (
            <li key={episode.id}>
              <Image
                src={episode.thumbnail}
                alt={episode.title}
                height={192}
                width={192}
                objectFit="cover"
              />

              <div className={styles.episodeDetails}>
                <Link href={`/episodio/${episode.id}`}>
                  <a>{episode.title}</a>
                </Link>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
              </div>

              <button
                type="button"
                onClick={() => playList(episodeList, index)}
              >
                <Image
                  src="/play-green.svg"
                  alt="Tocar episódio"
                  width={20}
                  height={20}
                />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => (
              <tr key={episode.id}>
                <td className={styles.image}>
                  <Image
                    src={episode.thumbnail}
                    alt={episode.title}
                    width={20}
                    height={20}
                    objectFit="cover"
                  />
                </td>

                <td>
                  <Link href={`/episodio/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                </td>

                <td>{episode.members}</td>
                <td className={styles.publishedAt}>{episode.publishedAt}</td>
                <td>{episode.durationAsString}</td>
                <td>
                  <button
                    type="button"
                    onClick={() =>
                      playList(episodeList, index + latestEpisodes.length)
                    }
                  >
                    <Image
                      src="/play-green.svg"
                      alt="Tocar episódio"
                      width={20}
                      height={20}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await episodes();

  const newEpisodes = data.map((item) => {
    return {
      id: item.id,
      title: item.title,
      thumbnail: item.thumbnail,
      members: item.members,
      publishedAt: format(parseISO(item.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      duration: Number(item.file.duration),
      durationAsString: convertDurationToTimeString(Number(item.file.duration)),
      url: item.file.url,
    };
  });

  console.log(newEpisodes);

  const latestEpisodes = newEpisodes.slice(0, 2);
  const allEpisodes = newEpisodes.slice(2, newEpisodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },

    revalidate: 60 * 60 * 8,
  };
};
