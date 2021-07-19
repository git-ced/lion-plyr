/* eslint-disable react-hooks/exhaustive-deps */
import Plyr from 'plyr';
import React from 'react';
import {
  UncontrolledLionPlyr,
  useHlsPlyr,
  usePlyr,
} from 'lion-plyr';

const onTimeUpdate = (event: Plyr.PlyrEvent) => {
  const instance = event.detail.plyr;
  console.log(instance.currentTime)
}

const Player = () => {
  const vimeoRef = usePlyr({
    source: {
      type: 'video',
      sources: [
        {
          src: 'https://vimeo.com/533559247',
          provider: 'vimeo'
        }
      ]
    }
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const vimeoPlayer = vimeoRef.current?.plyr;

    if (vimeoPlayer) {
      setLoading(false);
      vimeoPlayer.on('timeupdate', onTimeUpdate);
    }

    return () => {
      console.log('fuck')
      if (vimeoPlayer) {
        vimeoPlayer.off('timeupdate', onTimeUpdate)
      }
    }
  })

  return (
    <div>
      <UncontrolledLionPlyr
        ref={vimeoRef}
        isLoading={loading}
      />
    </div>
  );
}

const RefPlayer = () => {
  const dashRef = useHlsPlyr({
    source: {
      type: 'video',
      sources: [
        {
          src:
            'https://bitmovin-a.akamaihd.net/content/playhouse-vr/m3u8s/105560.m3u8',
          type: 'application/x-mpegURL',
        }
      ]
    },
  })
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const dashPlayer = dashRef.current?.plyr;

    if (dashPlayer) {
      setLoading(false);
      dashPlayer.on('timeupdate', onTimeUpdate);
    }

    return () => {
      if (dashPlayer) {
        dashPlayer.off('timeupdate', onTimeUpdate)
      }
    }
  })

  return (
    <div>
      <UncontrolledLionPlyr ref={dashRef} isLoading={loading} />
    </div>
  );
}

export const VimeoApp = () => {
  const [toggle, setToggle] = React.useState(true);

  return (
    <div>
      <h1>Plyr Usage</h1>
      <button onClick={() => setToggle((current) => !current)}>Toggle</button>
      {toggle ? <Player /> : <RefPlayer />}
    </div>
  );
}
