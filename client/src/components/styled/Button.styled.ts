import styled from "@emotion/styled/macro";
import { globalButtonStyles } from "../../styles/button";
import * as colors from "../../styles/colors";
import * as mq from "../../styles/mq";

const buttonStyles = {
  outline: {
    backgroundColor: "transparent",
    color: colors.textDark,
  },
  auth: {
    paddingLeft: "3em",
    paddingRight: "3em",
    [mq.mq_400]: {
      paddingLeft: "1em",
      paddingRight: "1em",
    },
  },
};

const ButtonStyled = styled.button<{ variant?: "outline" | "auth" }>(
  {
    ...globalButtonStyles,
  },
  (props) => {
    return props.variant ? buttonStyles[props.variant] : null;
  },
);

export default ButtonStyled;
