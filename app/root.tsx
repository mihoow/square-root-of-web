//css should be imported as an side effect for Vite
import "./styles/index.css";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [
  { title: "Welcome to RePay!" },
  { charSet: "utf-8" },
  { name: "viewport", content: "width=device-width, initial-scale=1" },
];

export default function App() {
  return (
    <html lang="en" className="">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="dark:bg-[rgb(2,4,32)]">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
