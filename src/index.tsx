import React, { useState, useRef, useEffect, forwardRef } from 'react';
import Plyr from 'plyr';
import Hls from 'hls.js';

export interface IUncontrolledPlayerProps {
  plyr: Plyr;
}

declare global {
  interface Window { hls: Hls; }
}

window.hls = window.hls || {};

export interface ILionPlyrProps {
  source: Plyr.SourceInfo;
  options?: Plyr.Options;
}

export type HTMLPlyrVideoElement = HTMLVideoElement & { plyr?: Plyr }

export const UncontrolledLionPlyr = forwardRef<HTMLPlyrVideoElement | null>((_, ref) => {
  return (
    <div>
      <video ref={ref} className="player-react plyr" />
    </div>
  );
});

export const useHlsPlyr = ({ source, options }: ILionPlyrProps) => {
  const ref = useRef<HTMLPlyrVideoElement>(null);
  const defaultOptions: Plyr.Options = {};
  const currentSource = source.sources[0];
  const [player, setPlayer] = useState<Plyr>();
  const [currentHls, setCurrentHls] = useState<Hls>();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    if (currentSource) {
      if (!Hls.isSupported()) {
        setPlayer(new Plyr('.player-react', options ?? defaultOptions));
      } else {
        const hls = new Hls();
        setCurrentHls(hls);
        hls.loadSource(currentSource.src ?? '');

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          const availableQualities = hls.levels.map(l => l.height);
          availableQualities.unshift(0);

          defaultOptions.quality = {
            default: 720,
            options: availableQualities,
            forced: true,
            onChange: event => updateQuality(event)
          };
          defaultOptions.i18n = {
            qualityLabel: {
              0: 'Auto'
            }
          };

          hls.on(Hls.Events.LEVEL_SWITCHED, function (_, data) {
            var span = document.querySelector(
              ".plyr__menu__container [data-plyr='quality'][value='0'] span"
            );
            if (span) {
              if (hls.autoLevelEnabled) {
                span.innerHTML = `AUTO (${hls.levels[data.level].height}p)`;
              } else {
                span.innerHTML = `AUTO`;
              }
            }
          });

          // Initialize new Plyr player with quality options
          setPlayer(new Plyr('.player-react', options ?? defaultOptions));
        });

        hls.attachMedia(ref.current);
        window.hls = hls;
      }
    }

    function updateQuality(newQuality: number) {
      if (newQuality === 0) {
        window.hls.currentLevel = -1;
      } else {
        window.hls.levels.forEach((level, levelIndex) => {
          if (level.height === newQuality) {
            window.hls.currentLevel = levelIndex;
          }
        });
      }
    }

    return () => {
      if (currentHls) {
        currentHls.detachMedia();
        window.hls = currentHls;
      }
    };
  }, [source, options]);

  useEffect(() => {
    if (ref.current && player) {
      ref.current.plyr = player;
    }

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [player]);

  return { ref };
};

export const usePlyr = ({ source, options }: ILionPlyrProps) => {
  const ref = useRef<HTMLPlyrVideoElement>(null);
  const defaultOptions: Plyr.Options = {};
  const [player, setPlayer] = useState<Plyr>();

  useEffect(() => {
    const newPlayer = new Plyr('.player-react', options ?? defaultOptions);
    newPlayer.source = source;
    setPlayer(newPlayer);
  }, [source, options]);

  useEffect(() => {
    if (ref.current && player) {
      ref.current.plyr = player;
    }

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [player]);

  return { ref };
};

export const LionPlyr = ({ source, options }: ILionPlyrProps) => {
  const { ref } = usePlyr({ source, options });

  return (
    <UncontrolledLionPlyr ref={ref} />
  );
};

export const LionHlsPlyr = ({ source, options }: ILionPlyrProps) => {
  const { ref } = useHlsPlyr({ source, options });

  return (
    <UncontrolledLionPlyr ref={ref} />
  );
};
