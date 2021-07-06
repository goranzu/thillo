/** @jsxImportSource @emotion/react */

import * as styleVariables from "../styles/variables";
import * as mq from "../styles/mq";
import { ReactComponent as Logo } from "../images/logo.svg";
import { ReactComponent as Illustration } from "../images/landing-page-illustration.svg";
import ButtonLink from "../components/styled/Link.styled";

const nav = [
  {
    name: "Signin",
    path: "/signin",
    variant: "outline",
  },
  {
    name: "Signup",
    path: "/signup",
    variant: undefined,
  },
] as const;

function Home() {
  return (
    <>
      <header
        css={{
          padding: `0.75rem ${styleVariables.globalPadding}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: styleVariables.boxShadow,
        }}
      >
        <p
          css={{
            fontWeight: 600,
            marginBottom: "-10px",
            ...styleVariables.flexCenter,
          }}
        >
          <Logo />
        </p>
        <nav
          css={{
            "> a + a": {
              marginLeft: "1rem",
            },
          }}
        >
          {nav.map((item) => {
            return (
              <ButtonLink
                css={{ textDecoration: "none" }}
                key={item.name}
                to={item.path}
                variant={item.variant}
              >
                {item.name}
              </ButtonLink>
            );
          })}
        </nav>
      </header>
      <main
        css={{
          padding: `0 ${styleVariables.globalPadding}`,
          maxWidth: styleVariables.pageWidth,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div>
          <h1>Thullo helps your team get work done faster.</h1>
          <p>
            An platform for teams of all sizes and locations. Bring your team
            together to design, build and deliver your project with a tool that
            works with you and your team, and adapts when you need to.
          </p>
          <ButtonLink to="/signup">Get Started</ButtonLink>
        </div>

        <div>
          <Illustration />
        </div>
      </main>
    </>
  );
}

export default Home;
