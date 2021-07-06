import { css } from "@emotion/react";
import * as colors from "./colors";

export const globalStyles = css`
  /* Box sizing rules */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* Remove default margin */
  body,
  h1,
  h2,
  h3,
  h4,
  p,
  figure,
  blockquote,
  dl,
  dd {
    margin: 0;
  }

  /* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
  ul[role="list"],
  ol[role="list"] {
    list-style: none;
  }

  /* Set core root defaults */
  html:focus-within {
    scroll-behavior: smooth;
  }

  /* Set core body defaults */
  body {
    min-height: 100vh;
    text-rendering: optimizeSpeed;
    line-height: 1.5;
  }

  /* A elements that don't have a class get default styles */
  a:not([class]) {
    text-decoration-skip-ink: auto;
  }

  /* Make images easier to work with */
  img,
  picture {
    max-width: 100%;
    display: block;
  }

  /* Inherit fonts for inputs and buttons */
  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  /* Remove all animations and transitions for people that prefer not to see them */
  @media (prefers-reduced-motion: reduce) {
    html:focus-within {
      scroll-behavior: auto;
    }
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  body {
    margin: 0;
    font-family: "Work Sans", -apple-system, BlinkMacSystemFont, "Segoe UI",
      "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    line-height: 1.4;
    color: ${colors.textDark};
    background-color: ${colors.backgroundColor};

    --base-font: 1.1rem;
    --font-scale: 1.2;
    --fs-100: calc(var(--fs-200) / var(--font-scale));
    --fs-200: calc(var(--fs-300) / var(--font-scale));
    --fs-300: calc(var(--fs-400) / var(--font-scale));
    --fs-400: var(--base-font);
    --fs-500: calc(var(--fs-400) * var(--font-scale));
    --fs-600: calc(var(--fs-500) * var(--font-scale));
    --fs-700: calc(var(--fs-600) * var(--font-scale));
    --fs-800: calc(var(--fs-700) * var(--font-scale));
    --fs-900: calc(var(--fs-800) * var(--font-scale));

    font-size: var(--fs-400);
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }
`;
