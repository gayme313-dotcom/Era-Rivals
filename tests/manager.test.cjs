const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const elements=new Map(),storage=new Map();const doc={getElementById(id){if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',className:'',value:'',hidden:false});return elements.get(id)},addEventListener(){},createElement(){return {click(){}}}};
storage.set('era_rivals_universe_v2','old career');storage.set('era_rivals_pro_v1','old career');const context={document:doc,window:{},location:{search:'?sport=nfl'},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},URLSearchParams,console,setTimeout:()=>0,clearTimeout(){},confirm:()=>true,Blob,URL,Math};vm.createContext(context);
for(const file of ['universe-reset.js','draft-player-pools.js','team-rosters.js','basketball-era-data.js','franchise-engine.js','living-league.js','franchise-ui.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
const source=fs.readFileSync('manager.js','utf8').replace(/render\(\);\s*\}\)\(\);\s*$/,`globalThis.test={createSave,getSave,beginMatch,finishMatch,simAuto,simFive,simRest,prepareTeam,nextOpponent,teamPower,teamOvr,renderDashboard,renderRoster,renderTactics,renderTransactions,renderScouting,renderStandings,renderLegacy,renderMatchday,renderSaveCenter,validateSave,toggleStarter,tradePlayers,advanceSeason,autoLineup,rankedTeams,state,SPORT,TEAMS,STARTERS,PLAN,resolveTie,sameFranchise,clubRating,teamPayroll,playerPools,franchiseEnv,render,recordPlayerGameStats,mvpScore,renderRecords,makePromise,evaluatePromises,proposeTrade,counterTrade,acceptTrade,makeDraftPicks,ensureSeason,completeSeason,playerTradeValue,setSport:v=>sport=v,setPage:v=>page=v,readState};\n})();`);
vm.runInContext(source,context);const t=context.test;
for(const sp of ['nba','nfl','mlb','soccer']){
 t.setSport(sp);for(const era of ['current','alltime'])for(const pos of t.SPORT[sp].positions){const pool=t.playerPools(pos,era);assert(pool.length>=100,sp+' '+era+' '+pos+' has 100+ players');assert(new Set(pool.map(p=>p.name.toLowerCase())).size>=100,sp+' '+era+' '+pos+' unique players');assert.strictEqual(t.playerPools(pos,era),pool,sp+' '+era+' '+pos+' pool is stable');}const team={nba:'Boston Celtics',nfl:'New England Patriots',mlb:'Boston Red Sox',soccer:'Real Madrid'}[sp];t.createSave({team,era:'current',manager:'Xavi'});const s=t.getSave();
 assert(s.roster.length>=10,sp+' full squad');assert(s.roster.every(p=>p.originalTeam===team),'club-bound players');assert(s.roster.every(p=>Number.isFinite(p.overall)));assert(t.teamPayroll(s)<=t.SPORT[sp].cap,sp+' current payroll under cap');for(const [pos,count] of Object.entries(t.STARTERS[sp]))assert.equal(s.roster.filter(p=>p.pos===pos&&p.starter).length,count,sp+' current starting '+pos+' depth chart');
 assert(new Set(s.roster.map(p=>p.name)).size===s.roster.length,'no duplicates');
 for(const name of ['renderDashboard','renderRoster','renderTactics','renderTransactions','renderScouting','renderStandings','renderLegacy','renderMatchday','renderSaveCenter']){const html=t[name](s);assert(!html.includes('undefined'),sp+' '+name+' contains undefined');}
 const expected=t.nextOpponent(s);t.prepareTeam(s,'recover');t.beginMatch();assert.equal(s.pending.opponent,expected,'preview matches actual opponent');
 const oldPending=s.pending;t.simFive();assert.equal(s.week,0,'pending games cannot be bypassed');assert.equal(s.pending,oldPending);
 const checked=t.validateSave(JSON.parse(JSON.stringify(s)));assert(checked.pending,'backup preserves pending decision');
 t.finishMatch(s,s.pending,s.pending.options[1],true);assert.equal(s.week,1);assert(s.roster.some(p=>p.seasonStats.appearances===1),sp+' player game stats recorded');assert(s.roster.some(p=>p.careerStats.appearances===1),sp+' career stats recorded');assert(t.renderRecords(s).includes('SEASON MVP RACE'),sp+' record book renders');assert(t.renderRecords(s).includes('CAREER RECORDS BY STAT'),sp+' career stat leaders render');
 const hurt=s.roster.find(p=>p.starter);hurt.injured=2;hurt.starter=false;t.toggleStarter(hurt.id);assert.equal(hurt.injured,2,'starting cannot heal injuries');assert(!hurt.starter);const played=hurt.games;
 t.simAuto(s);assert.equal(hurt.injured,1);assert.equal(hurt.games,played,'injured players get no games');
 t.simAuto(s);assert.equal(hurt.injured,0,'injuries recover');
 const strong=t.teamPower(s),op=t.nextOpponent(s),oppRating=s.standings[op].ovr;s.roster.forEach(p=>p.overall=Math.min(99,p.overall+4));assert(t.teamPower(s)>strong,'training improves effective strength');assert.equal(s.standings[op].ovr,oppRating,'opponents do not scale to user');
 while(s.week<t.SPORT[sp].games){t.simAuto(s);const rows=Object.values(s.standings);for(const r of rows)assert.equal(r.w+r.l+r.d,s.week,sp+' equal fixtures');assert.equal(rows.reduce((n,r)=>n+r.w,0),rows.reduce((n,r)=>n+r.l,0),'league wins equal losses');}
 let max=0;while(!s.offseason&&max++<4)t.simAuto(s);assert(s.offseason,'season completes');assert.equal(s.seasonHistory.length,1);assert.equal(s.record.w+s.record.l+s.record.d,t.SPORT[sp].games,'playoffs separate from regular record');
 const before=s.season;if(s.fo.owner.status==='fired')context.window.ERFranchise.action(s,'job',{team:s.fo.jobs[0].team},t.franchiseEnv(s));t.advanceSeason();assert.equal(s.season,before+1);assert.equal(s.week,0);assert.equal(s.playoffs,null);assert(s.schedule.length===t.SPORT[sp].games);
 console.log('PASS',sp, s.roster.length+' roster players; full season, injuries, fixtures, saves and next season');
}
t.setSport('nba');assert(t.sameFranchise('Cincinnati Royals','Sacramento Kings'),'historical NBA franchise alias');t.setSport('nfl');assert(t.sameFranchise('San Diego Chargers','Los Angeles Chargers'),'historical NFL franchise alias');t.setSport('mlb');assert(t.sameFranchise('Brooklyn Dodgers','Los Angeles Dodgers'),'historical MLB franchise alias');
// A weak single-player offer must be rejected by the AI front office.
t.setSport('nba');t.createSave({team:'Boston Celtics',era:'current'});const weakSave=t.getSave();const weak=weakSave.roster[0];weak.overall=60;weak.potential=60;weak.age=35;const candidates=t.playerPools(weak.pos,weakSave.era);const star=candidates.find(p=>p.pos===weak.pos&&p.base>=90&&p.team!==weakSave.team&&!weakSave.roster.some(x=>x.name===p.name));if(star){const proposal=t.proposeTrade(weakSave,[weak.id],weak.pos+'|'+star.name,[]);assert.equal(proposal.status,'rejected','unfair trade is rejected');assert(weakSave.roster.includes(weak),'rejected trade keeps outgoing player')}
for(const [sp,team] of [['nba','Boston Celtics'],['nfl','New England Patriots'],['mlb','New York Yankees'],['soccer','Real Madrid']]){
 t.setSport(sp);t.createSave({team,era:'alltime'});const s=t.getSave();
 for(const [pos,count] of Object.entries(t.STARTERS[sp])){
  assert.equal(s.roster.filter(p=>p.pos===pos).length,t.PLAN[sp].filter(x=>x===pos).length,sp+' all-time '+pos+' roster depth');
  assert.equal(s.roster.filter(p=>p.pos===pos&&p.starter).length,count,sp+' all-time '+pos+' starters');
 }
 assert(s.roster.length>Object.values(t.STARTERS[sp]).reduce((a,b)=>a+b,0),sp+' all-time bench players');assert(t.teamPayroll(s)<=t.SPORT[sp].cap,sp+' all-time payroll under cap');assert(s.roster.every(p=>p.age===27&&p.potential===p.overall&&p.careerPoints>0),sp+' all-time legends begin in their prime');assert(s.roster.some(p=>t.sameFranchise(p.originalTeam,team)),sp+' team-specific legends included');const rival=t.TEAMS[sp].find(x=>x!==team);assert.equal(s.standings[rival].ovr,context.window.ERFranchise.rating(context.window.ERFranchise.roster(s,rival),t.franchiseEnv(s)),sp+' opponents use their actual all-time roster ratings');
 const [x,y]=t.resolveTie(100,100);if(sp==='soccer')assert.equal(x,y,'soccer may finish level');else assert.notEqual(x,y,sp+' overtime resolves ties');
 t.simAuto(s);assert.equal(s.week,1);console.log('PASS',sp,'all-time depth chart, bench and overtime');
}

// Multiple outgoing players and draft picks can close a negotiated deal.
t.setSport('nfl');t.createSave({team:'New England Patriots',era:'current'});const tradeSave=t.getSave();
const outA=tradeSave.roster.find(p=>p.pos==='QB'),outB=tradeSave.roster.find(p=>p.id!==outA.id&&p.pos==='WR');
const targetSource=t.playerPools('QB',tradeSave.era).find(p=>p.team!==tradeSave.team&&!tradeSave.roster.some(x=>x.name===p.name));
assert(outA&&outB&&targetSource,'trade test has outgoing assets and a target');
const pickOffered=tradeSave.draftPicks[0],tradeOffer=t.proposeTrade(tradeSave,[outA.id,outB.id],'QB|'+targetSource.name,[pickOffered.id]);
assert(['accepted','counter'].includes(tradeOffer.status),'multi-asset offer is accepted or countered');
const accepted=t.acceptTrade(tradeSave,tradeOffer.status==='counter');
assert(accepted,'accepted trade completes');
assert(!tradeSave.roster.some(p=>p.id===outA.id||p.id===outB.id),'outgoing players leave roster');
assert(tradeSave.roster.some(p=>p.name===targetSource.name),'incoming player joins roster');
assert(!tradeSave.draftPicks.some(p=>p.id===pickOffered.id),'offered draft pick is transferred');
assert.equal(tradeSave.tradeHistory.length,1,'trade history is saved');

// A near-fair offer triggers a counter, and the GM can counter back with a pick.
t.setSport('nfl');t.createSave({team:'New England Patriots',era:'current'});const counterSave=t.getSave();
const counterOut=counterSave.roster.find(p=>p.pos==='QB');
const counterTarget=t.playerPools('QB',counterSave.era).find(p=>p.team!==counterSave.team&&!counterSave.roster.some(x=>x.name===p.name)&&p.base>=70);
assert(counterOut&&counterTarget,'counter test has a QB and trade target');
counterOut.overall=counterTarget.base-5;counterOut.potential=counterOut.overall;counterOut.age=27;
const firstOffer=t.proposeTrade(counterSave,[counterOut.id],'QB|'+counterTarget.name,[]);
assert.equal(firstOffer.status,'counter','near-fair offer receives a counter');
const counterBack=t.counterTrade(counterSave,[counterOut.id],[firstOffer.counterPick]);
assert(counterBack,'GM can send a counteroffer');
assert.equal(counterSave.tradeNegotiation.status,'accepted','added draft pick closes the value gap');
assert(t.acceptTrade(counterSave,false),'revised offer can be confirmed');

// Player promises reward trust and record season MVPs from actual simulated stats.
t.setSport('nba');t.createSave({team:'Boston Celtics',era:'current'});const promiseSave=t.getSave();
const promisedPlayer=promiseSave.roster.find(p=>p.starter);const promise=t.makePromise(promiseSave,'starter',promisedPlayer.id);
assert.equal(promise.status,'active');promisedPlayer.seasonStats.appearances=Math.ceil(t.SPORT.nba.games*.7);
const promiseAwards=[];t.evaluatePromises(promiseSave,false,promiseAwards);
assert.equal(promise.status,'fulfilled','starter promise is kept when playing-time target is met');
assert(promiseAwards.some(x=>x.includes('Promise kept')),'promise reward is recorded');
const titlePromise=t.makePromise(promiseSave,'championship','');t.evaluatePromises(promiseSave,true,[]);
assert.equal(titlePromise.status,'fulfilled','championship promise is kept by winning the title');
assert(promisedPlayer.morale>60,'kept promise improves player morale');


for(const [sp,team] of [['nba','Boston Celtics'],['nfl','New England Patriots'],['mlb','Boston Red Sox'],['soccer','Real Madrid']]){
 t.setSport(sp);t.createSave({team,era:'current',games:8,playoffs:0});const matchSave=t.getSave();
 assert(t.renderMatchday(matchSave).includes('OPPOSITION INTELLIGENCE'),sp+' pregame scouting report renders');
 t.prepareTeam(matchSave,'recover');t.beginMatch();
 let live=t.renderMatchday(matchSave);assert(live.includes('LIVE MATCH CENTER'),sp+' live scoreboard renders');assert(live.includes('MATCH TIMELINE'),sp+' live timeline renders');
 t.finishMatch(matchSave,matchSave.pending,matchSave.pending.options[0]);
 assert.equal(matchSave.pending.stage,'clutch',sp+' halftime moves to closing decision');
 live=t.renderMatchday(matchSave);assert(live.includes('CLOSING MOMENTS'),sp+' closing-stage scoreboard renders');
 t.finishMatch(matchSave,matchSave.pending,matchSave.pending.options[0]);
 assert(matchSave.lastMatch.timeline.length>=7,sp+' match report keeps a play-by-play timeline');
 assert(Array.isArray(matchSave.lastMatch.performers),sp+' postgame player lines are captured');
 assert(t.renderMatchday(matchSave).includes('POSTGAME REPORT'),sp+' postgame report renders');
}


assert.equal(storage.has('era_rivals_universe_v2'),false,'legacy front-office saves are cleared');
assert.equal(storage.has('era_rivals_pro_v1'),false,'legacy player-career saves are cleared');
assert.equal(JSON.parse(storage.get('era_rivals_universe_v3')).saves.nba.length,0,'new universe starts with empty save slots');
const living=context.window.ERLivingLeague;
for(const [sp,team] of [['nba','Boston Celtics'],['nfl','New England Patriots'],['mlb','Boston Red Sox'],['soccer','Real Madrid']]){
 t.setSport(sp);t.createSave({team,games:8,playoffs:0});const s=t.getSave(),e=t.franchiseEnv(s);
 assert(living.ensure(s).objectives.length,'owner objectives initialise for '+sp);
 const rival=Object.keys(s.standings).find(x=>x!==s.team);
 s.lastMatch={opponent:rival,home:14,away:10,result:'WIN',mvp:s.roster[0].name};
 context.window.ERFranchise.afterMatch(s,{post:false,results:[],activeIds:s.roster.filter(p=>p.starter).map(p=>p.id),availableIds:s.roster.map(p=>p.id)},e);
 assert(s.fo.living.rivalries.length,'rivalry tracking runs for '+sp);
 assert(s.fo.living.news.length,'match news is generated for '+sp);
 assert(s.fo.living.franchise.attendance>0,'attendance is calculated for '+sp);
 const press=living.pressConference(s,'test','MEDIA ROOM','How will you respond?');
 context.window.ERFranchise.action(s,'world-press',{id:press.id,choice:'accountability'},e);
 assert(press.resolved,'press response is saved for '+sp);
 context.window.ERFranchise.action(s,'world-stadium',{},e);
 context.window.ERFranchise.action(s,'world-ticket',{price:45},e);
 const coach=s.fo.living.coachMarket[0];context.window.ERFranchise.action(s,'world-hire-coach',{id:coach.id},e);
 const scout=s.fo.living.scoutMarket[0];context.window.ERFranchise.action(s,'world-hire-scout',{id:scout.id},e);
 assert.equal(s.fo.staff.length,1,'coaching carousel hires a coach for '+sp);
 assert.equal(s.fo.living.scouts.length,1,'scouting department hires a scout for '+sp);
 const page=living.render(s,e);assert(page.includes('LEAGUE CENTRAL')&&page.includes('WORLD NEWS')&&page.includes('RIVALRY WATCH'),'living league page renders for '+sp);
}

console.log('ALL CHECKS PASSED');

module.exports={t,context,doc};
