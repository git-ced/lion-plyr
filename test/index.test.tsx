import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { LionPlyr, LionHlsPlyr } from '../src';
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
