import React, { useRef, useEffect, forwardRef } from 'react';
import Plyr from 'plyr';
import Hls from 'hls.js';
import Dash from 'dashjs';
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

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        hls.on(Hls.Events.LEVEL_SWITCHED, function (_, data) {
          let span = document.querySelector(
            ".plyr__menu__container [data-plyr='quality'][value='0'] span"
          );
          if (span) {
            if (hls.autoLevelEnabled) {
              if (hls.levels[data.level].height > 1080) {
                player.quality = 1080;
                span.innerHTML = `AUTO (1080p)`;
              } else {
                span.innerHTML = `AUTO (${hls.levels[data.level].height}p)`;
              }
            } else {
              span.innerHTML = `AUTO`;
            }
          }
        });
      });

      const newOptions: Plyr.Options = {
        ...defaultOptions,
        quality: {
          default: 720,
          options: [0, 360, 480, 560, 720, 1080],
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

      if (ref.current) {
        player = newPlayer;
        ref.current.plyr = newPlayer;
        hls.attachMedia(ref.current);
        window.hls = hls;
      }
    }

    return () => {
      if (hls) {
        hls.detachMedia();
      }
      if (player) {
        player.destroy();
      }
    }
  }, [currentSource, defaultOptions, source]);

  return ref;
};

export const useDashPlyr = ({ source, options }: ILionPlyrProps) => {
  const ref = useRef<HTMLPlyrVideoElement>(null);
  const defaultOptions: Plyr.Options = options ?? {};
  const currentSource = source.sources[0];

  useEffect(() => {
    if (!window) {
      return;
    }

    let dash = Dash.MediaPlayer().create();
    let player: Plyr;

    window.dashjs = window.dashjs || {};

    if (!Dash.supportsMediaSource) {
      const newPlayer = new Plyr('.player-react', defaultOptions);

      if (ref.current) {
        player = newPlayer;
        ref.current.plyr = newPlayer;
      }
    } else {
      if (ref.current) {
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
        })

        const qualityOptions = [0, 360, 480, 560, 720, 1080];

        const newOptions: Plyr.Options = {
          ...defaultOptions,
          quality: {
            default: 720,
            options: qualityOptions,
            forced: true,
            onChange: newQuality => {
              dash.setQualityFor(
                'video',
                qualityOptions.indexOf(newQuality),
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
        player = newPlayer;
        ref.current.plyr = newPlayer;
      }
    }

    return () => {
      if (dash) {
        dash.reset();
      }
      if (player) {
        player.destroy();
      }
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
      if (player) {
        player.destroy();
      }
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

export const LionDashPlyr = ({ source, options }: ILionPlyrProps) => {
  const ref = useDashPlyr({ source, options });

  return (
    <UncontrolledLionPlyr ref={ref} />
  );
};
