import styled from "@emotion/styled/macro";

const FormGroup = styled.div({
  "> * + *": {
    marginTop: "5px",
  },
});

export default FormGroup;
