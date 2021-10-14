// ANCHOR React
import React, {
  forwardRef, memo,
} from 'react';

// ANCHOR Plyr
import Plyr from 'plyr';

// ANCHOR Types
export interface UncontrolledPlayerProps {
  fallback?: React.ReactNode;
  isLoading?: boolean;
}

export interface LionPlyrProps {
  source: Plyr.SourceInfo;
  options?: Plyr.Options;
}

export type HTMLPlyrVideoElement = HTMLVideoElement & { plyr?: Plyr }


const LionPlyrDefaultFallback = memo(() => {
  return (
    <div className="lion-spinner-container">
      <div className="lion-spinner lion-spinner-wave" />
    </div>
  )
})

const UncontrolledLionPlyr = forwardRef<HTMLPlyrVideoElement | null, UncontrolledPlayerProps>(({ fallback, isLoading }, ref) => {
  return (
    <>
      {
        isLoading && (
          <>
            {fallback ?? <LionPlyrDefaultFallback />}
          </>
        )
      }
      <div>
        <video ref={ref} className="player-react plyr" />
      </div>
    </>
  )
});

export default UncontrolledLionPlyr;
