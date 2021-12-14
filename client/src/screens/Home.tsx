/** @jsxImportSource @emotion/react */

import { Link } from "react-router-dom";
import * as styleVariables from "../styles/variables";
import * as mq from "../styles/mq";
import * as colors from "../styles/colors";
import { ReactComponent as Logo } from "../images/logo.svg";
import { ReactComponent as Illustration } from "../images/landing-page-illustration.svg";
import ButtonLink from "../components/styled/ButtonLink.styled";

const nav = [
  {
    name: "Signin",
    path: "/signin",
    variant: "outline",
  },
  {
    name: "Register",
    path: "/register",
    variant: undefined,
  },
] as const;

function Home() {
  return (
    <>
      <header
        css={{
          padding: `1.25rem ${styleVariables.globalPadding}`,
          borderBottom: "thin solid hsl(0, 0%, 90%);",
        }}
      >
        <div
          css={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: styleVariables.pageWidth,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <p
            css={{
              fontWeight: 600,
              ...styleVariables.flexCenter,
            }}
          >
            <Logo />
          </p>
          <nav
            css={{
              "> a + a": {
                marginLeft: "2rem",
              },
            }}
          >
            {nav.map((item) => {
              return (
                <Link
                  key={item.path}
                  css={{
                    textDecoration: "none",
                    color:
                      item.path === "/register" ? colors.primary : "inherit",
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    ":hover": {
                      textDecoration: "underline",
                    },
                  }}
                  to={item.path}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
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
            to="/register"
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
