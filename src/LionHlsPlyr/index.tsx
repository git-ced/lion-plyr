// ANCHOR React
import React from "react";

// ACNCHOR Hooks
import useHlsPlyr from "../hooks/useHlsPlyr";

// ANCHOR Components
import UncontrolledLionPlyr from "../UncontrolledLionPlyr";

// ANCHOR Types
import { LionPlyrProps } from "../UncontrolledLionPlyr/index.d";

export const LionHlsPlyr = ({ source, options }: LionPlyrProps) => {
  const ref = useHlsPlyr({ source, options });

  return (
    <UncontrolledLionPlyr ref={ref} isLoading={!ref} />
  );
};


export default LionHlsPlyr;
