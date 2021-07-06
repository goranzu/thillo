import styled from "@emotion/styled/macro";
import * as colors from "../../styles/colors";

type InputProps = {
  error: boolean;
};

const inputStyles = {
  error: {
    border: `1px solid ${colors.danger}`,
  },
};

const Input = styled.input(
  {
    width: "100%",
    font: "inherit",
  },
  (props: InputProps) => {
    return props.error ? inputStyles.error : null;
  },
);

export default Input;
