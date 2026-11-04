#!/usr/bin/env python3
"""Build the ERA RIVALS draft pools from public player datasets.

The generated file is a browser-ready static database. Ratings are game estimates,
not official league ratings.
"""
from __future__ import annotations

import csv
import io
import json
import math
import re
import urllib.request
from collections import defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "draft-player-pools.js"
USER_AGENT = "ERA-RIVALS-player-pool-builder/1.0"

NBA_URL = "https://raw.githubusercontent.com/lazappi/nba_positions/master/nba_positions_full.tsv"
NFL_URL = "https://github.com/nflverse/nflverse-data/releases/download/players/players.csv"
SOCCER_PROFILES_URL = "https://raw.githubusercontent.com/salimt/football-datasets/main/datalake/transfermarkt/player_profiles/player_profiles.csv"
SOCCER_VALUES_URL = "https://raw.githubusercontent.com/salimt/football-datasets/main/datalake/transfermarkt/player_latest_market_value/player_latest_market_value.csv"
LAHMAN_BASE = "https://raw.githubusercontent.com/daviddalpiaz/pylahman/main/data-raw/"

NBA_POSITIONS = ("PG", "SG", "SF", "PF", "C")
NFL_POSITIONS = ("QB", "RB", "WR", "TE", "DB", "OL", "LB", "DL")
SOCCER_POSITIONS = ("GK", "RB", "LB", "CB", "CDM", "CM", "CAM", "RW", "LW", "ST")
MLB_POSITIONS = ("SP", "RP", "CP", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF")
TARGET_PER_POSITION = 120

BOOSTS = {
    "nba": {
        "PG": ["passing", "handles"], "SG": ["shot", "finishing"],
        "SF": ["defense", "shot"], "PF": ["rebound", "inside"], "C": ["inside", "block"],
    },
    "nfl": {
        "QB": ["throw", "accuracy", "iq"], "RB": ["speed", "vision", "power"],
        "WR": ["route", "hands", "speed"], "TE": ["hands", "blocking", "strength"],
        "DB": ["coverage", "speed", "ball"], "OL": ["blocking", "strength", "footwork"],
        "LB": ["tackle", "coverage", "speed"], "DL": ["rush", "power", "strength"],
    },
    "soccer": {
        "GK": ["reflex", "handling", "position"], "RB": ["pace", "tackle", "stamina"],
        "LB": ["pace", "tackle", "stamina"], "CB": ["defense", "strength", "aerial"],
        "CDM": ["tackle", "passing", "stamina"], "CM": ["passing", "vision", "stamina"],
        "CAM": ["vision", "dribbling", "passing"], "RW": ["pace", "dribbling", "finishing"],
        "LW": ["pace", "dribbling", "finishing"], "ST": ["finishing", "position", "power"],
    },
    "mlb": {
        "SP": ["velocity", "control", "stamina"], "RP": ["velocity", "movement", "composure"],
        "CP": ["velocity", "clutch", "control"], "C": ["framing", "arm", "blocking"],
        "1B": ["contact", "power", "fielding"], "2B": ["contact", "range", "fielding"],
        "3B": ["power", "arm", "fielding"], "SS": ["range", "arm", "speed"],
        "LF": ["power", "contact", "range"], "CF": ["speed", "range", "arm"],
        "RF": ["power", "arm", "contact"],
    },
}

def fetch_text(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=180) as response:
        return response.read().decode("utf-8-sig")

def read_csv_url(url: str, delimiter: str = ",") -> list[dict[str, str]]:
    return list(csv.DictReader(io.StringIO(fetch_text(url)), delimiter=delimiter))

def value(row: dict, *keys: str, default: str = "") -> str:
    normalized = {str(k).strip().lower(): (v if v is not None else "") for k, v in row.items()}
    for key in keys:
        found = normalized.get(key.strip().lower(), "")
        if str(found).strip() not in ("", "-", "NA", "N/A", "nan", "None", "null"):
            return str(found).strip()
    return default

def number(row: dict, *keys: str, default: float = 0.0) -> float:
    raw = value(row, *keys)
    try:
        return float(raw.replace(",", ""))
    except (TypeError, ValueError):
        return default

def clamp(value_: float, low: int = 60, high: int = 99) -> int:
    return max(low, min(high, int(round(value_))))

def player(name: str, team: str, rating: int, pos: str, *, player_id: str = "",
           photo: str = "", boosts: list[str] | None = None,
           era_ratings: dict | None = None) -> dict:
    return {
        "name": name.strip(),
        "team": (team or "Free Agent").strip(),
        "base": clamp(rating, 60, 99),
        "id": str(player_id or "").strip(),
        "photo": str(photo or "").strip(),
        "pos": pos,
        "boosts": boosts or [],
        "eraRatings": era_ratings or {},
    }

def unique_by_name(rows: list[dict]) -> list[dict]:
    out, seen = [], set()
    for row in rows:
        key = re.sub(r"\s+", " ", row["name"].casefold()).strip()
        if not key or key in seen:
            continue
        seen.add(key)
        out.append(row)
    return out

def build_nba() -> dict[str, list[dict]]:
    raw = read_csv_url(NBA_URL, delimiter="\t")
    team_names = {
        "ATL": "Atlanta Hawks", "BOS": "Boston Celtics", "BRK": "Brooklyn Nets",
        "CHO": "Charlotte Hornets", "CHI": "Chicago Bulls", "CLE": "Cleveland Cavaliers",
        "DAL": "Dallas Mavericks", "DEN": "Denver Nuggets", "DET": "Detroit Pistons",
        "GSW": "Golden State Warriors", "HOU": "Houston Rockets", "IND": "Indiana Pacers",
        "LAC": "LA Clippers", "LAL": "Los Angeles Lakers", "MEM": "Memphis Grizzlies",
        "MIA": "Miami Heat", "MIL": "Milwaukee Bucks", "MIN": "Minnesota Timberwolves",
        "NOP": "New Orleans Pelicans", "NYK": "New York Knicks", "OKC": "Oklahoma City Thunder",
        "ORL": "Orlando Magic", "PHI": "Philadelphia 76ers", "PHX": "Phoenix Suns",
        "POR": "Portland Trail Blazers", "SAC": "Sacramento Kings", "SAS": "San Antonio Spurs",
        "TOR": "Toronto Raptors", "UTA": "Utah Jazz", "WAS": "Washington Wizards",
        "TOT": "Multiple Teams",
    }
    position_map = {
        "PointGuard": ["PG"], "ShootingGuard": ["SG"], "SmallForward": ["SF"],
        "PowerForward": ["PF"], "Center": ["C"], "PowerForward_Center": ["PF", "C"],
    }
    best: dict[tuple[str, str], dict] = {}
    for row in raw:
        name = value(row, "Player")
        team = value(row, "Team")
        raw_pos = value(row, "Position")
        if not name or raw_pos not in position_map:
            continue
        try:
            games = float(value(row, "Games", default="0"))
        except ValueError:
            games = 0
        candidate = {
            "name": name, "team": team, "games": games,
            "fg": number(row, "FieldGoalPct"), "reb": number(row, "ReboundPct"),
            "ast": number(row, "AssistPct"), "pos": position_map[raw_pos],
        }
        key = (name.casefold(), raw_pos)
        old = best.get(key)
        if old is None or (team == "TOT" and old["team"] != "TOT") or (old["team"] != "TOT" and games > old["games"]):
            best[key] = candidate

    pools = {pos: [] for pos in NBA_POSITIONS}
    for item in best.values():
        rating = clamp(
            68 + (item["fg"] - 40) * 0.34 + (item["reb"] - 8) * 0.42
            + (item["ast"] - 4) * 0.38 + (item["games"] - 40) * 0.055,
            68, 96,
        )
        for pos in item["pos"]:
            pools[pos].append(player(
                item["name"], team_names.get(item["team"], item["team"] or "NBA"),
                rating, pos, boosts=BOOSTS["nba"][pos], era_ratings={"10s": rating},
            ))
    return {pos: unique_by_name(rows) for pos, rows in pools.items()}

def build_nfl() -> dict[str, list[dict]]:
    raw = read_csv_url(NFL_URL)
    pools = {pos: [] for pos in NFL_POSITIONS}
    by_group: dict[str, dict[str, dict]] = defaultdict(dict)
    position_map = {
        "QB": "QB", "RB": "RB", "FB": "RB", "WR": "WR", "TE": "TE",
        "DB": "DB", "CB": "DB", "S": "DB", "FS": "DB", "SS": "DB",
        "OL": "OL", "C": "OL", "G": "OL", "OG": "OL", "OT": "OL", "T": "OL",
        "LT": "OL", "LG": "OL", "RG": "OL", "RT": "OL",
        "LB": "LB", "ILB": "LB", "OLB": "LB", "MLB": "LB",
        "DL": "DL", "DE": "DL", "DT": "DL", "NT": "DL", "EDGE": "DL",
    }
    for row in raw:
        name = value(row, "display_name", "full_name", "football_name")
        if not name:
            continue
        group = value(row, "position_group").upper()
        actual_pos = value(row, "position").upper()
        if group not in pools:
            group = position_map.get(actual_pos, "")
        if group not in pools:
            continue
        birth = value(row, "birth_date")
        identity = value(row, "gsis_id") or (name.casefold() + "|" + birth)
        last_season = int(number(row, "last_season"))
        years = number(row, "years_of_experience")
        status = value(row, "status").lower()
        active_rank = 1 if any(word in status for word in ("active", "practice squad", "injured reserve")) else 0
        draft_pick = number(row, "draft_pick", default=9999)
        sort_score = (last_season, active_rank, years, -draft_pick)
        old = by_group[group].get(identity)
        if old is None or sort_score > old["_sort"]:
            by_group[group][identity] = {
                "name": name, "team": value(row, "latest_team", "draft_team", default="NFL"),
                "id": value(row, "espn_id"), "photo": value(row, "headshot"),
                "pos": actual_pos or group, "sort": sort_score, "_sort": sort_score,
            }
    for group in NFL_POSITIONS:
        candidates = sorted(by_group[group].values(), key=lambda x: x["_sort"], reverse=True)
        if len(candidates) < TARGET_PER_POSITION:
            raise RuntimeError(f"NFL {group}: only {len(candidates)} players found")
        for rank, item in enumerate(candidates[:TARGET_PER_POSITION]):
            pools[group].append(player(
                item["name"], item["team"], 96 - rank * 0.12, item["pos"],
                player_id=item["id"], photo=item["photo"], boosts=BOOSTS["nfl"][group],
            ))
    return pools

def soccer_position(text_: str) -> str | None:
    raw = text_.strip().lower()
    raw = raw.replace("centre", "center")
    raw = raw.replace("midfielder", "midfield")
    aliases = {
        "goalkeeper": "GK", "keeper": "GK",
        "right-back": "RB", "right back": "RB",
        "left-back": "LB", "left back": "LB",
        "center-back": "CB", "center back": "CB", "centre-back": "CB",
        "defensive midfield": "CDM", "defensive midfielder": "CDM",
        "central midfield": "CM", "central midfielder": "CM",
        "attacking midfield": "CAM", "attacking midfielder": "CAM",
        "right winger": "RW", "left winger": "LW",
        "center-forward": "ST", "center forward": "ST", "striker": "ST",
        "second striker": "ST",
    }
    if raw in aliases:
        return aliases[raw]
    # Transfermarkt's broad labels sometimes prefix the exact role.
    if " - " in raw:
        tail = raw.split(" - ")[-1].strip()
        return aliases.get(tail)
    return None

def build_soccer() -> dict[str, list[dict]]:
    values = {}
    for row in read_csv_url(SOCCER_VALUES_URL):
        pid = value(row, "player_id")
        if not pid:
            continue
        market_value = number(row, "value")
        if market_value > values.get(pid, -1):
            values[pid] = market_value

    candidates: dict[str, dict[str, dict]] = {pos: {} for pos in SOCCER_POSITIONS}
    for row in read_csv_url(SOCCER_PROFILES_URL):
        name = value(row, "player_name")
        pid = value(row, "player_id")
        if not name or not pid:
            continue
        positions = set()
        main = value(row, "player_main_position", "Position")
        mapped = soccer_position(main)
        if mapped:
            positions.add(mapped)
        # Secondary positions are genuine listed positions, so a versatile player
        # can appear in more than one relevant role without inventing a duplicate.
        secondary = value(row, "player_sub_position")
        for role in secondary.split(","):
            mapped = soccer_position(role)
            if mapped:
                positions.add(mapped)
        if not positions:
            mapped = soccer_position(value(row, "Position"))
            if mapped:
                positions.add(mapped)
        club = value(row, "Current club", "current_club", default="Free Agent")
        market = values.get(pid, 0)
        active = 0 if club.lower() == "retired" else 1
        image_url = value(row, "player_image_url")
        dob = value(row, "Date of birth")
        for pos in positions:
            if pos not in candidates:
                continue
            old = candidates[pos].get(pid)
            rank_key = (market, active, dob)
            if old is None or rank_key > old["_sort"]:
                candidates[pos][pid] = {
                    "name": name, "team": club, "photo": image_url,
                    "value": market, "sort": rank_key, "_sort": rank_key,
                }

    pools = {pos: [] for pos in SOCCER_POSITIONS}
    for pos in SOCCER_POSITIONS:
        rows = sorted(candidates[pos].values(), key=lambda x: x["_sort"], reverse=True)
        if len(rows) < TARGET_PER_POSITION:
            raise RuntimeError(f"Soccer {pos}: only {len(rows)} players found")
        for rank, item in enumerate(rows[:TARGET_PER_POSITION]):
            market = max(item["value"], 100_000)
            rating = clamp(82 + 5 * math.log10(market / 1_000_000), 70, 99)
            pools[pos].append(player(
                item["name"], item["team"], rating, pos,
                photo=item["photo"], boosts=BOOSTS["soccer"][pos],
            ))
    return pools

def build_mlb() -> dict[str, list[dict]]:
    people_rows = read_csv_url(LAHMAN_BASE + "People.csv")
    fielding_rows = read_csv_url(LAHMAN_BASE + "Fielding.csv")
    pitching_rows = read_csv_url(LAHMAN_BASE + "Pitching.csv")
    team_rows = read_csv_url(LAHMAN_BASE + "Teams.csv")

    people = {}
    for row in people_rows:
        pid = value(row, "playerID")
        first = value(row, "nameFirst")
        last = value(row, "nameLast")
        name = (first + " " + last).strip()
        if pid and name:
            people[pid] = name

    team_names = {}
    for row in team_rows:
        year = int(number(row, "yearID"))
        team_id = value(row, "teamID")
        if year and team_id:
            team_names[(year, team_id)] = value(row, "name", default=team_id)

    fielding = defaultdict(lambda: {"games": 0, "year": 0, "team": ""})
    for row in fielding_rows:
        pid = value(row, "playerID")
        pos = value(row, "POS").upper()
        if not pid or pos not in ("C", "1B", "2B", "3B", "SS", "LF", "CF", "RF"):
            continue
        games = int(number(row, "G"))
        year = int(number(row, "yearID"))
        team = value(row, "teamID")
        item = fielding[(pid, pos)]
        item["games"] += games
        if year >= item["year"]:
            item["year"], item["team"] = year, team

    pitching = defaultdict(lambda: {"g": 0, "gs": 0, "sv": 0, "ipouts": 0, "so": 0, "year": 0, "team": ""})
    for row in pitching_rows:
        pid = value(row, "playerID")
        if not pid:
            continue
        item = pitching[pid]
        item["g"] += int(number(row, "G"))
        item["gs"] += int(number(row, "GS"))
        item["sv"] += int(number(row, "SV"))
        item["ipouts"] += int(number(row, "IPouts"))
        item["so"] += int(number(row, "SO"))
        year = int(number(row, "yearID"))
        if year >= item["year"]:
            item["year"], item["team"] = year, value(row, "teamID")

    pools = {pos: [] for pos in MLB_POSITIONS}
    for pos in ("C", "1B", "2B", "3B", "SS", "LF", "CF", "RF"):
        candidates = []
        for (pid, field_pos), stats in fielding.items():
            if field_pos != pos or pid not in people:
                continue
            candidates.append((pid, stats["games"], stats["year"], stats["team"]))
        candidates.sort(key=lambda x: (x[1], x[2]), reverse=True)
        if len(candidates) < TARGET_PER_POSITION:
            raise RuntimeError(f"MLB {pos}: only {len(candidates)} players found")
        for rank, (pid, games, year, team_id) in enumerate(candidates[:TARGET_PER_POSITION]):
            pools[pos].append(player(
                people[pid], team_names.get((year, team_id), team_id or "MLB Legends"),
                99 - rank * 0.13, pos, boosts=BOOSTS["mlb"][pos],
            ))

    pitching_roles = {
        "SP": lambda x: x["gs"],
        "RP": lambda x: max(0, x["g"] - x["gs"]),
        "CP": lambda x: x["sv"],
    }
    for pos, metric in pitching_roles.items():
        candidates = []
        for pid, stats in pitching.items():
            if pid not in people or metric(stats) <= 0:
                continue
            candidates.append((pid, metric(stats), stats["year"], stats["team"]))
        candidates.sort(key=lambda x: (x[1], x[2]), reverse=True)
        if len(candidates) < TARGET_PER_POSITION:
            raise RuntimeError(f"MLB {pos}: only {len(candidates)} players found")
        for rank, (pid, stat, year, team_id) in enumerate(candidates[:TARGET_PER_POSITION]):
            pools[pos].append(player(
                people[pid], team_names.get((year, team_id), team_id or "MLB Legends"),
                99 - rank * 0.13, pos, boosts=BOOSTS["mlb"][pos],
            ))
    return pools

def validate(pools: dict[str, dict[str, list[dict]]]) -> None:
    expected = {
        "nfl": NFL_POSITIONS, "soccer": SOCCER_POSITIONS, "mlb": MLB_POSITIONS,
    }
    for sport, positions in expected.items():
        for pos in positions:
            count = len(unique_by_name(pools[sport][pos]))
            if count < 100:
                raise RuntimeError(f"{sport.upper()} {pos}: only {count} unique players")

    # NBA's 2017-18 positional sample is combined with the curated all-time pool
    # already in draft.html and basketball-era-data.js.
    nba_text = (ROOT / "draft.html").read_text(encoding="utf-8")
    era_text = (ROOT / "basketball-era-data.js").read_text(encoding="utf-8")
    for pos in NBA_POSITIONS:
        line = next((x for x in nba_text.splitlines() if x.strip().startswith(pos + ":[")), "")
        names = set(re.findall(r"p\('([^']+)'", line))
        for match in re.findall(r"extras\." + pos + r"\.push\((.*?);", era_text, re.S):
            names.update(re.findall(r"\['([^']+)'", match))
        names.update(row["name"] for row in pools["nba"][pos])
        if len(names) < 100:
            raise RuntimeError(f"NBA {pos}: only {len(names)} unique players after merging")

def main() -> None:
    print("Building NBA pools...")
    pools = {
        "nba": build_nba(),
        "nfl": build_nfl(),
        "soccer": build_soccer(),
        "mlb": build_mlb(),
    }
    validate(pools)
    payload = {
        "generatedAt": date.today().isoformat(),
        "targetPerPosition": 100,
        "pools": pools,
    }
    output = "/* Generated by scripts/build-draft-player-pools.py. Do not edit by hand. */\n"
    output += "window.ERDraftExpandedPools = " + json.dumps(
        payload["pools"], ensure_ascii=False, separators=(",", ":")
    ) + ";\n"
    output += "window.ERDraftPoolMeta = " + json.dumps(
        {"generatedAt": payload["generatedAt"], "targetPerPosition": 100},
        separators=(",", ":"),
    ) + ";\n"
    OUTPUT.write_text(output, encoding="utf-8")
    for sport, positions in pools.items():
        print(sport.upper() + ": " + ", ".join(f"{pos}={len(unique_by_name(rows))}" for pos, rows in positions.items()))
    print(f"Wrote {OUTPUT} ({OUTPUT.stat().st_size:,} bytes)")

if __name__ == "__main__":
    main()
