# ERA RIVALS — Decision-Based Sports Management Game

ERA RIVALS is an original browser sports universe created by Xavier Matos. The main entry point is `index.html`, which opens the all-time legends portal for basketball, American football, soccer and baseball.

## Main game: Front Office

The primary game is a management simulator. You do not control athletes with movement or shooting controls. You make the decisions and the match engine simulates the result.

Open `manager.html` directly or choose a sport from the Legends homepage.

- Five local dynasty save slots per sport.
- Current-player and All-Time Legends roster eras.
- 100+ player entries per position, using curated current stars, historical legends, database players and clearly labeled generated prospects where a pool needs filling.
- Roster management: starters, bench, player roles, injuries, morale and fatigue.
- Team tactics: offensive identity, defensive identity, tempo, risk and rotation.
- Matchday decisions: prepare a game, simulate the first half, make a halftime adjustment, then simulate the finish.
- Season progression, records, standings, match reports and championship awards.
- Front office: free-agent signings, player trades, contract extensions and releases.
- Scouting and drafting prospects.
- Team training and player development based on potential.
- Player career legacy points, retirement and Hall of Fame rankings by exact position.

The match engine uses team ratings, lineup choices, chemistry, morale, fatigue, tactics and matchday decisions. Results and ratings are original game simulations, not official league statistics.

## Other game modes

- The Legends homepage presents an editorial all-time top five for each of the four sports.
- `draft.html` provides the player draft and attribute-spin experience.
- `career-system.js` supports the separate player-career system with multiple saves, training, simulated seasons, contracts, trades, depth charts, retirement and Hall of Fame eligibility.
- `classic.html` contains the separate school / college career prototype.
- `pro-series.html` is the older 3D arcade prototype. Its old Play and Franchise entry points now route to the decision-based Front Office game.

## Saves and online services

Front Office dynasty saves are stored in the browser's localStorage on the device being used. They are not automatically synced between devices. The Saves & Online screen supports explicit private cloud snapshots and opt-in casual leaderboards through Supabase; see the online launch note below. Remote multiplayer is not included.

## Run

Open `index.html` or `manager.html` in a modern browser, or publish the repository with GitHub Pages. The site is static and has no build step.

## Data and licensing

Player identities are drawn from curated and open sports datasets. ERA RIVALS overall ratings, contracts, match simulations, awards and results are original game estimates, not official league ratings or verified statistics. ERA RIVALS is an independent fan-made prototype and is not affiliated with the NBA, NFL, MLB, FIFA or any sports league.

## Expanded player pools

The fantasy draft targets 100 unique players for every selectable role across basketball, American football, soccer and baseball. The Front Office game uses the expanded pools and adds current-star and all-time legend entries. If a current pool has fewer than 100 entries, clearly labeled fictional ERA RIVALS prospects fill the remaining slots.

- Basketball: curated historical players, current stars and positional data from the NBA datasets.
- American football: player identities and position groups from [nflverse](https://github.com/nflverse/nflverse-data).
- Soccer: player names, positions and club data from [football-datasets](https://github.com/salimt/football-datasets).
- Baseball: historical names and position appearances from the [Lahman database](https://github.com/daviddalpiaz/pylahman).

The generated `draft-player-pools.js` file is refreshed during the GitHub Pages publishing workflow. Some player records may have incomplete team or portrait data. Generated fallback prospects are cached by sport, era and position during a session so scouting pools and opponent ratings stay consistent.

## Front Office v2 (November 5, 2026)

- 112 club roster snapshots from ESPN (30 NBA, 32 NFL, 30 MLB and 20 soccer clubs), with logos and player portraits. NBA/NFL/MLB depth charts inform initial roles. Soccer uses simplified game roles. Includes reserves and practice-squad players; this is not a league eligibility simulator.
- Start a **new current-era save** to use the new club rosters. Existing save rosters are preserved.
- All-Time mode now builds full position-by-position squads with a real bench, historical franchise-name matching, prime-age legends and a salary budget. Opponent ratings use the selected era instead of current-era club ratings.
- NFL team snapshots include specialist positions (kicker and punter); overtime results use sport-appropriate scoring.
- One preparation choice per fixture: recovery, team meeting or intense practice. Costs and bonuses are shown before selection.
- Consistent scheduled opponents with independent ratings. Each simulated league round updates both sides of every fixture. Soccer uses three points per win; other sports use wins.
- Top eight advance to a three-round, single-game ERA Cup in NBA/NFL/MLB. Soccer awards its custom league title to first place. These schedules and playoffs are simplified game formats, not official league formats.
- Injury countdowns, injured-player restrictions, automatic vacancy coverage, fair-value trade checks, two fictional draft picks per season, and salary limits.
- Download/import backups preserve in-progress matches and playoff rounds. Cloud loads create a new local slot.
- Supabase stores private, owner-scoped save snapshots and optional public **casual, self-reported** GM leaderboards. Cloud upload is explicit, not continuous synchronization. Public score fields omit account identifiers and email. Email confirmation is required for signup.

### Data refresh

Run `python scripts/build-team-rosters.py`, then `python scripts/refresh-depth-charts.py` to refresh the checked-in snapshot. Node is required to read the game's position/club configuration. Ratings, potentials, salaries, contracts and all generated prospects are fictional game estimates. ESPN source links and snapshot time are included in `team-rosters.js`. Rosters are a dated snapshot, not a continuously updated feed.

### Validation

Run `node --check manager.js` and `node tests/manager.test.cjs`. Tests cover all four sports, full current and all-time depth charts, prime-age legends, payroll limits, franchise aliases, era-specific opponent ratings, overtime scoring, full seasons, consistent fixture accounting, opponent identity, injury recovery, pending-game protection, backups and season rollover. The GitHub Pages workflow runs these checks.

`database/schema.sql` documents the deployed schema. Database verification used rolled-back test users and confirmed owner-only saves, blocked cross-owner writes, public-field-only leaderboard reads, and own-score updates. Security advisors reported no issues. Browser smoke testing covered creation, preparation, a complete match and a live empty leaderboard response.

### Online launch note

The backend and game integration are configured. Email delivery/sign-in has not been tested end-to-end with a real inbox. Supabase's default mailer is restricted; configure production SMTP and the site's Auth URL settings in Supabase before opening account creation to the public. After email verification, players can return to the game and sign in. Offline play and JSON backups do not require an account.

### Third-party dependency

`vendor/supabase-2.57.4.js` is the pinned Supabase JavaScript UMD distribution from jsDelivr's npm mirror. Its MIT license is in `vendor/SUPABASE-LICENSE`. The game runs locally without this optional online client.
