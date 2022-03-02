// ANCHOR React
import {
  useRef, useEffect, useMemo, useState,
} from 'react';

// ANCHOR Plyr
import Plyr from 'plyr';

// ANCHOR Dash
import Dash from 'dashjs';

// ANCHOR Types
import { LionPlyrProps, HTMLPlyrVideoElement } from '../UncontrolledLionPlyr';

const useDashPlyr = ({ source, options }: LionPlyrProps) => {
  const ref = useRef<HTMLPlyrVideoElement>(null);
  const dash = useMemo(() => Dash.MediaPlayer().create(), []);
  const currentSource = source.sources[0];
  const defaultOptions: Plyr.Options = useMemo(() => options ?? {}, [options]);
  const [qualityOptions, setQualityOptions] = useState<number[]>();

  useEffect(() => {
    if (!window) {
      return;
    }

    window.dashjs = window.dashjs || {};

    if (ref.current) {
      if (!Dash.supportsMediaSource) {
        const newPlayer = new Plyr('.player-react', defaultOptions);
        newPlayer.source = source;

        ref.current.plyr = newPlayer;
      } else {
        dash.initialize(
          ref.current,
          currentSource.src,
          options?.autoplay ?? false,
        );

        dash.on('playbackMetaDataLoaded', () => {
          let span = document.querySelector(
            ".plyr__menu__container [data-plyr='quality'][value='0'] span"
          );

          if (span) {
            span.innerHTML = 'AUTO';
          }

          const bitrateList = dash.getBitrateInfoListFor('video');

          setQualityOptions([0, ...bitrateList.map(bitrate => bitrate.height)]);
        })
      }
    }
  }, [dash, currentSource.src, options?.autoplay])

  useEffect(() => {
    if (qualityOptions && ref.current) {
      const newOptions: Plyr.Options = {
        ...defaultOptions,
        quality: {
          default: 720,
          options: qualityOptions,
          forced: true,
          onChange: (newQuality) => {
            dash.setQualityFor(
              'video',
              newQuality === 0 ? -1 : qualityOptions.indexOf(newQuality) - 1,
              true,
            );
          }
        },
        i18n: {
          qualityLabel: {
            0: 'Auto',
          },
        },
      }

      const newPlayer = new Plyr('.player-react', newOptions);
      ref.current.plyr = newPlayer;
    }

    return () => {
      if (dash && qualityOptions) {
        dash.reset();
      }
    }
  }, [dash, qualityOptions]);

  return ref;
};

export default useDashPlyr;
