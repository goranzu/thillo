import styled from "@emotion/styled/macro";

const Fieldset = styled.fieldset({
  padding: 0,
  border: "none",
  "> * + *": {
    marginTop: "30px",
  },
});

export default Fieldset;
