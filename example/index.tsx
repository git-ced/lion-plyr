import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { UncontrolledLionPlyr, useHlsPlyr, usePlyr } from '../.';

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

const App = () => {
  const [toggle, setToggle] = React.useState(true);

  return (
    <div>
      {toggle ? <HlsApp /> : <YoutubeApp />}
      <button onClick={() => setToggle(currentState => !currentState)}>Toggle</button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
