# ERA RIVALS — Browser Sports Game

An original browser-based sports game created by Xavier Matos. The main entry point is `index.html`, which opens the Legends sport selector. Basketball, American football, soccer and baseball are available.

## Career mode

Each sport has a dedicated Player Career experience with:

- Five save slots per sport, with separate player builds and career histories.
- Player development through training points and attribute upgrades.
- Full season progression and simulated games.
- Sport-specific awards, championships and career legacy points.
- Contracts, free agency offers, trade requests and team changes.
- Editable depth charts with starters and bench roles.
- Retirement, Hall of Fame eligibility and an all-time career leaderboard.

Career achievements award legacy points. Examples include MVP (1,000), league or Super Bowl championship (1,500), Finals / Super Bowl MVP (1,000), All-Star / Pro Bowl (250), and Hall of Fame induction (2,000). Soccer and baseball have their own sport-specific award values.

## Other game modes

- 3D browser gameplay with keyboard, touch and gamepad controls.
- MyPLAYER identity, appearance and attribute builder.
- Franchise team builder and roster management.
- Build-a-player fantasy draft with sport and position filters.
- Basketball all-time player pool with 133 curated players across five positions (23–32 per position).
- Basketball decade filter from the 1960s through the 2020s, with era-specific game overall ratings for each player's active era.
- Attribute spins use the selected era rating, and positions with no eligible players in that decade are disabled.

## Saves and online services

Career slots and player progress are stored in the browser's localStorage on the device being used. They are not automatically synced between devices. Online accounts, global leaderboards, remote multiplayer and cloud saves require a backend and are not included in this static browser build.

## Run

Open `index.html` in a modern browser or publish the repository with GitHub Pages. The site is static and has no build step.

## Data and licensing

Season simulations, ratings, contracts, career awards and results are original game simulations, not official league ratings or verified statistics. Basketball decade ratings are ERA RIVALS estimates designed for gameplay balance, not official historical ratings. Player and team data is curated and may be incomplete. ERA RIVALS is an independent fan-made prototype and is not affiliated with the NBA, NFL, MLB, FIFA, or any sports league.

## Expanded fantasy draft pools

The fantasy draft now targets **100 unique players for every selectable role** across basketball, American football, soccer, and baseball. The UI removes duplicate names and caps each selected role at 100 players.

- Basketball: curated all-time players plus the 2017–18 positional sample from [lazappi/nba_positions](https://github.com/lazappi/nba_positions). The era selector still filters players to the selected decade.
- American football: player identities, position groups, ESPN IDs, and available headshots from [nflverse](https://github.com/nflverse/nflverse-data).
- Soccer: player names, main/secondary positions, clubs, market values, and available portraits from [salimt/football-datasets](https://github.com/salimt/football-datasets).
- Baseball: historical names, position appearances, and team history from the [Lahman database](https://github.com/daviddalpiaz/pylahman).

The generated `draft-player-pools.js` file is refreshed during the GitHub Pages publishing workflow. ERA RIVALS overall ratings are game estimates, not official league ratings. Some older basketball and baseball players may use initials instead of a portrait when the source does not provide a usable image ID.
