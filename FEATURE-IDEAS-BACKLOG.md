# Era Rivals — Feature Ideas Backlog

**Recorded:** 2026-11-17  
**Status:** PROPOSED ONLY. These entries are not implemented or tested.  
**Project:** [Era-Rivals repository](https://github.com/gayme313-dotcom/Era-Rivals)  
**Tracker:** [Development HQ](https://gayme313-dotcom.github.io/Era-Rivals/dev-hq.html)

## Ground rule

- Ideas in this file represent planning work only, not working code.
- Mark implementation **verified** only after linking exact changed files/commit and passing reproducible tests.
- Fix rating correctness, injury reliability, and season standings ahead of adding mechanics that depend on them.
- Preserve separate rankings by sport **and position** for real legends and created career players.

## Prioritized proposed features

| Feature | System | Priority | Relative effort | Description |
|---|---|---|---|---|
| Dynamic player potential | Career development | High | Medium | Prospects grow, stall or decline based on age, minutes, coaching, injuries, and performance. |
| Player personalities and team chemistry | Career/franchise | High | Medium | Personality traits influence morale, team fit, negotiations, and performance. |
| Alternate-history universe | Historical modes | High | High | Historical decisions branch into new timelines with coherent rosters, records, and league history. |
| Draft war room | Draft/scouting | High | Medium | Live draft board, positional needs, surprise picks, trade offers, and prospect uncertainty. |
| Dynasty museum | Career legacy | High | Low–Medium | Save rings, trophies, retired jerseys, awards, record seasons, and career stories. |
| Player agents | Contracts | Medium | Medium | Agents negotiate based on salary, role, loyalty, location and chances of winning. |
| Youth academies and generational talents | Recruitment | Medium | High | Develop prospects and occasionally surface rare high-ceiling players. |
| Post-retirement careers | Career lifecycle | Medium | High | Retired players can become coaches, scouts or executives. |
| Coaching trees | Franchise | Medium | Medium | Coaches develop strategic identities and mentorship lineages. |
| Front office staff | Franchise | Medium | Medium | Scouts, doctors and assistants alter insight, development and injury care. |
| Franchise finances | Franchise | Medium | High | Revenue, facilities, salaries, sponsorships and ownership constraints. |
| Expansion franchises | League management | Medium | High | Add new teams with expansion drafts and stable league scheduling. |
| In-game tactical adjustments | Simulation | Medium | High | Scheme changes based on matchup, score and roster strengths. |
| Fatigue and workload | Simulation/injuries | High | Medium | Minutes, snaps and travel affect health and performance, subject to injury bug fixes. |
| Advanced analytics | Statistics | Medium | Medium | Position-and-sport relevant metrics, with clear formula definitions. |
| Era-specific rules | Historical modes | Medium | High | Apply documented historical rules consistently across simulations. |
| Legacy storylines | Career narrative | Medium | Medium | Remember breakout seasons, revenge games, records and comeback moments. |
| Sports media network | News/media | Medium | Medium | Extend planned dynamic news with mock drafts, recaps, debates and rankings. |
| Cross-sport legacy profile | Hall of Fame | Low | High | Optional meta-profile, without mixing sport-and-position player HOF rankings. |
| Chemistry-aware team builder | Franchise | Medium | Medium | Show fit and role conflicts before a roster move; depends on personality groundwork. |

## Selected for the development roadmap (2026-11-17)

The following five concepts are selected for future development. **Selection is not implementation**: all five remain **PLANNED / NOT VERIFIED** in this roadmap. Existing related systems are noted below so development extends them instead of duplicating them.

| Selected feature | Roadmap state | Existing related work (not proof the selected scope is complete) | Dependencies / likely code areas |
|---|---|---|---|
| Dynamic player potential | PLANNED — audit and extend | README describes training/development and the Dynasty HQ guide describes boom-or-bust offseason growth. Verify the actual growth rules before adding another system. | First stabilize rating data, season progression and injury effects. Inspect `franchise-engine.js`, `manager.js`, `career-system.js`; add/extend development tests in `tests/franchise.test.cjs` and `tests/manager.test.cjs`. |
| Player personalities & chemistry | PLANNED — audit and extend | README and Dynasty HQ guide already describe eight archetypes and chemistry effects/connections. Do not build a duplicate trait system; verify coverage and improve depth/consistency. | Verify morale, relationship and match-simulation effects first. Inspect `living-league.js`, `franchise-engine.js`, `franchise-ui.js`, `manager.js`; extend `tests/franchise.test.cjs`. |
| Draft war room | PLANNED — improve existing draft flow | Existing scouting/draft and draft-night chaos are documented. The selected scope is a more complete war-room experience, not a claim that a new draft engine exists. | Depends on stable player pools, scouting grades, positional needs and trade validation. Inspect `draft.html`, `draft-player-pools.js`, `manager.js`, `franchise-engine.js`; test with draft and manager suites. |
| Dynasty museum | PLANNED — build a unified archive | Existing Your Legacy, season recaps, retired jerseys, awards and record-book features are documented. The museum should unify verified achievements rather than invent new records. | Depends on reliable season results, career stats, awards and save persistence. Inspect `manager.js`, `franchise-engine.js`, `career-system.js`, `franchise-ui.js`; test archive accuracy, no duplicate awards and save/load. |
| Alternate-history universe | PLANNED — expand save branching | Existing historical-inspired starts and What-if save forks are documented. The selected scope is a coherent alternate timeline with era-aware rosters/rules/history. | Highest dependency: stable saves/forks, historical roster data, season schedules and rule configuration. Inspect `manager.js`, `franchise-engine.js`, `team-rosters.js`, `universe-reset.js`; test timeline isolation and deterministic replay. |

### Dependency-first implementation order

1. **Core reliability gate (before these additions):** verify realistic ratings, injury recovery/restrictions, and complete season standings/fixture accounting. Keep bugs visible; do not assume old test claims cover current code.
2. **Dynamic player potential:** audit existing growth and boom-or-bust logic; add only missing age, workload, coaching, injury and performance interactions.
3. **Player personalities & chemistry:** audit the documented archetypes and chemistry connections; close gaps in trait effects, teammate relationships, morale and persistence.
4. **Draft war room:** improve the existing scouting/draft flow with board state, pick tracking, positional needs and valid trade-up/down decisions.
5. **Dynasty museum:** assemble an archive from verified championships, awards, records, retired jerseys and player career milestones.
6. **Alternate-history universe:** expand the existing What-if fork and historical starts only after save isolation, roster/era data and season simulation are reliable.

For each step, record the exact changed paths and commit, tests run, expected vs. actual results, and any remaining limitations. A feature stays **PLANNED** until implementation evidence exists, and **VERIFIED** only after reproducible tests pass.

## Suggested order, after core bugs are controlled

1. **Dynamic potential:** model deterministic baseline development with controlled randomness. Tests: bounds, reproducible seed, age-curve regression, save/load.
2. **Personality/chemistry:** represent trait effects and their explanations. Tests: roster swap, morale recalculation, compatibility, persistence.
3. **Draft war room:** build on verified draft engine. Tests: no duplicate selection, picks/timers, valid trades, post-draft roster assignment.
4. **Dynasty museum:** read-only presentation of verified historical season achievements. Tests: no duplicate trophies; reload restores archive; compare across save slots.
5. **Alternate history:** depends on stable rosters/seasons/saves. Tests: divergence changes only expected records; era-aware rules; reproducible simulation.

## Evidence required for each idea

- Feature ID, sport(s), position(s), owner, state, priority, dependencies
- Repository file paths and commit SHA
- Test setup, expected behavior, actual behavior, result and date
- Integration impact (GitHub Pages, Supabase, authentication or other services)

**Implementation status:** The five selected items above are roadmap selections only. This documentation update does not implement gameplay code or change their status to complete.
