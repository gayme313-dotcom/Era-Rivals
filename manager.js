(function(){
'use strict';
const $=id=>document.getElementById(id);
const SPORT={
 nba:{name:'BASKETBALL',emoji:'🏀',positions:['PG','SG','SF','PF','C'],games:82,cap:154,unit:'M'},
 nfl:{name:'FOOTBALL',emoji:'🏈',positions:['QB','RB','WR','TE','OL','DL','LB','DB','K','P'],games:17,cap:280,unit:'M'},
 soccer:{name:'SOCCER',emoji:'⚽',positions:['GK','RB','CB','LB','CDM','CM','CAM','RW','LW','ST'],games:38,cap:300,unit:'M'},
 mlb:{name:'BASEBALL',emoji:'⚾',positions:['SP','RP','CP','C','1B','2B','3B','SS','LF','CF','RF'],games:162,cap:240,unit:'M'}
};
const TEAMS={
 nba:['Atlanta Hawks','Boston Celtics','Brooklyn Nets','Charlotte Hornets','Chicago Bulls','Cleveland Cavaliers','Dallas Mavericks','Denver Nuggets','Detroit Pistons','Golden State Warriors','Houston Rockets','Indiana Pacers','LA Clippers','Los Angeles Lakers','Memphis Grizzlies','Miami Heat','Milwaukee Bucks','Minnesota Timberwolves','New Orleans Pelicans','New York Knicks','Oklahoma City Thunder','Orlando Magic','Philadelphia 76ers','Phoenix Suns','Portland Trail Blazers','Sacramento Kings','San Antonio Spurs','Toronto Raptors','Utah Jazz','Washington Wizards'],
 nfl:['Arizona Cardinals','Atlanta Falcons','Baltimore Ravens','Buffalo Bills','Carolina Panthers','Chicago Bears','Cincinnati Bengals','Cleveland Browns','Dallas Cowboys','Denver Broncos','Detroit Lions','Green Bay Packers','Houston Texans','Indianapolis Colts','Jacksonville Jaguars','Kansas City Chiefs','Las Vegas Raiders','Los Angeles Chargers','Los Angeles Rams','Miami Dolphins','Minnesota Vikings','New England Patriots','New Orleans Saints','New York Giants','New York Jets','Philadelphia Eagles','Pittsburgh Steelers','San Francisco 49ers','Seattle Seahawks','Tampa Bay Buccaneers','Tennessee Titans','Washington Commanders'],
 soccer:['Arsenal','Aston Villa','Atlético Madrid','Bayern Munich','Benfica','Borussia Dortmund','Chelsea','FC Barcelona','Inter Milan','Juventus','Liverpool','Manchester City','Manchester United','Napoli','Newcastle United','Paris Saint-Germain','Porto','Real Madrid','Roma','Tottenham Hotspur'],
 mlb:['Arizona Diamondbacks','Atlanta Braves','Baltimore Orioles','Boston Red Sox','Chicago Cubs','Chicago White Sox','Cincinnati Reds','Cleveland Guardians','Colorado Rockies','Detroit Tigers','Houston Astros','Kansas City Royals','Los Angeles Angels','Los Angeles Dodgers','Miami Marlins','Milwaukee Brewers','Minnesota Twins','New York Mets','New York Yankees','Athletics','Philadelphia Phillies','Pittsburgh Pirates','San Diego Padres','San Francisco Giants','Seattle Mariners','St. Louis Cardinals','Tampa Bay Rays','Texas Rangers','Toronto Blue Jays','Washington Nationals']
};
const PLAN={
 nba:['PG','SG','SF','PF','C','PG','SG','SF','PF','C'],
 nfl:['QB','QB','RB','RB','RB','WR','WR','WR','WR','WR','WR','TE','TE','OL','OL','OL','OL','OL','OL','OL','DL','DL','DL','DL','DL','DL','LB','LB','LB','LB','LB','DB','DB','DB','DB','DB','DB','K','P'],
 soccer:['GK','GK','RB','RB','CB','CB','CB','CB','LB','LB','CDM','CDM','CM','CM','CM','CM','CAM','CAM','RW','RW','RW','LW','LW','LW','ST','ST','ST','ST'],
 mlb:['SP','SP','SP','SP','SP','RP','RP','RP','RP','RP','RP','CP','C','C','1B','1B','2B','2B','3B','3B','SS','SS','LF','LF','CF','CF','RF','RF']
};
const STARTERS={
 nba:{PG:1,SG:1,SF:1,PF:1,C:1},
 nfl:{QB:1,RB:1,WR:2,TE:1,OL:5,DL:4,LB:3,DB:4,K:1,P:1},
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
const CURRENT={
 nba:{
  PG:[['Shai Gilgeous-Alexander','Oklahoma City Thunder',98],['Luka Dončić','Dallas Mavericks',98],['Jalen Brunson','New York Knicks',95],['Tyrese Haliburton','Indiana Pacers',94]],
  SG:[['Anthony Edwards','Minnesota Timberwolves',97],['Devin Booker','Phoenix Suns',96],['Donovan Mitchell','Cleveland Cavaliers',96],['Jaylen Brown','Boston Celtics',95]],
  SF:[['Jayson Tatum','Boston Celtics',98],['Kevin Durant','Phoenix Suns',95],['LeBron James','Los Angeles Lakers',95],['Kawhi Leonard','LA Clippers',93]],
  PF:[['Giannis Antetokounmpo','Milwaukee Bucks',99],['Paolo Banchero','Orlando Magic',93],['Zion Williamson','New Orleans Pelicans',92],['Jaren Jackson Jr.','Memphis Grizzlies',92]],
  C:[['Nikola Jokić','Denver Nuggets',100],['Victor Wembanyama','San Antonio Spurs',98],['Joel Embiid','Philadelphia 76ers',97],['Bam Adebayo','Miami Heat',94]]
 },
 nfl:{
  QB:[['Patrick Mahomes','Kansas City Chiefs',99],['Josh Allen','Buffalo Bills',98],['Lamar Jackson','Baltimore Ravens',97],['Joe Burrow','Cincinnati Bengals',96],['Jalen Hurts','Philadelphia Eagles',95]],
  RB:[['Christian McCaffrey','San Francisco 49ers',98],['Saquon Barkley','Philadelphia Eagles',97],['Derrick Henry','Baltimore Ravens',96],['Jahmyr Gibbs','Detroit Lions',95]],
  WR:[['Justin Jefferson','Minnesota Vikings',99],['Ja’Marr Chase','Cincinnati Bengals',99],['CeeDee Lamb','Dallas Cowboys',98],['Amon-Ra St. Brown','Detroit Lions',96]],
  TE:[['Travis Kelce','Kansas City Chiefs',97],['George Kittle','San Francisco 49ers',96],['Sam LaPorta','Detroit Lions',94],['Trey McBride','Arizona Cardinals',93]],
  OL:[['Trent Williams','San Francisco 49ers',98],['Penei Sewell','Detroit Lions',97],['Lane Johnson','Philadelphia Eagles',96],['Creed Humphrey','Kansas City Chiefs',95]],
  DL:[['Myles Garrett','Cleveland Browns',99],['T.J. Watt','Pittsburgh Steelers',98],['Micah Parsons','Dallas Cowboys',98],['Nick Bosa','San Francisco 49ers',97]],
  LB:[['Fred Warner','San Francisco 49ers',98],['Roquan Smith','Baltimore Ravens',96],['Bobby Wagner','Washington Commanders',94]],
  DB:[['Sauce Gardner','New York Jets',97],['Patrick Surtain II','Denver Broncos',97],['Kyle Hamilton','Baltimore Ravens',96],['Minkah Fitzpatrick','Pittsburgh Steelers',95]]
 },
 soccer:{
  GK:[['Thibaut Courtois','Real Madrid',97],['Alisson','Liverpool',96],['Gianluigi Donnarumma','Paris Saint-Germain',96]],
  RB:[['Achraf Hakimi','Paris Saint-Germain',97],['Trent Alexander-Arnold','Liverpool',96],['Jeremie Frimpong','Bayer Leverkusen',94]],
  CB:[['Virgil van Dijk','Liverpool',98],['William Saliba','Arsenal',97],['Rúben Dias','Manchester City',96],['Alessandro Bastoni','Inter Milan',96]],
  LB:[['Theo Hernández','AC Milan',96],['Nuno Mendes','Paris Saint-Germain',96],['Alphonso Davies','Bayern Munich',96]],
  CDM:[['Rodri','Manchester City',99],['Declan Rice','Arsenal',97],['Moisés Caicedo','Chelsea',95]],
  CM:[['Jude Bellingham','Real Madrid',98],['Federico Valverde','Real Madrid',97],['Pedri','FC Barcelona',97],['Kevin De Bruyne','Manchester City',96]],
  CAM:[['Florian Wirtz','Bayer Leverkusen',97],['Jamal Musiala','Bayern Munich',97],['Martin Ødegaard','Arsenal',96],['Cole Palmer','Chelsea',96]],
  RW:[['Lamine Yamal','FC Barcelona',98],['Bukayo Saka','Arsenal',97],['Mohamed Salah','Liverpool',96]],
  LW:[['Vinícius Júnior','Real Madrid',98],['Raphinha','FC Barcelona',96],['Khvicha Kvaratskhelia','Napoli',95]],
  ST:[['Kylian Mbappé','Real Madrid',99],['Erling Haaland','Manchester City',99],['Harry Kane','Bayern Munich',97],['Lautaro Martínez','Inter Milan',96]]
 },
 mlb:{
  SP:[['Paul Skenes','Pittsburgh Pirates',98],['Tarik Skubal','Detroit Tigers',97],['Zack Wheeler','Philadelphia Phillies',96],['Gerrit Cole','New York Yankees',95]],
  RP:[['Josh Hader','Houston Astros',96],['Ryan Helsley','St. Louis Cardinals',95],['Devin Williams','New York Yankees',94]],
  CP:[['Emmanuel Clase','Cleveland Guardians',98],['Edwin Díaz','New York Mets',96],['Mason Miller','Oakland Athletics',95]],
  C:[['Cal Raleigh','Seattle Mariners',96],['William Contreras','Milwaukee Brewers',95],['Adley Rutschman','Baltimore Orioles',94]],
  '1B':[['Freddie Freeman','Los Angeles Dodgers',97],['Matt Olson','Atlanta Braves',96],['Vladimir Guerrero Jr.','Toronto Blue Jays',95]],
  '2B':[['Ketel Marte','Arizona Diamondbacks',96],['Jose Altuve','Houston Astros',95],['Marcus Semien','Texas Rangers',95]],
  '3B':[['José Ramírez','Cleveland Guardians',97],['Austin Riley','Atlanta Braves',95],['Rafael Devers','Boston Red Sox',94]],
  SS:[['Bobby Witt Jr.','Kansas City Royals',98],['Gunnar Henderson','Baltimore Orioles',97],['Francisco Lindor','New York Mets',96]],
  LF:[['Juan Soto','New York Yankees',98],['Yordan Alvarez','Houston Astros',97],['Kyle Tucker','Chicago Cubs',95]],
  CF:[['Julio Rodríguez','Seattle Mariners',96],['Corbin Carroll','Arizona Diamondbacks',95],['Mike Trout','Los Angeles Angels',94]],
  RF:[['Aaron Judge','New York Yankees',100],['Mookie Betts','Los Angeles Dodgers',97],['Shohei Ohtani','Los Angeles Dodgers',100]]
 }
};
const TACTICS={
 nba:{off:['Balanced','Pick & Roll','3-Point Heavy','Inside Game','Motion Offense'],def:['Man-to-Man','Zone Defense','Switch Everything','Protect the Paint','Full-Court Press'],tempo:['Slow','Normal','Fast'],risk:['Conservative','Balanced','Aggressive'],decisions:[['Feed the hot hand','Give your best scorer more touches. More offense, more fatigue.',6,0,8],['Lock in defensively','Make every possession difficult. Stronger defense.',1,7,1],['Push the pace','Create more possessions and attack early.',5,0,10]]},
 nfl:{off:['Balanced','Air Raid','Ground & Pound','Play Action','West Coast'],def:['Cover 2','Man Blitz','Zone Blitz','Stop the Run','Prevent Defense'],tempo:['Slow','Normal','Fast'],risk:['Conservative','Balanced','Aggressive'],decisions:[['Attack downfield','Take shots at big plays. More upside and more turnovers.',7,0,5],['Protect the quarterback','Keep the pocket clean and control the clock.',3,3,1],['Bring the pressure','Send extra rushers and force a mistake.',0,7,6]]},
 soccer:{off:['Possession','Counter Attack','Wing Play','High Press','Direct Football'],def:['Low Block','High Press','Counter Press','Compact Shape','Man Marking'],tempo:['Slow','Normal','Fast'],risk:['Conservative','Balanced','Aggressive'],decisions:[['Turn on the high press','Win the ball higher up the pitch. Costs stamina.',6,1,10],['Protect the middle','Close central spaces and defend as a unit.',0,7,2],['Attack the wings','Stretch the defense and create crossing chances.',5,1,5]]},
 mlb:{off:['Balanced','Small Ball','Power Hitting','Contact Hitting','Aggressive Baserunning'],def:['Pitch to Contact','Strikeout Pitching','Infield Shift','Outfield Deep','Infield In'],tempo:['Slow','Normal','Fast'],risk:['Conservative','Balanced','Aggressive'],decisions:[['Go to the bullpen','Use fresh arms to protect the lead.',0,7,2],['Play small ball','Move runners and manufacture runs.',4,2,3],['Let the sluggers swing','Chase extra-base hits. High upside, higher strikeout risk.',7,0,5]]}
};
Object.keys(SPORT).forEach(sp=>{const clubs=window.ERTeamRosters?.teams?.[sp];if(clubs&&Object.keys(clubs).length>1)TEAMS[sp]=Object.keys(clubs).sort()});
const STORAGE='era_rivals_front_office_v1';
const qs=new URLSearchParams(location.search);
let sport=SPORT[qs.get('sport')]?qs.get('sport'):'nba';
let page=qs.get('mode')==='franchise'?'roster':'dashboard',rosterFilter='ALL',hofPosition=null,toastTimer=null;
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
 if(era==='current'&&CURRENT[sport]&&CURRENT[sport][pos])CURRENT[sport][pos].forEach(x=>list.push({name:x[0],team:x[1],base:x[2],source:'Current Star'}));
 if(era==='alltime'&&sport==='nba'&&window.ERBasketballEraData&&window.ERBasketballEraData.extras&&window.ERBasketballEraData.extras[pos]){
  window.ERBasketballEraData.extras[pos].forEach(x=>list.push({name:x[0],team:x[1],base:Number(x[2])||80,source:'Historical Archive'}));
 }
 if(era==='alltime'&&LEGENDS[sport]&&LEGENDS[sport][pos]){
  LEGENDS[sport][pos].forEach(x=>list.push({name:x[0],team:x[1],base:x[2],source:'All-Time Legend'}));
 }
 if(era==='current'&&window.ERTeamRosters?.teams?.[sport])list=Object.values(window.ERTeamRosters.teams[sport]).flatMap(c=>c.players.filter(p=>p.pos===pos).map(p=>({...p,source:'Current club roster'})));
 const byName=new Map();list.forEach(p=>{const k=p.name.toLowerCase(),old=byName.get(k);if(!old||p.base>old.base)byName.set(k,p)});list=[...byName.values()];
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
 const roster=makeClubRoster(team,era);
 const s={id:'save-'+Date.now()+'-'+Math.random().toString(36).slice(2,6),sport:sport,era:era,team:team,manager:manager,difficulty:form.difficulty||'normal',season:1,year:era==='alltime'?1998:2026,week:0,record:{w:0,l:0,d:0},roster:roster,chemistry:72,morale:76,fanSupport:65,gmRep:50,gmPoints:0,trainingPoints:4,legacyPoints:0,tactics:{off:TACTICS[sport].off[0],def:TACTICS[sport].def[0],tempo:'Normal',risk:'Balanced',rotation:'Normal',training:SPORT[sport].positions[0]},matchPlan:'Balanced approach',pending:null,offseason:false,feed:['New franchise established. The board expects a competitive season.'],seasonHistory:[],retired:[],standings:{},awards:[],draftClass:[]};
 TEAMS[sport].forEach((t,i)=>s.standings[t]={w:0,l:0,d:0,ovr:68+((i*7+Math.floor(rand(0,12)))%23)});
 s.standings[team]={w:0,l:0,d:0,ovr:teamOvr(s)};
 ensureSeason(s);initialLineup(s);Object.keys(s.standings).forEach(t=>s.standings[t].ovr=clubRating(t,era));s.standings[team].ovr=teamOvr(s);
 const arr=state.saves[sport];if(arr.length>=5){notify('All five save slots are full. Delete one first.','bad');return}
 arr.push(s);state.active[sport]=s.id;page='dashboard';persist();render();notify('Dynasty created. You are in charge.');
}
function feed(s,msg){s.feed.unshift('S'+s.season+' · '+msg);s.feed=s.feed.slice(0,18)}
function starters(s){return s.roster.filter(p=>p.starter&&!p.injured)}
function teamPower(s){const a=starters(s);if(!a.length)return 60;const avg=a.reduce((n,p)=>n+p.overall,0)/a.length;const morale=s.roster.reduce((n,p)=>n+p.morale,0)/Math.max(1,s.roster.length);const fatigue=a.reduce((n,p)=>n+p.fatigue,0)/a.length;const required=Object.values(STARTERS[sport]).reduce((n,v)=>n+v,0);const vacancies=Math.max(0,required-a.length);return avg-vacancies*1.8+(s.chemistry-70)*.075+(morale-70)*.035-(fatigue-20)*.08}
function tacticBonus(s){const t=s.tactics,active=starters(s),avg=teamOvr(s),fit=(positions)=>{const group=active.filter(p=>positions.includes(p.pos));return group.length?(group.reduce((n,p)=>n+p.overall,0)/group.length-avg)*.3: -2};let b=0;
 if(/Air Raid|West Coast/.test(t.off))b+=fit(['QB','WR','TE']);
 if(/Ground & Pound|Inside Game/.test(t.off))b+=fit(sport==='nfl'?['RB','OL']:['PF','C']);
 if(/3-Point Heavy|Pick & Roll/.test(t.off))b+=fit(['PG','SG']);
 if(/Wing Play|Counter Attack/.test(t.off))b+=fit(['RW','LW','ST']);
 if(/Possession/.test(t.off))b+=fit(['CM','CDM','CAM']);
 if(/Power Hitting/.test(t.off))b+=fit(['1B','RF','LF']);
 if(/Strikeout Pitching/.test(t.def))b+=fit(['SP','RP','CP']);
 if(t.tempo==='Fast')b+=active.some(p=>p.fatigue>65)?-2:1;
 if(t.tempo==='Slow')b+=active.some(p=>p.fatigue>65)?1:0;
 if(t.rotation==='Short Rotation')b+=active.some(p=>p.fatigue>65)?-2:1;
 if(t.rotation==='Deep Rotation')b+=active.some(p=>p.fatigue>65)?1:0;
 return b;}
function planBonus(s){const p=s.matchPlan||'';if(/Attack from the start/.test(p))return 2;if(/Protect the lead/.test(p))return 1.2;if(/Play through your best player/.test(p))return 2.2;if(/Exploit the wings/.test(p))return 1.6;if(/Control possession/.test(p))return 1.3;return 0}
function opponentPower(s){return (s.standings[nextOpponent(s)]?.ovr||78)+(s.difficulty==='hard'?3:0)}
function segmentScore(sp,diff){
 if(sp==='nba')return Math.max(34,Math.round(51+diff*.36+rand(-8,8)));
 if(sp==='nfl'){const target=10+diff*.20+rand(-5,5),scores=[0,3,7,10,14,17,21,24];return scores.reduce((best,x)=>Math.abs(x-target)<Math.abs(best-target)?x:best,0)}
 if(sp==='soccer'){const chance=Math.max(.08,Math.min(.82,.34+diff*.025));return (Math.random()<chance?1:0)+(Math.random()<chance*.24?1:0)}
 return Math.max(0,Math.round(2+diff*.065+rand(-1.4,1.5)));
}
function matchDecisionOptions(){return TACTICS[sport].decisions}
function beginMatch(){
 const s=getSave();if(!s||s.offseason)return;
 if(s.pending){page='matchday';render();return}
 if(!s.preparation){page='dashboard';render();notify('Choose your preparation in the decision room first.');return}
 const opponent=nextOpponent(s),opp=opponentPower(s),diff=teamPower(s)+tacticBonus(s)+planBonus(s)+(s.preparation.bonus||0)-opp;
 s.pending={opponent,oppOvr:opp,home:segmentScore(sport,diff),away:segmentScore(sport,-diff),stage:'halftime',plan:s.matchPlan,planBonus:planBonus(s),options:matchDecisionOptions(),start:Date.now()};
 persist();page='matchday';render();
}
function finishMatch(s,pending,choice,silent=false){
 if(!pending||s.offseason)return;
 const swing=(s.tactics.risk==='Aggressive'?rand(-5,5):s.tactics.risk==='Conservative'?rand(-1,1):rand(-3,3));
 const diff=teamPower(s)+tacticBonus(s)+(pending.planBonus||0)+(s.preparation?.bonus||0)+choice[2]+choice[3]*.6-pending.oppOvr+swing;
 let [home,away]=resolveTie(pending.home+segmentScore(sport,diff),pending.away+segmentScore(sport,-diff));
 const win=home>away,draw=home===away,post=!!s.playoffs;
 if(!post){updateLeagueRound(s,pending.opponent,home,away);if(win)s.record.w++;else if(draw)s.record.d++;else s.record.l++;s.week++}
 const active=starters(s),activeIds=new Set(active.map(p=>p.id));
 const mvp=active.filter(p=>sport!=='nfl'||!['OL','K','P'].includes(p.pos)).map(p=>({p,score:p.overall+rand(0,12)})).sort((a,b)=>b.score-a.score)[0]?.p;
 s.roster.forEach(p=>{
  const played=activeIds.has(p.id);
  if(p.injured>0){p.injured--;if(!p.injured)feed(s,p.name+' cleared to return.');}
  if(played){p.games++;p.careerPoints+=win?9:4;p.fatigue=Math.min(100,Math.max(0,p.fatigue+Math.floor(rand(5,11))+(choice[4]||0)*.3-6));p.morale=clamp(p.morale+(win?3:draw?1:-3),30,100)}
  else p.fatigue=Math.max(0,p.fatigue-12);
  if(played&&p.fatigue>65&&Math.random()<.04){p.injured=2+Math.floor(rand(0,3));p.starter=false;feed(s,p.name+' is out for '+p.injured+' games.');}
 });
 if(mvp){mvp.careerPoints+=win?22:10;if(win){mvp.awards.push('Player of the Match');s.trainingPoints++}}
 s.chemistry=clamp(s.chemistry+(win?2:draw?1:-1),35,99);s.morale=clamp(s.morale+(win?3:draw?1:-3),30,100);s.fanSupport=clamp(s.fanSupport+(win?2:draw?0:-2),15,100);s.gmRep=clamp(s.gmRep+(win?1:draw?0:-1),0,100);
 s.gmPoints+=win?30:draw?15:8;s.legacyPoints+=win?18:draw?8:4;
 const result=win?'WIN':draw?'DRAW':'LOSS';
 s.lastMatch={opponent:pending.opponent,home,away,result,decision:choice[0],mvp:mvp?.name||'Team effort',preparation:s.preparation?.label||'Balanced preparation',phase:post?playoffLabel(s):'Game '+s.week};
 s.matchHistory.unshift({...s.lastMatch,season:s.season});s.matchHistory=s.matchHistory.slice(0,200);
 feed(s,result+' '+home+'–'+away+' vs '+pending.opponent+'. '+s.lastMatch.mvp+' led the team. Call: '+choice[0]+'.');
 s.pending=null;s.preparation=null;fillVacancies(s);
 if(post)advancePlayoffs(s,win);else if(s.week>=SPORT[sport].games)endRegularSeason(s);
 if(!silent){persist();render();notify(result+' · '+home+'–'+away)}
}
function completeSeason(s,title=false){
 if(s.offseason)return;
 const awards=[];
 if(title){s.legacyPoints+=1500;s.gmPoints+=300;awards.push(sport==='soccer'?'LEAGUE CHAMPIONS':'ERA CUP CHAMPIONS');s.roster.forEach(p=>{p.careerPoints+=250;p.awards.push('Champion')})}
 const target=Math.ceil(SPORT[sport].games*.5),met=s.record.w>=target;
 if(met){s.gmPoints+=150;awards.push('Board objective achieved');feed(s,'Board objective met: +150 GM points.')}
 s.seasonHistory.unshift({season:s.season,year:s.year,record:s.record.w+'-'+s.record.l+(s.record.d?'-'+s.record.d:''),title,awards});
 feed(s,'Season '+s.season+' complete. '+(title?'CHAMPIONS! ': '')+awards.join(' · '));
 s.offseason=true;s.pending=null;s.playoffs=null;
 s.roster.forEach(p=>{p.age++;p.contractYears=Math.max(0,p.contractYears-1);p.fatigue=0;p.injured=0;if(p.age>=39&&Math.random()<.45){p.retired=true;s.retired.push(p);feed(s,p.name+' announced retirement.')}});
 s.roster=s.roster.filter(p=>!p.retired);fillVacancies(s);
}
function advanceSeason(){
 const s=getSave();if(!s||!s.offseason)return;
 s.season++;s.year++;s.week=0;s.record={w:0,l:0,d:0};s.offseason=false;s.trainingPoints+=3;s.chemistry=Math.min(99,s.chemistry+4);s.preparation=null;s.playoffs=null;s.seasonDrafts=0;s.schedule=null;
 s.roster.forEach(p=>{if(p.potential>p.overall&&p.age<30&&Math.random()<.65)p.overall++;if(p.age>32&&Math.random()<.4)p.overall=Math.max(55,p.overall-1);if(p.contractYears===0)p.morale=Math.max(35,p.morale-10)});
 Object.keys(s.standings).forEach(t=>s.standings[t]={w:0,l:0,d:0,ovr:t===s.team?teamOvr(s):clamp(s.standings[t].ovr+Math.round(rand(-2,2)),65,98)});
 ensureSeason(s);feed(s,'Season '+s.season+' begins. Review contracts and prepare your squad.');persist();render();notify('New season started.');
}
function simAuto(s){
 if(s.offseason||s.pending)return;
 if(!s.preparation)prepareTeam(s,'recover');
 const diff=teamPower(s)+tacticBonus(s)+planBonus(s)-opponentPower(s);
 const pending={opponent:nextOpponent(s),oppOvr:opponentPower(s),home:segmentScore(sport,diff),away:segmentScore(sport,-diff),planBonus:planBonus(s)};
 finishMatch(s,pending,matchDecisionOptions()[1],true);
}
function simFive(){const s=getSave();if(!s||s.offseason)return;if(s.pending){notify('Finish your current match first.');return}let n=0;while(n<5&&!s.offseason){simAuto(s);n++}feed(s,'Assistant simulated '+n+' fixtures with recovery preparation.');persist();render();notify(n+' games simulated.')}
function simRest(){const s=getSave();if(!s||s.offseason)return;if(s.pending){notify('Finish your current match first.');return}for(let i=0;i<SPORT[sport].games+4&&!s.offseason;i++)simAuto(s);feed(s,'Assistant completed the season with recovery preparation.');persist();render();notify('Season complete.')}
function trainTeam(){
 const s=getSave();if(!s||s.trainingPoints<1){notify('You need a training point.','bad');return}
 const focus=s.tactics.training;let improved=0;
 s.roster.forEach(p=>{if(!p.injured&&p.pos===focus&&p.age<31&&p.overall<p.potential){p.overall++;improved++}if(!p.injured&&p.pos===focus)p.fatigue=Math.min(100,p.fatigue+5)});
 s.trainingPoints--;s.chemistry=Math.min(99,s.chemistry+1);feed(s,'Training camp focused on '+focus+'. '+improved+' player ratings improved.');
 persist();render();notify(improved+' players improved.');
}
function toggleStarter(id){
 const s=getSave();if(!s||s.pending)return;const p=s.roster.find(x=>x.id===id);if(!p)return;
 if(p.injured){notify('This player needs '+p.injured+' more games to recover.');return}
 if(p.starter)p.starter=false;else{const same=s.roster.filter(x=>x.pos===p.pos&&x.starter).sort((a,b)=>a.overall-b.overall);if(same.length>=(STARTERS[sport][p.pos]||1))same[0].starter=false;p.starter=true}
 persist();render();
}
function retirePlayer(id){
 const s=getSave();if(!s)return;const p=s.roster.find(x=>x.id===id);if(!p)return;
 p.retired=true;s.retired.push(p);s.roster=s.roster.filter(x=>x.id!==id);feed(s,p.name+' retired after '+p.games+' games. Career legacy: '+p.careerPoints+' points.');
 persist();render();notify(p.name+' retired.');
}
function releasePlayer(id){
 const s=getSave();if(!s)return;const p=s.roster.find(x=>x.id===id);if(!p)return;
 s.released=s.released||[];s.released.push({...p,base:p.overall,team:'Free Agent'});s.roster=s.roster.filter(x=>x.id!==id);fillVacancies(s);feed(s,'Released '+p.name+'. Payroll cleared: '+money(p.salary)+'.');persist();render();notify('Player released.');
}
function renewPlayer(id){
 const s=getSave();if(!s)return;const p=s.roster.find(x=>x.id===id);if(!p)return;
 const next=p.salary*1.14;if(teamPayroll(s)-p.salary+next>capFor()){notify('Not enough salary cap room for this extension.','bad');return}
 p.salary=Math.round(next*10)/10;p.contractYears=3;p.morale=Math.min(100,p.morale+6);feed(s,'Extended '+p.name+' for three seasons at '+money(p.salary)+' per year.');persist();render();notify('Contract extension signed.');
}
function signFromPool(name,pos,kind){
 const s=getSave();if(!s)return;const exists=s.roster.some(p=>p.name===name);if(exists){notify('That player is already on your roster.','bad');return}
 const source=(kind==='draft'?draftPool(s,pos):freeAgents(s,pos)).find(p=>p.name===name);if(!source)return;
 if(kind==='draft'&&s.seasonDrafts>=2){notify('You have used both draft picks this season.');return}
 const p=makePlayer(source,pos,false,0);p.salary=Math.max(.7,Math.round(p.salary*.82*10)/10);p.contractYears=kind==='draft'?4:2;if(kind==='draft')p.age=19;p.potential=Math.min(99,Math.max(p.potential,p.overall+(kind==='draft'?10:5)));
 if(teamPayroll(s)+p.salary>capFor()){notify('Over the salary cap. Release or trade a player first.','bad');return}
 s.roster.push(p);if(kind==='draft'){s.draftClass.push(p.name);s.seasonDrafts++}s.released=(s.released||[]).filter(x=>x.name!==name);feed(s,(kind==='draft'?'Drafted ':'Signed free agent ')+p.name+' ('+pos+').');persist();render();notify(p.name+' added to the roster.');
}
function tradePlayers(){
 const s=getSave();if(!s)return;const a=$('tradeOutgoing')?.value,b=$('tradeIncoming')?.value;
 const out=s.roster.find(p=>p.id===a);if(!out||!b){notify('Choose a player to trade.','bad');return}
 const source=playerPools(out.pos,s.era).find(p=>p.name===b);if(!source){notify('Trade target unavailable.','bad');return}
 if(s.roster.some(p=>p.name===b)){notify('That player is already on your team.');return}
 const value=out.overall+Math.max(0,27-out.age)*.4+Math.max(0,out.potential-out.overall)*.25;
 if(value<source.base-3){notify('Trade rejected. Offer a player closer in value to '+source.name+'.','bad');return}
 const incoming=makePlayer(source,out.pos,out.starter,0);incoming.age=source.age||incoming.age;incoming.team=s.team;s.chemistry=Math.max(35,s.chemistry-3);
 const payroll=teamPayroll(s)-out.salary+incoming.salary;
 if(payroll>capFor()){notify('Trade would put the team over the cap.','bad');return}
 const partner=source.team;if(s.standings[partner]&&partner!==s.team)s.standings[partner].ovr=clamp(Math.round(s.standings[partner].ovr+(out.overall-incoming.overall)/Math.max(5,starters(s).length)),65,99);s.roster=s.roster.filter(p=>p.id!==out.id);s.roster.push(incoming);fillVacancies(s);feed(s,'Traded '+out.name+' for '+incoming.name+'.');persist();render();notify('Trade completed.');
}
function createProspect(){
 const s=getSave();if(!s)return;const name=$('customName')?.value.trim(),pos=$('customPos')?.value,ovr=Number($('customOvr')?.value||72);
 if(!name){notify('Enter a player name first.','bad');return}
 if(!Number.isFinite(ovr)||!SPORT[sport].positions.includes(pos)){notify('Choose a valid rating and position.');return}
 if(s.roster.some(p=>p.name.toLowerCase()===name.toLowerCase())){notify('That player already exists.');return}
 if(teamPayroll(s)+salaryFor(clamp(ovr,55,95))>capFor()){notify('Not enough cap space.');return}
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
 const tabs=[['dashboard','◈','DASHBOARD'],['roster','▦','ROSTER'],['tactics','⌁','TACTICS'],['matchday','◎','MATCHDAY'],['transactions','⇄','TRANSACTIONS'],['scouting','⌕','SCOUTING & DRAFT'],['standings','▤','STANDINGS'],['legacy','♛','HALL OF FAME'],['saves','↥','SAVES & ONLINE']];
 return tabs.map(t=>'<button class="nav-item '+(page===t[0]?'active':'')+'" data-page="'+t[0]+'"><span>'+t[1]+'</span>'+t[2]+'</button>').join('');
}
function stat(label,value,sub){return '<div class="stat-card"><span>'+label+'</span><strong>'+value+'</strong><small>'+sub+'</small></div>'}
function renderSetup(){
 return '<section class="setup-hero"><div class="eyebrow">ERA RIVALS · FRONT OFFICE SIMULATOR</div><h1>YOU CALL<br><em>THE SHOTS.</em></h1><p>No controller skills. No running around the field. Build the roster, set the tactics, make the calls and watch your decisions shape the season.</p><div class="setup-card"><div class="setup-head"><span class="eyebrow">START A NEW DYNASTY</span><b>01 / FRANCHISE SETUP</b></div><div class="setup-grid"><label>GENERAL MANAGER<input id="setupManager" value="Xavier Matos" maxlength="28"></label><label>CHOOSE YOUR TEAM<select id="setupTeam">'+TEAMS[sport].map(t=>'<option>'+esc(t)+'</option>').join('')+'</select></label><label>PLAYER ERA<select id="setupEra"><option value="current">REAL CLUB ROSTERS · DATED SNAPSHOT</option><option value="alltime">ALL-TIME LEGENDS · GOLD</option></select></label><label>DIFFICULTY<select id="setupDifficulty"><option value="normal">FRONT OFFICE · NORMAL</option><option value="hard">CHAMPIONSHIP CHALLENGE</option></select></label></div><div class="era-explain"><span class="era-dot"></span><div><b>CURRENT</b><small>Start with your club’s actual roster snapshot.</small></div><span class="era-dot gold"></span><div><b>ALL-TIME</b><small>Draft legends from every generation.</small></div></div><button class="btn primary large" data-action="create-save">START DYNASTY ↗</button><p class="fineprint">Five save slots per sport · Automatic local saves · Rosters: ESPN, November 5, 2026. Ratings, salaries and schedules are game estimates; this is a custom league.</p></div><div class="setup-slots"><h3>YOUR SAVES</h3>'+(state.saves[sport].length?state.saves[sport].map((x,i)=>'<div class="saved-line"><span>SAVE '+(i+1)+'</span><b>'+esc(x.team)+'</b><small>'+x.era.toUpperCase()+' · SEASON '+x.season+'</small><button data-load="'+x.id+'">LOAD</button></div>').join(''):'<div class="empty-state">No dynasty yet. Your front office is waiting.</div>')+'</div></section>';
}
function renderDashboard(s){
 const ovr=teamOvr(s),pay=teamPayroll(s),pct=s.week?Math.round(s.record.w/s.week*100):0,next=nextOpponent(s);
 return '<section class="welcome-panel" style="--club-color:'+clubColor(s.team)+'"><div><div class="eyebrow">'+SPORT[sport].emoji+' '+SPORT[sport].name+' · SEASON '+s.season+' / '+s.year+'</div><h1>'+esc(s.team)+'<br><em>FRONT OFFICE.</em></h1><p>General Manager: '+esc(s.manager)+' · '+s.era.toUpperCase()+' PLAYER ERA</p></div><div class="club-crest">'+clubBadge(s.team)+'</div><div class="team-grade"><b>'+ovr+'</b><small>TEAM OVR</small></div></section>'+
 '<div class="stats-grid">'+stat('RECORD',s.record.w+'-'+s.record.l+(s.record.d?'-'+s.record.d:''),s.week+' / '+SPORT[sport].games+' games played')+stat('TEAM OVR',ovr,'Starting lineup strength')+stat('PAYROLL',money(pay),money(capFor())+' salary cap')+stat('GM LEGACY',s.gmPoints.toLocaleString(),'Career management points')+'</div>'+
 (s.offseason?'<div class="offseason-banner"><b>OFFSEASON UNLOCKED</b><span>Review contracts, draft prospects and prepare for the next season.</span><button class="btn primary" data-action="advance-season">START SEASON '+(s.season+1)+' →</button></div>':'')+
 renderDecisionRoom(s)+'<div class="dashboard-grid"><section class="panel next-match"><div class="panel-top"><div><span class="eyebrow">NEXT MATCHDAY</span><h2>'+(s.offseason?'OFFSEASON':s.playoffs?playoffLabel(s):'GAME '+(s.playoffs?playoffLabel(s):(s.week+1)+' / '+SPORT[sport].games))+'</h2></div><span class="status-pill">'+(s.offseason?'BREAK':'UP NEXT')+'</span></div><div class="matchup"><div><small>YOUR TEAM</small><b>'+esc(s.team)+'</b><strong>'+ovr+'</strong></div><span class="vs">VS</span><div><small>OPPOSITION</small><b>'+esc(next)+'</b><strong>'+opponentPower(s)+'</strong></div></div><p class="muted">Your tactics, starters, chemistry and player fatigue affect the result. Make your decisions before the simulation.</p><div class="button-row"><button class="btn primary" data-page="matchday" '+(s.offseason?'disabled':'')+'>PREPARE MATCH ↗</button><button class="btn ghost" data-page="tactics">SET GAMEPLAN</button></div></section><section class="panel club-health"><span class="eyebrow">FRANCHISE HEALTH</span><h2>THE BOARDROOM</h2>'+meter('TEAM CHEMISTRY',s.chemistry)+meter('TEAM MORALE',s.morale)+meter('FAN SUPPORT',s.fanSupport)+meter('GM APPROVAL',s.gmRep)+'<div class="health-foot">Training points: <b>'+s.trainingPoints+'</b> · Retired legends: <b>'+s.retired.length+'</b></div></section></div>'+
 '<div class="dashboard-grid"><section class="panel"><div class="panel-top"><div><span class="eyebrow">RECENT NEWS</span><h2>LEAGUE FEED</h2></div><button class="text-btn" data-page="standings">VIEW TABLE ↗</button></div><div class="feed-list">'+s.feed.slice(0,7).map(x=>'<div class="feed-row"><span class="feed-dot"></span><p>'+esc(x)+'</p></div>').join('')+'</div></section><section class="panel quick-actions"><span class="eyebrow">YOUR NEXT DECISIONS</span><h2>RUN THE TEAM.</h2><button data-page="roster">01 · Set your starting lineup <b>→</b></button><button data-page="transactions">02 · Sign, trade or release players <b>→</b></button><button data-page="scouting">03 · Scout the next generation <b>→</b></button><button data-page="tactics">04 · Choose your tactics <b>→</b></button></section></div>';
}
function meter(label,v){return '<div class="meter"><div><span>'+label+'</span><b>'+Math.round(v)+'/100</b></div><i><em style="width:'+Math.max(0,Math.min(100,v))+'%"></em></i></div>'}
function renderRoster(s){
 const list=s.roster.filter(p=>rosterFilter==='ALL'||p.pos===rosterFilter);
 return '<div class="page-heading"><div><span class="eyebrow">SQUAD MANAGEMENT</span><h1>THE ROSTER.</h1><p>Club roster snapshot: 2026-11-05. Includes reserves. Ratings and salaries are game estimates. Choose starters and manage contracts.</p></div><button class="btn ghost" data-action="auto-lineup">BEST LINEUP</button><button class="btn primary" data-action="show-create-player">+ CREATE PROSPECT</button></div><div class="roster-summary">'+stat('PLAYERS',s.roster.length,'Squad size')+stat('STARTERS',starters(s).length,'Active lineup')+stat('PAYROLL',money(teamPayroll(s)),'Annual salary')+stat('CAP SPACE',money(capFor()-teamPayroll(s)),'Available budget')+'</div><div class="filter-row"><button class="filter '+(rosterFilter==='ALL'?'active':'')+'" data-filter="ALL">ALL PLAYERS</button>'+SPORT[sport].positions.map(p=>'<button class="filter '+(rosterFilter===p?'active':'')+'" data-filter="'+p+'">'+p+'</button>').join('')+'</div><div class="roster-list">'+list.map(p=>'<div class="player-row '+(p.starter?'is-starter':'')+'"><div class="player-pos">'+(p.photo?'<img class="player-photo" src="'+esc(p.photo)+'" alt="" loading="lazy" referrerpolicy="no-referrer">':'')+p.pos+'</div><div class="player-main"><b>'+esc(p.name)+'</b><small>'+p.age+' YRS · '+p.contractYears+' YR CONTRACT · '+(p.injured?'OUT · '+p.injured+' GAMES':'FIT')+'</small></div><div class="player-rating"><b>'+p.overall+'</b><small>OVR</small></div><div class="player-meta"><span>'+money(p.salary)+'</span><small>'+esc(p.source)+'</small></div><div class="player-bars"><span>MORALE '+p.morale+'%</span><i><em style="width:'+p.morale+'%"></em></i><span>FATIGUE '+p.fatigue+'%</span><i><em class="fatigue" style="width:'+p.fatigue+'%"></em></i></div><div class="player-actions"><button data-action="toggle-starter" data-id="'+p.id+'">'+(p.starter?'BENCH':'START')+'</button><button data-action="renew" data-id="'+p.id+'">EXTEND</button><button data-action="retire" data-id="'+p.id+'">RETIRE</button><button class="danger-text" data-action="release" data-id="'+p.id+'">RELEASE</button></div></div>').join('')+'</div><div id="createPlayerPanel" class="panel create-player" hidden><div class="panel-top"><h2>CREATE A PROSPECT</h2><button class="text-btn" data-action="hide-create-player">CLOSE ✕</button></div><div class="setup-grid"><label>PLAYER NAME<input id="customName" placeholder="Xavier Matos"></label><label>POSITION<select id="customPos">'+SPORT[sport].positions.map(p=>'<option>'+p+'</option>').join('')+'</select></label><label>STARTING OVR<input id="customOvr" type="number" min="55" max="95" value="72"></label></div><button class="btn primary" data-action="create-player">ADD PLAYER TO ROSTER</button></div>';
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
  const cards=p.options.map((o,i)=>'<button class="decision-card" data-decision="'+i+'"><span>OPTION 0'+(i+1)+'</span><b>'+esc(o[0])+'</b><small>'+esc(o[1])+'</small><em>SELECT THIS DECISION →</em></button>').join('');
  return '<div class="page-heading"><div><span class="eyebrow">MATCHDAY / '+(sport==='mlb'?'MIDDLE INNINGS':'HALFTIME')+' DECISION</span><h1>YOUR CALL.</h1><p>The opening stage is over. Read the score and make your adjustment.</p></div><span class="status-pill live">DECISION REQUIRED</span></div><section class="panel halftime"><div class="halftime-title"><span>'+esc(s.team)+'</span><b>'+p.home+' : '+p.away+'</b><span>'+esc(p.opponent)+'</span></div><div class="eyebrow">'+(sport==='mlb'?'MIDDLE INNINGS':'HALFTIME')+' · '+esc(p.plan)+'</div><h2>WHAT IS THE ADJUSTMENT?</h2><p class="muted">Your decision changes the second-half simulation. Aggressive calls can win games, but they can also cost energy.</p><div class="decision-grid">'+cards+'</div></section>';
 }
 const opp=nextOpponent(s);
 const oppGrade=opponentPower(s);
 const last=s.lastMatch?'<section class="panel last-result"><span class="eyebrow">LAST MATCH · '+s.lastMatch.result+'</span><h2>'+s.lastMatch.home+' - '+s.lastMatch.away+' vs '+esc(s.lastMatch.opponent)+'</h2><p class="muted">Your call: '+esc(s.lastMatch.decision)+' · Player of the match: '+esc(s.lastMatch.mvp)+'</p></section>':'';
 const plans=['Balanced approach','Attack from the start','Protect the lead','Play through your best player','Exploit the wings / weak side','Control possession'];
 const planOptions=plans.map(x=>'<option '+(s.matchPlan===x?'selected':'')+'>'+x+'</option>').join('');
 return last+(!s.preparation&&!s.offseason?renderDecisionRoom(s):'')+'<div class="page-heading"><div><span class="eyebrow">MATCHDAY / '+(s.playoffs?playoffLabel(s):'GAME PREPARATION')+'</span><h1>'+(s.offseason?'SEASON COMPLETE.':'THE NEXT GAME.')+'</h1><p>Set your plan, then let the simulation decide how it plays out.</p></div><span class="status-pill">'+(s.playoffs?playoffLabel(s):(s.week+1)+' / '+SPORT[sport].games)+'</span></div><section class="panel match-preview"><div class="matchup large"><div><small>HOME</small><b>'+esc(s.team)+'</b><strong>'+teamOvr(s)+'</strong></div><span class="vs">VS</span><div><small>AWAY</small><b>'+esc(opp)+'</b><strong>'+oppGrade+' OVR</strong></div></div><div class="pre-match-grid"><label class="field">MATCH PLAN<select id="matchPlan">'+planOptions+'</select></label><div class="match-note"><b>YOUR GAMEPLAN</b><span>'+esc(s.tactics.off)+' · '+esc(s.tactics.def)+' · '+esc(s.tactics.tempo)+' tempo</span></div></div><div class="button-row"><button class="btn primary large" data-action="start-match" '+(s.offseason?'disabled':'')+'>START MATCH SIMULATION ↗</button><button class="btn ghost" data-page="roster">CHECK LINEUP</button><button class="btn ghost" data-page="tactics">CHANGE TACTICS</button></div></section><section class="panel"><span class="eyebrow">MATCHDAY RULES</span><h2>YOU ARE THE MANAGER.</h2><div class="rules-grid"><div><b>01 · PREPARE</b><p>Set your lineup, tactics, pace and risk level.</p></div><div><b>02 · RESPOND</b><p>At halftime, choose a tactical adjustment based on the match.</p></div><div><b>03 · SIMULATE</b><p>Your roster quality, chemistry, morale and decisions determine the result.</p></div></div></section>';
}

function renderTransactions(s){
 const pos=SPORT[sport].positions[0],outgoing=s.roster[0]||null;
 const contracts=s.roster.filter(p=>p.contractYears<=1).slice(0,8).map(p=>'<div><b>'+esc(p.name)+'</b><small>'+p.pos+' · '+p.contractYears+' years left · '+money(p.salary)+'</small><button data-action="renew" data-id="'+p.id+'">EXTEND</button></div>').join('');
 return '<div class="page-heading"><div><span class="eyebrow">FRONT OFFICE / PLAYER MOVEMENT</span><h1>MAKE THE MOVE.</h1><p>Sign free agents, negotiate extensions and trade for a better fit.</p></div></div><div class="transaction-grid"><section class="panel"><span class="eyebrow">FREE AGENT MARKET</span><h2>AVAILABLE PLAYERS.</h2><label class="field">POSITION<select id="faPosition">'+SPORT[sport].positions.map(p=>'<option>'+p+'</option>').join('')+'</select></label><div id="freeAgentList">'+renderFreeAgents(s,pos)+'</div></section><section class="panel"><span class="eyebrow">TRADE CENTER</span><h2>TRADE BLOCK.</h2><label class="field">PLAYER TO MOVE<select id="tradeOutgoing">'+s.roster.map(p=>'<option value="'+p.id+'">'+esc(p.pos+' · '+p.name+' · '+p.overall+' OVR')+'</option>').join('')+'</select></label><label class="field">TRADE TARGET<select id="tradeIncoming">'+(outgoing?playerPools(outgoing.pos,s.era).filter(p=>!s.roster.some(x=>x.name===p.name)).slice(0,30).map(p=>'<option>'+esc(p.name)+'</option>').join(''):'')+'</select></label><button class="btn primary" data-action="trade">PROPOSE PLAYER SWAP</button><p class="fineprint">Offers must be close in talent and potential. Accepted trades cost 3 chemistry; salary limits still apply.</p></section></div><section class="panel"><span class="eyebrow">CONTRACT WATCH</span><h2>WHO NEEDS A NEW DEAL?</h2><div class="contract-list">'+(contracts||'<div class="empty-state">No urgent contract decisions.</div>')+'</div></section>';
}
function renderFreeAgents(s,pos){
 return freeAgents(s,pos).filter(p=>!s.roster.some(x=>x.name===p.name)).slice(0,8).map(p=>'<div class="market-row"><div><b>'+esc(p.name)+'</b><small>'+pos+' · '+esc(p.team)+' · '+p.base+' OVR</small></div><button data-sign="'+esc(p.name)+'" data-pos="'+pos+'">SIGN</button></div>').join('')||'<div class="empty-state">No players available at this position.</div>';
}
function renderScouting(s){
 const pos=SPORT[sport].positions[0],prospects=playerPools(pos,s.era).filter(p=>!s.roster.some(x=>x.name===p.name)).slice(0,12);
 return '<div class="page-heading"><div><span class="eyebrow">SCOUTING DEPARTMENT / DRAFT ROOM</span><h1>FIND THE NEXT STAR.</h1><p>Two draft picks per season. These fictional prospects start at age 19 with room to develop.</p></div><span class="status-pill">'+s.era.toUpperCase()+' · '+(2-s.seasonDrafts)+' PICKS LEFT</span></div><section class="panel"><label class="field">SCOUT POSITION<select id="scoutPosition">'+SPORT[sport].positions.map(p=>'<option>'+p+'</option>').join('')+'</select></label><div id="prospectList">'+renderProspects(s,pos)+'</div></section><section class="panel"><span class="eyebrow">DRAFT CLASS</span><h2>YOUR RECENT PICKS.</h2>'+(s.draftClass.length?s.draftClass.slice(-8).reverse().map(x=>'<div class="feed-row"><span class="feed-dot"></span><p>'+esc(x)+'</p></div>').join(''):'<div class="empty-state">No prospects drafted yet.</div>')+'</section>';
}
function renderProspects(s,pos){return draftPool(s,pos).filter(p=>!s.roster.some(x=>x.name===p.name)).slice(0,12).map((p,i)=>'<div class="market-row"><div><b>'+esc(p.name)+'</b><small>'+pos+' · '+esc(p.team)+' · '+p.base+' OVR · '+esc(p.source)+'</small></div><button data-draft="'+esc(p.name)+'" data-pos="'+pos+'" '+(s.seasonDrafts>=2?'disabled':'')+'>DRAFT</button></div>').join('')}
function renderStandings(s){
 const rows=rankedTeams(s).map(team=>({team,...s.standings[team]}));
 return renderSeasonPath(s)+'<div class="page-heading"><div><span class="eyebrow">LEAGUE OFFICE / SEASON '+s.season+'</span><h1>THE STANDINGS.</h1><p>Every result moves the table. Your decisions shape the race.</p></div></div><section class="panel"><div class="table-head"><span>#</span><span>TEAM</span><span>W</span><span>L</span><span>D</span><span>OVR</span></div>'+rows.map((r,i)=>'<div class="standing-row '+(r.team===s.team?'user-team':'')+'"><b class="rank">'+(i+1)+'</b><span>'+esc(r.team)+(r.team===s.team?' <small>YOUR TEAM</small>':'')+'</span><b>'+r.w+'</b><b>'+r.l+'</b><b>'+r.d+'</b><b>'+r.ovr+'</b></div>').join('')+'</section><div class="button-row"><button class="btn primary" data-action="sim-five" '+(s.offseason?'disabled':'')+'>SIMULATE 5 GAMES</button><button class="btn ghost" data-action="sim-rest" '+(s.offseason?'disabled':'')+'>SIMULATE REST OF SEASON</button></div>';
}
function hallEntries(s,pos){
 const list=(LEGENDS[sport][pos]||[]).map(x=>({name:x[0],team:x[1],score:x[2]*18+450,real:true}));
 s.roster.filter(p=>p.pos===pos).forEach(p=>list.push({name:p.name,team:s.team,score:p.careerPoints+(p.overall*7),ovr:p.overall,career:true}));
 s.retired.filter(p=>p.pos===pos).forEach(p=>list.push({name:p.name,team:s.team,score:p.careerPoints+(p.overall*7),ovr:p.overall,retired:true}));
 return list.sort((a,b)=>b.score-a.score);
}
function renderLegacy(s){
 const pos=hofPosition&&SPORT[sport].positions.includes(hofPosition)?hofPosition:SPORT[sport].positions[0];
 hofPosition=pos;
 const list=hallEntries(s,pos);
 const options=SPORT[sport].positions.map(p=>'<option '+(p===pos?'selected':'')+'>'+p+'</option>').join('');
 const rows=list.map((p,i)=>{
  const rank=i===0?'🥇':i===1?'🥈':i===2?'🥉':'#'+(i+1);
  const badge=p.career?'<em>YOUR PLAYER</em>':'';
  const status=p.retired?'RETIRED':p.real?'ALL-TIME LEGEND':'ACTIVE';
  return '<div class="hof-row '+(p.career?'your-player':'')+'"><b class="hof-rank">'+rank+'</b><div class="hof-avatar">'+esc(p.name.split(' ').map(x=>x[0]).slice(0,2).join(''))+'</div><div><b>'+esc(p.name)+' '+badge+'</b><small>'+esc(p.team)+' · '+status+'</small></div><strong>'+p.score.toLocaleString()+'<small>LEGACY PTS</small></strong></div>';
 }).join('');
 const retired=s.retired.length?s.retired.map(p=>'<div class="market-row"><div><b>'+esc(p.name)+'</b><small>'+p.pos+' · '+p.careerPoints+' player legacy points</small></div><span class="badge">RETIRED</span></div>').join(''):'<div class="empty-state">Your first legend has not retired yet.</div>';
 return '<div class="page-heading"><div><span class="eyebrow">LEGACY ROOM / POSITION VS POSITION</span><h1>THE HALL OF FAME.</h1><p>Your players rank against legends at the same position. Legacy points and legend benchmarks are game estimates, not official rankings.</p></div></div><section class="panel"><label class="field">POSITION LEADERBOARD<select id="hofPosition">'+options+'</select></label><div class="hof-list">'+rows+'</div></section><section class="panel"><span class="eyebrow">YOUR FRANCHISE LEGACY</span><h2>'+s.legacyPoints.toLocaleString()+' TEAM LEGACY POINTS</h2><p class="muted">GM points: '+s.gmPoints.toLocaleString()+' · Championships: '+s.seasonHistory.filter(x=>x.title).length+' · Retired players: '+s.retired.length+'</p>'+retired+'</section>';
}

function render(){
 renderTop();
 const s=getSave();if(s)ensureSeason(s);
 $('sidebar').innerHTML=s?'<div class="side-label">FRONT OFFICE</div>'+navHtml()+'<div class="sidebar-bottom"><b>'+esc(s.manager)+'</b><small>GENERAL MANAGER · '+s.gmPoints+' PTS</small><button data-action="new-save">+ NEW SAVE SLOT</button><button data-action="delete-save">DELETE CURRENT SAVE</button></div>':'<div class="side-label">WELCOME</div><div class="side-welcome">Start a dynasty to unlock your front office.</div>';
 $('screen').innerHTML=(page==='setup'||!s)?renderSetup():({dashboard:()=>renderDashboard(s),roster:()=>renderRoster(s),tactics:()=>renderTactics(s),matchday:()=>renderMatchday(s),transactions:()=>renderTransactions(s),scouting:()=>renderScouting(s),standings:()=>renderStandings(s),legacy:()=>renderLegacy(s),saves:()=>renderSaveCenter(s)}[page]||(()=>renderDashboard(s)))();
}
function newSave(){page='setup';render()}
function deleteSave(){const s=getSave();if(!s)return;if(!confirm('Delete this dynasty save? This cannot be undone.'))return;state.saves[sport]=state.saves[sport].filter(x=>x.id!==s.id);state.active[sport]=state.saves[sport][0]?.id||null;page='dashboard';persist();render();notify('Save deleted.')}
function setPage(p){page=p;render()}
function clickHandler(e){
 const locked=getSave();if(locked?.pending&&e.target.closest('[data-sign],[data-draft],[data-tactic],[data-action=trade],[data-action=renew],[data-action=release],[data-action=retire],[data-action=train-team],[data-action=create-player]')){notify('Finish the match before changing your squad.');return}
 let el=e.target.closest('[data-prep]');if(el){const s=getSave();if(s&&!s.pending&&!s.offseason&&!s.preparation){prepareTeam(s,el.dataset.prep);persist();render()}return}
 el=e.target.closest('[data-cloud-load]');if(el){cloudLoad(el.dataset.cloudLoad);return}
 el=e.target.closest('[data-sport]');if(el){sport=el.dataset.sport;page='dashboard';rosterFilter='ALL';hofPosition=null;render();return}
 el=e.target.closest('[data-page]');if(el){page=el.dataset.page;render();return}
 el=e.target.closest('[data-filter]');if(el){rosterFilter=el.dataset.filter;render();return}
 el=e.target.closest('[data-load]');if(el){state.active[sport]=el.dataset.load;page='dashboard';persist();render();return}
 el=e.target.closest('[data-action]');if(el){const a=el.dataset.action,id=el.dataset.id;
  if(a==='create-save'){createSave({manager:$('setupManager')?.value,team:$('setupTeam')?.value,era:$('setupEra')?.value,difficulty:$('setupDifficulty')?.value})}
  else if(a==='auto-lineup'){const s=getSave();if(s&&!s.pending){autoLineup(s);persist();render();notify('Best available lineup selected.')}}
  else if(a==='export-save')exportSave();
  else if(a==='import-save')$('importFile').click();
  else if(a==='cloud-login')cloudAuth('login');
  else if(a==='cloud-signup')cloudAuth('signup');
  else if(a==='cloud-logout')cloudLogout();
  else if(a==='cloud-save')cloudSave();
  else if(a==='cloud-list')cloudList();
  else if(a==='publish-score')publishScore();
  else if(a==='load-scores')loadScores();
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
// Front Office v2: shared league fixtures, real club snapshots, weekly decisions.
function clamp(n,min,max){return Math.max(min,Math.min(max,n))}
function draftPool(s,pos){return Array.from({length:12},(_,i)=>({name:['Mateo','Jordan','Kai','Lucas','Andre','Noah','Diego','Leo','Eli','Marco','Dante','Alex'][i]+' '+['Cruz','Bennett','Reed','Santos','Brooks','Hayes','Rivera','Costa','Walker','Silva','Cole','Vega'][(i+s.season)%12]+' '+pos+' '+s.season,pos,team:'Draft class '+s.year,base:66+((i*7+s.season)%14),source:'Fictional prospect'}))}
function freeAgents(s,pos){return [...(s.released||[]).filter(p=>p.pos===pos),...draftPool(s,pos).map(p=>({...p,name:p.name+' FA',team:'Free Agent',source:'Fictional free agent'}))]}
function clubData(team){return window.ERTeamRosters?.teams?.[sport]?.[team]}
const FRANCHISE_ALIASES={
 nba:{
  'Los Angeles Lakers':['Minneapolis Lakers'],'Sacramento Kings':['Cincinnati Royals','Kansas City Kings','Rochester Royals'],
  'Oklahoma City Thunder':['Seattle SuperSonics'],'Brooklyn Nets':['New Jersey Nets','New York Nets'],
  'Memphis Grizzlies':['Vancouver Grizzlies'],'Charlotte Hornets':['Charlotte Bobcats'],
  'New Orleans Pelicans':['New Orleans Hornets'],'Washington Wizards':['Washington Bullets'],
  'Atlanta Hawks':['St Louis Hawks','St. Louis Hawks','Milwaukee Hawks','Tri-Cities Blackhawks'],
  'Golden State Warriors':['Philadelphia Warriors','San Francisco Warriors'],'Detroit Pistons':['Fort Wayne Pistons'],
  'Philadelphia 76ers':['Syracuse Nationals'],'Utah Jazz':['New Orleans Jazz'],'LA Clippers':['Los Angeles Clippers','San Diego Clippers','Buffalo Braves']
 },
 nfl:{
  'Las Vegas Raiders':['Oakland Raiders','Los Angeles Raiders'],'Los Angeles Chargers':['San Diego Chargers'],
  'Los Angeles Rams':['St Louis Rams','St. Louis Rams','Cleveland Rams'],'Tennessee Titans':['Houston Oilers'],
  'Indianapolis Colts':['Baltimore Colts'],'Washington Commanders':['Washington Redskins','Washington Football Team']
 },
 mlb:{
  'Los Angeles Dodgers':['Brooklyn Dodgers'],'San Francisco Giants':['New York Giants'],
  'Washington Nationals':['Montreal Expos'],'Miami Marlins':['Florida Marlins'],
  'Tampa Bay Rays':['Tampa Bay Devil Rays'],'Cleveland Guardians':['Cleveland Indians'],
  'Oakland Athletics':['Philadelphia Athletics','Kansas City Athletics'],
  'Atlanta Braves':['Boston Braves','Milwaukee Braves'],'Baltimore Orioles':['St Louis Browns','St. Louis Browns'],
  'Minnesota Twins':['Washington Senators'],'New York Yankees':['New York Highlanders'],
  'Los Angeles Angels':['California Angels','Anaheim Angels'],'Chicago White Sox':['Chicago White Stockings'],
  'Cincinnati Reds':['Cincinnati Redlegs']
 },
 soccer:{}
};
function normalizedClubName(value){return String(value||'').toLowerCase().replace(/[^a-z0-9]/g,'')}
function sameFranchise(playerTeam,selectedTeam){
 const aliases=FRANCHISE_ALIASES[sport]?.[selectedTeam]||[];
 const accepted=[selectedTeam,...aliases].map(normalizedClubName);
 return accepted.includes(normalizedClubName(playerTeam));
}
function clubColor(team){return /^#[a-f0-9]{6}$/i.test(clubData(team)?.color||'')?clubData(team).color:'#254d47'}
function clubBadge(team){const c=clubData(team);return c?.logo?'<img src="'+esc(c.logo)+'" alt="'+esc(team)+' crest" loading="lazy">':'<b>ER</b>'}
function makeClubRoster(team,era){
 if(era==='alltime'){
  const used=new Set();
  return PLAN[sport].map((pos,i)=>{
   const pool=playerPools(pos,era),home=pool.filter(p=>sameFranchise(p.team,team)&&!used.has(p.name.toLowerCase()));
   const candidate=home[0]||pool.find(p=>!used.has(p.name.toLowerCase()));
   if(!candidate)return null;
   used.add(candidate.name.toLowerCase());
   const player=makePlayer(candidate,pos,false,i);
   player.team=team;player.originalTeam=candidate.team;player.depthRank=PLAN[sport].slice(0,i).filter(x=>x===pos).length;
   if(!sameFranchise(candidate.team,team))player.source='All-Time Legend Free Agent';
   return player;
  }).filter(Boolean);
 }
 const club=clubData(team);if(!club)return makeRoster(era);
 const players=club.players.map((p,i)=>({...makePlayer(p,p.pos,false,i),overall:p.base,potential:Math.min(99,p.base+(p.age<25?8:p.age<29?3:0)),age:p.age||25,photo:p.photo,jersey:p.jersey,listedPosition:p.listedPosition,team,originalTeam:team,depthRank:p.depthRank??9,source:'ESPN snapshot · '+(window.ERTeamRosters?.fetchedAt||'').slice(0,10)}));
 const budget=players.reduce((n,p)=>n+p.salary,0),scale=Math.min(1,capFor()*.87/Math.max(1,budget));players.forEach(p=>p.salary=Math.max(.4,Math.round(p.salary*scale*10)/10));return players;
}
function initialLineup(s){s.roster.forEach(p=>p.starter=false);Object.entries(STARTERS[sport]).forEach(([pos,n])=>s.roster.filter(p=>p.pos===pos&&!p.injured).sort((a,b)=>(a.depthRank??9)-(b.depthRank??9)||b.overall-a.overall).slice(0,n).forEach(p=>p.starter=true))}
function autoLineup(s){s.roster.forEach(p=>p.starter=false);fillVacancies(s)}
function fillVacancies(s){Object.entries(STARTERS[sport]).forEach(([pos,count])=>{const active=s.roster.filter(p=>p.pos===pos&&p.starter&&!p.injured).length;s.roster.filter(p=>p.pos===pos&&!p.starter&&!p.injured).sort((a,b)=>(b.overall-b.fatigue*.15)-(a.overall-a.fatigue*.15)).slice(0,Math.max(0,count-active)).forEach(p=>p.starter=true)})}
function clubRating(team,era){const ps=clubData(team)?.players;if(!ps?.length)return 76;const top=[];Object.entries(STARTERS[sport]).forEach(([pos,n])=>top.push(...ps.filter(p=>p.pos===pos).sort((a,b)=>b.base-a.base).slice(0,n)));return top.length?Math.round(top.reduce((n,p)=>n+p.base,0)/top.length):76}
function ensureSeason(s){
 s.matchHistory=s.matchHistory||[];s.seasonDrafts=s.seasonDrafts||0;
 if(!s.schedule){
  let rotation=Object.keys(s.standings);if(!rotation.includes(s.team))rotation.push(s.team);if(rotation.length%2)rotation.push(null);
  const cycle=[];for(let round=0;round<rotation.length-1;round++){const fixtures=[];for(let i=0;i<rotation.length/2;i++){const a=rotation[i],b=rotation[rotation.length-1-i];if(a&&b)fixtures.push(round%2?[b,a]:[a,b])}cycle.push(fixtures);rotation=[rotation[0],rotation[rotation.length-1],...rotation.slice(1,-1)]}
  s.schedule=Array.from({length:SPORT[sport].games},(_,i)=>cycle[i%cycle.length].map(pair=>Math.floor(i/cycle.length)%2?pair.slice().reverse():pair.slice()));
 }
 // Existing careers retain their roster and record; only missing v2 fields are added.
 if(!s.engineVersion){s.engineVersion=2;Object.entries(s.standings).forEach(([t,r])=>{if(t===s.team)return;const games=r.w+r.l+r.d,rate=games?r.w/games:.5;r.w=Math.round(rate*s.week);r.d=0;r.l=s.week-r.w});}
}
function nextOpponent(s){if(s.offseason)return 'Season complete';if(s.playoffs){const pair=s.playoffs.pairs.find(p=>p.includes(s.team));return pair?.find(t=>t!==s.team)||'Final'}const pair=s.schedule?.[s.week]?.find(p=>p.includes(s.team));return pair?.find(t=>t!==s.team)||Object.keys(s.standings).find(t=>t!==s.team)}
function leagueResult(s,a,b,x,y){const ra=s.standings[a],rb=s.standings[b];if(x>y){ra.w++;rb.l++}else if(x<y){ra.l++;rb.w++}else{ra.d++;rb.d++}}
function resolveTie(x,y){
 if(sport==='soccer'||x!==y)return [x,y];
 const bonus=sport==='nfl'?(Math.random()<.72?3:7):sport==='nba'?(Math.random()<.65?2:3):1;
 if(Math.random()<.5)x+=bonus;else y+=bonus;
 return [x,y];
}
function simulatePair(s,a,b){
 const diff=(s.standings[a]?.ovr||78)-(s.standings[b]?.ovr||78);
 return resolveTie(segmentScore(sport,diff)*2,segmentScore(sport,-diff)*2);
}
function updateLeagueRound(s,opponent,home,away){
 for(const [a,b] of s.schedule[s.week]||[]){if(a===s.team)leagueResult(s,a,b,home,away);else if(b===s.team)leagueResult(s,a,b,away,home);else{const [x,y]=simulatePair(s,a,b);leagueResult(s,a,b,x,y)}}s.standings[s.team].ovr=teamOvr(s);
}
function rankedTeams(s){return Object.keys(s.standings).sort((a,b)=>{const x=s.standings[a],y=s.standings[b];return (sport==='soccer'?(y.w*3+y.d)-(x.w*3+x.d):y.w-x.w)||x.l-y.l||y.ovr-x.ovr||a.localeCompare(b)})}
function playoffLabel(s){return ['QUARTERFINAL','SEMIFINAL','CHAMPIONSHIP'][s.playoffs?.round||0]}
function endRegularSeason(s){
 const table=rankedTeams(s);if(sport==='soccer'){completeSeason(s,table[0]===s.team);return}
 const top=table.slice(0,8);if(!top.includes(s.team)){feed(s,'Finished #'+(table.indexOf(s.team)+1)+'. Top eight advance; your season ends here.');completeSeason(s,false);return}
 s.playoffs={round:0,pairs:[[top[0],top[7]],[top[3],top[4]],[top[1],top[6]],[top[2],top[5]]]};feed(s,'PLAYOFF BERTH! You are seed #'+(top.indexOf(s.team)+1)+'. Three knockout wins earn the ERA Cup.');
}
function advancePlayoffs(s,win){
 const bracket=s.playoffs,winners=bracket.pairs.map(([a,b])=>{if(a===s.team||b===s.team)return win?s.team:(a===s.team?b:a);const [x,y]=simulatePair(s,a,b);return x>=y?a:b});
 if(!win){feed(s,'Eliminated in the '+playoffLabel(s).toLowerCase()+'.');completeSeason(s,false);return}
 if(winners.length===1){completeSeason(s,true);return}bracket.round++;bracket.pairs=[];for(let i=0;i<winners.length;i+=2)bracket.pairs.push([winners[i],winners[i+1]]);feed(s,'Advanced to the '+playoffLabel(s).toLowerCase()+'.');
}
function prepareTeam(s,key){
 if(s.preparation||s.pending||s.offseason)return;
 const options={recover:{label:'Recovery day',bonus:0},chemistry:{label:'Team meeting',bonus:1},intense:{label:'Intense practice',bonus:3}};const selected=options[key];if(!selected)return;s.preparation=selected;
 if(key==='recover')s.roster.forEach(p=>p.fatigue=Math.max(0,p.fatigue-18));
 if(key==='chemistry'){s.morale=clamp(s.morale+2,30,100);s.chemistry=clamp(s.chemistry+3,35,99);s.roster.forEach(p=>p.morale=clamp(p.morale+2,30,100))}
 if(key==='intense')s.roster.filter(p=>!p.injured).forEach(p=>p.fatigue=clamp(p.fatigue+10,0,100));
 feed(s,selected.label+' chosen before '+nextOpponent(s)+'.');
}
function renderDecisionRoom(s){
 if(s.offseason)return renderSeasonPath(s);
 const avg=Math.round(starters(s).reduce((a,p)=>a+p.fatigue,0)/Math.max(1,starters(s).length));
 const cards=[['recover','Recovery day','−18 fatigue','Rest the squad. No extra match boost.'],['chemistry','Team meeting','+3 chemistry · +2 morale','Build trust. +1 strength for this game.'],['intense','Intense practice','+3 match strength · +10 fatigue','Sharper execution, but tired players risk injury.']];
 return '<section class="panel decision-room"><div class="panel-top"><div><span class="eyebrow">'+(s.playoffs?playoffLabel(s):'GAME '+(s.week+1))+' / DECISION ROOM</span><h2>EVERY CALL HAS A COST.</h2></div><span class="status-pill">SQUAD FATIGUE '+avg+'%</span></div><p class="muted">'+(s.preparation?'Preparation locked: '+esc(s.preparation.label)+'. Next, set your lineup and head to matchday.':'Choose one preparation before your next game. Your choice lasts for one match.')+'</p><div class="decision-grid">'+cards.map(([key,label,effect,desc])=>'<button class="decision-card '+(s.preparation?.label===label?'chosen':'')+'" data-prep="'+key+'" '+(s.preparation||s.pending?'disabled':'')+'><span>'+effect+'</span><b>'+label+'</b><small>'+desc+'</small></button>').join('')+'</div><div class="season-progress"><span>BOARD TARGET · '+s.record.w+' / '+Math.ceil(SPORT[sport].games*.5)+' WINS</span><progress max="'+Math.ceil(SPORT[sport].games*.5)+'" value="'+s.record.w+'"></progress><span>+150 GM points</span></div>'+(s.preparation?'<button class="btn primary" data-page="matchday">'+(s.pending?'RESUME MATCH':'GO TO MATCHDAY')+' →</button>':'')+'</section>';
}
function renderSeasonPath(s){const rank=rankedTeams(s).indexOf(s.team)+1;return '<section class="panel season-path"><span class="eyebrow">THE ROAD TO A DYNASTY</span><h2>'+(s.offseason?'SEASON '+s.season+' COMPLETE':s.playoffs?'ERA CUP · '+playoffLabel(s):'LEAGUE POSITION #'+rank)+'</h2><p class="muted">'+(sport==='soccer'?'Three points for a win, one for a draw. First place wins this custom 20-club league.':'Top eight qualify for the ERA Cup: quarterfinal, semifinal, final. Single-game knockouts in this custom league.')+' Ties in the table: fewer losses, then team rating.</p>'+(s.playoffs?s.playoffs.pairs.map(([a,b])=>'<div class="bracket-pair '+([a,b].includes(s.team)?'your-player':'')+'"><b>'+esc(a)+'</b><span>VS</span><b>'+esc(b)+'</b></div>').join(''):'')+(s.offseason&&s.seasonHistory[0]?'<div class="season-awards">'+esc(s.seasonHistory[0].awards.join(' · ')||'Reload. Rebuild. Run it back.')+'</div>':'')+'</section>'}
// Save backup validation also applies to data downloaded from the cloud.
function validateSave(v){
 if(!v||typeof v!=='object'||!SPORT[v.sport]||!['current','alltime'].includes(v.era)||typeof v.team!=='string'||typeof v.manager!=='string'||!Array.isArray(v.roster)||v.roster.length>120)throw Error('This is not a valid Era Rivals save.');
 for(const key of ['season','year','week','chemistry','morale','fanSupport','gmRep','gmPoints','trainingPoints','legacyPoints'])if(!Number.isFinite(v[key])||v[key]<0)throw Error('Invalid save values.');
 if(v.week>SPORT[v.sport].games||!v.tactics||typeof v.tactics.off!=='string'||!v.record||!v.standings||!v.standings[v.team])throw Error('Invalid season data.');
 for(const key of ['w','l','d'])if(!Number.isInteger(v.record[key])||v.record[key]<0)throw Error('Invalid record.');
 if(v.record.w+v.record.l+v.record.d!==v.week)throw Error('Record does not match games played.');
 for(const key of ['retired','seasonHistory','feed','draftClass'])if(!Array.isArray(v[key]))throw Error('Incomplete save.');
 for(const p of [...v.roster,...v.retired]){
  if(typeof p.name!=='string'||!SPORT[v.sport].positions.includes(p.pos)||typeof p.id!=='string'||!/^[a-z0-9-]+$/i.test(p.id))throw Error('Invalid player.');
  for(const key of ['overall','potential','age','salary','contractYears','fatigue','morale','careerPoints','games','injured'])if(!Number.isFinite(p[key])||p[key]<0)throw Error('Invalid player values.');
  if(p.overall>100||p.fatigue>100||p.morale>100||!Array.isArray(p.awards))throw Error('Invalid player rating.');
  if(p.photo&&!/^https:\/\/a\.espncdn\.com\//.test(p.photo))delete p.photo;
 }
 if(typeof v.id!=='string'||!/^[a-z0-9-]+$/i.test(v.id))throw Error('Invalid save identity.');
 // Schedules are rebuilt from the selected universe, never trusted as executable input.
 v.schedule=null;
 if(v.pending){const q=v.pending;if(typeof q.opponent!=='string'||!v.standings[q.opponent]||![q.home,q.away,q.oppOvr].every(Number.isFinite)||!Array.isArray(q.options)||q.options.length!==3)throw Error('Invalid match data.');for(const o of q.options)if(!Array.isArray(o)||typeof o[0]!=='string'||typeof o[1]!=='string'||!o.slice(2,5).every(Number.isFinite))throw Error('Invalid decision.');}
 if(v.playoffs){const q=v.playoffs;if(!Number.isInteger(q.round)||q.round<0||q.round>2||!Array.isArray(q.pairs)||q.pairs.length!==[4,2,1][q.round]||q.pairs.some(pair=>!Array.isArray(pair)||pair.length!==2||pair.some(t=>!v.standings[t])))throw Error('Invalid playoff bracket.');}
 return v;
}
function exportSave(){const s=getSave();if(!s)return;const blob=new Blob([JSON.stringify({format:'era-rivals-save',version:2,save:s},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='era-rivals-'+sport+'-season-'+s.season+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('Save backup downloaded.');}
function addImportedSave(v){const target=state.saves[v.sport];if(target.length>=5)throw Error('All five slots for this sport are full. Delete one first.');v.id='save-'+Date.now()+'-'+Math.random().toString(36).slice(2,6);target.push(v);sport=v.sport;state.active[sport]=v.id;ensureSeason(v);if(!v.offseason&&!v.playoffs&&v.week>=SPORT[sport].games)endRegularSeason(v);page='dashboard';persist();render()}
async function importSave(file){try{if(!file)return;if(file.size>1500000)throw Error('Save file is too large.');const raw=JSON.parse(await file.text());addImportedSave(validateSave(raw.save||raw));notify('Backup loaded in a new slot.')}catch(e){notify(e.message,'bad')}}
let cloudClient=null,cloudUser=null,cloudBusy=false,cloudMessage='',cloudRows=[],scoreRows=[];
function cloud(){if(!cloudClient&&window.supabase)cloudClient=window.supabase.createClient('https://blfivhuhlcawgmrchzeu.supabase.co','sb_publishable_vkADCw0MqIJTZr1XXCLDoA_b_0wnPdw');if(!cloudClient)throw Error('Online services did not load. Local saves still work.');return cloudClient}
function cloudStatus(message){cloudMessage=message;if(page==='saves')render();}
async function cloudRun(work){if(cloudBusy)return;cloudBusy=true;try{await work()}catch(e){cloudStatus(e.message||'Connection failed. Try again.')}finally{cloudBusy=false;if(page==='saves')render()}}
async function cloudAuth(mode){const email=$('cloudEmail')?.value.trim(),password=$('cloudPassword')?.value;if(!email||!password){cloudStatus('Enter your email and password.');return}if(mode==='signup'&&password.length<8){cloudStatus('Use a password with at least 8 characters.');return}await cloudRun(async()=>{const result=mode==='signup'?await cloud().auth.signUp({email,password}):await cloud().auth.signInWithPassword({email,password});if(result.error)throw result.error;cloudUser=result.data.session?.user||null;cloudStatus(cloudUser?'Signed in. Upload this dynasty or browse your cloud saves.':'Check your email to confirm your account. Then return to this game and sign in.');})}
async function cloudLogout(){await cloudRun(async()=>{const {error}=await cloud().auth.signOut();if(error)throw error;cloudUser=null;cloudRows=[];cloudStatus('Signed out. Local saves are still on this device.');})}
async function requireUser(){const {data,error}=await cloud().auth.getUser();if(error||!data.user)throw Error('Sign in to use cloud saves.');cloudUser=data.user;return data.user}
async function cloudSave(){const s=getSave();if(!s)return;await cloudRun(async()=>{const u=await requireUser();const {error}=await cloud().from('dynasty_saves').upsert({user_id:u.id,slot_id:s.id,sport:s.sport,team:s.team,payload:JSON.parse(JSON.stringify(s)),updated_at:new Date().toISOString()},{onConflict:'user_id,slot_id'});if(error)throw error;cloudStatus('Cloud save updated. You can load it on another device.');})}
async function cloudList(){await cloudRun(async()=>{await requireUser();const {data,error}=await cloud().from('dynasty_saves').select('slot_id,sport,team,updated_at').order('updated_at',{ascending:false}).limit(30);if(error)throw error;cloudRows=data;cloudStatus(data.length?'Choose a cloud save to load into a new local slot.':'No cloud saves yet. Upload your current dynasty.');})}
async function cloudLoad(id){await cloudRun(async()=>{await requireUser();const {data,error}=await cloud().from('dynasty_saves').select('payload').eq('slot_id',id).single();if(error)throw error;addImportedSave(validateSave(data.payload));notify('Cloud dynasty loaded in a new local slot.');})}
async function publishScore(){const s=getSave(),nickname=$('scoreNickname')?.value.trim();if(!nickname||nickname.length>24){cloudStatus('Choose a public nickname (1–24 characters).');return}await cloudRun(async()=>{const u=await requireUser();const values={nickname,team:s.team,score:Math.round(s.gmPoints),titles:s.seasonHistory.filter(x=>x.title).length,updated_at:new Date().toISOString()};const updated=await cloud().from('dynasty_scores').update(values).eq('sport',sport).eq('era',s.era).select('score');if(updated.error)throw updated.error;if(!updated.data.length){const {error}=await cloud().from('dynasty_scores').insert({...values,user_id:u.id,sport,era:s.era});if(error)throw error}cloudStatus('Published to the casual leaderboard. Your save and email stay private.');})}
async function loadScores(){const s=getSave();await cloudRun(async()=>{const {data,error}=await cloud().from('dynasty_scores').select('nickname,team,score,titles').eq('sport',sport).eq('era',s.era).order('score',{ascending:false}).limit(30);if(error)throw error;scoreRows=data;cloudStatus(data.length?'Leaderboard refreshed.':'No scores yet for this sport and era.');})}
function renderSaveCenter(s){return '<div class="page-heading"><div><span class="eyebrow">YOUR DYNASTY / ANY DEVICE</span><h1>KEEP YOUR LEGACY.</h1><p>Local saves are automatic. Upload a cloud snapshot whenever you want to carry it to another device.</p></div></div><div class="dashboard-grid"><section class="panel"><span class="eyebrow">LOCAL BACKUPS</span><h2>YOUR SAVE. YOUR FILE.</h2><p class="muted">Download a backup or import one into a new slot. Existing local dynasties are kept.</p><div class="button-row"><button class="btn primary" data-action="export-save">DOWNLOAD BACKUP</button><button class="btn ghost" data-action="import-save">IMPORT BACKUP</button><input id="importFile" type="file" accept=".json,application/json" hidden></div></section><section class="panel"><span class="eyebrow">PRIVATE CLOUD SAVES</span><h2>'+(cloudUser?'SIGNED IN.':'TAKE IT WITH YOU.')+'</h2>'+(cloudUser?'<p class="muted">Cloud snapshots are private to your account.</p><div class="button-row"><button class="btn primary" data-action="cloud-save">UPLOAD THIS DYNASTY</button><button class="btn ghost" data-action="cloud-list">MY CLOUD SAVES</button><button class="text-btn" data-action="cloud-logout">SIGN OUT</button></div>':'<label class="field">EMAIL<input id="cloudEmail" type="email" autocomplete="email" placeholder="Your email"></label><label class="field">PASSWORD<input id="cloudPassword" type="password" autocomplete="current-password" placeholder="At least 8 characters"></label><div class="button-row"><button class="btn primary" data-action="cloud-login">SIGN IN</button><button class="btn ghost" data-action="cloud-signup">CREATE ACCOUNT</button></div><p class="fineprint">Creating an account sends a confirmation email. Confirm it, then return here to sign in.</p>')+'</section></div><p class="cloud-status" role="status">'+esc(cloudMessage||'Cloud uploads and leaderboard publishing happen only when you choose them.')+'</p>'+cloudRows.map(r=>'<div class="panel market-row"><div><b>'+esc(r.team)+'</b><small>'+esc(r.sport.toUpperCase())+' · '+esc(new Date(r.updated_at).toLocaleString())+'</small></div><button class="btn" data-cloud-load="'+esc(r.slot_id)+'">LOAD COPY</button></div>').join('')+'<section class="panel leaderboard"><span class="eyebrow">'+SPORT[sport].name+' · '+s.era.toUpperCase()+' ERA</span><h2>COMMUNITY LEADERBOARD.</h2><p class="muted">Casual, self-reported GM scores. These are not verified competitive records. Only your chosen nickname, team, titles and score are public.</p><label class="field">PUBLIC NICKNAME<input id="scoreNickname" maxlength="24" placeholder="Choose a nickname"></label><div class="button-row"><button class="btn primary" data-action="publish-score">PUBLISH MY SCORE</button><button class="btn ghost" data-action="load-scores">VIEW LEADERBOARD</button></div>'+scoreRows.map((r,i)=>'<div class="market-row"><b>#'+(i+1)+' '+esc(r.nickname)+'</b><span>'+esc(r.team)+' · '+r.titles+' titles</span><strong>'+Number(r.score).toLocaleString()+' PTS</strong></div>').join('')+'</section>'}
// Auth recovery is optional; an unavailable network never blocks the local game.
Promise.resolve().then(async()=>{try{const {data}=await cloud().auth.getSession();cloudUser=data.session?.user||null;cloud().auth.onAuthStateChange((_event,session)=>{cloudUser=session?.user||null;});}catch(e){/* Local play remains available. */}});

document.addEventListener('click',clickHandler);
document.addEventListener('change',e=>{
 const s=getSave();
 if(e.target.id==='importFile'){importSave(e.target.files[0]);return}
 if(e.target.id==='slotSelect'){state.active[sport]=e.target.value;page='dashboard';persist();render()}
 if(!s)return;if(s.pending&&['tempoSelect','riskSelect','rotationSelect','trainingSelect','matchPlan'].includes(e.target.id)){render();notify('Your match is already in progress.');return}
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