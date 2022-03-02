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

export const YoutubePlayer = () => {
  const youtubeRef = usePlyr({
    source: {
      type: 'video',
      sources: [
        {
          src: 'yWtFb9LJs3o',
          provider: 'youtube'
        }
      ]
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const youtubePlayer = youtubeRef.current?.plyr;

    if (youtubePlayer) {
      setLoading(false);
      youtubePlayer.on('timeupdate', onTimeUpdate);
    }

    return () => {
      if (youtubePlayer) {
        youtubePlayer.off('timeupdate', onTimeUpdate)
      }
    }
  })

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Youtube Usage</h1>
      <UncontrolledLionPlyr
        ref={youtubeRef}
        isLoading={loading}
      />
    </div>
  );
}
