import Head from 'next/head'
import dynamic from 'next/dynamic';
import { useState } from 'react';

type VideoFormats = 'vimeo' | 'hls' | 'mp4' | 'youtube' | 'dash';

const VimeoPlayer = dynamic(
  async () => {
    const mod = await import('../components/VimeoPlayer');
    return mod.VimeoPlayer;
  },
  {
    ssr: false,
  },
)

const HlsPlayer = dynamic(
  async () => {
    const mod = await import('../components/HlsPlayer');
    return mod.HlsPlayer;
  },
  {
    ssr: false,
  },
)

const Mp4Player = dynamic(
  async () => {
    const mod = await import('../components/Mp4Player');
    return mod.Mp4Player;
  },
  {
    ssr: false,
  },
)

const DashPlayer = dynamic(
  async () => {
    const mod = await import('../components/DashPlayer');
    return mod.DashPlayer;
  },
  {
    ssr: false,
  },
)

const YoutubePlayer = dynamic(
  async () => {
    const mod = await import('../components/YoutubePlayer');
    return mod.YoutubePlayer;
  },
  {
    ssr: false,
  },
)

export default function Home() {
  const [state, setState] = useState<VideoFormats>('mp4');

  return (
    <div>
      <Head>
        <title>Lion Plyr Demo</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '800px',
          }}
        >
          {state === 'vimeo' && <VimeoPlayer />}
          {state === 'hls' && <HlsPlayer />}
          {state === 'mp4' && <Mp4Player />}
          {state === 'dash' && <DashPlayer />}
          {state === 'youtube' && <YoutubePlayer />}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              marginTop: '24px',
              gridColumnGap: '16px',
              height: '40px',
            }}
          >
            <button onClick={() => setState('mp4')}>MP4 Player</button>
            <button onClick={() => setState('hls')}>HLS Player</button>
            <button onClick={() => setState('dash')}>Dash Player</button>
            <button onClick={() => setState('youtube')}>Youtube Player</button>
            <button onClick={() => setState('vimeo')}>Vimeo Player</button>
          </div>
        </div>
      </div>
    </div>
  )
}
