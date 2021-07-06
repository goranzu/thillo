import * as colors from "../styles/colors";
import * as styleVariables from "../styles/variables";

const globalButtonStyles = {
  border: `2px solid ${colors.primary}`,
  cursor: "pointer",
  borderRadius: "5px",
  boxShadow: styleVariables.boxShadow,
  padding: "0.3em 0.8em",
  backgroundColor: colors.primary,
  color: colors.textLight,
  ":disabled": {
    opacity: "0.5",
  },
};

export { globalButtonStyles };
