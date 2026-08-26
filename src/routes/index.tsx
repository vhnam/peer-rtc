import { LobbyPage } from "#/modules/lobby";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: LobbyPage });
