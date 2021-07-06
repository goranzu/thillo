import styled from "@emotion/styled";
import * as colors from "../../styles/colors";
import { Link } from "react-router-dom";
import { globalButtonStyles } from "../../styles/button";

const buttonStyles = {
  outline: {
    backgroundColor: "transparent",
    color: colors.textDark,
  },
};

const ButtonLink = styled(Link)<{ variant?: "outline" }>(
  {
    ...globalButtonStyles,
    display: "inline-block",
    textDecoration: "none",
  },
  (props) => {
    return props.variant ? buttonStyles[props.variant] : null;
  },
);

export default ButtonLink;
