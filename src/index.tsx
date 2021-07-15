import React, { useRef, useEffect, forwardRef, useMemo, useState } from 'react';
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
  const currentSource = source.sources[0];
  const hls = useMemo(() => new Hls(), []);
  const defaultOptions: Plyr.Options = options ?? {};
  const [qualityOptions, setQualityOptions] = useState<number[]>();

  useEffect(() => {
    let player: Plyr;

    if (!window) {
      return;
    }

    window.hls = window.hls || {};

    if (ref.current) {
      if (!Hls.isSupported()) {
        const newPlayer = new Plyr('.player-react', defaultOptions);

        player = newPlayer;
        ref.current.plyr = newPlayer;
      } else {
        hls.loadSource(currentSource.src);

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

    return () => {
      if (player) {
        player.destroy();
      }
    }
  }, [hls])

  useEffect(() => {
    let player: Plyr;

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

      player = newPlayer;
      ref.current.plyr = newPlayer;
      hls.attachMedia(ref.current);
      window.hls = hls;
    }


    return () => {
      if (hls && qualityOptions) {
        hls.detachMedia();
      }
      if (player) {
        player.destroy();
      }
    }
  }, [hls, qualityOptions, defaultOptions]);

  return ref;
};

export const useDashPlyr = ({ source, options }: ILionPlyrProps) => {
  const ref = useRef<HTMLPlyrVideoElement>(null);
  const dash = useMemo(() => Dash.MediaPlayer().create(), []);
  const currentSource = source.sources[0];
  const defaultOptions: Plyr.Options = options ?? {};
  const [qualityOptions, setQualityOptions] = useState<number[]>();

  useEffect(() => {
    if (!window) {
      return;
    }

    let player: Plyr;

    window.dashjs = window.dashjs || {};

    if (ref.current) {
      if (!Dash.supportsMediaSource) {
        const newPlayer = new Plyr('.player-react', defaultOptions);

        player = newPlayer;
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

          setQualityOptions(bitrateList.map(bitrate => bitrate.height));
        })
      }
    }

    return () => {
      if (player) {
        player.destroy();
      }
    }
  }, [dash, currentSource, defaultOptions])

  useEffect(() => {
    let player: Plyr;

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

    return () => {
      if (dash && qualityOptions) {
        dash.reset();
      }
      if (player) {
        player.destroy();
      }
    }
  }, [dash, qualityOptions]);

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
