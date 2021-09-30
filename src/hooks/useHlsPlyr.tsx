// ANCHOR React
import {
  useRef, useEffect, useMemo, useState,
} from 'react';

// ANCHOR Plyr
import Plyr from 'plyr';

// ANCHOR HLS
import Hls from 'hls.js';

// ANCHOR Types
import { LionPlyrProps, HTMLPlyrVideoElement } from '../UncontrolledLionPlyr/index.d';

declare global {
  interface Window { hls: Hls; }
}

const useHlsPlyr = ({ source, options }: LionPlyrProps) => {
  const ref = useRef<HTMLPlyrVideoElement>(null);
  const hls = useMemo(() => new Hls(), []);
  const defaultOptions: Plyr.Options = useMemo(() => options ?? {}, [options]);
  const [qualityOptions, setQualityOptions] = useState<number[]>();
  const currentSource = source.sources[0].src;

  useEffect(() => {
    if (!window) {
      return;
    }

    window.hls = window.hls || {};

    if (ref.current) {
      if (ref.current.canPlayType('application/vnd.apple.mpegURL')) {
        const newPlayer = new Plyr('.player-react', options ?? {});
        newPlayer.source = {
          ...source,
          sources: [
            {
              ...source.sources[0],
              type: 'application/vnd.apple.mpegURL',
            }
          ]
        };

        ref.current.plyr = newPlayer;
      } else if (!Hls.isSupported()) {
        const newPlayer = new Plyr('.player-react', defaultOptions);

        ref.current.plyr = newPlayer;
      } else {
        hls.loadSource(currentSource);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          const availableQualities = [0, ...hls.levels.map((level) => level.height)]

          setQualityOptions(availableQualities);

          hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
            let span = document.querySelector(
              ".plyr__menu__container [data-plyr='quality'][value='0'] span"
            );

            if (span) {
              if (hls.autoLevelEnabled) {
                span.innerHTML = `AUTO (${hls.levels[data.level].height}p)`
              } else {
                span.innerHTML = `AUTO`
              }
            }
          });
        });
      }
    }
  }, [hls, currentSource])

  useEffect(() => {
    if (qualityOptions && ref.current) {
      const newOptions: Plyr.Options = {
        ...defaultOptions,
        quality: {
          default: 720,
          options: qualityOptions,
          forced: true,
          onChange: newQuality => {
            if (newQuality === 0) {
              hls.currentLevel = -1;
            } else {
              hls.levels.forEach((level, levelIndex) => {
                if (level.height === newQuality) {
                  hls.currentLevel = levelIndex;
                }
              });
            }
          }
        },
        i18n: {
          qualityLabel: {
            0: 'Auto'
          }
        }
      }

      const newPlayer = new Plyr('.player-react', newOptions);

      ref.current.plyr = newPlayer;
      hls.attachMedia(ref.current);
      window.hls = hls;
    }


    return () => {
      if (hls && qualityOptions) {
        hls.detachMedia();
      }
    }
  }, [hls, qualityOptions]);

  return ref;
};

export default useHlsPlyr;
