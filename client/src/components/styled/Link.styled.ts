import styled from "@emotion/styled/macro";
import isPropValid from "@emotion/is-prop-valid";
import { Link } from "react-router-dom";
import * as colors from "../../styles/colors";

const LinkStyled = styled(Link, {
  shouldForwardProp: (prop) => isPropValid(prop),
})<{ isLoading?: Boolean }>(
  {
    textDecoration: "none",
    color: colors.linkColor,
  },
  (props) => {
    return {
      pointerEvents: props.isLoading && "none",
      opacity: props.isLoading && "0.5",
    };
  },
);

export default LinkStyled;
