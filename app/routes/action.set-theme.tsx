import { handleAction } from "~/features/theme/service.server";
import { redirect } from "@remix-run/node";

export const action = handleAction;

export const loader = () => redirect("/", { status: 404 });
