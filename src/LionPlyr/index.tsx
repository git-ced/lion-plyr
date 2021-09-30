// ANCHOR React
import React from "react";

// ACNCHOR Hooks
import usePlyr from "../hooks/usePlyr";

// ANCHOR Components
import UncontrolledLionPlyr from "../UncontrolledLionPlyr";

// ANCHOR Types
import { LionPlyrProps } from "../UncontrolledLionPlyr/index.d";

const LionPlyr = ({ source, options }: LionPlyrProps) => {
  const ref = usePlyr({ source, options });

  return (
    <UncontrolledLionPlyr ref={ref} isLoading={!ref} />
  );
};

export default LionPlyr;
