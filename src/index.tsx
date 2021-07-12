import React, { useRef, useEffect, forwardRef } from 'react';
import Plyr from 'plyr';
import Hls from 'hls.js';
import './styles.css';

export interface IUncontrolledPlayerProps {
  plyr: Plyr;
}

declare global {
  interface Window { hls: Hls; }
}

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
  const defaultOptions: Plyr.Options = options ?? {};
  const currentSource = source.sources[0];

  useEffect(() => {
    let hls: Hls;
    let player: Plyr;
    let newOptions: Plyr.Options;

    if (!window) {
      return;
    }

    window.hls = window.hls || {};

    if (!Hls.isSupported()) {
      const newPlayer = new Plyr('.player-react', defaultOptions);

      if (ref.current) {
        player = newPlayer;
        ref.current.plyr = newPlayer;
      }
    } else {
      hls = new Hls();
      hls.loadSource(currentSource.src);

      const availableQualities = hls.levels.map(level => level.height);
      availableQualities.unshift(0);

      newOptions = {
        ...defaultOptions,
        quality: {
          default: 720,
          options: availableQualities,
          forced: true,
          onChange: event => updateQuality(event)
        },
        i18n: {
          qualityLabel: {
            0: 'Auto'
          }
        }
      }

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
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
      });

      const newPlayer = new Plyr('.player-react', newOptions);

      if (ref.current) {
        player = newPlayer;
        ref.current.plyr = newPlayer;
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
      hls.detachMedia();
      player.destroy();
    }
  }, [currentSource, defaultOptions, source]);

  return ref;
};

export const usePlyr = ({ source, options }: ILionPlyrProps) => {
  const ref = useRef<HTMLPlyrVideoElement>(null);

  useEffect(() => {
    let player: Plyr;
    const newPlayer = new Plyr('.player-react', options ?? {});
    newPlayer.source = source;

    if (ref.current) {
      player = newPlayer
      ref.current.plyr = newPlayer;
    }

    return () => {
      player.destroy();
    }
  }, [source]);

  return ref;
};

export const LionPlyr = ({ source, options }: ILionPlyrProps) => {
  const ref = usePlyr({ source, options });

  return (
    <UncontrolledLionPlyr ref={ref} />
  );
};

export const LionHlsPlyr = ({ source, options }: ILionPlyrProps) => {
  const ref = useHlsPlyr({ source, options });

  return (
    <UncontrolledLionPlyr ref={ref} />
  );
};
