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

**Not done:** No files have been modified to implement these features by this backlog commit alone.
