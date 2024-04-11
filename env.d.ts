/// <reference types="@vercel/remix/server" />
/// <reference types="vite/client" />

import type { User } from "payload/generated-types";
import type { Response, Request, NextFunction } from "express";
import type { Payload } from "payload";
import type { ServerBuild } from "@remix-run/node";

export interface RemixRequestContext {
  payload: Payload;
  user?: User;
  token?: string;
  exp?: number;
  res: Response;
}

declare module "@vercel/remix/server" {
  interface AppLoadContext extends RemixRequestContext {}
}

//overload the request handler to include the payload and user objects
interface PayloadRequest extends Express.Request {
  payload: Payload;
  user?: User;
}

type IGetLoadContextFunction = (
  req: PayloadRequest,
  res: Response
) => Promise<AppLoadContext> | AppLoadContext;

type IRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

declare module "@vercel/remix/server" {
  export function createRequestHandler({
    build,
    getLoadContext,
    mode,
  }: {
    build: ServerBuild | (() => Promise<ServerBuild>);
    getLoadContext?: IGetLoadContextFunction;
    mode?: string;
  }): IRequestHandler;
}
