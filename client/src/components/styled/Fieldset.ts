import styled from "@emotion/styled/macro";

const Fieldset = styled.fieldset({
  padding: 0,
  margin: 0,
  border: "none",
  "> * + *": {
    marginTop: ".75rem",
  },
});

export default Fieldset;
