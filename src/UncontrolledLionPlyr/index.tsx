// ANCHOR React
import React, {
  forwardRef, memo,
} from 'react';

// ANCHOR Types
import { HTMLPlyrVideoElement, UncontrolledPlayerProps } from './index.d';

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
