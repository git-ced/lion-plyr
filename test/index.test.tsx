import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { LionPlyr, LionHlsPlyr, LionDashPlyr } from '../src';
import Plyr from 'plyr';

const videoSrc: Plyr.SourceInfo = {
  type: 'video',
  sources: [
    {
      src: 'yWtFb9LJs3o',
      provider: 'youtube'
    }
  ]
};

const hlsSrc: Plyr.SourceInfo = {
  type: 'video',
  sources: [
    {
      src:
        'https://bitmovin-a.akamaihd.net/content/playhouse-vr/m3u8s/105560.m3u8',
      type: 'application/x-mpegURL'
    }
  ]
};


const dashSrc: Plyr.SourceInfo = {
  type: 'video',
  sources: [
    {
      src: 'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd',
      type: 'application/dash+xml',
    }
  ]
};

describe('The Normal Plyr', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<LionPlyr source={videoSrc} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('The HLS Plyr', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<LionHlsPlyr source={hlsSrc} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('The Dash Plyr', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<LionDashPlyr source={dashSrc} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
