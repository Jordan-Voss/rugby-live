import { useEffect, useRef, useState } from "react";
import { IonApp, IonButton, setupIonicReact } from "@ionic/react";
import {
  ArrowLeft,
  CalendarClock,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Menu,
  Newspaper,
  Search,
  Star,
  Trophy,
  ChartNoAxesCombined,
  UserRound,
} from "lucide-react";
import { loadData, dateOffset, kickoff, dayLabel } from "./lib/api";
import type { Data, Match, Selection } from "./lib/types";
import { Crest, CompetitionIcon, Avatar } from "./components/Identity";
import { EmptyState } from "./components/EmptyState";
import {
  AccountDialog,
  SettingsDialog,
  type ThemeMode,
} from "./components/Dialogs";
import {
  OriginalLineups,
  OriginalEvents,
  OriginalStats,
} from "./features/OriginalMatchContent";
import {
  TeamProfile,
  PlayerProfile,
  CompetitionProfile,
} from "./features/Profiles";
setupIonicReact({ mode: "ios" });
const MATCH_TABS = ["Events", "Teams", "Stats", "Players", "H2H"];
function OriginalRow({
  m,
  data,
  open,
}: {
  m: Match;
  data: Data;
  open: (s: Selection) => void;
}) {
  const home = data.teams.find((t) => t.id === m.homeId)!,
    away = data.teams.find((t) => t.id === m.awayId)!;
  return (
    <button
      className={"original-match " + (m.status === "LIVE" ? "live" : "")}
      onClick={() => open({ kind: "match", id: m.id })}
    >
      <Crest team={home} size={31} />
      <span className="home-name">{home.name}</span>
      {m.homeScore !== null && <strong>{m.homeScore}</strong>}
      <span className="original-time">
        {m.status === "LIVE"
          ? `${m.minute}′`
          : m.status === "FINISHED"
            ? "FT"
            : kickoff(m.kickoff)}
      </span>
      {m.awayScore !== null && <strong>{m.awayScore}</strong>}
      <span className="away-name">{away.name}</span>
      <Crest team={away} size={31} />
    </button>
  );
}
function OriginalMatches({
  data,
  open,
}: {
  data: Data;
  open: (s: Selection) => void;
}) {
  const [date, setDate] = useState(data.defaultDate),
    [expanded, setExpanded] = useState<string[]>([]),
    [live, setLive] = useState(false),
    [search, setSearch] = useState(false),
    [query, setQuery] = useState("");
  const dates = Array.from({ length: 29 }, (_, i) => dateOffset(date, i - 14));
  const strip = useRef<HTMLDivElement>(null),
    calendar = useRef<HTMLInputElement>(null),
    start = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    strip.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({
        inline: "center",
        block: "nearest",
        behavior: "smooth",
      });
  }, [date]);
  const matches = data.matches.filter(
    (m) =>
      m.date === date &&
      (!live || m.status === "LIVE") &&
      (!query ||
        [m.homeId, m.awayId].some((id) =>
          data.teams
            .find((t) => t.id === id)
            ?.name.toLowerCase()
            .includes(query.toLowerCase()),
        )),
  );
  return (
    <>
      <header className="original-header">
        <img
          className="original-brand light-logo"
          src="/brand/logo-light.png"
          alt="RugbyLive"
        />
        <img
          className="original-brand dark-logo"
          src="/brand/logo-dark.png"
          alt="RugbyLive"
        />
        <div>
          <button
            className={"original-live " + (live ? "active" : "")}
            onClick={() => setLive(!live)}
            aria-pressed={live}
          >
            LIVE
          </button>
          <button
            aria-label="Search matches"
            onClick={() => setSearch(!search)}
          >
            <Search size={23} />
          </button>
          <label className="original-calendar">
            <CalendarClock size={25} />
            <input
              ref={calendar}
              aria-label="Choose match date"
              type="date"
              value={date}
              onChange={(e) => e.target.value && setDate(e.target.value)}
            />
          </label>
        </div>
      </header>
      {search && (
        <input
          className="search-input original-search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search teams"
          placeholder="Search teams…"
        />
      )}
      <div
        className="original-date-strip"
        role="tablist"
        aria-label="Match dates"
        ref={strip}
      >
        {dates.map((d) => (
          <button
            key={d}
            role="tab"
            aria-selected={d === date}
            onClick={() => setDate(d)}
          >
            <span>
              {d === data.defaultDate
                ? "Sample day"
                : new Date(d + "T12:00:00").toLocaleDateString("en-GB", {
                    weekday: "short",
                  })}
            </span>
            <strong>
              {new Date(d + "T12:00:00").toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </strong>
          </button>
        ))}
      </div>
      <div
        className="original-day-content"
        onTouchStart={(e) =>
          (start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })
        }
        onTouchEnd={(e) => {
          if (start.current) {
            const dx = e.changedTouches[0].clientX - start.current.x,
              dy = e.changedTouches[0].clientY - start.current.y;
            if (Math.abs(dx) > 70 && Math.abs(dy) < 45)
              setDate(dateOffset(date, dx < 0 ? 1 : -1));
            start.current = null;
          }
        }}
      >
        <p className="original-data-note">
          Sample data · Provider not connected
        </p>
        {data.competitions.map((c) => {
          const rows = matches.filter((m) => m.competitionId === c.id);
          if (!rows.length) return null;
          const isOpen = expanded.includes(c.id);
          return (
            <section className="original-league" key={c.id}>
              <div className="original-league-header">
                <button
                  className="original-league-title"
                  onClick={() => open({ kind: "competition", id: c.id })}
                >
                  <CompetitionIcon id={c.id} size={32} />
                  <strong>{c.name}</strong>
                </button>
                <button
                  aria-label={`${isOpen ? "Collapse" : "Expand"} ${c.name}`}
                  onClick={() =>
                    setExpanded(
                      isOpen
                        ? expanded.filter((id) => id !== c.id)
                        : [...expanded, c.id],
                    )
                  }
                >
                  {isOpen ? <ChevronUp size={25} /> : <ChevronDown size={25} />}
                </button>
              </div>
              {isOpen &&
                rows.map((m) => (
                  <OriginalRow key={m.id} m={m} data={data} open={open} />
                ))}
            </section>
          );
        })}
        {!matches.length && (
          <EmptyState title="No match data for this date" kind="calendar">
            We don’t have fixtures for {dayLabel(date)}. Data sources will be
            connected separately.
          </EmptyState>
        )}
        {date !== data.defaultDate && (
          <button
            className="today-fab"
            onClick={() => setDate(data.defaultDate)}
          >
            Sample matchday
          </button>
        )}
      </div>
    </>
  );
}
function OriginalMatch({
  m,
  data,
  open,
  back,
  follow,
}: {
  m: Match;
  data: Data;
  open: (s: Selection) => void;
  back: () => void;
  follow: () => void;
}) {
  const [tab, setTab] = useState("Events"),
    [progress, setProgress] = useState(0);
  const scroll = useRef<HTMLDivElement>(null),
    touch = useRef<{ x: number; y: number } | null>(null);
  const home = data.teams.find((t) => t.id === m.homeId)!,
    away = data.teams.find((t) => t.id === m.awayId)!;
  useEffect(() => {
    setTab("Events");
    scroll.current?.scrollTo(0, 0);
    setProgress(0);
  }, [m.id]);
  const style = {
    "--collapse": progress,
    "--logo-size": `${70 - progress * 30}px`,
    "--score-size": `${32 - progress * 8}px`,
  } as React.CSSProperties;
  return (
    <div
      className="original-detail-scroll"
      ref={scroll}
      onScroll={(e) =>
        setProgress(Math.min(1, e.currentTarget.scrollTop / 125))
      }
    >
      <div className="original-sticky-score" style={style}>
        <div className="original-back-row">
          <button className="icon-button" aria-label="Back" onClick={back}>
            <ArrowLeft size={23} />
          </button>
          <span>
            {data.competitions.find((c) => c.id === m.competitionId)?.shortName}
          </span>
          <button
            className="icon-button"
            aria-label="Follow match"
            onClick={follow}
          >
            <Star size={21} />
          </button>
        </div>
        <div className="original-scoreboard">
          <button
            className="original-score-team"
            onClick={() => open({ kind: "team", id: home.id })}
          >
            <Crest team={home} size={70} />
            <span>{home.name}</span>
          </button>
          <div className="original-score">
            <strong>{m.homeScore ?? "–"}</strong>
            <span>–</span>
            <strong>{m.awayScore ?? "–"}</strong>
          </div>
          <button
            className="original-score-team"
            onClick={() => open({ kind: "team", id: away.id })}
          >
            <Crest team={away} size={70} />
            <span>{away.name}</span>
          </button>
        </div>
        <div
          className="original-score-extras"
          style={{ maxHeight: 125 * (1 - progress), opacity: 1 - progress }}
        >
          <p>
            {m.status === "LIVE"
              ? `${m.minute}′ · Sample in-play`
              : m.status === "FINISHED"
                ? "Full Time"
                : kickoff(m.kickoff)}
          </p>
          {m.events.length > 0 && (
            <div className="original-scorers">
              {[home, away].map((t) => (
                <div key={t.id}>
                  <b>Tries:</b>
                  {m.events
                    .filter((e) => e.teamId === t.id && e.type === "Try")
                    .map((e) => (
                      <span key={e.id}>
                        {e.player} {e.minute}′
                      </span>
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>
        <nav className="original-match-tabs" aria-label="Match sections">
          {MATCH_TABS.map((t) => (
            <button
              key={t}
              className={tab === t ? "active" : ""}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </nav>
      </div>
      <div
        className="original-tab-body"
        onTouchStart={(e) =>
          (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })
        }
        onTouchEnd={(e) => {
          if (!touch.current) return;
          const dx = e.changedTouches[0].clientX - touch.current.x,
            dy = e.changedTouches[0].clientY - touch.current.y;
          if (Math.abs(dx) > 70 && Math.abs(dy) < 40) {
            const t = MATCH_TABS[MATCH_TABS.indexOf(tab) + (dx < 0 ? 1 : -1)];
            if (t) setTab(t);
          }
          touch.current = null;
        }}
      >
        <p className="original-data-note">
          Illustrative match · Data provider not connected
        </p>
        {tab === "Events" && <OriginalEvents match={m} data={data} />}
        {tab === "Teams" && (
          <OriginalLineups match={m} data={data} select={open} />
        )}{" "}
        {tab === "Stats" && <OriginalStats match={m} data={data} />}{" "}
        {tab === "Players" &&
          (m.coverage === "full" ? (
            <div className="original-players">
              <h3>Player Statistics</h3>
              {data.players
                .filter((p) => p.teamId === home.id || p.teamId === away.id)
                .map((p) => (
                  <button
                    key={p.id}
                    onClick={() => open({ kind: "player", id: p.id })}
                  >
                    <Avatar
                      player={p}
                      team={data.teams.find((t) => t.id === p.teamId)!}
                    />
                    <span>
                      <strong>{p.name}</strong>
                      <small>{p.position}</small>
                    </span>
                    <span>{p.stats.metres} m</span>
                    <ChevronRight size={17} />
                  </button>
                ))}
            </div>
          ) : (
            <EmptyState title="Player statistics unavailable">
              No player feed is available for this match.
            </EmptyState>
          ))}
        {tab === "H2H" && (
          <EmptyState title="Head-to-head data unavailable">
            Historical meetings will appear once verified match history is
            connected.
          </EmptyState>
        )}
      </div>
    </div>
  );
}
export default function LegacyApp() {
  const [data, setData] = useState<Data | null>(null),
    [error, setError] = useState(""),
    [attempt, setAttempt] = useState(0),
    [page, setPage] = useState("matches"),
    [selection, setSelection] = useState<Selection>(null),
    [trail, setTrail] = useState<Selection[]>([]),
    [dialog, setDialog] = useState<"account" | "settings" | null>(null),
    [gender, setGender] = useState("all"),
    [theme, setTheme] = useState<ThemeMode>(
      () => (localStorage.getItem("rugbylive.theme") as ThemeMode) || "system",
    );
  useEffect(() => {
    const c = new AbortController();
    loadData(c.signal)
      .then(setData)
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => c.abort();
  }, [attempt]);
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme:dark)");
    const update = () =>
      (document.documentElement.dataset.theme =
        theme === "system" ? (media.matches ? "dark" : "light") : theme);
    update();
    localStorage.setItem("rugbylive.theme", theme);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [theme]);
  const open = (s: Selection) => {
    setTrail((t) => [...t, selection]);
    setSelection(s);
  };
  const back = () => {
    setSelection(trail.at(-1) || null);
    setTrail(trail.slice(0, -1));
  };
  const nav = (p: string) => {
    setPage(p);
    setSelection(null);
    setTrail([]);
  };
  const follow = () => setDialog("account");
  return (
    <IonApp>
      <div className="original-app">
        {!data ? (
          <EmptyState
            title={error ? "Unable to connect" : "Loading RugbyLive"}
            action={
              error && (
                <IonButton
                  onClick={() => {
                    setError("");
                    setAttempt(attempt + 1);
                  }}
                >
                  Try again
                </IonButton>
              )
            }
          >
            {error || "Preparing your matchday…"}
          </EmptyState>
        ) : (
          <div className="original-screen">
            {page === "matches" && (
              <div
                className={
                  "original-matches-screen" + (selection ? " hidden" : "")
                }
              >
                <OriginalMatches data={data} open={open} />
              </div>
            )}
            {selection?.kind === "match" ? (
              <OriginalMatch
                m={data.matches.find((m) => m.id === selection.id)!}
                data={data}
                open={open}
                back={back}
                follow={follow}
              />
            ) : selection?.kind === "team" ? (
              <TeamProfile
                team={data.teams.find((t) => t.id === selection.id)!}
                data={data}
                select={open}
                onBack={back}
                onFollow={follow}
              />
            ) : selection?.kind === "player" ? (
              <PlayerProfile
                player={data.players.find((p) => p.id === selection.id)!}
                data={data}
                select={open}
                onBack={back}
                onFollow={follow}
              />
            ) : selection?.kind === "competition" ? (
              <CompetitionProfile
                competition={
                  data.competitions.find((c) => c.id === selection.id)!
                }
                data={data}
                select={open}
                onBack={back}
                onFollow={follow}
              />
            ) : page === "matches" ? null : page === "leagues" ? (
              <div className="original-directory">
                <h1>Leagues</h1>
                <div className="segmented">
                  {[
                    ["all", "All"],
                    ["men", "Men"],
                    ["women", "Women"],
                  ].map(([v, l]) => (
                    <button
                      key={v}
                      className={gender === v ? "active" : ""}
                      onClick={() => setGender(v)}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <h3>Competitions</h3>
                {data.competitions
                  .filter((c) => gender === "all" || c.gender === gender)
                  .map((c) => (
                    <button
                      className="original-league-link"
                      key={c.id}
                      onClick={() => open({ kind: "competition", id: c.id })}
                    >
                      <CompetitionIcon id={c.id} size={35} />
                      <span>{c.name}</span>
                      <ChevronRight size={22} />
                    </button>
                  ))}
              </div>
            ) : page === "more" ? (
              <div className="original-directory">
                <h1>More</h1>
                <label
                  className="original-theme-label"
                  htmlFor="theme-preference"
                >
                  Theme Preference
                </label>
                <select
                  className="original-theme-select"
                  id="theme-preference"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as ThemeMode)}
                >
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
                <button className="original-league-link" onClick={follow}>
                  <UserRound />
                  <span>Account & Following</span>
                  <ChevronRight />
                </button>
                <button className="original-league-link" onClick={follow}>
                  <Star />
                  <span>Notification preferences</span>
                  <ChevronRight />
                </button>
              </div>
            ) : (
              <div className="original-directory">
                <h1>{page === "news" ? "News" : "Standings"}</h1>
                <EmptyState
                  title={
                    page === "news"
                      ? "News isn’t connected yet"
                      : "Standings aren’t available yet"
                  }
                >
                  {page === "news"
                    ? "Articles and news sources will be added after the core match experience."
                    : "Select a league to explore its fixtures. Tables will appear when a data source is connected."}
                </EmptyState>
              </div>
            )}
          </div>
        )}
        <nav className="original-bottom-nav" aria-label="Main navigation">
          {[
            ["matches", "Matches", Trophy],
            ["standings", "Standings", ChartNoAxesCombined],
            ["news", "News", Newspaper],
            ["leagues", "Leagues", Trophy],
            ["more", "More", Menu],
          ].map(([id, label, Icon]) => (
            <button
              key={id as string}
              className={page === id ? "active" : ""}
              onClick={() => nav(id as string)}
            >
              {id === "matches" ? (
                <img src="/brand/logo.png" alt="" />
              ) : (
                typeof Icon !== "string" && <Icon size={25} />
              )}
              <span>{label as string}</span>
            </button>
          ))}
        </nav>
        {dialog === "account" && (
          <AccountDialog onClose={() => setDialog(null)} />
        )}{" "}
        {dialog === "settings" && (
          <SettingsDialog
            theme={theme}
            setTheme={setTheme}
            onClose={() => setDialog(null)}
          />
        )}
      </div>
    </IonApp>
  );
}
