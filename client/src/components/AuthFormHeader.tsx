/** @jsxImportSource @emotion/react */

import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../images/logo.svg";

function AuthFormHeader({ text }: { text: string }) {
  return (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <h1>{text}</h1>
      <Link to="/">
        <Logo />
      </Link>
    </div>
  );
}

export default AuthFormHeader;
