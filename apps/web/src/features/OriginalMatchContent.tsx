import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  List,
  LayoutGrid,
} from "lucide-react";
import { Avatar, Crest } from "../components/Identity";
import { EmptyState } from "../components/EmptyState";
import type { Data, Match, Selection } from "../lib/types";

// The formation and event-card geometry come from RugbyLiveScoreApp rather
// than a new match-centre design. Missing provider fields stay unavailable.
const POSITIONS: Record<number, [number, number]> = {
  1: [10, 20],
  2: [10, 50],
  3: [10, 80],
  4: [25, 35],
  5: [25, 65],
  6: [40, 20],
  7: [40, 80],
  8: [40, 50],
  9: [55, 15],
  10: [60, 38.333],
  11: [85, 15],
  12: [65, 61.667],
  13: [70, 85],
  14: [85, 85],
  15: [90, 50],
};
export function OriginalLineups({
  match,
  data,
  select,
}: {
  match: Match;
  data: Data;
  select: (s: Selection) => void;
}) {
  const [side, setSide] = useState("home"),
    [mode, setMode] = useState("pitch");
  const team = data.teams.find(
    (t) => t.id === (side === "home" ? match.homeId : match.awayId),
  )!;
  const players = data.players.filter((p) => p.teamId === team.id);
  if (match.coverage !== "full")
    return (
      <EmptyState title="Team sheets aren’t available">
        We don’t have lineup data for this match yet.
      </EmptyState>
    );
  return (
    <section className="original-lineups">
      <div className="section-toolbar">
        <h3>Team Sheets</h3>
        <div className="segmented compact">
          <button
            className={mode === "pitch" ? "active" : ""}
            onClick={() => setMode("pitch")}
            aria-label="Pitch view"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            className={mode === "list" ? "active" : ""}
            onClick={() => setMode("list")}
            aria-label="List view"
          >
            <List size={18} />
          </button>
        </div>
      </div>
      <div className="original-team-toggle">
        {["home", "away"].map((s) => {
          const t = data.teams.find(
            (t) => t.id === (s === "home" ? match.homeId : match.awayId),
          )!;
          return (
            <button
              key={s}
              className={side === s ? "active" : ""}
              style={
                {
                  "--team": t.primary,
                  "--team-secondary": t.secondary,
                } as React.CSSProperties
              }
              onClick={() => setSide(s)}
              aria-label={`${t.name} team sheet`}
              aria-pressed={side === s}
            >
              <Crest team={t} size={30} />
            </button>
          );
        })}
      </div>
      <p className="lineup-caption">Illustrative starting XV · Tap a player</p>
      {mode === "pitch" ? (
        <div className="original-formation">
          {players.map((p) => {
            const pos = POSITIONS[p.number];
            return (
              pos && (
                <button
                  key={p.id}
                  className="original-pitch-player"
                  style={{ top: `${pos[0]}%`, left: `${pos[1]}%` }}
                  onClick={() => select({ kind: "player", id: p.id })}
                  aria-label={`Open ${p.name}`}
                >
                  <Avatar player={p} team={team} size={42} />
                  <span>{p.name.split(" ").at(-1)}</span>
                </button>
              )
            );
          })}
        </div>
      ) : (
        <div className="squad-list">
          {players.map((p) => (
            <button
              key={p.id}
              onClick={() => select({ kind: "player", id: p.id })}
            >
              <Avatar player={p} team={team} />
              <span>
                <strong>{p.name}</strong>
                <small>{p.position}</small>
              </span>
              <ChevronRight size={17} />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
export function OriginalEvents({ match, data }: { match: Match; data: Data }) {
  if (!match.events.length)
    return (
      <EmptyState title="Match events unavailable">
        {match.status === "SCHEDULED"
          ? "Events will appear after kick-off when covered by the provider."
          : "No event feed is available for this match."}
      </EmptyState>
    );
  const symbols: Record<string, string> = {
    Try: "🏉",
    Conversion: "🎯",
    Penalty: "🥅",
    "Yellow card": "🟨",
    "Red card": "🟥",
  };
  return (
    <section className="original-events">
      <h3>Match Events</h3>
      {[...match.events]
        .sort((a, b) => b.minute - a.minute)
        .map((event) => {
          const team = data.teams.find((t) => t.id === event.teamId)!;
          return (
            <div className="original-event-row" key={event.id}>
              <time>{event.minute}′</time>
              <div className="original-event-card">
                <span
                  className="original-event-avatar"
                  style={{
                    background: `linear-gradient(${team.primary},${team.secondary})`,
                  }}
                >
                  <img src="/brand/player.png" alt="" />
                </span>
                <div>
                  <strong>{event.player}</strong>
                  <small>
                    {symbols[event.type] || "•"} {event.type}
                  </small>
                </div>
                <Crest team={team} size={30} />
              </div>
            </div>
          );
        })}
    </section>
  );
}
const GROUPS = [
  ["Overview", ["possession", "territory"]],
  ["Attack", ["metres", "carries"]],
  ["Defence", ["tackles"]],
  ["Set Piece", ["lineouts", "scrums"]],
  ["Discipline", ["penalties"]],
] as const;
const LABELS: Record<string, string> = {
  possession: "Possession",
  territory: "Territory",
  metres: "Metres Gained",
  carries: "Carries",
  tackles: "Tackles Made",
  lineouts: "Lineouts Won",
  scrums: "Scrums Won",
  penalties: "Penalties Conceded",
};
export function OriginalStats({ match, data }: { match: Match; data: Data }) {
  const [collapsed, setCollapsed] = useState<string[]>([]),
    [period, setPeriod] = useState("Full Match");
  if (!match.stats)
    return (
      <EmptyState title="Statistics aren’t available">
        No statistics feed is available for this match. Missing data is never
        shown as zero.
      </EmptyState>
    );
  const home = data.teams.find((t) => t.id === match.homeId)!,
    away = data.teams.find((t) => t.id === match.awayId)!;
  return (
    <div className="original-stats">
      {GROUPS.map(([title, keys]) => (
        <section key={title}>
          <button
            className="original-stat-heading"
            onClick={() =>
              setCollapsed(
                collapsed.includes(title)
                  ? collapsed.filter((t) => t !== title)
                  : [...collapsed, title],
              )
            }
            aria-expanded={!collapsed.includes(title)}
          >
            <strong>{title}</strong>
            {collapsed.includes(title) ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronUp size={20} />
            )}
          </button>
          {!collapsed.includes(title) && (
            <div className="original-stat-content">
              {title === "Overview" && (
                <div className="original-periods">
                  {[
                    "Full Match",
                    "First Half",
                    "Second Half",
                    "Last 10 Min",
                  ].map((p) => (
                    <button
                      className={period === p ? "active" : ""}
                      key={p}
                      onClick={() => setPeriod(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
              {title === "Overview" && period !== "Full Match" ? (
                <EmptyState title="Period breakdown unavailable">
                  We don’t have statistics for this period yet.
                </EmptyState>
              ) : (
                keys.map((key) => {
                  const pair = match.stats?.[key];
                  if (!pair)
                    return (
                      <p key={key} className="muted">
                        {LABELS[key]} unavailable
                      </p>
                    );
                  const [a, b] = pair,
                    percent = key === "possession" || key === "territory";
                  return (
                    <div className="original-stat-card" key={key}>
                      <h4>{LABELS[key]}</h4>
                      <div>
                        <strong>
                          {a}
                          {percent ? "%" : ""}
                        </strong>
                        <span>vs</span>
                        <strong>
                          {b}
                          {percent ? "%" : ""}
                        </strong>
                      </div>
                      <div
                        className="original-stat-track"
                        aria-label={`${home.name}: ${a}; ${away.name}: ${b}`}
                      >
                        <i
                          style={{
                            width: `${(a / (a + b || 1)) * 100}%`,
                            background: home.primary,
                          }}
                        />
                        <i style={{ flex: 1, background: away.primary }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </section>
      ))}
      <p className="original-data-note">
        Additional breakdown, kicking and success rates need a provider.
      </p>
    </div>
  );
}
