// ANCHOR React
import React from "react";

// ACNCHOR Hooks
import useDashPlyr from "../hooks/useDashPlyr";

// ANCHOR Components
import UncontrolledLionPlyr from "../UncontrolledLionPlyr";

// ANCHOR Types
import { LionPlyrProps } from "../UncontrolledLionPlyr/index.d";

export const LionDashPlyr = ({ source, options }: LionPlyrProps) => {
  const ref = useDashPlyr({ source, options });

  return (
    <UncontrolledLionPlyr ref={ref} isLoading={!ref} />
  );
};

export default LionDashPlyr;
