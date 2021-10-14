// ANCHOR React
import { useRef, useEffect } from 'react';

// ANCHOR Plyr
import Plyr from 'plyr';

// ANCHOR Types
import { LionPlyrProps, HTMLPlyrVideoElement } from '../UncontrolledLionPlyr';

const usePlyr = ({ source, options }: LionPlyrProps) => {
  const ref = useRef<HTMLPlyrVideoElement>(null);

  useEffect(() => {
    const newPlayer = new Plyr('.player-react', options ?? {});
    newPlayer.source = source;

    if (ref.current) {
      ref.current.plyr = newPlayer;
    }
  }, [options, source]);

  return ref;
};

export default usePlyr;
