(function(){
'use strict';
var PROFILE_KEY='era_rivals_pro_v1',STORE_KEY='er_career_saves_v2';
var INFO={nba:{name:'BASKETBALL',emoji:'🏀',length:82,positions:['PG','SG','SF','PF','C'],unit:'PTS'},nfl:{name:'FOOTBALL',emoji:'🏈',length:17,positions:['QB','RB','WR','TE','OL','DL','LB','CB','S'],unit:'YDS'},soccer:{name:'SOCCER',emoji:'⚽',length:38,positions:['GK','RB','CB','LB','CDM','CM','CAM','RW','LW','ST'],unit:'G/A'},mlb:{name:'BASEBALL',emoji:'⚾',length:162,positions:['P','C','1B','2B','3B','SS','LF','CF','RF'],unit:'HITS'}};
var CATALOG={
nba:[['NBA MVP',1000],['NBA Championship',1500],['Finals MVP',1000],['NBA All-Star',250],['Rookie of the Year',500],['Defensive Player of the Year',600],['All-NBA First Team',400],['Scoring Champion',350],['NBA record broken',200],['Hall of Fame Induction',2000]],
nfl:[['NFL MVP',1000],['Super Bowl Champion',1500],['Super Bowl MVP',1000],['Pro Bowl',250],['Offensive Rookie of the Year',500],['Defensive Player of the Year',600],['First-Team All-Pro',400],['Passing / Rushing / Receiving Leader',350],['NFL record broken',200],['Hall of Fame Induction',2000]],
soccer:[['Ballon d’Or',1200],['FIFA World Cup Champion',2000],['UEFA Champions League Champion',1500],['League Champion',900],['Golden Boot',500],['Team of the Year',400],['Player of the Year',1000],['World record broken',200],['Hall of Fame Induction',2000]],
mlb:[['MLB MVP',1000],['World Series Champion',1500],['World Series MVP',1000],['MLB All-Star',250],['Rookie of the Year',500],['Cy Young Award',900],['Gold Glove',300],['Silver Slugger',350],['MLB record broken',200],['Hall of Fame Induction',2000]]};
var FIRST=['Andre','Marcus','Jalen','Cameron','Isaiah','Malik','Darius','Julian','Tyrese','Noah','Ethan','Mateo','Luca','Jordan','Devin','Xavier','Miles','Adrian','Kai','Antonio'];
var LAST=['Carter','Johnson','Walker','Brooks','Rivera','Santos','Bennett','Williams','Morgan','Coleman','Thompson','Evans','Howard','Robinson','King','Mitchell','Reed','Parker','Davis','Miller'];
var activeSport=(new URLSearchParams(location.search).get('sport')||'nba').toLowerCase();
if(!INFO[activeSport])activeSport='nba';
var store=readStore(),currentTab='overview',tradeOffer=null,offers=[],selectedAttr='',simulating=false,root=null;
var rawSet=Storage.prototype.setItem;
function clone(v){return JSON.parse(JSON.stringify(v))}
function readJSON(k,d){try{var v=JSON.parse(localStorage.getItem(k)||'null');return v==null?d:v}catch(e){return d}}
function readStore(){var v=readJSON(STORE_KEY,{});if(!v||typeof v!=='object')v={};v.saves=v.saves||{};v.active=v.active||{};['nba','nfl','soccer','mlb'].forEach(function(s){if(!Array.isArray(v.saves[s]))v.saves[s]=[]});return v}
function writeStore(){try{rawSet.call(localStorage,STORE_KEY,JSON.stringify(store))}catch(e){console.warn('Career save unavailable',e)}}
function profiles(){return readJSON(PROFILE_KEY,{})}
function activeSlot(sp){return (store.saves[sp]||[]).find(function(x){return x.id===store.active[sp]})||null}
function getProfile(){return window.ERPro&&window.ERPro.getSport()===activeSport?window.ERPro.getProfile():(profiles()[activeSport]||null)}
function rating(p){var a=Object.values((p&&p.attrs)||{}).map(Number).filter(Number.isFinite);return a.length?Math.round(a.reduce(function(x,y){return x+y},0)/a.length):70}
function salary(p){var base={nba:1.2,nfl:.9,soccer:1.1,mlb:.8}[p.sport]||1;return Math.max(.7,Math.round(base*Math.pow(Math.max(60,rating(p))/75,2)*10)/10)}
function makeDepth(sp,p){var rows=[];INFO[sp].positions.forEach(function(pos,i){rows.push({id:sp+pos+'1',pos:pos,name:pos===p.position?p.name:FIRST[(i*3+2)%20]+' '+LAST[(i*5+1)%20],rating:Math.max(60,rating(p)-2+i%4),starter:true});rows.push({id:sp+pos+'2',pos:pos,name:FIRST[(i*5+7)%20]+' '+LAST[(i*7+4)%20],rating:65+(i*7)%19,starter:false})});return rows}
function blankCareer(sp,p){return {age:p.level==='college'?19:22,seasons:0,season:Number(p.season||1),seasonGames:Number(p.played||0)%INFO[sp].length,seasonWins:0,seasonLosses:0,seasonValue:0,games:Number(p.played||0),trainingPoints:5,legacyPoints:0,awards:[],history:[],championships:0,status:'ACTIVE',retiredAt:null,contract:{salary:salary(p),years:4,status:'SIGNED',team:p.team||''},depthChart:makeDepth(sp,p),trades:[]}}
function createSlot(sp,p,name){var q=clone(p);q.sport=sp;q.played=0;q.wins=0;q.losses=0;q.draws=0;q.points=0;q.xp=0;q.season=1;q.history=[];return {id:'career-'+Date.now()+'-'+Math.floor(Math.random()*99999),name:name||q.name||'New Career',sport:sp,createdAt:Date.now(),profile:q,career:blankCareer(sp,q)}}
function boot(){var s=activeSlot(activeSport);if(s&&s.profile){var all=profiles();all[activeSport]=clone(s.profile);try{rawSet.call(localStorage,PROFILE_KEY,JSON.stringify(all))}catch(e){}}}
boot();
function syncProfile(value){try{var all=JSON.parse(value||'{}'),s=activeSlot(activeSport);if(s&&all[activeSport]){s.profile=clone(all[activeSport]);writeStore()}}catch(e){}}
Storage.prototype.setItem=function(k,v){rawSet.call(this,k,v);if(k===PROFILE_KEY&&!window.__ERCareerSyncing)syncProfile(v)};
function ensure(sp){if(!activeSlot(sp)&&window.ERPro){var s=createSlot(sp,window.ERPro.getProfile());store.saves[sp].push(s);store.active[sp]=s.id;writeStore()}return activeSlot(sp)}
function career(){var s=activeSlot(activeSport);return s?s.career:null}
function saveCurrent(){var s=activeSlot(activeSport),p=getProfile();if(s&&p){s.profile=clone(p);writeStore()}}
function activate(id){var s=(store.saves[activeSport]||[]).find(function(x){return x.id===id});if(!s)return;store.active[activeSport]=id;writeStore();if(window.ERPro)window.ERPro.loadProfile(activeSport,s.profile);render()}
function newCareer(){var a=store.saves[activeSport]||[];if(a.length>=5){toast('All 5 career slots are full. Delete one first.');return}var p=getProfile();if(!p){toast('Build your player first.');return}var s=createSlot(activeSport,p,'CAREER '+(a.length+1));a.push(s);store.saves[activeSport]=a;store.active[activeSport]=s.id;writeStore();if(window.ERPro)window.ERPro.loadProfile(activeSport,s.profile);currentTab='overview';render();toast('New career created.')}
function deleteCareer(){var a=store.saves[activeSport]||[],s=activeSlot(activeSport);if(!s||a.length<2){toast('Keep at least one save slot.');return}if(!confirm('Delete '+s.name+'? This cannot be recovered.'))return;store.saves[activeSport]=a.filter(function(x){return x.id!==s.id});store.active[activeSport]=store.saves[activeSport][0].id;writeStore();if(window.ERPro)window.ERPro.loadProfile(activeSport,store.saves[activeSport][0].profile);render();toast('Career slot deleted.')}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function money(n){return '$'+Number(n||0).toFixed(1)+'M'}
function tier(n){return n>=10000?'GOAT':n>=7500?'HALL OF FAME':n>=5000?'ALL-TIME GREAT':n>=2500?'SUPERSTAR':n>=1000?'RISING LEGEND':'PROSPECT'}
function hofScore(s){var c=s.career||{},p=s.profile||{};return Number(c.legacyPoints||0)+Math.min(1200,Number(c.seasons||0)*45)+Math.min(600,Number(p.played||0)*2)}
function give(c,label,points){var n=Number(c.season||1);if((c.awards||[]).some(function(a){return a.label===label&&a.season===n}))return false;c.awards.unshift({label:label,points:points,season:n,date:Date.now()});c.legacyPoints=(c.legacyPoints||0)+points;if(/champion|championship|super bowl|world series/i.test(label))c.championships=(c.championships||0)+1;return true}
function awardSeason(sp,s){var c=s.career,p=s.profile,o=rating(p),g=c.seasonGames||INFO[sp].length,w=c.seasonWins||0,r=g?w/g:0,earned=[];function a(n,v){if(give(c,n,v))earned.push(n)}
 if(sp==='nba'){if(o>=86&&r>=.59)a('NBA MVP',1000);if(o>=80&&r>=.48)a('NBA All-Star',250);if(o>=82&&r>=.55)a('All-NBA First Team',400);if(o>=84&&r>=.55&&Number(p.attrs['Perimeter Defense']||p.attrs.Block||70)>=82)a('Defensive Player of the Year',600);if(o>=84&&c.seasonValue>=1600)a('Scoring Champion',350);if(w>=Math.ceil(g*.62)&&Math.random()<.22+(o-80)*.012){a('NBA Championship',1500);a('Finals MVP',1000)}if(c.seasons===0&&o>=75)a('Rookie of the Year',500)}
 else if(sp==='nfl'){if(o>=87&&r>=.62&&(p.position==='QB'||c.seasonValue>=2500))a('NFL MVP',1000);if(o>=80&&r>=.47)a('Pro Bowl',250);if(o>=83&&r>=.53)a('First-Team All-Pro',400);if(o>=84&&p.position==='QB'&&c.seasonValue>=3500)a('Passing / Rushing / Receiving Leader',350);if(o>=80&&c.seasons===0)a('Offensive Rookie of the Year',500);if(w>=Math.ceil(g*.65)&&Math.random()<.24+(o-80)*.012){a('Super Bowl Champion',1500);if(o>=86)a('Super Bowl MVP',1000)}if(o>=84&&p.position==='LB'&&r>=.55)a('Defensive Player of the Year',600)}
 else if(sp==='soccer'){if(o>=87&&r>=.58&&c.seasonValue>=20)a('Ballon d’Or',1200);if(o>=80&&r>=.48)a('Team of the Year',400);if(o>=82&&r>=.55&&c.seasonValue>=18)a('Golden Boot',500);if(w>=Math.ceil(g*.58)&&Math.random()<.3+(o-80)*.01)a('League Champion',900);if(o>=86&&r>=.57&&Math.random()<.28)a('UEFA Champions League Champion',1500);if(o>=88&&c.seasonValue>=24)a('Player of the Year',1000);if(c.season%4===0&&o>=85&&Math.random()<.24)a('FIFA World Cup Champion',2000)}
 else{if(o>=86&&r>=.56&&c.seasonValue>=110)a('MLB MVP',1000);if(o>=80&&r>=.48)a('MLB All-Star',250);if(o>=82&&r>=.52)a('Silver Slugger',350);if(o>=82&&r>=.52)a('Gold Glove',300);if(p.position==='P'&&o>=84&&r>=.52)a('Cy Young Award',900);if(o>=80&&c.seasons===0)a('Rookie of the Year',500);if(w>=Math.ceil(g*.57)&&Math.random()<.2+(o-80)*.012){a('World Series Champion',1500);if(o>=86)a('World Series MVP',1000)}}
 return earned}
