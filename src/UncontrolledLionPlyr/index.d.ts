import React from 'react';
import Plyr from 'plyr';

export interface UncontrolledPlayerProps {
  fallback?: React.ReactNode;
  isLoading?: boolean;
}

export interface LionPlyrProps {
  source: Plyr.SourceInfo;
  options?: Plyr.Options;
}

export type HTMLPlyrVideoElement = HTMLVideoElement & { plyr?: Plyr }
