import type { BindingMatchContext, LayerBinding, SceneBindingKey } from "./types";

export const supportedBindings: readonly SceneBindingKey[] = [
  "match.homeTeam.name", "match.homeTeam.shortName", "match.homeTeam.logo", "match.homeTeam.score",
  "match.awayTeam.name", "match.awayTeam.shortName", "match.awayTeam.logo", "match.awayTeam.score",
  "match.clock", "match.status", "event.type", "event.playerName", "event.playerNumber", "event.teamName", "event.minute", "event.score", "competition.name", "venue.name",
] as const;

export function resolveBindingValue(binding: LayerBinding, context: BindingMatchContext): string {
  const raw = valueForKey(binding.key, context);
  if (raw === undefined || raw === null || raw === "") return binding.fallback ?? "";
  const value = String(raw);
  if (binding.format === "uppercase") return value.toUpperCase();
  if (binding.format === "minute") return `${value}'`;
  return value;
}

function valueForKey(key: SceneBindingKey, context: BindingMatchContext): string | number | undefined {
  switch (key) {
    case "match.homeTeam.name": return context.match.homeTeam.name;
    case "match.homeTeam.shortName": return context.match.homeTeam.shortName;
    case "match.homeTeam.logo": return context.match.homeTeam.logo;
    case "match.homeTeam.score": return context.match.homeTeam.score;
    case "match.awayTeam.name": return context.match.awayTeam.name;
    case "match.awayTeam.shortName": return context.match.awayTeam.shortName;
    case "match.awayTeam.logo": return context.match.awayTeam.logo;
    case "match.awayTeam.score": return context.match.awayTeam.score;
    case "match.clock": return context.match.clock;
    case "match.status": return context.match.status;
    case "event.type": return context.event?.type;
    case "event.playerName": return context.event?.playerName;
    case "event.playerNumber": return context.event?.playerNumber;
    case "event.teamName": return context.event?.teamName;
    case "event.minute": return context.event?.minute;
    case "event.score": return context.event?.score;
    case "competition.name": return context.competition?.name;
    case "venue.name": return context.venue?.name;
  }
}
