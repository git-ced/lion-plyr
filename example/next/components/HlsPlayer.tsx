/* eslint-disable react-hooks/exhaustive-deps */
import Plyr from 'plyr';
import { useState, useEffect } from 'react';
import {
  UncontrolledLionPlyr,
  useHlsPlyr,
} from 'lion-plyr';
import 'lion-plyr/dist/lion-skin.min.css';

const onTimeUpdate = (event: Plyr.PlyrEvent) => {
  const instance = event.detail.plyr;
  console.log(instance.currentTime)
}

export const HlsPlayer = () => {
  const hlsRef = useHlsPlyr({
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
    options: {
      autoplay: true,
    }
  })
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hlsPlayer = hlsRef.current?.plyr;

    if (hlsPlayer) {
      setLoading(false);
      hlsPlayer.on('timeupdate', onTimeUpdate);
    }

    return () => {
      if (hlsPlayer) {
        hlsPlayer.off('timeupdate', onTimeUpdate)
      }
    }
  })

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>HLS Usage</h1>
      <UncontrolledLionPlyr
        ref={hlsRef}
        isLoading={loading}
      />
    </div>
  );
}
