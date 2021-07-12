import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  UncontrolledLionPlyr,
  useHlsPlyr,
  useDashPlyr,
  usePlyr,
} from '../.';

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

const HlsApp = () => {
  const hlsRef = useHlsPlyr({
    source: hlsSrc,
  });

  React.useEffect(() => {
    const hlsPlayer = hlsRef.current.plyr;

    if (hlsPlayer) {
      hlsPlayer.on('timeupdate', event => {
        const instance = event.detail.plyr;
        console.log(instance.currentTime);
      });
    }
  })

  return (
    <div>
      <h1>HLS Usage</h1>
      <UncontrolledLionPlyr ref={hlsRef} />
    </div>
  );
}

const YoutubeApp = () => {
  const youtubeRef = usePlyr({
    source: videoSrc,
  });
  React.useEffect(() => {
    const youtubePlayer = youtubeRef.current.plyr;

    if (youtubePlayer) {
      youtubePlayer.on('timeupdate', event => {
        const instance = event.detail.plyr;
        console.log(instance.currentTime);
      });
    }
  })

  return (
    <div>
      <h1>Youtube Usage</h1>
      <UncontrolledLionPlyr ref={youtubeRef} />
    </div>
  );
}

const DashApp = () => {
  const dashRef = useDashPlyr({
    source: dashSrc,
  });

  React.useEffect(() => {
    const dashPlayer = dashRef.current.plyr;

    if (dashPlayer) {
      dashPlayer.on('timeupdate', event => {
        const instance = event.detail.plyr;
        console.log(instance.currentTime);
      });
    }
  })

  return (
    <div>
      <h1>Dash Usage</h1>
      <UncontrolledLionPlyr ref={dashRef} />
    </div>
  );
}

const App = () => {
  const [state, setState] = React.useState('hls');

  return (
    <div>
      {
        state === 'hls' && (
          <HlsApp />
        )
      }
      {
        state === 'youtube' && (
          <YoutubeApp />
        )
      }
      {
        state === 'dash' && (
          <DashApp />
        )
      }
      <div style={
        {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          marginTop: '16px',
          gridColumnGap: '16px',
          height: '40px',
        }
      }>
        <button onClick={() => setState('hls')}>HLS Player</button>
        <button onClick={() => setState('youtube')}>Youtube Player</button>
        <button onClick={() => setState('dash')}>Dash Player</button>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
