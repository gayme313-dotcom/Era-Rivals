const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const elements=new Map(),storage=new Map();const doc={getElementById(id){if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',className:'',value:'',hidden:false});return elements.get(id)},addEventListener(){},createElement(){return {click(){}}}};
const context={document:doc,window:{},location:{search:'?sport=nfl'},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},URLSearchParams,console,setTimeout:()=>0,clearTimeout(){},confirm:()=>true,Blob,URL,Math};vm.createContext(context);
for(const file of ['draft-player-pools.js','team-rosters.js','basketball-era-data.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
const source=fs.readFileSync('manager.js','utf8').replace(/render\(\);\s*\}\)\(\);\s*$/,`globalThis.test={createSave,getSave,beginMatch,finishMatch,simAuto,simFive,simRest,prepareTeam,nextOpponent,teamPower,teamOvr,renderDashboard,renderRoster,renderTactics,renderTransactions,renderScouting,renderStandings,renderLegacy,renderMatchday,renderSaveCenter,validateSave,toggleStarter,tradePlayers,advanceSeason,autoLineup,rankedTeams,state,SPORT,TEAMS,setSport:v=>sport=v,setPage:v=>page=v,readState};\n})();`);
vm.runInContext(source,context);const t=context.test;
for(const sp of ['nba','nfl','mlb','soccer']){
 t.setSport(sp);const team={nba:'Boston Celtics',nfl:'New England Patriots',mlb:'Boston Red Sox',soccer:'Real Madrid'}[sp];t.createSave({team,era:'current',manager:'Xavi'});const s=t.getSave();
 assert(s.roster.length>=10,sp+' full squad');assert(s.roster.every(p=>p.originalTeam===team),'club-bound players');assert(s.roster.every(p=>Number.isFinite(p.overall)));
 assert(new Set(s.roster.map(p=>p.name)).size===s.roster.length,'no duplicates');
 for(const name of ['renderDashboard','renderRoster','renderTactics','renderTransactions','renderScouting','renderStandings','renderLegacy','renderMatchday','renderSaveCenter']){const html=t[name](s);assert(!html.includes('undefined'),sp+' '+name+' contains undefined');}
 const expected=t.nextOpponent(s);t.prepareTeam(s,'recover');t.beginMatch();assert.equal(s.pending.opponent,expected,'preview matches actual opponent');
 const oldPending=s.pending;t.simFive();assert.equal(s.week,0,'pending games cannot be bypassed');assert.equal(s.pending,oldPending);
 const checked=t.validateSave(JSON.parse(JSON.stringify(s)));assert(checked.pending,'backup preserves pending decision');
 t.finishMatch(s,s.pending,s.pending.options[1],true);assert.equal(s.week,1);
 const hurt=s.roster.find(p=>p.starter);hurt.injured=2;hurt.starter=false;t.toggleStarter(hurt.id);assert.equal(hurt.injured,2,'starting cannot heal injuries');assert(!hurt.starter);const played=hurt.games;
 t.simAuto(s);assert.equal(hurt.injured,1);assert.equal(hurt.games,played,'injured players get no games');
 t.simAuto(s);assert.equal(hurt.injured,0,'injuries recover');
 const strong=t.teamPower(s),op=t.nextOpponent(s),oppRating=s.standings[op].ovr;s.roster.forEach(p=>p.overall=Math.min(99,p.overall+4));assert(t.teamPower(s)>strong,'training improves effective strength');assert.equal(s.standings[op].ovr,oppRating,'opponents do not scale to user');
 while(s.week<t.SPORT[sp].games){t.simAuto(s);const rows=Object.values(s.standings);for(const r of rows)assert.equal(r.w+r.l+r.d,s.week,sp+' equal fixtures');assert.equal(rows.reduce((n,r)=>n+r.w,0),rows.reduce((n,r)=>n+r.l,0),'league wins equal losses');}
 let max=0;while(!s.offseason&&max++<4)t.simAuto(s);assert(s.offseason,'season completes');assert.equal(s.seasonHistory.length,1);assert.equal(s.record.w+s.record.l+s.record.d,t.SPORT[sp].games,'playoffs separate from regular record');
 const before=s.season;t.advanceSeason();assert.equal(s.season,before+1);assert.equal(s.week,0);assert.equal(s.playoffs,null);assert(s.schedule.length===t.SPORT[sp].games);
 console.log('PASS',sp, s.roster.length+' roster players; full season, injuries, fixtures, saves and next season');
}
// Trade rejection must prevent swapping weak players for superstars.
t.setSport('nba');const s=t.getSave();const out=s.roster[0];out.overall=60;out.potential=60;out.age=35;doc.getElementById('tradeOutgoing').value=out.id;const candidates=context.window.ERTeamRosters.teams.nba;const target=Object.values(candidates).flatMap(c=>c.players).find(p=>p.pos===out.pos&&p.base>=90&&!s.roster.some(x=>x.name===p.name));if(target){doc.getElementById('tradeIncoming').value=target.name;t.tradePlayers();assert(s.roster.includes(out),'unfair trade rejected')}
for(const sp of ['nba','nfl','mlb','soccer']){t.setSport(sp);t.createSave({team:t.TEAMS[sp][0],era:'alltime'});t.simAuto(t.getSave());assert.equal(t.getSave().week,1);console.log('PASS',sp,'all-time mode')}
console.log('ALL CHECKS PASSED');
