import styled from "@emotion/styled/macro";
import * as colors from "../../styles/colors";
import * as styleVariables from "../../styles/variables";

type InputProps = {
  isError: boolean;
};

const inputStyles = {
  error: {
    border: `1px solid ${colors.danger}`,
  },
};

const InputStyled = styled.input<InputProps>(
  {
    backgroundColor: colors.lightGray,
    border: "1px solid transparent",
    boxShadow: styleVariables.boxShadow,
    padding: "6px 0 6px 10px",
    transition: "all .1s linear",
    outline: "none",
    width: "100%",
    ":focus, :hover": {
      backgroundColor: "white",
    },
    ":disabled": {
      opacity: "0.5",
    },
  },
  (props) => {
    return props.isError && inputStyles.error;
  },
);

export default InputStyled;
