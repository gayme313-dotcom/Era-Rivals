(function(){
'use strict';
const $=id=>document.getElementById(id);
const SPORT={
 nba:{name:'BASKETBALL',emoji:'🏀',positions:['PG','SG','SF','PF','C'],games:82,cap:154,unit:'M'},
 nfl:{name:'FOOTBALL',emoji:'🏈',positions:['QB','RB','WR','TE','OL','DL','LB','DB'],games:17,cap:280,unit:'M'},
 soccer:{name:'SOCCER',emoji:'⚽',positions:['GK','RB','CB','LB','CDM','CM','CAM','RW','LW','ST'],games:38,cap:300,unit:'M'},
 mlb:{name:'BASEBALL',emoji:'⚾',positions:['SP','RP','CP','C','1B','2B','3B','SS','LF','CF','RF'],games:162,cap:240,unit:'M'}
};
const TEAMS={
 nba:['Los Angeles Lakers','Boston Celtics','Golden State Warriors','New York Knicks','Chicago Bulls','Miami Heat','Dallas Mavericks','San Antonio Spurs','Denver Nuggets','Oklahoma City Thunder','Phoenix Suns','Cleveland Cavaliers'],
 nfl:['Kansas City Chiefs','San Francisco 49ers','Philadelphia Eagles','Dallas Cowboys','Baltimore Ravens','Buffalo Bills','Green Bay Packers','Detroit Lions','Cincinnati Bengals','Los Angeles Rams','Miami Dolphins','New England Patriots'],
 soccer:['Real Madrid','FC Barcelona','Manchester City','Arsenal','Liverpool','Bayern Munich','Paris Saint-Germain','Inter Milan','AC Milan','Chelsea','Atlético Madrid','Borussia Dortmund'],
 mlb:['New York Yankees','Los Angeles Dodgers','Boston Red Sox','New York Mets','Atlanta Braves','Chicago Cubs','Houston Astros','San Diego Padres','Philadelphia Phillies','Seattle Mariners','Texas Rangers','Baltimore Orioles']
};
const PLAN={
 nba:['PG','SG','SF','PF','C','PG','SG','SF','PF','C'],
 nfl:['QB','RB','WR','WR','TE','OL','OL','OL','OL','OL','DL','DL','DL','LB','LB','LB','DB','DB','DB','DB'],
 soccer:['GK','RB','CB','CB','LB','CDM','CM','CAM','RW','LW','ST','GK','CB','CDM','CM','RW','LW','ST'],
 mlb:['SP','SP','SP','SP','SP','RP','RP','RP','CP','C','1B','2B','3B','SS','LF','CF','RF']
};
const STARTERS={
 nba:{PG:1,SG:1,SF:1,PF:1,C:1},
 nfl:{QB:1,RB:1,WR:2,TE:1,OL:5,DL:3,LB:3,DB:4},
 soccer:{GK:1,RB:1,CB:2,LB:1,CDM:1,CM:1,CAM:1,RW:1,LW:1,ST:1},
 mlb:{SP:5,RP:3,CP:1,C:1,'1B':1,'2B':1,'3B':1,SS:1,LF:1,CF:1,RF:1}
};
const LEGENDS={
 nba:{
 PG:[['Magic Johnson','Los Angeles Lakers',100],['Stephen Curry','Golden State Warriors',99],['Oscar Robertson','Cincinnati Royals',99],['John Stockton','Utah Jazz',98],['Isiah Thomas','Detroit Pistons',98],['Chris Paul','LA Clippers',97]],
 SG:[['Michael Jordan','Chicago Bulls',100],['Kobe Bryant','Los Angeles Lakers',99],['Jerry West','Los Angeles Lakers',98],['Dwyane Wade','Miami Heat',98],['Allen Iverson','Philadelphia 76ers',97],['Reggie Miller','Indiana Pacers',96]],
 SF:[['LeBron James','Cleveland Cavaliers',100],['Larry Bird','Boston Celtics',99],['Kevin Durant','Golden State Warriors',99],['Julius Erving','Philadelphia 76ers',98],['Scottie Pippen','Chicago Bulls',98]],
 PF:[['Tim Duncan','San Antonio Spurs',100],['Karl Malone','Utah Jazz',99],['Kevin Garnett','Boston Celtics',99],['Dirk Nowitzki','Dallas Mavericks',98],['Charles Barkley','Phoenix Suns',98]],
 C:[['Kareem Abdul-Jabbar','Los Angeles Lakers',100],['Shaquille O’Neal','Los Angeles Lakers',100],['Wilt Chamberlain','Los Angeles Lakers',100],['Bill Russell','Boston Celtics',100],['Hakeem Olajuwon','Houston Rockets',99],['Nikola Jokić','Denver Nuggets',99]]
 },
 nfl:{
 QB:[['Tom Brady','New England Patriots',100],['Joe Montana','San Francisco 49ers',99],['Peyton Manning','Indianapolis Colts',99],['Patrick Mahomes','Kansas City Chiefs',98],['Aaron Rodgers','Green Bay Packers',98]],
 RB:[['Jim Brown','Cleveland Browns',100],['Barry Sanders','Detroit Lions',100],['Walter Payton','Chicago Bears',99],['Emmitt Smith','Dallas Cowboys',99],['LaDainian Tomlinson','San Diego Chargers',98]],
 WR:[['Jerry Rice','San Francisco 49ers',100],['Randy Moss','Minnesota Vikings',99],['Terrell Owens','San Francisco 49ers',98],['Calvin Johnson','Detroit Lions',98],['Larry Fitzgerald','Arizona Cardinals',98]],
 TE:[['Tony Gonzalez','Kansas City Chiefs',99],['Rob Gronkowski','New England Patriots',99],['Travis Kelce','Kansas City Chiefs',98]],
 OL:[['Anthony Muñoz','Cincinnati Bengals',100],['Larry Allen','Dallas Cowboys',99],['Jonathan Ogden','Baltimore Ravens',98],['Joe Thomas','Cleveland Browns',98]],
 DL:[['Reggie White','Philadelphia Eagles',100],['Bruce Smith','Buffalo Bills',100],['Aaron Donald','Los Angeles Rams',99],['Deacon Jones','Los Angeles Rams',99]],
 LB:[['Lawrence Taylor','New York Giants',100],['Ray Lewis','Baltimore Ravens',99],['Dick Butkus','Chicago Bears',99],['Junior Seau','San Diego Chargers',98]],
 DB:[['Deion Sanders','Dallas Cowboys',100],['Ed Reed','Baltimore Ravens',100],['Ronnie Lott','San Francisco 49ers',99],['Troy Polamalu','Pittsburgh Steelers',99],['Darrelle Revis','New York Jets',98]]
 },
 soccer:{
 GK:[['Lev Yashin','Dynamo Moscow',100],['Gianluigi Buffon','Juventus',100],['Manuel Neuer','Bayern Munich',99],['Iker Casillas','Real Madrid',99]],
 RB:[['Cafu','AC Milan',100],['Dani Alves','FC Barcelona',99],['Philipp Lahm','Bayern Munich',99]],
 CB:[['Franz Beckenbauer','Bayern Munich',100],['Paolo Maldini','AC Milan',100],['Sergio Ramos','Real Madrid',99],['Alessandro Nesta','AC Milan',98]],
 LB:[['Roberto Carlos','Real Madrid',100],['Paolo Maldini','AC Milan',99],['Ashley Cole','Chelsea',97]],
 CDM:[['Claude Makélélé','Real Madrid',99],['Sergio Busquets','FC Barcelona',99],['Patrick Vieira','Arsenal',99]],
 CM:[['Xavi','FC Barcelona',100],['Andrés Iniesta','FC Barcelona',100],['Luka Modrić','Real Madrid',99],['Zinedine Zidane','Real Madrid',100]],
 CAM:[['Diego Maradona','Napoli',100],['Zinedine Zidane','Real Madrid',100],['Ronaldinho','FC Barcelona',99],['Michel Platini','Juventus',99]],
 RW:[['Lionel Messi','FC Barcelona',100],['George Best','Manchester United',99],['Garrincha','Brazil',99]],
 LW:[['Cristiano Ronaldo','Real Madrid',100],['Neymar','FC Barcelona',98],['Ronaldinho','AC Milan',98]],
 ST:[['Pelé','Santos',100],['Ronaldo Nazário','Real Madrid',100],['Cristiano Ronaldo','Real Madrid',100],['Thierry Henry','Arsenal',99],['Gerd Müller','Bayern Munich',99]]
 },
 mlb:{
 SP:[['Cy Young','Boston Rustlers',100],['Walter Johnson','Washington Senators',100],['Sandy Koufax','Los Angeles Dodgers',100],['Pedro Martínez','Boston Red Sox',99],['Greg Maddux','Atlanta Braves',99],['Randy Johnson','Arizona Diamondbacks',99]],
 RP:[['Dennis Eckersley','Oakland Athletics',98],['Goose Gossage','New York Yankees',98],['John Franco','New York Mets',97]],
 CP:[['Mariano Rivera','New York Yankees',100],['Trevor Hoffman','San Diego Padres',99],['Lee Smith','Chicago Cubs',98]],
 C:[['Johnny Bench','Cincinnati Reds',100],['Yogi Berra','New York Yankees',99],['Ivan Rodríguez','Texas Rangers',99],['Mike Piazza','New York Mets',98]],
 '1B':[['Lou Gehrig','New York Yankees',100],['Albert Pujols','St. Louis Cardinals',100],['Jimmie Foxx','Philadelphia Athletics',99]],
 '2B':[['Rogers Hornsby','St. Louis Cardinals',100],['Joe Morgan','Cincinnati Reds',99],['Jackie Robinson','Brooklyn Dodgers',99],['Roberto Alomar','Toronto Blue Jays',98]],
 '3B':[['Mike Schmidt','Philadelphia Phillies',100],['George Brett','Kansas City Royals',99],['Chipper Jones','Atlanta Braves',98],['Adrián Beltré','Texas Rangers',98]],
 SS:[['Honus Wagner','Pittsburgh Pirates',100],['Derek Jeter','New York Yankees',99],['Cal Ripken Jr.','Baltimore Orioles',99],['Ozzie Smith','St. Louis Cardinals',98]],
 LF:[['Ted Williams','Boston Red Sox',100],['Barry Bonds','San Francisco Giants',100],['Rickey Henderson','Oakland Athletics',99]],
 CF:[['Willie Mays','San Francisco Giants',100],['Mickey Mantle','New York Yankees',100],['Ken Griffey Jr.','Seattle Mariners',99],['Ty Cobb','Detroit Tigers',100]],
 RF:[['Babe Ruth','New York Yankees',100],['Hank Aaron','Atlanta Braves',100],['Roberto Clemente','Pittsburgh Pirates',99],['Ichiro Suzuki','Seattle Mariners',99]]
 }
};
const TACTICS={
 nba:{off:['Balanced','Pick & Roll','3-Point Heavy','Inside Game','Motion Offense'],def:['Man-to-Man','Zone Defense','Switch Everything','Protect the Paint','Full-Court Press'],tempo:['Slow','Normal','Fast'],risk:['Conservative','Balanced','Aggressive'],decisions:[['Feed the hot hand','Give your best scorer more touches. More offense, more fatigue.',6,0,8],['Lock in defensively','Make every possession difficult. Stronger defense.',1,7,1],['Push the pace','Create more possessions and attack early.',5,0,10]]},
 nfl:{off:['Balanced','Air Raid','Ground & Pound','Play Action','West Coast'],def:['Cover 2','Man Blitz','Zone Blitz','Stop the Run','Prevent Defense'],tempo:['Slow','Normal','Fast'],risk:['Conservative','Balanced','Aggressive'],decisions:[['Attack downfield','Take shots at big plays. More upside and more turnovers.',7,0,5],['Protect the quarterback','Keep the pocket clean and control the clock.',3,3,1],['Bring the pressure','Send extra rushers and force a mistake.',0,7,6]]},
 soccer:{off:['Possession','Counter Attack','Wing Play','High Press','Direct Football'],def:['Low Block','High Press','Counter Press','Compact Shape','Man Marking'],tempo:['Slow','Normal','Fast'],risk:['Conservative','Balanced','Aggressive'],decisions:[['Turn on the high press','Win the ball higher up the pitch. Costs stamina.',6,1,10],['Protect the middle','Close central spaces and defend as a unit.',0,7,2],['Attack the wings','Stretch the defense and create crossing chances.',5,1,5]]},
 mlb:{off:['Balanced','Small Ball','Power Hitting','Contact Hitting','Aggressive Baserunning'],def:['Pitch to Contact','Strikeout Pitching','Infield Shift','Outfield Deep','Infield In'],tempo:['Slow','Normal','Fast'],risk:['Conservative','Balanced','Aggressive'],decisions:[['Go to the bullpen','Use fresh arms to protect the lead.',0,7,2],['Play small ball','Move runners and manufacture runs.',4,2,3],['Let the sluggers swing','Chase extra-base hits. High upside, higher strikeout risk.',7,0,5]]}
};
const STORAGE='era_rivals_front_office_v1';
const qs=new URLSearchParams(location.search);
let sport=SPORT[qs.get('sport')]?qs.get('sport'):'nba';
let page='dashboard',rosterFilter='ALL',hofPosition=null,toastTimer=null;
function blankState(){return {saves:{nba:[],nfl:[],soccer:[],mlb:[]},active:{nba:null,nfl:null,soccer:null,mlb:null}}}
function readState(){try{const v=JSON.parse(localStorage.getItem(STORAGE)||'null');if(v&&v.saves){const d=blankState();Object.keys(d.saves).forEach(s=>d.saves[s]=Array.isArray(v.saves[s])?v.saves[s]:[]);d.active={...d.active,...(v.active||{})};return d}}catch(e){}return blankState()}
const state=readState();
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(state))}catch(e){notify('Browser storage is full. Export or delete an old save.','bad')}}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function rand(a,b){return a+Math.random()*(b-a)}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function money(v){return '$'+Number(v||0).toFixed(1)+'M'}
function notify(msg,type){const el=$('toast');el.textContent=msg;el.className='toast show '+(type||'');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.className='toast',2400)}
function getSave(){const a=state.saves[sport]||[];return a.find(x=>x.id===state.active[sport])||null}
function teamName(){const s=getSave();return s?s.team:'UNSIGNED'}
function cleanName(n){return String(n||'').replace(/\s+\(\d+\)$/,'')}
function playerPools(pos,era){
 const raw=(window.ERDraftExpandedPools&&window.ERDraftExpandedPools[sport]&&window.ERDraftExpandedPools[sport][pos])||[];
 let list=raw.map(p=>({name:cleanName(p.name),team:p.team||'Free Agent',base:Number(p.base)||74,source:'Player Database'}));
 if(sport==='nba'&&window.ERBasketballEraData&&window.ERBasketballEraData.extras&&window.ERBasketballEraData.extras[pos]){
  window.ERBasketballEraData.extras[pos].forEach(x=>list.push({name:x[0],team:x[1],base:Number(x[2])||80,source:'Historical Archive'}));
 }
 if(era==='alltime'&&LEGENDS[sport]&&LEGENDS[sport][pos]){
  LEGENDS[sport][pos].forEach(x=>list.push({name:x[0],team:x[1],base:x[2],source:'All-Time Legend'}));
 }
 const seen=new Set();list=list.filter(p=>{const k=p.name.toLowerCase();if(seen.has(k))return false;seen.add(k);return true});
 let n=1;while(list.length<100){list.push({name:'ER Prospect '+pos+' '+String(n++).padStart(3,'0'),team:'ERA RIVALS ACADEMY',base:68+Math.floor(rand(0,15)),source:'Generated Prospect'})}
 return list.sort((a,b)=>b.base-a.base);
}
function capFor(){return SPORT[sport].cap}
function salaryFor(ovr){const mult={nba:.42,nfl:.31,soccer:.36,mlb:.34}[sport];return Math.max(.7,Math.round((ovr-55)*mult*10)/10)}
function makePlayer(source,pos,starter,index){
 const overall=Math.max(62,Math.min(99,Math.round(source.base+rand(-3,2))));
 const age=sport==='nba'?Math.floor(rand(20,35)):sport==='nfl'?Math.floor(rand(21,34)):sport==='soccer'?Math.floor(rand(19,34)):Math.floor(rand(21,36));
 return {id:'p-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),name:source.name,team:sport==='soccer'?source.team:source.team,originalTeam:source.team,pos:pos,overall:overall,potential:Math.min(99,overall+(age<25?Math.floor(rand(4,14)):age<29?Math.floor(rand(1,7)):0)),age:age,salary:salaryFor(overall),contractYears:Math.floor(rand(1,5)),morale:Math.floor(rand(66,96)),fatigue:Math.floor(rand(3,24)),careerPoints:source.source==='All-Time Legend'?Math.round(overall*18):0,games:0,awards:[],starter:starter,injured:0,source:source.source||'Player Database'};
}
function makeRoster(era){
 const used=new Set(),roster=[];
 PLAN[sport].forEach((pos,i)=>{
  const options=playerPools(pos,era).filter(p=>!used.has(p.name.toLowerCase()));
  const source=pick(options.slice(0,Math.min(options.length,era==='alltime'?75:95)));
  if(!source)return;used.add(source.name.toLowerCase());
  const count=roster.filter(p=>p.pos===pos).length;
  roster.push(makePlayer(source,pos,count<(STARTERS[sport][pos]||1),i));
 });
 return roster;
}
function teamOvr(s){const a=s.roster.filter(p=>p.starter&&!p.injured);if(!a.length)return 65;return Math.round(a.reduce((n,p)=>n+p.overall,0)/a.length)}
function teamPayroll(s){return s.roster.reduce((n,p)=>n+p.salary,0)}
function teamChem(s){return Math.round(s.chemistry||70)}
function createSave(form){
 const era=form.era||'current',team=form.team||TEAMS[sport][0],manager=form.manager||'Xavier Matos';
 const roster=makeRoster(era);
 const s={id:'save-'+Date.now()+'-'+Math.random().toString(36).slice(2,6),sport:sport,era:era,team:team,manager:manager,season:1,year:era==='alltime'?1998:2026,week:0,record:{w:0,l:0,d:0},roster:roster,chemistry:72,morale:76,fanSupport:65,gmRep:50,gmPoints:0,trainingPoints:4,legacyPoints:0,tactics:{off:TACTICS[sport].off[0],def:TACTICS[sport].def[0],tempo:'Normal',risk:'Balanced',rotation:'Normal',training:SPORT[sport].positions[0]},matchPlan:'Balanced approach',pending:null,offseason:false,feed:['New franchise established. The board expects a competitive season.'],seasonHistory:[],retired:[],standings:{},awards:[],draftClass:[]};
 TEAMS[sport].forEach((t,i)=>s.standings[t]={w:0,l:0,d:0,ovr:68+((i*7+Math.floor(rand(0,12)))%23)});
 s.standings[team]={w:0,l:0,d:0,ovr:teamOvr(s)};
 const arr=state.saves[sport];if(arr.length>=5){notify('All five save slots are full. Delete one first.','bad');return}
 arr.push(s);state.active[sport]=s.id;page='dashboard';persist();render();notify('Dynasty created. You are in charge.');
}
function feed(s,msg){s.feed.unshift('S'+s.season+' · '+msg);s.feed=s.feed.slice(0,18)}
function starters(s){return s.roster.filter(p=>p.starter&&!p.injured)}
function teamPower(s){const a=starters(s);if(!a.length)return 60;const avg=a.reduce((n,p)=>n+p.overall,0)/a.length;const morale=s.roster.reduce((n,p)=>n+p.morale,0)/Math.max(1,s.roster.length);const fatigue=a.reduce((n,p)=>n+p.fatigue,0)/a.length;return avg+(s.chemistry-70)*.075+(morale-70)*.035-(fatigue-20)*.08}
function tacticBonus(s){let b=0;const t=s.tactics;if(t.tempo==='Fast')b+=1.2;if(t.tempo==='Slow')b+=.5;if(t.risk==='Aggressive')b+=1.5;if(t.risk==='Conservative')b-=.5;if(/Pick & Roll|3-Point Heavy|Air Raid|Counter Attack|High Press|Power Hitting/.test(t.off))b+=1.4;if(/Zone Defense|Cover 2|Compact Shape|Strikeout Pitching/.test(t.def))b+=.9;return b}
function opponentPower(s){return Math.max(65,Math.min(97,Math.round(teamPower(s)+rand(-8,8))))}
function segmentScore(sp,diff){
 if(sp==='nba')return Math.max(34,Math.round(51+diff*.36+rand(-8,8)));
 if(sp==='nfl')return Math.max(0,Math.round((10+diff*.20+rand(-4,4))/3)*3);
 if(sp==='soccer'){const chance=Math.max(.08,Math.min(.82,.34+diff*.025));return (Math.random()<chance?1:0)+(Math.random()<chance*.24?1:0)}
 return Math.max(0,Math.round(2+diff*.065+rand(-1.4,1.5)));
}
function matchDecisionOptions(){return TACTICS[sport].decisions}
function beginMatch(){
 const s=getSave();if(!s||s.offseason)return;
 if(s.pending){notify('Finish the current match decision first.','bad');return}
 const opponent=pick(TEAMS[sport].filter(t=>t!==s.team));
 const opp=opponentPower(s),power=teamPower(s)+tacticBonus(s);
 const diff=power-opp;
 s.pending={opponent:opponent,oppOvr:opp,home:segmentScore(sport,diff),away:segmentScore(sport,-diff),stage:'halftime',plan:s.matchPlan,options:matchDecisionOptions(),start:Date.now()};
 feed(s,'Matchday: '+s.team+' vs '+opponent+'. Your first-half decisions are coming up.');
 persist();page='matchday';render();
}
function finishMatch(s,pending,choice){
 const diff=teamPower(s)+tacticBonus(s)+choice[2]+choice[3]*.6-pending.oppOvr;
 let home=pending.home+segmentScore(sport,diff),away=pending.away+segmentScore(sport,-diff);
 if(sport!=='soccer'&&home===away){if(Math.random()<.5)home+=sport==='nfl'?3:1;else away+=sport==='nfl'?3:1}
 const win=home>away,draw=home===away;
 if(win)s.record.w++;else if(draw)s.record.d++;else s.record.l++;
 s.week++;
 const active=starters(s),mvp=active.sort((a,b)=>(b.overall+rand(0,8))-(a.overall+rand(0,8)))[0];
 s.roster.forEach(p=>{
  p.games+=1;
  if(p.starter){p.fatigue=Math.min(100,p.fatigue+Math.floor(rand(6,13))+(choice[4]||0)*.18);p.morale=Math.max(30,Math.min(100,p.morale+(win?3:draw?1:-3)))}
  else{p.fatigue=Math.max(0,p.fatigue-Math.floor(rand(3,7)));p.morale=Math.max(30,Math.min(100,p.morale+(win?1:draw?0:-1)))}
  p.careerPoints+=win?9:4;
 });
 if(mvp){mvp.careerPoints+=win?22:10;if(win&&mvp.overall>=90&&Math.random()<.35){mvp.awards.push('Player of the Match');mvp.careerPoints+=35}}
 s.chemistry=Math.max(35,Math.min(99,s.chemistry+(win?2:draw?1:-1)));
 s.morale=Math.max(30,Math.min(100,s.morale+(win?3:draw?1:-3)));
 s.fanSupport=Math.max(15,Math.min(100,s.fanSupport+(win?2:draw?0:-2)));
 s.gmRep=Math.max(0,Math.min(100,s.gmRep+(win?1:draw?0:-1)));
 s.gmPoints+=win?30:draw?15:8;s.legacyPoints+=win?18:draw?8:4;
 if(mvp)s.trainingPoints+=win?1:0;
 const injured=s.roster.find(p=>p.starter&&!p.injured&&p.fatigue>72&&Math.random()<.035);
 if(injured){injured.injured=1+Math.floor(rand(1,4));injured.starter=false;feed(s,injured.name+' picked up an injury. They are out for '+injured.injured+' games.')}
 const result=win?'WIN':draw?'DRAW':'LOSS';
 feed(s,result+' '+home+'-'+away+' vs '+pending.opponent+'. '+(mvp?mvp.name+' led the team.':'Team effort.')+' Decision: '+choice[0]+'.');
 const row=s.standings[s.team];row.w=s.record.w;row.l=s.record.l;row.d=s.record.d;row.ovr=teamOvr(s);
 TEAMS[sport].filter(t=>t!==s.team).slice(0,5).forEach(t=>{const r=s.standings[t];if(Math.random()<.55)r.w++;else r.l++});
 s.pending=null;
 if(s.week>=SPORT[sport].games)completeSeason(s);
 persist();render();
 notify(result+' · '+home+'-'+away);
}
function completeSeason(s){
 const gp=Math.max(1,s.record.w+s.record.l+s.record.d),rate=s.record.w/gp;
 let title=false,awards=[];
 if(rate>=.65&&Math.random()<.76){title=true;s.legacyPoints+=1500;s.gmPoints+=300;awards.push('LEAGUE CHAMPIONS');}
 const star=s.roster.slice().sort((a,b)=>b.careerPoints-a.careerPoints)[0];
 if(star&&star.overall>=86&&rate>=.55){star.awards.push('League MVP');star.careerPoints+=500;awards.push(star.name+' · MVP');}
 s.seasonHistory.unshift({season:s.season,year:s.year,record:s.record.w+'-'+s.record.l+(s.record.d?'-'+s.record.d:''),title:title,awards:awards});
 feed(s,'Season '+s.season+' complete: '+s.record.w+'-'+s.record.l+(s.record.d?'-'+s.record.d:'')+'. '+(title?'CHAMPIONS! ':'')+awards.join(' · '));
 s.offseason=true;s.pending=null;
 s.roster.forEach(p=>{p.age++;p.contractYears=Math.max(0,p.contractYears-1);p.fatigue=Math.max(0,p.fatigue-30);if(p.age>=39&&Math.random()<.45){p.retired=true;s.retired.push(p);feed(s,p.name+' announced retirement.')}});
 s.roster=s.roster.filter(p=>!p.retired);
}
function advanceSeason(){
 const s=getSave();if(!s||!s.offseason)return;
 s.season++;s.year++;s.week=0;s.record={w:0,l:0,d:0};s.offseason=false;s.trainingPoints+=3;s.chemistry=Math.min(99,s.chemistry+4);
 s.roster.forEach(p=>{if(p.potential>p.overall&&p.age<30&&Math.random()<.65)p.overall=Math.min(p.potential,p.overall+1);if(p.contractYears===0){p.morale=Math.max(35,p.morale-10)}});
 Object.keys(s.standings).forEach(t=>s.standings[t]={w:0,l:0,d:0,ovr:t===s.team?teamOvr(s):s.standings[t].ovr});
 s.standings[s.team].ovr=teamOvr(s);
 feed(s,'Season '+s.season+' begins. Review contracts, refresh the roster and set your strategy.');
 persist();render();notify('New season started.');
}
function simAuto(s){
 const opp=opponentPower(s),diff=teamPower(s)+tacticBonus(s)-opp;
 let a=segmentScore(sport,diff)+segmentScore(sport,diff),b=segmentScore(sport,-diff)+segmentScore(sport,-diff);
 if(sport!=='soccer'&&a===b){if(Math.random()<.5)a++;else b++}
 const win=a>b,draw=a===b;if(win)s.record.w++;else if(draw)s.record.d++;else s.record.l++;
 s.week++;s.roster.forEach(p=>{p.games++;if(p.starter){p.fatigue=Math.min(100,p.fatigue+5);p.morale=Math.max(30,Math.min(100,p.morale+(win?2:-2)))}else p.fatigue=Math.max(0,p.fatigue-3);p.careerPoints+=win?6:3});
 s.chemistry=Math.max(35,Math.min(99,s.chemistry+(win?1:-.5)));s.gmPoints+=win?20:5;s.legacyPoints+=win?12:3;
 const row=s.standings[s.team];row.w=s.record.w;row.l=s.record.l;row.d=s.record.d;row.ovr=teamOvr(s);
 if(s.week>=SPORT[sport].games)completeSeason(s);
}
function simFive(){const s=getSave();if(!s||s.offseason)return;for(let i=0;i<5&&s.week<SPORT[sport].games;i++)simAuto(s);feed(s,'Front office simulated up to five fixtures using your current tactics.');persist();render();notify('Five-game simulation complete.')}
function simRest(){const s=getSave();if(!s||s.offseason)return;const n=SPORT[sport].games-s.week;for(let i=0;i<n;i++){simAuto(s);if(s.offseason)break}feed(s,'The remaining schedule was simulated by your current strategy.');persist();render();notify('Season simulation complete.')}
function trainTeam(){
 const s=getSave();if(!s||s.trainingPoints<1){notify('You need a training point.','bad');return}
 const focus=s.tactics.training;let improved=0;
 s.roster.forEach(p=>{if(p.pos===focus&&p.age<31&&p.overall<p.potential){p.overall++;improved++}if(p.pos===focus)p.fatigue=Math.min(100,p.fatigue+5)});
 s.trainingPoints--;s.chemistry=Math.min(99,s.chemistry+1);feed(s,'Training camp focused on '+focus+'. '+improved+' player ratings improved.');
 persist();render();notify(improved+' players improved.');
}
function toggleStarter(id){
 const s=getSave();if(!s)return;const p=s.roster.find(x=>x.id===id);if(!p)return;
 const other=s.roster.find(x=>x.pos===p.pos&&x.starter&&!x.injured);
 if(p.starter){p.starter=false}else{if(other)other.starter=false;p.starter=true;p.injured=0}
 persist();render();
}
function retirePlayer(id){
 const s=getSave();if(!s)return;const p=s.roster.find(x=>x.id===id);if(!p)return;
 p.retired=true;s.retired.push(p);s.roster=s.roster.filter(x=>x.id!==id);feed(s,p.name+' retired after '+p.games+' games. Career legacy: '+p.careerPoints+' points.');
 persist();render();notify(p.name+' retired.');
}
function releasePlayer(id){
 const s=getSave();if(!s)return;const p=s.roster.find(x=>x.id===id);if(!p)return;
 s.roster=s.roster.filter(x=>x.id!==id);feed(s,'Released '+p.name+'. Payroll cleared: '+money(p.salary)+'.');persist();render();notify('Player released.');
}
function renewPlayer(id){
 const s=getSave();if(!s)return;const p=s.roster.find(x=>x.id===id);if(!p)return;
 const next=p.salary*1.14;if(teamPayroll(s)-p.salary+next>capFor()){notify('Not enough salary cap room for this extension.','bad');return}
 p.salary=Math.round(next*10)/10;p.contractYears=3;p.morale=Math.min(100,p.morale+6);feed(s,'Extended '+p.name+' for three seasons at '+money(p.salary)+' per year.');persist();render();notify('Contract extension signed.');
}
function signFromPool(name,pos,kind){
 const s=getSave();if(!s)return;const exists=s.roster.some(p=>p.name===name);if(exists){notify('That player is already on your roster.','bad');return}
 const source=playerPools(pos,s.era).find(p=>p.name===name);if(!source)return;
 const p=makePlayer(source,pos,false,0);p.salary=Math.max(.7,Math.round(p.salary*.82*10)/10);p.contractYears=kind==='draft'?4:2;p.potential=Math.min(99,Math.max(p.potential,p.overall+(kind==='draft'?10:5)));
 if(teamPayroll(s)+p.salary>capFor()){notify('Over the salary cap. Release or trade a player first.','bad');return}
 s.roster.push(p);if(kind==='draft')s.draftClass.push(p.name);feed(s,(kind==='draft'?'Drafted ':'Signed free agent ')+p.name+' ('+pos+').');persist();render();notify(p.name+' added to the roster.');
}
function tradePlayers(){
 const s=getSave();if(!s)return;const a=$('tradeOutgoing')?.value,b=$('tradeIncoming')?.value;
 const out=s.roster.find(p=>p.id===a);if(!out||!b){notify('Choose a player to trade.','bad');return}
 const source=playerPools(out.pos,s.era).find(p=>p.name===b);if(!source){notify('Trade target unavailable.','bad');return}
 const incoming=makePlayer(source,out.pos,false,0);
 const payroll=teamPayroll(s)-out.salary+incoming.salary;
 if(payroll>capFor()){notify('Trade would put the team over the cap.','bad');return}
 s.roster=s.roster.filter(p=>p.id!==out.id);s.roster.push(incoming);feed(s,'Traded '+out.name+' for '+incoming.name+'.');persist();render();notify('Trade completed.');
}
function createProspect(){
 const s=getSave();if(!s)return;const name=$('customName')?.value.trim(),pos=$('customPos')?.value,ovr=Number($('customOvr')?.value||72);
 if(!name){notify('Enter a player name first.','bad');return}
 const p={id:'custom-'+Date.now(),name:name,team:s.team,originalTeam:s.team,pos:pos,overall:Math.max(55,Math.min(95,ovr)),potential:Math.min(99,Math.max(ovr+10,90)),age:19,salary:salaryFor(ovr),contractYears:4,morale:82,fatigue:0,careerPoints:0,games:0,awards:[],starter:false,injured:0,source:'Created Prospect'};
 s.roster.push(p);feed(s,'Signed created prospect '+name+' at '+pos+'.');persist();render();notify(name+' joined the squad.');
}
function renderTop(){
 $('sportTabs').innerHTML=Object.keys(SPORT).map(sp=>'<button class="sport-tab '+(sp===sport?'active':'')+'" data-sport="'+sp+'">'+SPORT[sp].emoji+' '+SPORT[sp].name+'</button>').join('');
 const s=getSave();
 $('topMeta').innerHTML=s?'<span class="top-era '+s.era+'">'+(s.era==='alltime'?'ALL-TIME ERA':'CURRENT ERA')+'</span><span class="top-team">'+esc(s.team)+'</span>':'<span class="top-era">NEW DYNASTY</span>';
 $('slotTools').innerHTML=s?'<select id="slotSelect" aria-label="Career save slot">'+state.saves[sport].map((x,i)=>'<option value="'+x.id+'" '+(x.id===s.id?'selected':'')+'>SAVE '+(i+1)+' · '+esc(x.team)+'</option>').join('')+'</select><button class="top-new" data-action="new-save">+ NEW SAVE</button>':'';
}
function navHtml(){
 const tabs=[['dashboard','◈','DASHBOARD'],['roster','▦','ROSTER'],['tactics','⌁','TACTICS'],['matchday','◎','MATCHDAY'],['transactions','⇄','TRANSACTIONS'],['scouting','⌕','SCOUTING & DRAFT'],['standings','▤','STANDINGS'],['legacy','♛','HALL OF FAME']];
 return tabs.map(t=>'<button class="nav-item '+(page===t[0]?'active':'')+'" data-page="'+t[0]+'"><span>'+t[1]+'</span>'+t[2]+'</button>').join('');
}
function stat(label,value,sub){return '<div class="stat-card"><span>'+label+'</span><strong>'+value+'</strong><small>'+sub+'</small></div>'}
function renderSetup(){
 return '<section class="setup-hero"><div class="eyebrow">ERA RIVALS · FRONT OFFICE SIMULATOR</div><h1>YOU CALL<br><em>THE SHOTS.</em></h1><p>No controller skills. No running around the field. Build the roster, set the tactics, make the calls and watch your decisions shape the season.</p><div class="setup-card"><div class="setup-head"><span class="eyebrow">START A NEW DYNASTY</span><b>01 / FRANCHISE SETUP</b></div><div class="setup-grid"><label>GENERAL MANAGER<input id="setupManager" value="Xavier Matos" maxlength="28"></label><label>CHOOSE YOUR TEAM<select id="setupTeam">'+TEAMS[sport].map(t=>'<option>'+esc(t)+'</option>').join('')+'</select></label><label>PLAYER ERA<select id="setupEra"><option value="current">CURRENT PLAYERS · TURQUOISE</option><option value="alltime">ALL-TIME LEGENDS · GOLD</option></select></label><label>DIFFICULTY<select id="setupDifficulty"><option value="normal">FRONT OFFICE · NORMAL</option><option value="hard">CHAMPIONSHIP CHALLENGE</option></select></label></div><div class="era-explain"><span class="era-dot"></span><div><b>CURRENT</b><small>Build around the modern player pool.</small></div><span class="era-dot gold"></span><div><b>ALL-TIME</b><small>Draft legends from every generation.</small></div></div><button class="btn primary large" data-action="create-save">START DYNASTY ↗</button><p class="fineprint">Five save slots per sport · Automatic local saves · All ratings are ERA RIVALS game estimates.</p></div><div class="setup-slots"><h3>YOUR SAVES</h3>'+(state.saves[sport].length?state.saves[sport].map((x,i)=>'<div class="saved-line"><span>SAVE '+(i+1)+'</span><b>'+esc(x.team)+'</b><small>'+x.era.toUpperCase()+' · SEASON '+x.season+'</small><button data-load="'+x.id+'">LOAD</button></div>').join(''):'<div class="empty-state">No dynasty yet. Your front office is waiting.</div>')+'</div></section>';
}
function renderDashboard(s){
 const ovr=teamOvr(s),pay=teamPayroll(s),pct=s.week?Math.round(s.record.w/s.week*100):0,next=TEAMS[sport].filter(t=>t!==s.team)[(s.week*3+2)% (TEAMS[sport].length-1)];
 return '<section class="welcome-panel"><div><div class="eyebrow">'+SPORT[sport].emoji+' '+SPORT[sport].name+' · SEASON '+s.season+' / '+s.year+'</div><h1>'+esc(s.team)+'<br><em>FRONT OFFICE.</em></h1><p>General Manager: '+esc(s.manager)+' · '+s.era.toUpperCase()+' PLAYER ERA</p></div><div class="team-grade"><b>'+ovr+'</b><small>TEAM OVR</small></div></section>'+
 '<div class="stats-grid">'+stat('RECORD',s.record.w+'-'+s.record.l+(s.record.d?'-'+s.record.d:''),s.week+' / '+SPORT[sport].games+' games played')+stat('TEAM OVR',ovr,'Starting lineup strength')+stat('PAYROLL',money(pay),money(capFor())+' salary cap')+stat('GM LEGACY',s.gmPoints.toLocaleString(),'Career management points')+'</div>'+
 (s.offseason?'<div class="offseason-banner"><b>OFFSEASON UNLOCKED</b><span>Review contracts, draft prospects and prepare for the next season.</span><button class="btn primary" data-action="advance-season">START SEASON '+(s.season+1)+' →</button></div>':'')+
 '<div class="dashboard-grid"><section class="panel next-match"><div class="panel-top"><div><span class="eyebrow">NEXT MATCHDAY</span><h2>'+(s.offseason?'OFFSEASON':'GAME '+(s.week+1)+' / '+SPORT[sport].games)+'</h2></div><span class="status-pill">'+(s.offseason?'BREAK':'UP NEXT')+'</span></div><div class="matchup"><div><small>YOUR TEAM</small><b>'+esc(s.team)+'</b><strong>'+ovr+'</strong></div><span class="vs">VS</span><div><small>OPPOSITION</small><b>'+esc(next)+'</b><strong>—</strong></div></div><p class="muted">Your tactics, starters, chemistry and player fatigue affect the result. Make your decisions before the simulation.</p><div class="button-row"><button class="btn primary" data-page="matchday" '+(s.offseason?'disabled':'')+'>PREPARE MATCH ↗</button><button class="btn ghost" data-page="tactics">SET GAMEPLAN</button></div></section><section class="panel club-health"><span class="eyebrow">FRANCHISE HEALTH</span><h2>THE BOARDROOM</h2>'+meter('TEAM CHEMISTRY',s.chemistry)+meter('TEAM MORALE',s.morale)+meter('FAN SUPPORT',s.fanSupport)+meter('GM APPROVAL',s.gmRep)+'<div class="health-foot">Training points: <b>'+s.trainingPoints+'</b> · Retired legends: <b>'+s.retired.length+'</b></div></section></div>'+
 '<div class="dashboard-grid"><section class="panel"><div class="panel-top"><div><span class="eyebrow">RECENT NEWS</span><h2>LEAGUE FEED</h2></div><button class="text-btn" data-page="standings">VIEW TABLE ↗</button></div><div class="feed-list">'+s.feed.slice(0,7).map(x=>'<div class="feed-row"><span class="feed-dot"></span><p>'+esc(x)+'</p></div>').join('')+'</div></section><section class="panel quick-actions"><span class="eyebrow">YOUR NEXT DECISIONS</span><h2>RUN THE TEAM.</h2><button data-page="roster">01 · Set your starting lineup <b>→</b></button><button data-page="transactions">02 · Sign, trade or release players <b>→</b></button><button data-page="scouting">03 · Scout the next generation <b>→</b></button><button data-page="tactics">04 · Choose your tactics <b>→</b></button></section></div>';
}
function meter(label,v){return '<div class="meter"><div><span>'+label+'</span><b>'+Math.round(v)+'/100</b></div><i><em style="width:'+Math.max(0,Math.min(100,v))+'%"></em></i></div>'}
function renderRoster(s){
 const list=s.roster.filter(p=>rosterFilter==='ALL'||p.pos===rosterFilter);
 return '<div class="page-heading"><div><span class="eyebrow">SQUAD MANAGEMENT</span><h1>THE ROSTER.</h1><p>Choose your starters, protect your depth and manage every contract.</p></div><button class="btn primary" data-action="show-create-player">+ CREATE PROSPECT</button></div><div class="roster-summary">'+stat('PLAYERS',s.roster.length,'Squad size')+stat('STARTERS',starters(s).length,'Active lineup')+stat('PAYROLL',money(teamPayroll(s)),'Annual salary')+stat('CAP SPACE',money(capFor()-teamPayroll(s)),'Available budget')+'</div><div class="filter-row"><button class="filter '+(rosterFilter==='ALL'?'active':'')+'" data-filter="ALL">ALL PLAYERS</button>'+SPORT[sport].positions.map(p=>'<button class="filter '+(rosterFilter===p?'active':'')+'" data-filter="'+p+'">'+p+'</button>').join('')+'</div><div class="roster-list">'+list.map(p=>'<div class="player-row '+(p.starter?'is-starter':'')+'"><div class="player-pos">'+p.pos+'</div><div class="player-main"><b>'+esc(p.name)+'</b><small>'+p.age+' YRS · '+p.contractYears+' YR CONTRACT · '+(p.injured?'INJURED':'FIT')+'</small></div><div class="player-rating"><b>'+p.overall+'</b><small>OVR</small></div><div class="player-meta"><span>'+money(p.salary)+'</span><small>'+p.source+'</small></div><div class="player-bars"><span>MORALE '+p.morale+'%</span><i><em style="width:'+p.morale+'%"></em></i><span>FATIGUE '+p.fatigue+'%</span><i><em class="fatigue" style="width:'+p.fatigue+'%"></em></i></div><div class="player-actions"><button data-action="toggle-starter" data-id="'+p.id+'">'+(p.starter?'BENCH':'START')+'</button><button data-action="renew" data-id="'+p.id+'">EXTEND</button><button data-action="retire" data-id="'+p.id+'">RETIRE</button><button class="danger-text" data-action="release" data-id="'+p.id+'">RELEASE</button></div></div>').join('')+'</div><div id="createPlayerPanel" class="panel create-player" hidden><div class="panel-top"><h2>CREATE A PROSPECT</h2><button class="text-btn" data-action="hide-create-player">CLOSE ✕</button></div><div class="setup-grid"><label>PLAYER NAME<input id="customName" placeholder="Xavier Matos"></label><label>POSITION<select id="customPos">'+SPORT[sport].positions.map(p=>'<option>'+p+'</option>').join('')+'</select></label><label>STARTING OVR<input id="customOvr" type="number" min="55" max="95" value="72"></label></div><button class="btn primary" data-action="create-player">ADD PLAYER TO ROSTER</button></div>';
}
function renderTactics(s){
 const t=s.tactics;
 return '<div class="page-heading"><div><span class="eyebrow">COACHING STAFF / STRATEGY ROOM</span><h1>SET THE PLAN.</h1><p>Your tactics change how the simulated team performs. There are no movement controls.</p></div><span class="status-pill">GAMEPLAN SAVED</span></div><div class="tactics-grid"><section class="panel"><span class="eyebrow">OFFENSIVE IDENTITY</span><h2>HOW DO WE ATTACK?</h2><div class="choice-grid">'+TACTICS[sport].off.map(x=>'<button class="choice '+(t.off===x?'selected':'')+'" data-tactic="off" data-value="'+esc(x)+'"><b>'+esc(x)+'</b><small>'+offDesc(x)+'</small></button>').join('')+'</div></section><section class="panel"><span class="eyebrow">DEFENSIVE IDENTITY</span><h2>HOW DO WE STOP THEM?</h2><div class="choice-grid">'+TACTICS[sport].def.map(x=>'<button class="choice '+(t.def===x?'selected':'')+'" data-tactic="def" data-value="'+esc(x)+'"><b>'+esc(x)+'</b><small>'+defDesc(x)+'</small></button>').join('')+'</div></section><section class="panel"><span class="eyebrow">GAME MANAGEMENT</span><h2>CONTROL THE TEMPO.</h2><label class="field">PACE<select id="tempoSelect">'+TACTICS[sport].tempo.map(x=>'<option '+(t.tempo===x?'selected':'')+'>'+x+'</option>').join('')+'</select></label><label class="field">RISK LEVEL<select id="riskSelect">'+TACTICS[sport].risk.map(x=>'<option '+(t.risk===x?'selected':'')+'>'+x+'</option>').join('')+'</select></label><label class="field">ROTATION<select id="rotationSelect">'+['Short Rotation','Normal','Deep Rotation'].map(x=>'<option '+(t.rotation===x?'selected':'')+'>'+x+'</option>').join('')+'</select></label></section><section class="panel"><span class="eyebrow">PLAYER DEVELOPMENT</span><h2>TRAINING FOCUS.</h2><label class="field">POSITION TO DEVELOP<select id="trainingSelect">'+SPORT[sport].positions.map(x=>'<option '+(t.training===x?'selected':'')+'>'+x+'</option>').join('')+'</select></label><div class="training-box"><b>'+s.trainingPoints+' TRAINING POINTS</b><p>Spend one point to improve every young player at your selected position who still has potential. Training increases fatigue slightly.</p><button class="btn primary" data-action="train-team" '+(s.trainingPoints<1?'disabled':'')+'>RUN TRAINING CAMP</button></div></section></div>';
}
function offDesc(x){const d={'Balanced':'Mix the options and stay unpredictable.','Pick & Roll':'Create space with screens and ball movement.','3-Point Heavy':'Generate more shots from deep.','Inside Game':'Attack the paint and use size.','Motion Offense':'Constant movement and passing.','Air Raid':'Spread the field and throw often.','Ground & Pound':'Control the clock with the run game.','Play Action':'Use the run threat to open passing lanes.','West Coast':'Short, accurate passes and timing.','Possession':'Keep the ball and control the match.','Counter Attack':'Break quickly when the opponent loses shape.','Wing Play':'Stretch the defense out wide.','High Press':'Win the ball high up the pitch.','Direct Football':'Move forward quickly.','Small Ball':'Bunts, steals and smart baserunning.','Power Hitting':'Hunt for extra-base hits.','Contact Hitting':'Put the ball in play.','Aggressive Baserunning':'Take extra bases and pressure defenders.'};return d[x]||'Choose this approach to shape your team.'}
function defDesc(x){const d={'Man-to-Man':'Stay attached to your matchup.','Zone Defense':'Protect areas and close passing lanes.','Switch Everything':'Switch assignments on screens.','Protect the Paint':'Make inside scoring difficult.','Full-Court Press':'Pressure the ball from end to end.','Cover 2':'Keep two safeties deep.','Man Blitz':'Send pressure and challenge the quarterback.','Zone Blitz':'Disguise pressure and coverage.','Stop the Run':'Commit bodies to the line.','Prevent Defense':'Protect against the big play.','Low Block':'Stay compact near your own goal.','Counter Press':'Win the ball back immediately.','Compact Shape':'Keep the lines close together.','Man Marking':'Follow dangerous opponents.','Pitch to Contact':'Let the defense make plays.','Strikeout Pitching':'Attack hitters with strikeout pitches.','Infield Shift':'Position defenders for likely contact.','Outfield Deep':'Protect against extra-base hits.','Infield In':'Play closer to home plate.'};return d[x]||'Choose this approach to shape your team.'}
function renderMatchday(s){
 if(s.pending){
  const p=s.pending;
  return '<div class="page-heading"><div><span class="eyebrow">MATCHDAY / HALFTIME DECISION</span><h1>YOUR CALL.</h1><p>The first half is over. The next decision is yours.</p></div><span class="status-pill live">DECISION REQUIRED</span></div><section class="panel halftime"><div class="halftime-title"><span>'+esc(s.team)+'</span><b>'+p.home+' : '+p.away+'</b><span>'+esc(p.opponent)+'</span></div><div class="eyebrow">HALFTIME · '+p.plan+'</div><h2>WHAT'S THE ADJUSTMENT?</h2><p class="muted">Your decision changes the second-half simulation. Choose carefully: aggressive calls can win games, but they can also cost energy.</p><div class="decision-grid">'+p.options.map((o,i)=>'<button class="decision-card" data-decision="'+i+'"><span>OPTION 0'+(i+1)+'</span><b>'+o[0]+'</b><small>'+o[1]+'</small><em>SELECT THIS DECISION →</em></button>').join('')+'</div></section>';
 }
 const opp=TEAMS[sport].filter(t=>t!==s.team)[(s.week*3+2)%(TEAMS[sport].length-1)];
 return '<div class="page-heading"><div><span class="eyebrow">MATCHDAY / GAME PREPARATION</span><h1>THE NEXT GAME.</h1><p>Set your plan, then let the simulation decide how it plays out.</p></div><span class="status-pill">'+(s.week+1)+' / '+SPORT[sport].games+'</span></div><section class="panel match-preview"><div class="matchup large"><div><small>HOME</small><b>'+esc(s.team)+'</b><strong>'+teamOvr(s)+'</strong></div><span class="vs">VS</span><div><small>AWAY</small><b>'+esc(opp)+'</b><strong>SCOUTING: '+Math.round(teamOvr(s)+rand(-7,7))+'</strong></div></div><div class="pre-match-grid"><label class="field">MATCH PLAN<select id="matchPlan">'+['Balanced approach','Attack from the start','Protect the lead','Play through your best player','Exploit the wings / weak side','Control possession'].map(x=>'<option '+(s.matchPlan===x?'selected':'')+'>'+x+'</option>').join('')+'</select></label><div class="match-note"><b>YOUR GAMEPLAN</b><span>'+esc(s.tactics.off)+' · '+esc(s.tactics.def)+' · '+esc(s.tactics.tempo)+' tempo</span></div></div><div class="button-row"><button class="btn primary large" data-action="start-match" '+(s.offseason?'disabled':'')+'>START MATCH SIMULATION ↗</button><button class="btn ghost" data-page="roster">CHECK LINEUP</button><button class="btn ghost" data-page="tactics">CHANGE TACTICS</button></div></section><section class="panel"><span class="eyebrow">MATCHDAY RULES</span><h2>YOU ARE THE MANAGER.</h2><div class="rules-grid"><div><b>01 · PREPARE</b><p>Set your lineup, tactics, pace and risk level.</p></div><div><b>02 · RESPOND</b><p>At halftime, choose a tactical adjustment based on the match.</p></div><div><b>03 · SIMULATE</b><p>Your roster quality, chemistry, morale and decisions determine the result.</p></div></div></section>';
}
function renderTransactions(s){
 const available=playerPools(SPORT[sport].positions[0],s.era);
 const pos=SPORT[sport].positions[0],free=playerPools(pos,s.era).filter(p=>!s.roster.some(x=>x.name===p.name)).slice(0,8);
 const outgoing=s.roster[0]||null;
 return '<div class="page-heading"><div><span class="eyebrow">FRONT OFFICE / PLAYER MOVEMENT</span><h1>MAKE THE MOVE.</h1><p>Sign free agents, negotiate extensions and trade for a better fit.</p></div></div><div class="transaction-grid"><section class="panel"><span class="eyebrow">FREE AGENT MARKET</span><h2>AVAILABLE PLAYERS.</h2><label class="field">POSITION<select id="faPosition">'+SPORT[sport].positions.map(p=>'<option>'+p+'</option>').join('')+'</select></label><div id="freeAgentList">'+renderFreeAgents(s,pos)+'</div></section><section class="panel"><span class="eyebrow">TRADE CENTER</span><h2>TRADE BLOCK.</h2><label class="field">PLAYER TO MOVE<select id="tradeOutgoing">'+s.roster.map(p=>'<option value="'+p.id+'">'+esc(p.pos+' · '+p.name+' · '+p.overall+' OVR')+'</option>').join('')+'</select></label><label class="field">TRADE TARGET<select id="tradeIncoming">'+(outgoing?playerPools(outgoing.pos,s.era).filter(p=>!s.roster.some(x=>x.name===p.name)).slice(0,30).map(p=>'<option>'+esc(p.name)+'</option>').join(''):'')+'</select></label><button class="btn primary" data-action="trade">PROPOSE PLAYER SWAP</button><p class="fineprint">Trades swap players at the same position. Salary cap rules still apply.</p></section></div><section class="panel"><span class="eyebrow">CONTRACT WATCH</span><h2>WHO NEEDS A NEW DEAL?</h2><div class="contract-list">'+s.roster.filter(p=>p.contractYears<=1).slice(0,8).map(p=>'<div><b>'+esc(p.name)+'</b><small>'+p.pos+' · '+p.contractYears+' years left · '+money(p.salary)+'</small><button data-action="renew" data-id="'+p.id+'">EXTEND</button></div>').join('')||'<div class="empty-state">No urgent contract decisions.</div>'+'</div></section>';
}
function renderFreeAgents(s,pos){
 return playerPools(pos,s.era).filter(p=>!s.roster.some(x=>x.name===p.name)).slice(0,8).map(p=>'<div class="market-row"><div><b>'+esc(p.name)+'</b><small>'+pos+' · '+esc(p.team)+' · '+p.base+' OVR</small></div><button data-sign="'+esc(p.name)+'" data-pos="'+pos+'">SIGN</button></div>').join('')||'<div class="empty-state">No players available at this position.</div>';
}
function renderScouting(s){
 const pos=SPORT[sport].positions[0],prospects=playerPools(pos,s.era).filter(p=>!s.roster.some(x=>x.name===p.name)).slice(0,12);
 return '<div class="page-heading"><div><span class="eyebrow">SCOUTING DEPARTMENT / DRAFT ROOM</span><h1>FIND THE NEXT STAR.</h1><p>Scout prospects by position. Draft for talent, potential and long-term value.</p></div><span class="status-pill">'+s.era.toUpperCase()+' POOL</span></div><section class="panel"><label class="field">SCOUT POSITION<select id="scoutPosition">'+SPORT[sport].positions.map(p=>'<option>'+p+'</option>').join('')+'</select></label><div id="prospectList">'+renderProspects(s,pos)+'</div></section><section class="panel"><span class="eyebrow">DRAFT CLASS</span><h2>YOUR RECENT PICKS.</h2>'+(s.draftClass.length?s.draftClass.slice(-8).reverse().map(x=>'<div class="feed-row"><span class="feed-dot"></span><p>'+esc(x)+'</p></div>').join(''):'<div class="empty-state">No prospects drafted yet.</div>')+'</section>';
}
function renderProspects(s,pos){return playerPools(pos,s.era).filter(p=>!s.roster.some(x=>x.name===p.name)).slice(0,12).map((p,i)=>'<div class="market-row"><div><b>'+esc(p.name)+'</b><small>'+pos+' · '+esc(p.team)+' · '+p.base+' OVR · '+p.source+'</small></div><button data-draft="'+esc(p.name)+'" data-pos="'+pos+'">DRAFT</button></div>').join('')}
function renderStandings(s){
 const rows=Object.entries(s.standings).map(([team,r])=>({team:team,w:r.w,l:r.l,d:r.d,ovr:r.ovr})).sort((a,b)=>(b.w-a.w)||(a.l-b.l));
 return '<div class="page-heading"><div><span class="eyebrow">LEAGUE OFFICE / SEASON '+s.season+'</span><h1>THE STANDINGS.</h1><p>Every result moves the table. Your decisions shape the race.</p></div></div><section class="panel"><div class="table-head"><span>TEAM</span><span>W</span><span>L</span><span>D</span><span>OVR</span></div>'+rows.map((r,i)=>'<div class="standing-row '+(r.team===s.team?'user-team':'')+'"><b class="rank">'+(i+1)+'</b><span>'+esc(r.team)+(r.team===s.team?' <small>YOUR TEAM</small>':'')+'</span><b>'+r.w+'</b><b>'+r.l+'</b><b>'+r.d+'</b><b>'+r.ovr+'</b></div>').join('')+'</section><div class="button-row"><button class="btn primary" data-action="sim-five" '+(s.offseason?'disabled':'')+'>SIMULATE 5 GAMES</button><button class="btn ghost" data-action="sim-rest" '+(s.offseason?'disabled':'')+'>SIMULATE REST OF SEASON</button></div>';
}
function hallEntries(s,pos){
 const list=(LEGENDS[sport][pos]||[]).map(x=>({name:x[0],team:x[1],score:x[2]*18+450,real:true}));
 s.roster.filter(p=>p.pos===pos).forEach(p=>list.push({name:p.name,team:s.team,score:p.careerPoints+(p.overall*7),ovr:p.overall,career:true}));
 s.retired.filter(p=>p.pos===pos).forEach(p=>list.push({name:p.name,team:s.team,score:p.careerPoints+(p.overall*7),ovr:p.overall,retired:true}));
 return list.sort((a,b)=>b.score-a.score);
}
function renderLegacy(s){
 const pos=hofPosition&&SPORT[sport].positions.includes(hofPosition)?hofPosition:SPORT[sport].positions[0];hofPosition=pos;
 const list=hallEntries(s,pos);
 return '<div class="page-heading"><div><span class="eyebrow">LEGACY ROOM / POSITION VS POSITION</span><h1>THE HALL OF FAME.</h1><p>Your players rank against legends at the exact same position. A QB never competes against a WR.</p></div></div><section class="panel"><label class="field">POSITION LEADERBOARD<select id="hofPosition">'+SPORT[sport].positions.map(p=>'<option '+(p===pos?'selected':'')+'>'+p+'</option>').join('')+'</select></label><div class="hof-list">'+list.map((p,i)=>'<div class="hof-row '+(p.career?'your-player':'')+'"><b class="hof-rank">'+(i===0?'🥇':i===1?'🥈':i===2?'🥉':'#'+(i+1))+'</b><div class="hof-avatar">'+esc(p.name.split(' ').map(x=>x[0]).slice(0,2).join(''))+'</div><div><b>'+esc(p.name)+(p.career?' <em>YOUR PLAYER</em>':'')+'</b><small>'+esc(p.team)+' · '+(p.retired?'RETIRED':p.real?'ALL-TIME LEGEND':'ACTIVE')+'</small></div><strong>'+p.score.toLocaleString()+'<small>LEGACY PTS</small></strong></div>').join('')}</div></section><section class="panel"><span class="eyebrow">YOUR FRANCHISE LEGACY</span><h2>'+s.legacyPoints.toLocaleString()+' TEAM LEGACY POINTS</h2><p class="muted">GM points: '+s.gmPoints.toLocaleString()+' · Championships: '+s.seasonHistory.filter(x=>x.title).length+' · Retired players: '+s.retired.length+'</p>'+(s.retired.length?s.retired.map(p=>'<div class="market-row"><div><b>'+esc(p.name)+'</b><small>'+p.pos+' · '+p.careerPoints+' player legacy points</small></div><span class="badge">RETIRED</span></div>').join(''):'<div class="empty-state">Your first legend has not retired yet.</div>')+'</section>';
}
function render(){
 renderTop();
 const s=getSave();
 $('sidebar').innerHTML=s?'<div class="side-label">FRONT OFFICE</div>'+navHtml()+'<div class="sidebar-bottom"><b>'+esc(s.manager)+'</b><small>GENERAL MANAGER · '+s.gmPoints+' PTS</small><button data-action="new-save">+ NEW SAVE SLOT</button><button data-action="delete-save">DELETE CURRENT SAVE</button></div>':'<div class="side-label">WELCOME</div><div class="side-welcome">Start a dynasty to unlock your front office.</div>';
 $('screen').innerHTML=s?({dashboard:()=>renderDashboard(s),roster:()=>renderRoster(s),tactics:()=>renderTactics(s),matchday:()=>renderMatchday(s),transactions:()=>renderTransactions(s),scouting:()=>renderScouting(s),standings:()=>renderStandings(s),legacy:()=>renderLegacy(s)}[page]||(()=>renderDashboard(s)))():renderSetup();
}
function newSave(){page='setup';render()}
function deleteSave(){const s=getSave();if(!s)return;if(!confirm('Delete this dynasty save? This cannot be undone.'))return;state.saves[sport]=state.saves[sport].filter(x=>x.id!==s.id);state.active[sport]=state.saves[sport][0]?.id||null;page='dashboard';persist();render();notify('Save deleted.')}
function setPage(p){page=p;render()}
function clickHandler(e){
 let el=e.target.closest('[data-sport]');if(el){sport=el.dataset.sport;page='dashboard';rosterFilter='ALL';hofPosition=null;render();return}
 el=e.target.closest('[data-page]');if(el){page=el.dataset.page;render();return}
 el=e.target.closest('[data-filter]');if(el){rosterFilter=el.dataset.filter;render();return}
 el=e.target.closest('[data-load]');if(el){state.active[sport]=el.dataset.load;page='dashboard';persist();render();return}
 el=e.target.closest('[data-action]');if(el){const a=el.dataset.action,id=el.dataset.id;
  if(a==='create-save'){createSave({manager:$('setupManager')?.value,team:$('setupTeam')?.value,era:$('setupEra')?.value})}
  else if(a==='new-save')newSave();
  else if(a==='delete-save')deleteSave();
  else if(a==='start-match')beginMatch();
  else if(a==='advance-season')advanceSeason();
  else if(a==='sim-five')simFive();
  else if(a==='sim-rest')simRest();
  else if(a==='train-team')trainTeam();
  else if(a==='toggle-starter')toggleStarter(id);
  else if(a==='retire')retirePlayer(id);
  else if(a==='release')releasePlayer(id);
  else if(a==='renew')renewPlayer(id);
  else if(a==='trade')tradePlayers();
  else if(a==='show-create-player'){$('createPlayerPanel').hidden=false}
  else if(a==='hide-create-player'){$('createPlayerPanel').hidden=true}
  else if(a==='create-player')createProspect();
  return;
 }
 el=e.target.closest('[data-decision]');if(el){const s=getSave();if(s&&s.pending){const i=Number(el.dataset.decision),choice=s.pending.options[i];if(choice)finishMatch(s,s.pending,choice)}return}
 el=e.target.closest('[data-tactic]');if(el){const s=getSave();if(s){s.tactics[el.dataset.tactic]=el.dataset.value;persist();render()}return}
 el=e.target.closest('[data-sign]');if(el){signFromPool(el.dataset.sign,el.dataset.pos,'free agent');return}
 el=e.target.closest('[data-draft]');if(el){signFromPool(el.dataset.draft,el.dataset.pos,'draft');return}
}
document.addEventListener('click',clickHandler);
document.addEventListener('change',e=>{
 const s=getSave();
 if(e.target.id==='slotSelect'){state.active[sport]=e.target.value;page='dashboard';persist();render()}
 if(!s)return;
 if(e.target.id==='tempoSelect')s.tactics.tempo=e.target.value;
 if(e.target.id==='riskSelect')s.tactics.risk=e.target.value;
 if(e.target.id==='rotationSelect')s.tactics.rotation=e.target.value;
 if(e.target.id==='trainingSelect')s.tactics.training=e.target.value;
 if(e.target.id==='matchPlan')s.matchPlan=e.target.value;
 if(e.target.id==='faPosition'){$('freeAgentList').innerHTML=renderFreeAgents(s,e.target.value)}
 if(e.target.id==='scoutPosition'){$('prospectList').innerHTML=renderProspects(s,e.target.value)}
 if(e.target.id==='hofPosition'){hofPosition=e.target.value;render()}
 if(e.target.id==='tradeOutgoing'){
  const p=s.roster.find(x=>x.id===e.target.value);
  if(p)$('tradeIncoming').innerHTML=playerPools(p.pos,s.era).filter(x=>!s.roster.some(y=>y.name===x.name)).slice(0,30).map(x=>'<option>'+esc(x.name)+'</option>').join('');
 }
 persist();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const p=$('createPlayerPanel');if(p)p.hidden=true}});
render();
})();