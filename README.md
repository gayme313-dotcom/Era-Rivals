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

Front Office dynasty saves are stored in the browser's localStorage on the device being used. They are not automatically synced between devices. Online accounts, global leaderboards, remote multiplayer and cloud saves require a hosted backend and are not included in this static browser build.

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

The generated `draft-player-pools.js` file is refreshed during the GitHub Pages publishing workflow. Some player records may have incomplete team or portrait data.
