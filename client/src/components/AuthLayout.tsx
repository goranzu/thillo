/** @jsxImportSource @emotion/react */

import React from "react";
import * as mq from "../styles/mq";
import * as styleVariables from "../styles/variables";
import { mAuto } from "../styles/utils";

interface AuthLayoutProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  imageUrl: string;
  children: React.ReactNode;
  backgroundColor: string;
}

function AuthLayout({
  handleSubmit,
  imageUrl,
  children,
  backgroundColor,
}: AuthLayoutProps) {
  return (
    <div
      css={{
        height: "100vh",
        [mq.mq_400]: {
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
        },
      }}
    >
      <div
        css={{
          display: "nono",
          [mq.mq_400]: {
            display: "block",
            background: `no-repeat center/80% url(${imageUrl}) ${backgroundColor}`,
            backgroundSize: "contain",
          },
        }}
      />
      <main
        css={{
          padding: `0 ${styleVariables.globalPadding}`,
          alignSelf: "center",
        }}
      >
        <form
          css={{
            textAlign: "center",
            marginTop: "125px",
            maxWidth: "440px",
            ...mAuto,
            "> * + *": {
              marginTop: "30px",
            },
            [mq.mq_300]: {
              textAlign: "left",
            },
          }}
          onSubmit={handleSubmit}
        >
          {children}
        </form>
      </main>
    </div>
  );
}

export default AuthLayout;
