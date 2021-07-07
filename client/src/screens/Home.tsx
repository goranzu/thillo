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
          [mq.mq_400]: {
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1em",
            marginTop: "200px",
            alignItems: "start",
          },
        }}
      >
        <div
          css={{
            textAlign: "center",
            marginTop: styleVariables.globalFlow,
            "> *": { marginTop: "1.2em" },
            [mq.mq_100]: {
              textAlign: "left",
              maxWidth: "650px",
            },
            [mq.mq_400]: {
              textAlign: "left",
              maxWidth: "650px",
              gridColumn: "1 / 3",
              marginTop: 0,
            },
          }}
        >
          <h1
            css={{
              fontSize: "var(--fs-800)",
              fontWeight: 700,
              [mq.mq_100]: {
                maxWidth: "600px",
              },
              [mq.mq_400]: {
                marginTop: "0 !important",
              },
            }}
          >
            Thillo helps your team get work done faster.
          </h1>
          <p
            css={{
              maxWidth: "90%",
              marginLeft: "auto",
              marginRight: "auto",
              [mq.mq_100]: {
                marginLeft: "unset",
              },
            }}
          >
            An platform for teams of all sizes and locations. Bring your team
            together to design, build and deliver your project with a tool that
            works with you and your team, and adapts when you need to.
          </p>
          <ButtonLink
            css={{ paddingLeft: "2em", paddingRight: "2em" }}
            to="/signup"
          >
            Get Started
          </ButtonLink>
        </div>

        <div
          css={{
            marginTop: styleVariables.globalFlow,
            marginLeft: "auto",
            marginRight: "auto",
            maxWidth: "545px",
            [mq.mq_300]: {
              marginRight: "unset",
              marginTop: "-3rem",
            },
            [mq.mq_400]: {
              gridColumn: "3 / -1",
              marginLeft: "unset",
              marginTop: "unset",
            },
          }}
        >
          <Illustration />
        </div>
      </main>
    </>
  );
}

export default Home;
