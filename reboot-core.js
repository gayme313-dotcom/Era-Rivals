/* ERA RIVALS REBORN: independent decision-driven four-sport simulation. */
(function(root){
'use strict';
const D=root.ERRebootData;
if(!D)throw new Error('Reboot data missing');
const {SPORT,TEAMS,PLAN,STARTERS,LEGENDS,CURRENT}=D;
const personalities={
 leader:{name:'Leader',desc:'Lifts the locker room after wins and setbacks'},
 closer:{name:'Clutch',desc:'Stays composed during the final minutes'},
 loyal:{name:'Loyal',desc:'Values trust, playing time and staying with a club'},
 hothead:{name:'Hothead',desc:'Brilliant intensity, but morale can swing'},
 mentor:{name:'Mentor',desc:'Helps young players develop'},
 workhorse:{name:'Workhorse',desc:'Handles fatigue and heavy workloads'},
 showman:{name:'Showman',desc:'Generates fan interest and pressure'},
 calm:{name:'Calm',desc:'Steadies teammates during close games'}
};
const newsTypes=['TRADE WIRE','INJURY REPORT','BREAKOUT WATCH','OWNER PRESSURE','MVP RACE','RIVALRY WEEK','LEAGUE CENTRAL','COACHING CAROUSEL'];
const COACHES=[
{name:'Jordan Ellis',style:'Balanced',skill:82,cost:5},
{name:'Alex Mercer',style:'Defense',skill:88,cost:7},
{name:'Rafael Cruz',style:'Attack',skill:87,cost:7},
{name:'Maya Bennett',style:'Development',skill:91,cost:6},
{name:'Taylor Grant',style:'Culture',skill:84,cost:5},
{name:'Andre Brooks',style:'High Tempo',skill:86,cost:6}
];
const STAFF=['Rookie Whisperer','Global Network','Film Room','Veteran Scout','Data Scientist'];
const COUNTRY={soccer:['Brazil','Argentina','Spain','France','England','Portugal','Japan','Nigeria','Colombia','Germany'],nfl:['USA','Canada','Nigeria'],nba:['USA','France','Serbia','Lithuania','Canada','Australia','Puerto Rico'],mlb:['USA','Dominican Republic','Venezuela','Puerto Rico','Japan','Cuba','Mexico']};
const CREATORS=['Jalen','Malik','Theo','Adrian','Nico','Mateo','Luis','Marco','Diego','Miles','Carter','Jordan','Avery','Rafael','Andre','Bruno','David','Noah','Isaiah','Caleb','Xavier','Victor','Leo','Ren','Samir','Darius','Nolan'];
const SURNAMES=['Cruz','Matos','Bennett','Silva','Rivera','Brown','Johnson','Williams','Garcia','Soto','Miller','King','Torres','Wright','Rodriguez','Parker','Santos','Reed','Cole','Mendes','Jackson','Lee','Martinez','Walker','Diaz','Flores'];
const ID=()=>Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-4);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const hash=x=>{let h=2166136261;for(const c of String(x)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
function rand(a,b){return a+Math.random()*(b-a)}
const rng=(a,b)=>Math.floor(rand(a,b+1));
const shuffled=a=>a.slice().sort(()=>Math.random()-.5);
const cap=(sp)=>SPORT[sp].cap;
const money=n=>'$'+Number(n||0).toFixed(1)+'M';
const fullPos=(sp,pos)=>pos;
function getRawPool(sp,pos,era){
 const seed=era==='alltime'?LEGENDS:CURRENT;
 const stars=(seed[sp]?.[pos]||[]).map(([name,team,base])=>({name,team,base,pos,source:'Curated '+era}));
 const expanded=root.ERDraftExpandedPools?.[sp]?.[pos]||[];
 const pool=expanded.map(p=>({name:p.name,team:p.team||'Free Agent',base:p.base||72,pos,source:'Historical / expanded database'}));
 const all=[...stars,...pool],byName=new Map();
 for(const p of all){const key=p.name.toLowerCase();if(!byName.has(key)||byName.get(key).base<p.base)byName.set(key,p)}
 return Array.from(byName.values()).sort((a,b)=>b.base-a.base);
}
const pools={};
function pool(sp,pos,era='current'){
 const key=[sp,pos,era].join('/');if(pools[key])return pools[key];
 const base=getRawPool(sp,pos,era),out=base.slice(),names=new Set(out.map(p=>p.name.toLowerCase()));
 let i=0;while(out.length<100){const name='ER Prospect '+pos+' '+String(++i).padStart(3,'0');if(names.has(name.toLowerCase()))continue;out.push({name,team:'ERA RIVALS ACADEMY',base:68+(hash(name+sp)%18),pos,source:'Fictional prospect'});names.add(name.toLowerCase())}
 return pools[key]=out;
}
function personality(name,position){return Object.keys(personalities)[hash(name+'|'+position)%Object.keys(personalities).length]}
function makePlayer(raw,sp,pos,team,era,season=1){
 const name=raw.name||'Academy Prospect',base=clamp(Math.round(Number(raw.base||raw.overall||raw.rating||70)),50,99),age=raw.age||20+hash(name+sp)%13;
 const leagueIncome=sp==='nfl'?1.8:sp==='soccer'?1.7:sp==='mlb'?1.2:1.5;
 const salary=Math.round((.7+Math.max(0,base-64)*.11*leagueIncome)*10)/10;
 return {id:ID(),name,pos,team,origin:raw.team||team,source:raw.source||'Roster snapshot',era,
 overall:base,potential:clamp(Math.max(base+hash(name+'peak')%8,base),base,99),hiddenCeiling:clamp(base+hash(name+'hidden')%18-5,base-3,99),
 age,years:1+hash(name+'contract')%4,salary,trait:personality(name,pos),morale:72+hash(name)%20,
 fatigue:0,injury:0,relationships:{},demand:null,mentor:null,games:0,awards:[],career:stats(sp),seasonStats:stats(sp),seasonHistory:[],legacy:0,
 starter:false,created:!!raw.created};
}
function stats(sp){
 if(sp==='nba')return {games:0,points:0,rebounds:0,assists:0,steals:0,blocks:0};
 if(sp==='nfl')return {games:0,passYards:0,passTD:0,rushYards:0,rushTD:0,recYards:0,recTD:0,tackles:0,sacks:0,interceptions:0};
 if(sp==='soccer')return {games:0,goals:0,assists:0,shots:0,saves:0,cleanSheets:0};
 return {games:0,hits:0,homeRuns:0,rbi:0,stolenBases:0,era:0,strikeouts:0,wins:0,saves:0};
}
function titleFor(sp){return {nba:'ERA FINALS',nfl:'ERA BOWL',soccer:'LEAGUE TITLE',mlb:'ERA WORLD SERIES'}[sp]}
function leagueName(sp){return {nba:'BASKETBALL',nfl:'FOOTBALL',soccer:'FOOTBALL CLUBS',mlb:'BASEBALL'}[sp]}
const ALIASES={
 nba:{'Los Angeles Lakers':['Minneapolis Lakers'],'Brooklyn Nets':['New Jersey Nets'],'Oklahoma City Thunder':['Seattle SuperSonics'],'Sacramento Kings':['Cincinnati Royals','Kansas City Kings'],'Golden State Warriors':['Philadelphia Warriors'],'Charlotte Hornets':['Charlotte Bobcats']},
 nfl:{'Las Vegas Raiders':['Oakland Raiders'],'Los Angeles Chargers':['San Diego Chargers'],'Los Angeles Rams':['St Louis Rams'],'Tennessee Titans':['Houston Oilers'],'Washington Commanders':['Washington Redskins','Washington Football Team']},
 mlb:{'Los Angeles Dodgers':['Brooklyn Dodgers'],'San Francisco Giants':['New York Giants'],'Washington Nationals':['Montreal Expos'],'Miami Marlins':['Florida Marlins'],'Cleveland Guardians':['Cleveland Indians'],'Tampa Bay Rays':['Tampa Bay Devil Rays']},
 soccer:{}
};
function sameClub(sp,a,b){const clean=x=>String(x).replace(/[^a-z0-9]/gi,'').toLowerCase();return [b,...(ALIASES[sp]?.[b]||[])].some(x=>clean(a)===clean(x))}
function snapshotTeam(sp,team){return root.ERTeamRosters?.teams?.[sp]?.[team]?.players||[]}
function blueprint(sp,team,era,season){
 const plan=PLAN[sp],selected=[],used=new Set(),snap=era==='current'?snapshotTeam(sp,team):[],players=[];
 const roleCounts={};
 for(const pos of plan){
  const rank=(roleCounts[pos]||0);roleCounts[pos]=rank+1;
  const actual=snap.filter(p=>p.pos===pos&&!used.has(p.name?.toLowerCase()));
  const candidates=pool(sp,pos,era);
  const home=candidates.filter(p=>sameClub(sp,p.team,team)&&!used.has(p.name.toLowerCase()));
  let src=actual.sort((a,b)=>(b.base||b.overall||0)-(a.base||a.overall||0))[rank===0?0:0];
  if(!src)src=home[0];
  if(!src)src=candidates.find(p=>!used.has(p.name.toLowerCase()));
  if(!src){const n='ER Academy '+pos+' '+rank+' '+team;src={name:n,base:62+hash(n)%18,team:'ERA RIVALS ACADEMY',source:'Fictional prospect'}}
  used.add(src.name.toLowerCase());
  const player=makePlayer(src,sp,pos,team,era,season);
  player.starter=rank<(STARTERS[sp][pos]||1);
  if(era==='alltime'){player.age=26+hash(player.name)%4;player.potential=player.overall;player.hiddenCeiling=player.overall}
  players.push(player);
 }
 const payroll=players.reduce((n,p)=>n+p.salary,0),scale=Math.min(1,cap(sp)*.85/Math.max(1,payroll));
 players.forEach(p=>p.salary=Math.max(.4,Math.round(p.salary*scale*10)/10));
 return players;
}
function schedule(teams,games,season){
 const list=teams.slice(),size=list.length;if(size%2)list.push('BYE');const rounds=[],fixed=list[0],ring=list.slice(1);
 for(let r=0;r<list.length-1;r++){
  const arranged=[fixed,...ring],fixtures=[];
  for(let i=0;i<list.length/2;i++){const a=arranged[i],b=arranged[list.length-1-i];if(a!=='BYE'&&b!=='BYE'){const home=(r+season+i)%2?a:b,away=home===a?b:a;fixtures.push({home,away})}}
  rounds.push(fixtures);ring.unshift(ring.pop());
 }
 const out=[];for(let w=0;w<games;w++){const round=rounds[w%rounds.length];out.push(round.map(pair=>w>=rounds.length?{home:pair.away,away:pair.home}:pair))}
 return out;
}
function coachSeed(team){return COACHES[hash(team)%COACHES.length]}
function teamPower(universe,team){
 const t=universe.league[team];if(!t)return 68;
 const sp=universe.sport;
 const power=[];
 for(const [pos,n] of Object.entries(STARTERS[sp]))power.push(...t.roster.filter(p=>p.pos===pos&&p.injury===0).sort((a,b)=>b.overall-a.overall).slice(0,n));
 if(!power.length)return 62;
 const core=power.reduce((s,p)=>s+p.overall,0)/power.length,chem=t.chemistry||70,leader=power.filter(p=>p.trait==='leader').length,coach=t.coach?.skill||80;
 return clamp(Math.round(core+(chem-70)/30+leader*.35+(coach-78)/15),50,99);
}
function createTeam(sp,name,era,season){
 const roster=blueprint(sp,name,era,season),coach=coachSeed(name);
 return {name,roster,coach:{...coach},coachHistory:[],strategy:['Balanced','Attack','Defense','Fast','Control'][hash(name)%5],
 chemistry:70+hash(name)%20,morale:75,fan:58+hash(name+'fans')%30,loyalty:65,owner:78,stadium:1,scout:65+hash(name+'scout')%25,
 budget:42,finance:{revenue:0,expenses:0,attendance:0},record:{w:0,l:0,d:0,for:0,against:0},draftPicks:3,
 ownerGoal:'Win 50% of games',pressPending:false,news:[],retired:[],relocated:false,expansion:false};
}
function makeUniverse({sport='nfl',team,era='current',year=2026,name='Manager',difficulty='normal',friend='',history='reset'}={}){
 if(!SPORT[sport])throw new Error('Invalid sport');
 const clubs=TEAMS[sport],chosen=clubs.includes(team)?team:clubs[0],league={};
 clubs.forEach(t=>league[t]=createTeam(sport,t,era,1));
 const currentDate=new Date();
 const save={id:ID(),version:1,createdAt:currentDate.toISOString(),name:name.slice(0,40)||'Manager',sport,era,year:Number(year)||2026,
 difficulty,team:chosen,season:1,week:0,phase:'preseason',historyMode:history,league,clubs:clubs.slice(),
 schedule:schedule(clubs,SPORT[sport].games,1),match:null,matchHistory:[],news:[],history:[],rivalries:{},
 playerPromises:[],pendingConference:null,draft:[],draftLog:[],scouting:{focus:'Any',accuracy:league[chosen].scout,reports:[]},
 ownerOffers:[],staffOffers:[],leagueEvents:[],friendManagers:friend?[{name:friend,team:chosen}]:[],
 seasonsWon:0,gmRep:63,legacyPoints:0,createdPlayers:[],awards:[],records:[],museum:[],
 oldHistoryCleared:true};
 prepareProspects(save);save.news.unshift(story(save,'LEAGUE CENTRAL','A new sports universe begins. Everything that happens next will be written by your decisions.',chosen));
 save.news.unshift(story(save,'FRONT OFFICE','Welcome to '+chosen+'. Your team, your strategy, your legacy.',chosen));
 return save;
}
function story(s,tag,headline,team){
 return {id:ID(),week:s.week,season:s.season,tag,headline,team:team||s.team,date:s.year+' · WEEK '+(s.week+1)};
}
function publish(s,tag,text,team){s.news.unshift(story(s,tag,text,team));s.news=s.news.slice(0,120)}
function fixture(s,week=s.week){return (s.schedule[week]||[]).find(m=>m.home===s.team||m.away===s.team)||null}
function opponent(s){const m=fixture(s);return m?(m.home===s.team?m.away:m.home):null}
function getTeam(s){return s.league[s.team]}
function payroll(t){return Math.round(t.roster.reduce((n,p)=>n+p.salary,0)*10)/10}
function morale(s){return Math.round(getTeam(s).roster.reduce((n,p)=>n+p.morale,0)/Math.max(1,getTeam(s).roster.length))}
function record(s,team,h,a,home){
 const t=s.league[team];if(!t)return;
 const me=home?h:a,them=home?a:h;t.record.for+=me;t.record.against+=them;
 if(me>them)t.record.w++;else if(me<them)t.record.l++;else t.record.d++;
}
function standings(s){return s.clubs.slice().sort((a,b)=>{const x=s.league[a]?.record||{},y=s.league[b]?.record||{};const pt=r=>s.sport==='soccer'?r.w*3+r.d:r.w*2+r.d;
 return pt(y)-pt(x)||(y.for-y.against)-(x.for-x.against)||teamPower(s,b)-teamPower(s,a)});
}
function userRank(s){return Math.max(1,standings(s).indexOf(s.team)+1)}
function primaryStar(t){return t.roster.slice().sort((a,b)=>b.overall-a.overall)[0]}
function findPlayer(s,id,team=s.team){return s.league[team]?.roster.find(p=>p.id===id)}
function stat(p,key,n){p.seasonStats[key]=(p.seasonStats[key]||0)+n;p.career[key]=(p.career[key]||0)+n}
function gameStat(s,team,score,allowed){
 const sp=s.sport,t=s.league[team],active=t.roster.filter(p=>p.injury===0&&p.starter);
 for(const p of active){
  p.games++;stat(p,'games',1);p.fatigue=clamp(p.fatigue+(p.trait==='workhorse'?3:8)+rng(-1,3),0,95);
  if(sp==='nba'){
   const grade=(p.overall-55)/42,pts=Math.max(2,Math.round((score/5)*(1+(grade-.55)*.8)+rand(-8,7)));
   stat(p,'points',pts);stat(p,'rebounds',rng(0,['C','PF'].includes(p.pos)?12:6));stat(p,'assists',rng(0,p.pos==='PG'?11:5));stat(p,'steals',rng(0,3));stat(p,'blocks',rng(0,p.pos==='C'?4:2))
  }else if(sp==='nfl'){
   if(p.pos==='QB'){stat(p,'passYards',rng(130,380));stat(p,'passTD',rng(0,Math.min(5,Math.max(1,Math.floor(score/7)))))}
   if(p.pos==='RB'){stat(p,'rushYards',rng(15,140));stat(p,'rushTD',rng(0,score>17?2:1))}
   if(p.pos==='WR'||p.pos==='TE'){stat(p,'recYards',rng(10,125));stat(p,'recTD',rng(0,score>20?2:1))}
   if(['DL','LB','DB'].includes(p.pos)){stat(p,'tackles',rng(1,11));if(p.pos==='DL')stat(p,'sacks',rng(0,2));if(p.pos==='DB')stat(p,'interceptions',rng(0,1))}
  }else if(sp==='soccer'){
   const attacker=['ST','RW','LW','CAM'].includes(p.pos);if(score>0&&attacker&&Math.random()<.35)stat(p,'goals',1);
   if(attacker&&score>0&&Math.random()<.25)stat(p,'assists',1);
   if(p.pos==='GK'){stat(p,'saves',rng(1,6));if(allowed===0)stat(p,'cleanSheets',1)}
   stat(p,'shots',rng(0,attacker?5:2));
  }else{
   if(['SP','RP','CP'].includes(p.pos)){stat(p,'strikeouts',rng(1,p.pos==='SP'?10:4));if(score>allowed)stat(p,'wins',p.pos==='SP'?1:0)}
   else{const h=rng(0,3);stat(p,'hits',h);stat(p,'homeRuns',h&&Math.random()<.2?1:0);stat(p,'rbi',rng(0,3));stat(p,'stolenBases',rng(0,1))}
  }
  p.legacy+=Math.max(1,Math.round((p.overall-65)/8))+1;
 }
}
function scoreHalf(sp,strength,against,plan='Balanced',home=false){
 const differential=(strength-against)*.15+(plan==='Attack'?1.2:plan==='Defense'?-1.1:plan==='Fast'?.7:0)+(home?.65:0);
 if(sp==='soccer'){const r=Math.random();const p=clamp(.42+differential*.055,.09,.85);return (r<p?1:0)+(Math.random()<p*.3?1:0)+(Math.random()<p*.1?1:0)}
 if(sp==='nfl'){let v=0;const drives=3+rng(0,2);for(let i=0;i<drives;i++){const p=clamp(.37+differential*.022,.13,.74);if(Math.random()<p)v+=Math.random()<.76?7:3}return v}
 if(sp==='mlb'){let v=0;for(let i=0;i<5;i++){const p=clamp(.38+differential*.027,.14,.7);if(Math.random()<p)v+=rng(1,Math.random()<.1?4:2)}return v}
 return Math.max(22,Math.round(rand(40,56)+differential*1.7));
}
function overtime(sp,h,a){if(sp==='soccer'||h!==a)return [h,a];const inc=sp==='nfl'?(Math.random()<.72?3:7):sp==='nba'?(Math.random()<.6?2:3):1;if(Math.random()<.5)h+=inc;else a+=inc;return [h,a]}
function planEffect(plan,own,opp,s){let n=0;if(plan==='Attack')n+=1.5;if(plan==='Defense')n+=1.2;if(plan==='Fast')n+=.4;if(plan==='Star Power')n+=1;
 const active=own.roster.filter(p=>p.starter&&p.injury===0);
 n+=Math.min(2,active.filter(p=>p.trait==='leader').length*.5);
 if(s.match?.stage==='clutch')n+=Math.min(1.8,active.filter(p=>p.trait==='closer'||p.trait==='calm').length*.6);
 n+=(own.chemistry-70)*.03-(own.roster.reduce((x,p)=>x+p.fatigue,0)/Math.max(1,own.roster.length))*.025;
 n+=(own.coach?.style===plan?1.4:0);return n;
}
function clearFatigue(s){for(const t of Object.values(s.league))for(const p of t.roster){p.fatigue=Math.max(0,p.fatigue-4);if(p.injury>0)p.injury--;}}
function change(s,team,delta=0){const t=s.league[team];if(t)t.chemistry=clamp(t.chemistry+delta,25,100)}
function relationship(p,q,delta){p.relationships[q.id]=clamp((p.relationships[q.id]||0)+delta,-100,100);q.relationships[p.id]=clamp((q.relationships[p.id]||0)+delta,-100,100)}
function injuryEvent(s,team){const t=s.league[team];if(!t)return null;const chance=s.sport==='nfl'?.22:.08;
 if(Math.random()>chance)return null;
 const active=t.roster.filter(p=>p.starter&&p.injury===0);if(!active.length)return null;
 const p=active[rng(0,active.length-1)],games=1+rng(1,Math.max(3,Math.round(SPORT[s.sport].games/15)));
 p.injury=games;p.morale=clamp(p.morale-4,20,100);
 const ev={type:'injury',player:p.name,team,games};
 publish(s,'INJURY REPORT',p.name+' is expected to miss '+games+' game(s). '+team+' faces a tough lineup choice.',team);
 return ev;
}
function postResult(s,team,win,opponent){
 const t=s.league[team];t.morale=clamp(t.morale+(win?2:-2),30,100);
 t.fan=clamp(t.fan+(win?1:-1),15,100);
 const active=t.roster.filter(p=>p.starter);
 for(const p of active){const diff=win?(p.trait==='leader'?3:2):(p.trait==='hothead'?-5:-1);p.morale=clamp(p.morale+diff,20,100)}
 if(win&&active.some(p=>p.trait==='showman'))t.fan=clamp(t.fan+2,15,100);
 if(active.some(p=>p.trait==='mentor'))for(const rookie of t.roster.filter(p=>p.age<24))rookie.morale=clamp(rookie.morale+1,20,100);
 const id=[team,opponent].sort().join('|'),r=s.rivalries[id]||(s.rivalries[id]={heat:0,games:0,story:''});
 r.games++;r.heat=clamp(r.heat+(win?2:1),0,100);if(r.heat>10&&r.games%5===0)publish(s,'RIVALRY WEEK',team+' vs '+opponent+' is becoming a serious rivalry.',team)
}
function decidePress(s,key){
 if(!s.pendingConference)return {error:'No press conference pending'};
 const t=getTeam(s),options={accountability:{owner:4,team:0,fan:-1,note:'You took responsibility. The owner respects your accountability.'},
 praise:{owner:0,team:4,fan:2,note:'You praised the locker room. Confidence rises.'},
 challenge:{owner:2,team:-3,fan:3,note:'You challenged the roster. Fans demand an answer next week.'}};
 const choice=options[key];if(!choice)return {error:'Invalid press conference answer'};
 t.owner=clamp(t.owner+choice.owner,0,100);t.morale=clamp(t.morale+choice.team,0,100);t.fan=clamp(t.fan+choice.fan,0,100);
 s.pendingConference=null;publish(s,'PRESS ROOM',choice.note,s.team);return {message:choice.note};
}

function prepareProspects(s){
 s.draft=Array.from({length:Math.max(55,SPORT[s.sport].positions.length*7)},(_,i)=>makeProspect(s,i));
 s.freeAgents=Array.from({length:Math.max(30,SPORT[s.sport].positions.length*4)},(_,i)=>makeProspect(s,i+200));
 for(const p of s.freeAgents){p.age+=rng(0,7);p.source='Fictional free agent'}
}
function makeProspect(s,i,pos){
 const sp=s.sport,name=CREATORS[hash(sp+s.year+i)%CREATORS.length]+' '+SURNAMES[hash('last'+i+s.year)%SURNAMES.length],p=pos||SPORT[sp].positions[i%SPORT[sp].positions.length],
 base=59+hash(name+sp+i)%24,raw={name:name+' '+String(i+1).padStart(2,'0'),team:'ER GLOBAL SCOUTING',base,source:'Fictional prospect'};
 const player=makePlayer(raw,sp,p,'FREE AGENT',s.era,s.season);
 player.age=18+hash(raw.name)%6;player.potential=clamp(base+2+hash(raw.name+'visible')%19,base,98);
 player.hiddenCeiling=clamp(base+hash(raw.name+'boom')%31-4,base-6,99);
 player.country=(COUNTRY[sp]||['USA'])[hash(raw.name+'nation')%COUNTRY[sp].length];player.salary=.5+Math.round((base-55)*.05*10)/10;
 player.source='Fictional prospect';return player;
}
function scoutReport(s,p){
 const acc=getTeam(s).scout,noise=Math.max(1,Math.round((100-acc)/9)),v=p.potential+Math.round(rand(-noise,noise));
 return {id:p.id,name:p.name,pos:p.pos,age:p.age,country:p.country,overall:p.overall,
 estimate:clamp(v,45,99),low:clamp(v-noise,45,99),high:clamp(v+noise,45,99),accuracy:acc,source:p.source};
}
function selectedProspects(s,pos){return s.draft.filter(p=>!pos||pos==='Any'||p.pos===pos).sort((a,b)=>b.potential-a.potential).slice(0,40).map(p=>scoutReport(s,p))}
function activePlayers(s,team){
 const t=s.league[team],selected=[];
 if(!t)return selected;
 for(const [pos,count] of Object.entries(STARTERS[s.sport])){
  const first=t.roster.filter(p=>p.pos===pos&&p.injury===0).sort((a,b)=>(b.starter?5:0)+b.overall-(a.starter?5:0)-a.overall);
  selected.push(...first.slice(0,count));
 }
 return selected;
}
function opponentPlan(s,opp){const t=s.league[opp];return t?.strategy||'Balanced'}
function startMatch(s,plan='Balanced'){
 if(s.match)return {error:'Finish your current match first.'};
 if(s.phase==='offseason')return {error:'The season is over. Open the offseason first.'};
 if(s.pendingConference)return {error:'Answer your postgame press conference first.'};
 if(s.phase==='preseason')s.phase='regular';
 const fx=fixture(s);if(!fx)return {error:'No scheduled game is available.'};
 const opp=opponent(s),own=getTeam(s),enemy=s.league[opp],home=fx.home===s.team,
 strength=teamPower(s,s.team)+planEffect(plan,own,enemy,s)+(home?1:0)-(s.difficulty==='hard'?2:0);
 const other=teamPower(s,opp)+planEffect(enemy.strategy,enemy,own,s)+(!home?1:0);
 const mine=scoreHalf(s.sport,strength,other,plan,home),theirs=scoreHalf(s.sport,other,strength,enemy.strategy,!home);
 s.match={id:ID(),stage:'halftime',fixture:fx,opponent:opp,homeTeam:home?s.team:opp,
 half:{user:mine,them:theirs},score:{user:mine,them:theirs},plan,oppPlan:enemy.strategy,decision:null,clutch:null,
 power:{user:strength,them:other},events:[],impact:0};
 s.match.events.push({time:'OPENING',text:s.team+' take on '+opp+'. '+enemy.coach.name+' sets up '+enemy.strategy.toLowerCase()+'.',side:'neutral'});
 s.match.events.push({time:'1ST HALF',text:mine>theirs?s.team+' takes an early lead.':mine<theirs?opp+' strikes first.':'Both sides are locked together.',side:mine>theirs?'us':mine<theirs?'them':'neutral'});
 s.match.events.push({time:'HALFTIME',text:'The coaches return to the drawing board. Your call changes the second half.',side:'neutral'});
 return {message:'Halftime. The next decision is yours.',match:s.match};
}
function halftime(s,style){
 const m=s.match;if(!m||m.stage!=='halftime')return {error:'No halftime decision available.'};
 const valid=['Attack','Balanced','Protect','Star Power','Risky','Rotate'];if(!valid.includes(style))return {error:'Invalid adjustment.'};
 m.decision=style;m.stage='clutch';
 const userPlan=style==='Protect'?'Defense':style==='Risky'?'Attack':style==='Rotate'?'Balanced':style;
 const tactical={Attack:1.7,Balanced:.5,Protect:1.1,'Star Power':1.8,Risky:2.8,Rotate:.35}[style];
 m.impact=Math.round((tactical+(teamPower(s,s.team)-teamPower(s,m.opponent))*.025)*10)/10;
 const own=s.league[s.team],enemy=s.league[m.opponent];
 const half1=scoreHalf(s.sport,m.power.user+m.impact, m.power.them,userPlan,m.homeTeam===s.team);
 const half2=scoreHalf(s.sport,m.power.them,m.power.user+m.impact,m.oppPlan,m.homeTeam===m.opponent);
 m.score.user+=Math.max(0,Math.round(half1*.6));m.score.them+=Math.max(0,Math.round(half2*.6));
 if(style==='Risky'&&Math.random()<.27){m.score.them+=s.sport==='nfl'?7:s.sport==='nba'?4:1;m.impact-=1.5}
 if(style==='Rotate')own.roster.forEach(p=>p.fatigue=clamp(p.fatigue-5,0,100));
 m.events.push({time:s.sport==='soccer'?"60'":s.sport==='mlb'?'6TH': '3RD PERIOD',text:'Your staff switches to '+style+'. '+(style==='Risky'?'A gamble with a possible cost.':'Players respond to the change.'),side:'us'});
 m.events.push({time:'LATE GAME',text:m.score.user>m.score.them?s.team+' has the edge.':m.score.user<m.score.them?m.opponent+' is in front.':'This game is on a knife-edge.',side:'neutral'});
 return {message:'Closing moments. Make the final call.',match:m};
}
function closing(s,call){
 const m=s.match;if(!m||m.stage!=='clutch')return {error:'No closing decision available.'};
 const valid=['Trust Star','Conservative','All In'];if(!valid.includes(call))return {error:'Choose a closing strategy.'};
 m.clutch=call;
 const closers=activePlayers(s,s.team).filter(p=>p.trait==='closer'||p.trait==='calm').length;
 const ours=teamPower(s,s.team)+(call==='All In'?3:call==='Trust Star'?2+Math.min(2,closers*.5):1);
 const theirs=teamPower(s,m.opponent)+(call==='All In'?2:0);
 const segment=scoreHalf(s.sport,ours,theirs,call==='All In'?'Attack':'Balanced',m.homeTeam===s.team);
 const other=scoreHalf(s.sport,theirs,ours,'Balanced',m.homeTeam===m.opponent);
 m.score.user+=Math.round(segment*.4);m.score.them+=Math.round(other*.4);
 if(call==='All In'&&Math.random()<.2)m.score.them+=s.sport==='nfl'?3:s.sport==='nba'?2:1;
 if(s.phase==='playoffs'&&m.score.user===m.score.them){const resolved=overtime(s.sport==='soccer'?'mlb':s.sport,m.score.user,m.score.them);m.score.user=resolved[0];m.score.them=resolved[1]}
 else{const resolved=overtime(s.sport,m.score.user,m.score.them);m.score.user=resolved[0];m.score.them=resolved[1]}
 m.events.push({time:'FINAL',text:m.score.user>m.score.them?s.team+' takes the victory!':m.score.user<m.score.them?m.opponent+' takes the game.':'The game finishes level.',side:m.score.user>m.score.them?'us':'neutral'});
 m.stage='final';const result=completeMatch(s);
 return {message:result==='W'?'WHAT A WIN.':result==='L'?'Tough loss. The season moves on.':'A draw. Every point matters.',result};
}
function simulateOther(s,fx){
 const a=s.league[fx.home],b=s.league[fx.away],ap=teamPower(s,fx.home),bp=teamPower(s,fx.away);
 const [h,y]=overtime(s.sport,scoreHalf(s.sport,ap,bp,a.strategy,true)+scoreHalf(s.sport,ap,bp,a.strategy,true),
 scoreHalf(s.sport,bp,ap,b.strategy,false)+scoreHalf(s.sport,bp,ap,b.strategy,false));
 record(s,fx.home,h,y,true);record(s,fx.away,h,y,false);
 gameStat(s,fx.home,h,y);gameStat(s,fx.away,y,h);
 postResult(s,fx.home,h>y,fx.away);postResult(s,fx.away,y>h,fx.home);
 if(Math.random()<.02)injuryEvent(s,Math.random()<.5?fx.home:fx.away);
 return {home:fx.home,away:fx.away,h,a:y};
}
function completeMatch(s){
 const m=s.match;if(!m||m.stage!=='final')throw new Error('Match is not complete');
 const h=m.homeTeam===s.team?m.score.user:m.score.them,a=m.homeTeam===s.team?m.score.them:m.score.user;
 record(s,m.fixture.home,h,a,true);record(s,m.fixture.away,h,a,false);
 gameStat(s,s.team,m.score.user,m.score.them);gameStat(s,m.opponent,m.score.them,m.score.user);
 postResult(s,s.team,m.score.user>m.score.them,m.opponent);postResult(s,m.opponent,m.score.them>m.score.user,s.team);
 const result=m.score.user>m.score.them?'W':m.score.user<m.score.them?'L':'D',star=activePlayers(s,s.team).sort((x,y)=>y.overall-x.overall)[0];
 const highlight={week:s.week,season:s.season,opponent:m.opponent,user:m.score.user,them:m.score.them,
 homeTeam:m.homeTeam,result,star:star?.name||'Team effort',plan:m.plan,halftime:m.decision,clutch:m.clutch,
 impact:m.impact,events:m.events.map(x=>({...x})),phase:s.phase};
 s.matchHistory.unshift(highlight);s.matchHistory=s.matchHistory.slice(0,220);
 publish(s,result==='W'?'MATCH WIN':result==='L'?'MATCH REPORT':'MATCH DRAW',s.team+' '+m.score.user+'–'+m.score.them+' '+m.opponent+'. '+(star?.name||'The team')+' led the effort.');
 if(result==='W')getTeam(s).budget+=3;else getTeam(s).budget+=1;
 getTeam(s).finance.revenue+=2+getTeam(s).stadium*.45;
 getTeam(s).finance.attendance+=Math.round(32000+getTeam(s).fan*380);
 getTeam(s).owner=clamp(getTeam(s).owner+(result==='W'?2:result==='L'?-2:0),0,100);
 getTeam(s).pressPending=true;s.pendingConference={result,week:s.week,opponent:m.opponent};
 if(result==='L'&&getTeam(s).owner<30)publish(s,'OWNER PRESSURE','Ownership wants answers after the latest defeat. The manager is under pressure.');
 if(Math.random()<.22)injuryEvent(s,s.team);
 s.match=null;
 const otherFixtures=s.phase==='regular'?(s.schedule[s.week]||[]).filter(x=>x.home!==s.team&&x.away!==s.team):(s.playoffs?.fixtures||[]).filter(x=>x.home!==s.team&&x.away!==s.team);
 const otherResults=otherFixtures.map(f=>simulateOther(s,f));
 if(s.phase==='regular'){
  s.week++;aiWeek(s);
  if(s.week>=SPORT[s.sport].games)endRegularSeason(s);
 }else if(s.phase==='playoffs')finishPlayoffRound(s,highlight,otherResults);
 clearFatigue(s);
 return result;
}
function aiWeek(s){
 const clubs=s.clubs.filter(t=>t!==s.team),week=s.week,sp=s.sport;
 if(week%2===0){const t=clubs[hash('ai'+week+s.season)%clubs.length],roster=s.league[t].roster;
 const contract=roster.find(p=>p.years===1&&p.overall>83);if(contract&&Math.random()<.35){contract.years=2;contract.salary=Math.round(contract.salary*1.12*10)/10;publish(s,'CONTRACT WIRE',t+' extends '+contract.name+' through '+(s.year+2)+'.',t)}}
 if(week%3===0){const t=clubs[hash('trade'+week+s.season)%clubs.length],other=clubs[(hash('other'+week)%clubs.length)],target=s.league[t],partner=s.league[other];
 const tradeA=target.roster.filter(p=>!p.starter&&p.overall<88)[0],tradeB=partner.roster.filter(p=>p.pos===tradeA?.pos&&!p.starter&&p.overall<88)[0];
 if(tradeA&&tradeB&&Math.abs(tradeA.overall-tradeB.overall)<=5&&t!==other){
  target.roster=target.roster.filter(p=>p.id!==tradeA.id);partner.roster=partner.roster.filter(p=>p.id!==tradeB.id);
  tradeA.team=other;tradeB.team=t;target.roster.push(tradeB);partner.roster.push(tradeA);
  publish(s,'TRADE WIRE',t+' acquires '+tradeB.name+' from '+other+' in a front-office swap.',t)
 }}
 if(week%4===0){
  const t=clubs[hash('rise'+week+s.season)%clubs.length],rookie=s.league[t].roster.filter(p=>p.age<24).sort((a,b)=>b.potential-a.potential)[0];
  if(rookie){rookie.overall=clamp(rookie.overall+1,50,rookie.potential);publish(s,'BREAKOUT WATCH',rookie.name+' is turning heads for '+t+'. Scouts see a possible future star.',t)}
 }
 const leaders=standings(s),top=leaders[0];
 if(week>3&&week%6===0)publish(s,'CHAMPIONSHIP RACE',top+' leads the title race. '+s.team+' sits '+userRank(s)+getOrdinal(userRank(s))+' in the standings.',top);
}
function getOrdinal(n){return [11,12,13].includes(n%100)?'th':n%10===1?'st':n%10===2?'nd':n%10===3?'rd':'th'}
function playoffFixtures(teams){const fixtures=[];for(let i=0;i<teams.length/2;i++)fixtures.push({home:teams[i],away:teams[teams.length-i-1]});return fixtures}
function endRegularSeason(s){
 if(s.sport==='soccer'){endSeason(s,standings(s)[0]);return}
 const top=standings(s).slice(0,8);
 s.playoffs={round:1,teams:top,fixtures:playoffFixtures(top),winners:[]};
 s.phase='playoffs';s.week=SPORT[s.sport].games;publish(s,'PLAYOFF BRACKET',titleFor(s.sport)+' bracket is set. Eight teams remain.',s.team);
 if(!top.includes(s.team)){autoPlayoffs(s);return}
}
function finishPlayoffRound(s,match,other){
 const p=s.playoffs,winners=[];
 const mine=match.user>match.them?s.team:match.opponent;
 winners.push(mine);
 for(const x of other)winners.push(x.h>x.a?x.home:x.away);
 p.winners=winners;p.teams=winners;
 if(winners.length<=1){endSeason(s,winners[0]);return}
 p.round++;p.fixtures=playoffFixtures(winners);
 publish(s,'PLAYOFFS',winners.join(', ')+' advance to the next round.');
 if(!winners.includes(s.team))autoPlayoffs(s);
}
function autoPlayoffs(s){
 let rounds=0;while(s.phase==='playoffs'&&rounds++<5){
  const next=s.playoffs.fixtures.map(fx=>simulateOther(s,fx)),winners=next.map(x=>x.h>x.a?x.home:x.away);
  s.playoffs.teams=winners;if(winners.length<=1){endSeason(s,winners[0]);break}
  s.playoffs.round++;s.playoffs.fixtures=playoffFixtures(winners);
 }
}
function topMVP(s){
 const candidates=[];for(const [team,t] of Object.entries(s.league))for(const p of t.roster){const a=p.seasonStats;if(!a.games)continue;
 const metric=s.sport==='nba'?a.points+a.assists*1.4+a.rebounds:s.sport==='nfl'?a.passYards/18+a.passTD*8+a.rushYards/15+a.recYards/16+a.tackles*1.1:s.sport==='soccer'?a.goals*7+a.assists*4+a.saves*.4:a.homeRuns*5+a.hits+a.rbi*1.5+a.strikeouts*.6;
 candidates.push({name:p.name,pos:p.pos,team,score:metric,player:p})}
 return candidates.sort((a,b)=>b.score-a.score).slice(0,10);
}
function endSeason(s,champion){
 if(s.phase==='offseason')return;
 const ranked=standings(s),mvp=topMVP(s)[0],title={season:s.season,year:s.year,champion,runnerUp:ranked.find(x=>x!==champion),
 mvp:mvp?.name||'No MVP',mvpTeam:mvp?.team||'Unknown',awards:[],topFour:ranked.slice(0,4),
 standings:ranked.map(team=>({team,record:{...s.league[team].record}}))};
 if(mvp){mvp.player.awards.push('MVP '+s.year);mvp.player.legacy+=500;title.awards.push({type:'MVP',name:mvp.name,team:mvp.team})}
 const rooks=Object.values(s.league).flatMap(t=>t.roster).filter(p=>p.age<=23&&p.seasonStats.games>0).sort((a,b)=>b.legacy-a.legacy);
 if(rooks.length){const rookie=rooks[0];rookie.awards.push('Rookie of the Year '+s.year);rookie.legacy+=250;title.awards.push({type:'ROY',name:rookie.name,team:rookie.team})}
 const defenders=Object.values(s.league).flatMap(t=>t.roster).filter(p=>['DL','LB','DB','GK','CB','RP','CP','C','PF'].includes(p.pos)).sort((a,b)=>(b.seasonStats.tackles||0)+(b.seasonStats.blocks||0)*2+(b.seasonStats.saves||0)-(a.seasonStats.tackles||0)-(a.seasonStats.blocks||0)*2-(a.seasonStats.saves||0));
 if(defenders.length&&defenders[0].seasonStats.games){defenders[0].awards.push('Defensive Player '+s.year);title.awards.push({type:'DPOY',name:defenders[0].name,team:defenders[0].team})}
 s.history.unshift(title);if(champion===s.team){s.seasonsWon++;s.legacyPoints+=1000;getTeam(s).owner=clamp(getTeam(s).owner+18,0,100);getTeam(s).fan=clamp(getTeam(s).fan+18,0,100);s.museum.unshift({type:'CHAMPIONSHIP',year:s.year,text:s.team+' won the '+titleFor(s.sport)})}
 publish(s,'CHAMPIONSHIP HISTORY',champion+' wins the '+titleFor(s.sport)+'! '+title.mvp+' takes MVP honours.',champion);
 for(const [name,t] of Object.entries(s.league)){
  for(const p of t.roster){
   p.seasonHistory.unshift({year:s.year,stats:{...p.seasonStats},overall:p.overall});
   p.seasonHistory=p.seasonHistory.slice(0,22);
   p.seasonStats=stats(s.sport);p.age++;p.years=Math.max(0,p.years-1);
   p.fatigue=0;p.injury=0;
   let up=p.age<27?rng(-1,3):p.age>33?rng(-3,0):rng(-1,1);
   if(p.trait==='mentor'&&p.age<29)up++;
   const chance=hash(p.id+s.season+'arc')%20;if(chance===0)up+=5;if(chance===1)up-=5;
   p.overall=clamp(Math.min(p.hiddenCeiling,p.overall+up),45,99);
   p.potential=clamp(Math.max(p.overall,p.potential+(chance===0?2:chance===1?-3:0)),45,99);
   if(p.age>36&&Math.random()<.35){t.retired.push(p);if(name===s.team)s.museum.unshift({type:'RETIREMENT',year:s.year,text:p.name+' retired after '+p.games+' appearances.'});}
   p.legacy+=Math.max(0,Math.round(p.overall-65));
  }
  t.roster=t.roster.filter(p=>!t.retired.includes(p));t.draftPicks=3;
  const champ=name===champion; t.owner=clamp(t.owner+(champ?8:name===s.team?Math.round((t.record.w/Math.max(1,SPORT[s.sport].games)-.5)*15):0),0,100);
 }
 s.phase='offseason';s.pendingConference=null;s.playoffs=null;s.match=null;
 s.gmRep=clamp(s.gmRep+(champion===s.team?14:userRank(s)<=s.clubs.length/2?3:-7),0,100);
 s.ownerOffers=makeJobOffers(s);
 s.playerPromises.forEach(pr=>{if(pr.resolved)return;pr.resolved=true;const kept=pr.type==='title'?champion===s.team:pr.type==='playoffs'?ranked.indexOf(s.team)<8:!!findPlayer(s,pr.playerId)?.starter;pr.kept=kept;const p=findPlayer(s,pr.playerId);if(p)p.morale=clamp(p.morale+(kept?10:-14),20,100);publish(s,kept?'PROMISE KEPT':'PROMISE BROKEN',(kept?'You kept':'You broke')+' a promise to '+(p?.name||s.team)+'.')});
 s.playerPromises=s.playerPromises.slice(-12);
 return title;
}
function makeJobOffers(s){
 const clubs=s.clubs.filter(c=>c!==s.team).sort((a,b)=>s.league[a].record.w-s.league[b].record.w);
 return clubs.slice(0,3).map((team,i)=>({team,goal:i===0?'Rebuild the roster':'Compete for the title',salary:Math.round(3+s.gmRep/20+i),expires:s.year+1}));
}
function advanceSeason(s){
 if(s.phase!=='offseason')return {error:'Finish the current season first.'};
 const retiredNew=[];
 for(const t of Object.values(s.league)){t.record={w:0,l:0,d:0,for:0,against:0};t.budget=Math.round((t.budget+t.finance.revenue-t.finance.expenses*.35)*10)/10;
  t.roster=t.roster.filter(p=>{if(p.years>0)return true;if(p.trait==='loyal'&&Math.random()<.7){p.years=1;return true}retiredNew.push({...p});return false});
  t.finance={revenue:0,expenses:0,attendance:0};
  const depth=STARTERS[s.sport];for(const [pos,n] of Object.entries(depth)){const has=t.roster.filter(p=>p.pos===pos).length;for(let i=has;i<n+1;i++){const raw=makeProspect(s,i+hash(t.name+pos)%1000,pos);raw.team=t.name;raw.years=2;raw.starter=i<n;t.roster.push(raw)}}
 }
 s.year++;s.season++;s.week=0;s.phase='preseason';s.schedule=schedule(s.clubs,SPORT[s.sport].games,s.season);s.draftLog=[];s.match=null;s.pendingConference=null;s.scouting.reports=[];
 prepareProspects(s);aiOffseason(s);s.rivalries=Object.fromEntries(Object.entries(s.rivalries).map(([k,v])=>[k,{...v,heat:Math.max(0,v.heat-3)}]));
 publish(s,'LEAGUE CENTRAL','Season '+s.season+' opens. Clubs reset their records and the next chapter begins.');
 return {message:'A new season begins.'};
}
function aiOffseason(s){
 const ai=s.clubs.filter(t=>t!==s.team);
 for(const team of ai){
  const t=s.league[team],weak=Object.keys(STARTERS[s.sport]).map(pos=>({pos,power:t.roster.filter(p=>p.pos===pos).reduce((n,p)=>n+p.overall,0)/Math.max(1,t.roster.filter(p=>p.pos===pos).length)})).sort((a,b)=>a.power-b.power)[0];
  const prospect=s.freeAgents.filter(p=>p.pos===weak.pos).sort((a,b)=>b.overall-a.overall)[0];
  if(prospect&&t.budget>=prospect.salary){const player={...prospect,id:ID(),team,relationships:{},career:stats(s.sport),seasonStats:stats(s.sport),seasonHistory:[],awards:[]};t.roster.push(player);t.budget-=player.salary;publish(s,'FREE AGENCY',team+' signs '+player.name+' to strengthen '+weak.pos+'.',team)}
  if(t.record.w<Math.ceil(SPORT[s.sport].games*.35)&&Math.random()<.4){const old=t.coach.name;t.coach={...COACHES[rng(0,COACHES.length-1)]};publish(s,'COACHING CAROUSEL',team+' dismisses '+old+' and appoints '+t.coach.name+'.',team)}
 }
}
function signFreeAgent(s,id){
 const idx=s.freeAgents.findIndex(p=>p.id===id);if(idx<0)return {error:'Player not available'};
 const t=getTeam(s),p=s.freeAgents[idx],cost=p.salary;
 if(payroll(t)+cost>cap(s.sport))return {error:'Salary cap exceeded'};
 if(t.budget<cost)return {error:'Insufficient budget'};
 s.freeAgents.splice(idx,1);p.team=s.team;p.years=3;t.roster.push(p);t.budget-=cost;change(s,s.team,1);
 publish(s,'FREE AGENCY',s.team+' agrees a three-year deal with '+p.name+'.');
 return {message:p.name+' signed.'};
}
function releasePlayer(s,id){
 const t=getTeam(s),p=t.roster.find(p=>p.id===id);if(!p)return {error:'Player not found'};
 if(t.roster.filter(x=>x.pos===p.pos).length<2)return {error:'Keep at least one backup in that position'};
 t.roster=t.roster.filter(x=>x.id!==id);p.team='Free Agent';p.starter=false;s.freeAgents.push(p);change(s,s.team,-1);
 publish(s,'FRONT OFFICE',s.team+' releases '+p.name+'.');return {message:p.name+' released.'};
}
function setStarter(s,id){
 const t=getTeam(s),p=findPlayer(s,id);if(!p)return {error:'Player not found'};if(p.injury)return {error:'This player is injured'};
 const depth=STARTERS[s.sport][p.pos]||1;
 if(!p.starter&&t.roster.filter(x=>x.pos===p.pos&&x.starter).length>=depth){const other=t.roster.filter(x=>x.pos===p.pos&&x.starter).sort((a,b)=>a.overall-b.overall)[0];if(other)other.starter=false}
 p.starter=!p.starter;return {message:p.name+(p.starter?' promoted to starter.':' moved to the bench.')};
}
function train(s,id,focus){
 const p=findPlayer(s,id),t=getTeam(s);if(!p)return {error:'Player not found'};if(t.budget<2)return {error:'Training costs $2M'};
 t.budget-=2;p.fatigue=clamp(p.fatigue+5,0,100);
 const delta=(p.age<28?2:1)+(t.coach.style==='Development'?1:0)+(p.mentor?1:0);
 p.overall=clamp(Math.min(p.hiddenCeiling,p.overall+delta),45,99);p.morale=clamp(p.morale+2,20,100);
 publish(s,'PLAYER DEVELOPMENT',p.name+' completed '+focus+' training and improved to '+p.overall+' OVR.');
 return {message:p.name+' trained. OVR '+p.overall};
}
function mentor(s,oldId,youngId){
 const older=findPlayer(s,oldId),younger=findPlayer(s,youngId);if(!older||!younger||older.id===younger.id)return {error:'Choose two different players'};
 if(older.age<27||younger.age>25)return {error:'Mentor must be 27+, prospect must be 25 or younger'};
 younger.mentor=older.id;relationship(older,younger,15);younger.potential=clamp(younger.potential+2,younger.overall||60,99);
 return {message:older.name+' is mentoring '+younger.name+'.'};
}
function makePromise(s,type,id){
 if(!['starter','title','playoffs'].includes(type))return {error:'Unknown promise'};
 const p=id?findPlayer(s,id):null;if(type==='starter'&&!p)return {error:'Select a player'};
 const pr={id:ID(),playerId:p?.id||null,playerName:p?.name||s.team,type,resolved:false,season:s.season};s.playerPromises.push(pr);return {message:'Promise recorded. The locker room will remember.'};
}
function respondDemand(s,id,response){
 const p=findPlayer(s,id);if(!p||!p.demand)return {error:'No active demand'};
 const t=getTeam(s),d=p.demand;
 if(response==='promise'){makePromise(s,'starter',id);p.morale=clamp(p.morale+8,20,100)}
 else if(response==='trade'){p.morale=clamp(p.morale-5,20,100);publish(s,'TRADE REQUEST',p.name+' has been placed on the trade block.')}
 else{p.morale=clamp(p.morale-15,20,100);t.chemistry=clamp(t.chemistry-5,20,100)}
 p.demand=null;return {message:'Demand addressed: '+d+'.'};
}
function negotiate(s,outIds,inTeam,inId,pickCount=0){
 const t=getTeam(s),other=s.league[inTeam];if(!other||inTeam===s.team)return {error:'Choose a rival club'};
 const offered=outIds.map(id=>t.roster.find(p=>p.id===id)).filter(Boolean),incoming=other.roster.find(p=>p.id===inId);
 if(!offered.length||!incoming)return {error:'Choose valid trade assets'};
 if(offered.some(p=>p.injury>0))return {error:'An injured player cannot be traded'};
 const myValue=offered.reduce((n,p)=>n+p.overall+(p.potential-p.overall)*.35,0)+Math.min(3,pickCount)*13;
 const theirValue=incoming.overall+(incoming.potential-incoming.overall)*.4;
 const scarcity=other.roster.filter(p=>p.pos===incoming.pos).length<2?18:0,loyal=incoming.trait==='loyal'?12:0,
 star=incoming.overall>91?25:0,ai=theirValue+scarcity+loyal+star;
 const counter=Math.max(0,Math.ceil((ai-myValue)/13));
 const status=myValue>=ai?'accepted':counter<=2?'counter':'rejected';
 s.negotiation={id:ID(),out:offered.map(p=>p.id),target:inId,inTeam,picks:pickCount,requiredPicks:status==='counter'?counter:0,status,deadline:s.week+2,
 message:status==='accepted'?'The rival GM accepts. Confirm the deal.':status==='counter'?'Counteroffer: add '+counter+' draft pick(s).':'The rival GM rejects the deal as too costly.'};
 publish(s,'TRADE WIRE',s.team+' opens talks with '+inTeam+' for '+incoming.name+'.');
 return {message:s.negotiation.message,negotiation:s.negotiation};
}
function confirmTrade(s,withCounter){
 const n=s.negotiation;if(!n)return {error:'No trade pending'};
 if(s.week>n.deadline){s.negotiation=null;return {error:'Trade deadline passed'}};
 if(n.status!=='accepted'&&!(withCounter&&n.status==='counter'))return {error:'The other team has not accepted'};
 const t=getTeam(s),other=s.league[n.inTeam],incoming=other.roster.find(p=>p.id===n.target),out=n.out.map(id=>t.roster.find(p=>p.id===id)).filter(Boolean);
 const picks=n.picks+(withCounter?n.requiredPicks:0);
 if(!incoming||out.length!==n.out.length)return {error:'Trade assets unavailable'};
 if(t.draftPicks<picks)return {error:'Not enough draft picks'};
 const newSalary=payroll(t)-out.reduce((a,p)=>a+p.salary,0)+incoming.salary;
 if(newSalary>cap(s.sport))return {error:'Salary cap exceeded'};
 t.roster=t.roster.filter(p=>!n.out.includes(p.id));other.roster=other.roster.filter(p=>p.id!==incoming.id);
 for(const p of out){p.team=n.inTeam;p.starter=false;other.roster.push(p)}
 incoming.team=s.team;incoming.starter=false;t.roster.push(incoming);t.draftPicks-=picks;other.draftPicks+=picks;
 change(s,s.team,-2);change(s,n.inTeam,-1);
 const name=incoming.name;s.negotiation=null;publish(s,'BLOCKBUSTER TRADE',s.team+' receives '+name+' from '+n.inTeam+' in a completed trade.');
 return {message:'Trade completed for '+name+'.'};
}
function draftPlayer(s,id){
 if(s.phase!=='offseason')return {error:'Drafting opens in the offseason'};
 const t=getTeam(s),idx=s.draft.findIndex(p=>p.id===id);if(idx<0)return {error:'Prospect already drafted'};
 if(t.draftPicks<=0)return {error:'You have no draft picks'};
 const p=s.draft.splice(idx,1)[0];p.team=s.team;t.roster.push(p);t.draftPicks--;
 s.draftLog.push({team:s.team,name:p.name,round:4-t.draftPicks,year:s.year});publish(s,'DRAFT NIGHT',s.team+' drafts '+p.name+' ('+p.pos+').');
 for(let i=0;i<Math.min(3,s.draft.length);i++){const rival=s.clubs[(hash(p.name+i)%s.clubs.length)];if(rival===s.team)continue;
 const need=Object.keys(STARTERS[s.sport]).map(pos=>({pos,count:s.league[rival].roster.filter(p=>p.pos===pos).length})).sort((a,b)=>a.count-b.count)[0]?.pos;
 const picked=s.draft.find(x=>x.pos===need)||s.draft[0];if(!picked)break;s.draft=s.draft.filter(x=>x.id!==picked.id);
 picked.team=rival;s.league[rival].roster.push(picked);s.draftLog.push({team:rival,name:picked.name,round:1,year:s.year})}
 return {message:p.name+' drafted. '+t.draftPicks+' picks left.'};
}
function hireCoach(s,name){const coach=COACHES.find(x=>x.name===name),t=getTeam(s);if(!coach)return {error:'Coach unavailable'};
 if(t.budget<coach.cost)return {error:'Not enough budget'};t.budget-=coach.cost;t.coachHistory.push({year:s.year,name:t.coach.name});t.coach={...coach};
 change(s,s.team,2);publish(s,'COACHING CAROUSEL',s.team+' appoints '+coach.name+' to run '+coach.style.toLowerCase()+' football.',s.team);return {message:coach.name+' hired.'};
}
function stadiumUpgrade(s){const t=getTeam(s),cost=12+t.stadium*9;if(t.budget<cost)return {error:'Not enough budget: '+money(cost)};
 t.budget-=cost;t.stadium++;t.fan=clamp(t.fan+6,0,100);publish(s,'FRANCHISE IDENTITY',s.team+' upgrades its home venue to level '+t.stadium+'.');return {message:'Stadium upgraded to level '+t.stadium};}
function expandLeague(s,name){name=String(name||'').trim().slice(0,30);if(name.length<4)return {error:'Enter a team name of at least four characters'};
 if(s.clubs.length%2===1)return {error:'A paired expansion team is already pending'};
 if(s.clubs.includes(name))return {error:'Team already exists'};
 const partner='ER Expansion '+(s.clubs.length+2);s.clubs.push(name,partner);s.league[name]=createTeam(s.sport,name,s.era,s.season);s.league[partner]=createTeam(s.sport,partner,s.era,s.season);
 s.league[name].expansion=true;s.league[partner].expansion=true;
 if(s.week===0){s.schedule=schedule(s.clubs,SPORT[s.sport].games,s.season)}
 publish(s,'LEAGUE EXPANSION',name+' and '+partner+' join the league. New eras bring new rivalries.');
 return {message:'Two new franchises created.'};
}
function relocate(s,name){name=String(name||'').trim().slice(0,30);if(name.length<4)return {error:'Enter a new franchise name'};
 if(s.clubs.includes(name))return {error:'Another club already uses that name'};
 const old=s.team,t=getTeam(s);delete s.league[old];t.name=name;t.relocated=true;s.league[name]=t;
 s.clubs=s.clubs.map(x=>x===old?name:x);s.schedule=s.schedule.map(round=>round.map(f=>({home:f.home===old?name:f.home,away:f.away===old?name:f.away})));
 t.roster.forEach(p=>p.team=name);s.team=name;publish(s,'FRANCHISE RELOCATION',old+' is now '+name+'. A new identity begins.');return {message:'Franchise renamed '+name+'.'};
}
function acceptJob(s,team){if(!s.ownerOffers.some(x=>x.team===team))return {error:'No valid job offer'};
 s.team=team;s.ownerOffers=[];publish(s,'GM CAREER','New job accepted. You are now managing '+team+'.',team);return {message:'Welcome to '+team+'.'};
}
function selectStrategy(s,strategy){const valid=['Balanced','Attack','Defense','Fast','Control'];if(!valid.includes(strategy))return {error:'Unknown gameplan'};getTeam(s).strategy=strategy;return {message:'Team gameplan changed to '+strategy+'.'}}
function legacyRankings(s,pos){
 const real=(LEGENDS[s.sport]?.[pos]||[]).map(([name,team,overall])=>({name,team,position:pos,points:Math.round((overall-70)*105)+750,real:true}));
 const mine=Object.values(s.league).flatMap(t=>[...t.roster,...t.retired]).filter(p=>p.pos===pos).map(p=>({name:p.name,team:p.team,position:pos,points:Math.round(p.legacy),real:false,created:p.created}));
 return [...real,...mine].sort((a,b)=>b.points-a.points).slice(0,100);
}
function summary(s){const t=getTeam(s),next=opponent(s);return {sport:s.sport,name:s.name,team:s.team,season:s.season,year:s.year,week:s.week,
 games:SPORT[s.sport].games,phase:s.phase,record:{...t.record},overall:teamPower(s,s.team),rank:userRank(s),teamCount:s.clubs.length,
 owner:t.owner,fan:t.fan,chem:t.chemistry,budget:t.budget,cap:cap(s.sport),payroll:payroll(t),mood:morale(s),next,star:primaryStar(t),championships:s.seasonsWon,leagueMvp:topMVP(s)[0]};
}
root.ERRebootEngine={SPORT,TEAMS,PLAN,STARTERS,LEGENDS,CURRENT,COACHES,STAFF,personality:personalities,
 makeUniverse,summary,stats,makePlayer,pool,blueprint,schedule,teamPower,fixture,opponent,standings,userRank,activePlayers,findPlayer,
 startMatch,halftime,closing,press:decidePress,gameStat,scoreHalf,overtime,makeProspect,prepareProspects,selectedProspects,
 publish,story,payroll,cap,injuryEvent,advanceSeason,aiWeek,aiOffseason,endRegularSeason,endSeason,topMVP,legacyRankings,
 signFreeAgent,releasePlayer,setStarter,train,mentor,makePromise,respondDemand,negotiate,confirmTrade,draftPlayer,hireCoach,stadiumUpgrade,
 expandLeague,relocate,acceptJob,selectStrategy,getTeam,makeJobOffers,COACHES,newsTypes,money,ID,clamp};
})(typeof window!=='undefined'?window:globalThis);
