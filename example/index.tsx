import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  UncontrolledLionPlyr,
  useHlsPlyr,
  useDashPlyr,
  usePlyr,
} from '../src';

const videoSrc = {
  type: 'video',
  sources: [
    {
      src: 'yWtFb9LJs3o',
      provider: 'youtube'
    }
  ]
};

const hlsSrc = {
  type: 'video',
  sources: [
    {
      src:
        'https://bitmovin-a.akamaihd.net/content/playhouse-vr/m3u8s/105560.m3u8',
      type: 'application/x-mpegURL'
    }
  ]
};

const dashSrc = {
  type: 'video',
  sources: [
    {
      src: 'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd',
      type: 'application/dash+xml',
    }
  ]
};

const switchSrc = "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd";
const switchAlternativeSrc = "https://dash.akamaized.net/dash264/TestCasesHD/2b/qualcomm/1/MultiResMPEG2.mpd";

const mp4Src = {
  type: 'video',
  sources: [
    {
      src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4',
      type: 'video/mp4',
      size: 720,
    },
    {
      src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4',
      type: 'video/mp4',
      size: 1080,
    }
  ]
};

const HlsApp = () => {
  const hlsRef = useHlsPlyr({
    source: hlsSrc,
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const hlsPlayer = hlsRef.current?.plyr;

    if (hlsPlayer) {
      setLoading(false);
      hlsPlayer.on('timeupdate', event => {
        const instance = event.detail.plyr;
        console.log(instance.currentTime);
      });
    }
  })

  return (
    <div>
      <h1>HLS Usage</h1>
      <UncontrolledLionPlyr ref={hlsRef} isLoading={loading} />
    </div>
  );
}

const YoutubeApp = () => {
  const youtubeRef = usePlyr({
    source: videoSrc,
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const youtubePlayer = youtubeRef.current?.plyr;

    if (youtubePlayer) {
      setLoading(false);
      youtubePlayer.on('timeupdate', event => {
        const instance = event.detail.plyr;
        console.log(instance.currentTime);
      });
    }
  })

  return (
    <div>
      <h1>Youtube Usage</h1>
      <UncontrolledLionPlyr ref={youtubeRef} isLoading={loading} />
    </div>
  );
}

const Mp4App = () => {
  const mp4Ref = usePlyr({
    source: mp4Src,
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const mp4Player = mp4Ref.current?.plyr;

    if (mp4Player) {
      setLoading(false);
      mp4Player.on('timeupdate', event => {
        const instance = event.detail.plyr;
        console.log(instance.currentTime);
      });
    }
  })

  return (
    <div>
      <h1>MP4 Usage</h1>
      <UncontrolledLionPlyr ref={mp4Ref} isLoading={loading} />
    </div>
  );
}

const DashApp = () => {
  const dashRef = useDashPlyr({
    source: dashSrc,
  })
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const dashPlayer = dashRef.current?.plyr;

    if (dashPlayer) {
      setLoading(false);
      dashPlayer.on('timeupdate', event => {
        const instance = event.detail.plyr;
        console.log(instance.currentTime);
      });
    }
  })

  return (
    <div>
      <h1>Dash Usage</h1>
      <UncontrolledLionPlyr ref={dashRef} isLoading={loading} />
    </div>
  );
}

const SwitchingSourceApp = () => {
  const [loading, setLoading] = React.useState(true);
  const [toggle, setToggle] = React.useState(false);

  const dashRef = useDashPlyr({
    source: {
      type: 'video',
      sources: [
        {
          src: toggle ? switchSrc : switchAlternativeSrc,
          type: 'application/dash+xml',
        }
      ]
    },
  })

  React.useEffect(() => {
    const dashPlayer = dashRef.current?.plyr;

    if (dashPlayer) {
      setLoading(false);
    }
  })

  return (
    <div>
      <h1>Switching Source Usage</h1>
      <UncontrolledLionPlyr ref={dashRef} isLoading={loading} />
      <button onClick={() => setToggle((current) => !current)}>Switch Source</button>
    </div>
  );
}

const App = () => {
  const [state, setState] = React.useState('dash');

  return (
    <>
      <div>
        {
          state === 'mp4' && (
            <Mp4App />
          )
        }
        {
          state === 'hls' && (
            <HlsApp />
          )
        }
        {
          state === 'dash' && (
            <DashApp />
          )
        }
        {
          state === 'youtube' && (
            <YoutubeApp />
          )
        }
        {
          state === 'switching' && (
            <SwitchingSourceApp />
          )
        }
        <div style={
          {
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            marginTop: '16px',
            gridColumnGap: '16px',
            height: '40px',
          }
        }>
          <button onClick={() => setState('mp4')}>MP4 Player</button>
          <button onClick={() => setState('hls')}>HLS Player</button>
          <button onClick={() => setState('dash')}>Dash Player</button>
          <button onClick={() => setState('youtube')}>Youtube Player</button>
          <button onClick={() => setState('switching')}>Switching Sources</button>
        </div>
      </div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
