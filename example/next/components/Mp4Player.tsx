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

export const Mp4Player = () => {
  const mp4Ref = usePlyr({
    source: {
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
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mp4Player = mp4Ref.current?.plyr;
    

    if (mp4Player) {
      setLoading(false);
      mp4Player.on('timeupdate', onTimeUpdate);
    }

    return () => {
      if (mp4Player) {
        mp4Player.off('timeupdate', onTimeUpdate)
      }
    }
  })

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>MP4 Usage</h1>
      <UncontrolledLionPlyr
        ref={mp4Ref}
        isLoading={loading}
      />
    </div>
  );
}
