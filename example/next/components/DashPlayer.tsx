r/* eslint-disable react-hooks/exhaustive-deps */
import Plyr from 'plyr';
import { useState, useEffect } from 'react';
import {
  UncontrolledLionPlyr,
  useDashPlyr,
} from 'lion-plyr';
import 'lion-plyr/dist/lion-skin.min.css';

const onTimeUpdate = (event: Plyr.PlyrEvent) => {
  const instance = event.detail.plyr;
  console.log(instance.currentTime)
}

export const DashPlayer = () => {
  const dashRef = useDashPlyr({
    source: {
      type: 'video',
      sources: [
        {
          src:
            'https://videodelivery.net/9ce31a6a4dd4a2fc46de774bc0f39d8d/manifest/video.mpd',
          type: 'application/x-mpegURL',
        }
      ]
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      <h1 style={{ textAlign: 'center' }}>Dash Usage</h1>
      <UncontrolledLionPlyr
        ref={dashRef}
        isLoading={loading}
      />
    </div>
  );
}
