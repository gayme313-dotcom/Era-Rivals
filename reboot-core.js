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
