import { handleAction } from "~/features/theme/service.server";
import { redirect } from "@vercel/remix";

export const action = handleAction;

export const loader = () => redirect("/", { status: 404 });
