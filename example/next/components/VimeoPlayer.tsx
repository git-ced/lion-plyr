/* eslint-disable react-hooks/exhaustive-deps */
import Plyr from 'plyr';
import { useState, useEffect } from 'react';
import {
  UncontrolledLionPlyr,
  usePlyr,
} from 'lion-plyr';
import 'lion-plyr/dist/lion-skin.min.css';

const onTimeUpdate = (event: Plyr.PlyrEvent) => {
  const instance = event.detail.plyr;
  console.log(instance.currentTime)
}

export const VimeoPlayer = () => {
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const vimeoPlayer = vimeoRef.current?.plyr;

    if (vimeoPlayer) {
      setLoading(false);
      vimeoPlayer.on('timeupdate', onTimeUpdate);
    }

    return () => {
      if (vimeoPlayer) {
        vimeoPlayer.off('timeupdate', onTimeUpdate)
      }
    }
  })

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Vimeo Usage</h1>
      <UncontrolledLionPlyr
        ref={vimeoRef}
        isLoading={loading}
      />
    </div>
  );
}
