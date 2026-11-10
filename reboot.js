/* ERA RIVALS REBORN: independent visual-first front end. */
(function(root){
'use strict';
const E=root.ERRebootEngine;
if(!E)throw new Error('Reboot simulation not loaded');
const KEY='era_rivals_reborn_v1',MAX=5;
const PHOTOS={
 nba:'https://upload.wikimedia.org/wikipedia/commons/f/f0/Jordan_by_Lipofsky_16577_%28high_quality%29.jpg',
 nfl:'https://upload.wikimedia.org/wikipedia/commons/3/3b/Tom_Brady_2015.JPG',
 soccer:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Lionel-Messi-Argentina-2022-FIFA-World-Cup_sharpness.jpg/960px-Lionel-Messi-Argentina-2022-FIFA-World-Cup_sharpness.jpg',
 mlb:'https://upload.wikimedia.org/wikipedia/commons/7/79/Babe_Ruth%2C_full-length_portrait%2C_standing%2C_facing_front%2C_holding_up_bat%2C_in_baseball_uniform%2C_on_field_LCCN89714713.jpg'
};
const NAMES={nba:'BASKETBALL',nfl:'FOOTBALL',soccer:'SOCCER',mlb:'BASEBALL'};
const LABELS={nba:'NBA-STYLE',nfl:'NFL-STYLE',soccer:'FOOTBALL CLUBS',mlb:'MLB-STYLE'};
const ICONS={nba:'🏀',nfl:'🏈',soccer:'⚽',mlb:'⚾'};
const $=id=>document.getElementById(id);
const q=new URLSearchParams(location.search),requested=q.get('sport');
function escapeHTML(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
const h=escapeHTML;
function readStore(){try{const x=JSON.parse(localStorage.getItem(KEY)||'null');return x&&x.version===1&&Array.isArray(x.saves)?x:{version:1,saves:[],active:null}}catch{return {version:1,saves:[],active:null}}}
let db=readStore(),selectedSport=E.SPORT[requested]?requested:'nfl';
const ui={page:'home',tab:'overview',modal:E.SPORT[requested]&&!db.saves.length?'new':null,selectedSport,era:'current',year:2026,selectedPosition:null,scout:'Any',seasonTab:'standings',marketPos:null,transferTeam:null,feedLimit:9};
function active(){return db.saves.find(x=>x.id===db.active)||null}
function saveIndexedDB(){
 if(!root.indexedDB)return;
 try{const open=indexedDB.open('era_rivals_reborn_storage',1);
  open.onupgradeneeded=()=>open.result.createObjectStore('saves');
  open.onsuccess=()=>{const d=open.result,tx=d.transaction('saves','readwrite');tx.objectStore('saves').put(JSON.stringify(db),'current');tx.oncomplete=()=>d.close();tx.onerror=()=>d.close()}}
 catch(e){console.warn('Browser database unavailable',e)}
}
function restoreIndexedDB(){
 if(!root.indexedDB)return;
 try{const open=indexedDB.open('era_rivals_reborn_storage',1);
  open.onupgradeneeded=()=>open.result.createObjectStore('saves');
  open.onsuccess=()=>{const d=open.result,tx=d.transaction('saves'),req=tx.objectStore('saves').get('current');
   req.onsuccess=()=>{try{const x=JSON.parse(req.result||'null');if(x?.version===1&&Array.isArray(x.saves)&&Number(x.updatedAt||0)>Number(db.updatedAt||0)){db=x;render()}}catch(e){console.warn('Cannot restore browser backup',e)}};
   tx.oncomplete=()=>d.close();tx.onerror=()=>d.close()}}
 catch(e){console.warn('Browser database unavailable',e)}
}
function dataSave(){
 db.updatedAt=Date.now();let savedLocal=true;try{localStorage.setItem(KEY,JSON.stringify(db))}catch(e){savedLocal=false}
 saveIndexedDB();if(!savedLocal)notify('Browser storage is crowded. Download a backup in Settings.',true);
 return true
}
function notify(text,error=false){const n=$('notice');if(!n)return;n.hidden=false;n.className='notice'+(error?' error':'');n.textContent=String(text);clearTimeout(notify.timer);notify.timer=setTimeout(()=>n.hidden=true,4800)}
function sportTitle(sp){return ICONS[sp]+' '+NAMES[sp]}
function stat(v){return Number(v||0).toLocaleString()}
function num(v){return Math.round(Number(v||0))}
function money(n){return E.money(n)}
function small(tag,value){return '<small>'+h(tag)+'</small><b>'+h(value)+'</b>'}
function image(sp,cls='art-img'){return '<img class="'+cls+'" loading="lazy" alt="'+h(NAMES[sp]+' legend photography')+'" src="'+PHOTOS[sp]+'" referrerpolicy="no-referrer" decoding="async">'}
function sportTile(sp,large=false){
 return '<button class="'+(large?'sport-cover ':'art-tile ')+'art-'+sp+'" type="button" data-action="choose-sport" data-sport="'+sp+'">'+image(sp)+'<span class="art-shade"></span><span class="art-content"><span><small>'+ICONS[sp]+' · '+LABELS[sp]+'</small><strong>'+NAMES[sp]+'</strong></span><span class="art-arrow">↗</span></span></button>';
}
function pane(label,title,body,extra=''){return '<section class="panel '+extra+'"><div class="eyebrow"><i></i>'+h(label)+'</div>'+(title?'<h2>'+title+'</h2>':'')+body+'</section>'}
function button(text,action,style='secondary',attrs=''){return '<button type="button" class="btn '+style+'" data-action="'+action+'" '+attrs+'>'+text+'</button>'}
function navigation(page){ui.page=page||'home';ui.modal=null;render();window.scrollTo?.(0,0)}
function resume(id){if(id&&!db.saves.some(x=>x.id===id))return;db.active=id||db.active;dataSave();ui.page='hub';ui.tab='overview';ui.modal=null;render();window.scrollTo?.(0,0)}
function openNew(sp){ui.modal='new';if(E.SPORT[sp])ui.selectedSport=sp;render()}
function newGame({name,sport,team,era,year,difficulty}){
 if(db.saves.filter(s=>s.sport===sport).length>=MAX)return {error:'Five '+NAMES[sport]+' save slots are full. Reset a slot in Settings to create another.'};
 const s=E.makeUniverse({sport,team,name,era,year,difficulty,history:'reset'});
 db.saves.unshift(s);db.active=s.id;ui.page='hub';ui.tab='overview';ui.modal=null;dataSave();render();window.scrollTo?.(0,0);
 return {message:'New universe created. All championship and award history begins at zero.'};
}
function getMatchup(s){const fx=E.fixture(s),opp=E.opponent(s);if(!fx||!opp)return '<div class="muted">Season complete. No remaining fixtures.</div>';
 const a=E.getTeam(s),b=s.league[opp];
 return '<div class="match-score"><div class="side"><strong>'+h(s.team)+'</strong><small>'+E.teamPower(s,s.team)+' OVR · YOUR CLUB</small></div><div><div class="score-badge">NEXT MATCH</div><div class="numbers">VS</div></div><div class="side"><strong>'+h(opp)+'</strong><small>'+E.teamPower(s,opp)+' OVR · '+h(b.coach.style)+'</small></div></div>';
}
function statBlock(items){
 return '<div class="metric-grid">'+items.map(x=>'<div class="metric"><small>'+h(x[0])+'</small><strong>'+h(x[1])+'</strong>'+(x[2]?'<em>'+h(x[2])+'</em>':'')+'</div>').join('')+'</div>';
}
function homeNews(s){
 if(!s)return [
  {tag:'A NEW SPORTS WORLD',headline:'Every league. Every champion. Starting from zero.',date:'FRESH HISTORY'},
  {tag:'BUILD YOUR DYNASTY',headline:'Sign stars. Scout rookies. Make the calls.',date:'FRONT OFFICE'},
  {tag:'REWRITE HISTORY',headline:'Historic legends. New careers. Your timeline.',date:'ALT HISTORY'}
 ];
 return s.news.slice(0,3).map(n=>({tag:n.tag,headline:n.headline,date:'S'+n.season+' · W'+(n.week+1)}));
}
function renderHome(){
 const s=active(),latest=s?.news?.[0],tiles=['nba','nfl','soccer','mlb'].map(sp=>sportTile(sp)).join('');
 const headlines=homeNews(s);
 const headlineHTML=headlines.map((x,i)=>'<div class="news-card '+(i===0?'lead':'')+'"><span class="news-tag">'+h(x.tag)+'</span><strong>'+h(x.headline)+'</strong><small>'+h(x.date)+'</small></div>').join('');
 const continueBtn=s?button('▶ CONTINUE '+h(s.team).toUpperCase(),'resume',''):button('▶ START THE FIRST DYNASTY','new','');
 const latestRows=(db.saves.slice(0,3)).map(save=>{
  const t=save.league[save.team],rec=t?.record||{w:0,l:0};
  return '<div class="lobby-line"><span><b>'+ICONS[save.sport]+' '+h(save.team)+'</b><br><small>S'+save.season+' · '+save.year+' · '+rec.w+'–'+rec.l+' · '+h(save.era.toUpperCase())+'</small></span>'+button('RESUME','resume','small','data-id="'+save.id+'"')+'</div>';
 }).join('');
 const leagueInfo=s?pane('UNIVERSE STATUS','YOUR WORLD',
  statBlockLite([['SEASON','S'+s.season],['TEAM RANK','#'+E.userRank(s)],['CHAMPIONSHIPS',s.seasonsWon]])+
  '<p class="muted">'+h((latest?.headline||'The story of the league starts with your next decision.'))+'</p>'+button('OPEN LEAGUE CENTRAL ↗','universe','secondary wide')):pane('UNIVERSE STATUS','A CLEAN SLATE',
  '<p class="muted">No trophies. No past winners. No old save history. A brand-new simulation where every result becomes history.</p>'+
  button('CREATE YOUR UNIVERSE','new','wide'));
 return '<div class="hero"><div class="hero-copy"><span class="eyebrow"><i></i>FOUR SPORTS. ONE SPORTS UNIVERSE.</span>'+
 '<h1>WRITE<br>YOUR<br><span>HISTORY.</span></h1><p>Run the franchise. Control the decisions. Let the league live around you. No arcade controls. No fixed endings.</p>'+
 '<div class="btn-row">'+continueBtn+button('+ NEW DYNASTY','new','secondary')+'</div><div class="hero-meta"><span><b>04</b> SPORTS</span><span><b>100+</b> PLAYERS / POSITION</span><span><b>∞</b> ALTERNATE HISTORIES</span></div></div>'+
 '<div class="hero-art">'+tiles+'</div></div>'+
 '<section class="home-section"><div class="section-heading"><div><div class="eyebrow"><i></i>ERA SPORTS NETWORK</div><h2>LEAGUE CENTRAL.</h2></div><button class="text-link" data-nav="universe">VIEW NEWS →</button></div><div class="news-grid">'+headlineHTML+'</div></section>'+
 '<section class="home-section"><div class="home-dashboard">'+pane('MY FRANCHISE FILES','CONTINUE A DYNASTY.',
  '<div class="stack">'+(latestRows||'<p class="muted">No active careers. Your first universe is one decision away.</p>')+'</div>')+leagueInfo+'</div></section>'+
 '<section class="home-section"><div class="section-heading"><div><div class="eyebrow"><i></i>START YOUR LEGACY</div><h2>CHOOSE YOUR SPORT.</h2></div></div><div class="sport-grid">'+['nba','nfl','soccer','mlb'].map(x=>sportTile(x,true)).join('')+'</div></section>';
}
function statBlockLite(items){return '<div class="three-col">'+items.map(x=>'<div class="metric"><small>'+h(x[0])+'</small><strong>'+h(x[1])+'</strong></div>').join('')+'</div>'}
const gameTabs=[
 ['overview','OVERVIEW'],['match','MATCHDAY'],['roster','MY ROSTER'],['trade','TRANSFERS'],['draft','DRAFT ROOM'],
 ['coaches','COACHES'],['finance','FRANCHISE'],['league','LEAGUE CENTRAL'],['history','HISTORY'],['legacy','GOAT ROOM']
];
function renderHub(){
 const s=active();if(!s)return renderHome();
 const t=E.getTeam(s),v=E.summary(s),tab=ui.tab;
 const nav='<div class="dash-tabs">'+gameTabs.map(([name,label])=>'<button data-tab="'+name+'" class="'+(tab===name?'active':'')+'">'+label+'</button>').join('')+'</div>';
 const header='<div class="hero-row"><div><span class="eyebrow"><i></i>'+ICONS[s.sport]+' '+h(s.era.toUpperCase())+' UNIVERSE · '+s.year+'</span><h1>'+h(s.team.toUpperCase())+'</h1><p>'+h(s.name)+' · SEASON '+s.season+' · '+h(s.phase.toUpperCase())+'</p></div><div class="btn-row">'+button('+ NEW SAVE','new','secondary small')+button('UNIVERSE SETTINGS','settings','secondary small')+'</div></div>';
 const pages={overview:renderOverview,match:renderMatch,roster:renderRoster,trade:renderTrade,draft:renderDraft,
 coaches:renderCoaches,finance:renderFinance,league:renderLeague,history:renderHistory,legacy:renderLegacy};
 const body=(pages[tab]||renderOverview)(s);
 const side='<aside class="dash-sidebar">'+pane('FRONT OFFICE','YOUR DASHBOARD', 
  '<div class="stack">'+[['TEAM OVERALL',v.overall+' OVR'],['OWNER TRUST',v.owner+'%'],['TEAM CHEMISTRY',v.chem+'%'],['FAN SUPPORT',v.fan+'%'],['SALARY BUDGET',money(v.cap-v.payroll)]].map(([x,y])=>'<div class="row between"><span class="muted">'+h(x)+'</span><b>'+h(y)+'</b></div>').join('')+'</div>')+
 pane('LATEST HEADLINES','THE WIRE', 
  '<div class="news-wire">'+s.news.slice(0,5).map(x=>'<div class="news-item"><span>'+h(x.tag.split(' ')[0])+'</span><b>'+h(x.headline)+'</b></div>').join('')+'</div>')+
 pane('THE NEXT CALL','MANAGER ACTIONS',
  '<div class="stack">'+button(s.phase==='offseason'?'START NEXT SEASON →':'SIMULATE MATCH →',s.phase==='offseason'?'next-season':'match','wide')+
  button('OPEN TRANSFER MARKET','trade','secondary wide')+button('GOAT LEADERBOARD','legacy','secondary wide')+'</div>')+'</aside>';
 return '<div class="page-pad">'+header+nav+'<div class="dash-layout"><div class="dash-main">'+body+'</div>'+side+'</div></div>';
}
function renderOverview(s){
 const t=E.getTeam(s),v=E.summary(s),history=s.history[0],star=v.star;
 const banner='<div class="team-banner"><span class="eyebrow"><i></i>THE FRONT OFFICE · '+h(s.phase.toUpperCase())+'</span>'+
 '<strong>'+h(s.team.toUpperCase())+'</strong>'+
 '<p>'+h(t.coach.name)+' · '+h(t.coach.style)+' · '+h(s.era==='alltime'?'LEGENDARY DRAFT UNIVERSE':'MODERN FRANCHISE')+'</p>'+
 '<span class="pill">'+t.record.w+' W · '+t.record.l+' L'+(t.record.d?' · '+t.record.d+' D':'')+'</span><span class="pill gold">#'+E.userRank(s)+' LEAGUE RANK</span></div>';
 const metrics=statBlock([['TEAM RATING',v.overall,'POWER RANK'],['TEAM RECORD',v.record.w+'–'+v.record.l,'SEASON '+s.season],['OWNER TRUST',v.owner+'%','BOARD'],['GM LEGACY',stat(s.legacyPoints),'POINTS']]);
 const game= s.phase==='offseason'?pane('SEASON COMPLETE','THE OFFSEASON STARTS NOW.',
  '<p class="muted">'+(history?'Champions: '+h(history.champion)+'. MVP: '+h(history.mvp)+'.':'Your league enters the offseason.')+
  '</p><div class="btn-row">'+button('ENTER DRAFT WAR ROOM','draft')+button('ADVANCE TO NEW SEASON ↗','next-season','secondary')+'</div>'):
 pane('NEXT MATCH','MAKE THE CALL.',getMatchup(s)+
 '<div class="btn-row">'+button('OPEN MATCHDAY →','match')+button('CHANGE YOUR ROSTER','roster','secondary')+'</div>');
 const players=t.roster.slice().sort((a,b)=>b.overall-a.overall).slice(0,3);
 const stars=pane('YOUR BIG THREE','BUILD A DYNASTY',
  '<div class="stack">'+players.map(p=>'<div class="player-row"><span class="player-ovr">'+p.overall+'</span><span><b>'+h(p.name)+'</b><small>'+h(p.pos)+' · '+h(p.trait.toUpperCase())+'</small></span><span class="pill">'+p.age+' YRS</span></div>').join('')+'</div>');
 const events=s.news.slice(0,4).map(x=>'<div class="feed-item"><div><b>'+h(x.headline)+'</b><small>'+h(x.tag)+' · S'+x.season+' / W'+(x.week+1)+'</small></div></div>').join('');
 return banner+metrics+game+'<div class="two-col" style="margin-top:13px">'+stars+pane('THE WORLD MOVES','AROUND THE LEAGUE.',events)+'</div>';
}
function renderMatch(s){
 const t=E.getTeam(s),m=s.match,last=s.matchHistory[0],fx=E.fixture(s),opp=E.opponent(s);
 const conference=s.pendingConference?
 pane('PRESS ROOM · YOUR REPUTATION','FACE THE MEDIA.',
  '<p class="muted">The reporters want an answer after your '+(s.pendingConference.result==='W'?'win':s.pendingConference.result==='L'?'loss':'draw')+'. What do you tell them?</p>'+
  '<div class="choice-grid">'+[
   ['accountability','TAKE RESPONSIBILITY','Owner trust rises.'],
   ['praise','PRAISE THE PLAYERS','Morale and fan support rise.'],
   ['challenge','DEMAND MORE','Fans respond, but morale may drop.']
  ].map(([key,title,desc],i)=>'<button class="choice" data-action="press" data-choice="'+key+'"><span>PRESS ANSWER '+(i+1)+'</span><strong>'+title+'</strong><small>'+desc+'</small></button>').join('')+'</div>'):'';
 if(m){
  const state=m.stage==='halftime'?'HALFTIME':m.stage==='clutch'?'FINAL MOMENTS':'FINAL';
  const options=m.stage==='halftime'?
   [['Attack','PUSH FORWARD','More chances, more risk.'],['Balanced','STAY DISCIPLINED','Trust the current approach.'],['Protect','PROTECT THE LEAD','Reduce risk and conserve energy.'],['Star Power','FEED THE STAR','Put the ball in your best player’s hands.'],['Risky','ALL-OUT GAMBLE','Big reward. Real downside.'],['Rotate','USE THE BENCH','Fresh legs over pure aggression.']]:
   [['Trust Star','TRUST YOUR STAR','A moment for your clutch player.'],['Conservative','CLOSE IT SAFELY','Protect the result and stay organised.'],['All In','EVERYTHING FOR THE WIN','Maximum aggression, maximum danger.']];
  return pane('THE LIVE MATCH CENTER','IT ALL COMES DOWN TO THIS.', 
    '<div class="score-badge">'+h(state)+' · '+h(s.sport.toUpperCase())+'</div>'+
    matchScore(s.team,m.opponent,m.score.user,m.score.them)+'<div class="two-col"><div>'+
    '<h3 class="eyebrow">MATCH TIMELINE</h3>'+timeline(m.events)+'</div><div><h3 class="eyebrow">YOUR NEXT DECISION</h3>'+
    '<div class="choice-grid">'+options.map(([key,title,desc],i)=>'<button class="choice" data-action="match-decision" data-choice="'+h(key)+'"><span>OPTION '+(i+1)+'</span><strong>'+title+'</strong><small>'+desc+'</small></button>').join('')+'</div></div></div>');
 }
 const opponentCard=opp?pane('OPPOSITION INTELLIGENCE','KNOW YOUR RIVAL.',
   '<div class="two-col"><div class="metric"><small>RIVAL TEAM</small><strong>'+h(opp)+'</strong></div><div class="metric"><small>POWER</small><strong>'+E.teamPower(s,opp)+' OVR</strong></div></div>'+
   '<div class="row between"><span class="muted">AI MANAGER</span><b>'+h(s.league[opp].coach.name)+'</b></div>'+
   '<div class="row between"><span class="muted">GAMEPLAN</span><b>'+h(s.league[opp].strategy)+'</b></div>'+
   '<div class="row between"><span class="muted">STANDOUT</span><b>'+h(E.getTeam(s).name===opp?'':s.league[opp].roster.slice().sort((a,b)=>b.overall-a.overall)[0]?.name)+'</b></div>'):'';
 const lastReport=last?pane('POSTGAME · DECISION REPLAY','THE FINAL WHISTLE.',
   matchScore(s.team,last.opponent,last.user,last.them)+
   '<div class="two-col"><div><span class="eyebrow">MANAGER CALLS</span><p class="muted">Gameplan: '+h(last.plan)+'<br>Halftime: '+h(last.halftime)+'<br>Closing moment: '+h(last.clutch)+'<br>Estimated tactical impact: '+num(last.impact)+'</p></div><div><span class="eyebrow">PLAYER OF THE MATCH</span><h3>'+h(last.star)+'</h3><p class="muted">'+h(last.result==='W'?'Win':last.result==='L'?'Loss':'Draw')+' · Season '+last.season+' Week '+(last.week+1)+'</p></div></div>'+
   '<div class="eyebrow">PLAY BY PLAY</div>'+timeline(last.events)):'';
 const start=s.phase==='offseason'?
 pane('SEASON ENDED','REBUILD FOR NEXT YEAR.',button('NEW SEASON ↗','next-season','wide')):
 pane('PREGAME · YOU SET THE PLAN','THE NEXT BIG DECISION.',getMatchup(s)+
 '<div class="radio-pills" style="margin:14px 0">'+['Balanced','Attack','Defense','Fast','Star Power'].map((x,i)=>'<label><input type="radio" name="pregamePlan" value="'+h(x)+'" '+(i===0?'checked':'')+'><span>'+h(x.toUpperCase())+'</span></label>').join('')+'</div>'+
 '<div class="btn-row">'+button('SIMULATE TO HALFTIME →','start-match')+button('EDIT STARTING LINEUP','roster','secondary')+'</div>');
 return conference+start+opponentCard+lastReport;
}
function timeline(events){return '<div class="timeline">'+(events||[]).map(x=>'<div class="timeline-entry"><span class="time">'+h(x.time)+'</span><div><b>'+h(x.text)+'</b></div></div>').join('')+'</div>'}
function matchScore(a,b,as,bs){return '<div class="match-score"><div class="side"><strong>'+h(a)+'</strong><small>YOUR TEAM</small></div><div class="numbers">'+h(as)+' <span>:</span> '+h(bs)+'</div><div class="side"><strong>'+h(b)+'</strong><small>OPPOSITION</small></div></div>'}
function renderRoster(s){
 const t=E.getTeam(s),r=t.roster.slice().sort((a,b)=>b.starter-a.starter||E.SPORT[s.sport].positions.indexOf(a.pos)-E.SPORT[s.sport].positions.indexOf(b.pos)||b.overall-a.overall);
 const pstats=(p)=>s.sport==='nba'?p.seasonStats.points+' PTS · '+p.seasonStats.assists+' AST':s.sport==='nfl'?p.pos==='QB'?p.seasonStats.passYards+' PASS YDS':p.pos==='WR'?p.seasonStats.recYards+' REC YDS':p.games+' GAMES':s.sport==='soccer'?p.seasonStats.goals+' GOALS · '+p.seasonStats.assists+' AST':p.seasonStats.hits+' HITS · '+p.seasonStats.homeRuns+' HR';
 const rows=r.map(p=>'<div class="player-row '+(p.overall>=90?'is-star':'')+'"><span class="player-ovr">'+p.overall+'</span><span><b>'+h(p.name)+' '+(p.starter?'★':'')+'</b><small>'+h(p.pos)+' · '+h(p.trait.toUpperCase())+' · '+p.age+' YRS · '+p.years+' YR DEAL</small><small>'+h(pstats(p))+(p.injury?' · OUT '+p.injury+' GAMES':'')+'</small></span><span><small>'+money(p.salary)+'</small></span><div class="stack"><button class="btn small secondary" data-action="starter" data-id="'+p.id+'">'+(p.starter?'BENCH':'START')+'</button><button class="btn small secondary" data-action="train" data-id="'+p.id+'">TRAIN</button></div></div>').join('');
 const demands=t.roster.filter(p=>p.demand).map(p=>'<div class="story-card"><div class="story-time">PLAYER REQUEST</div><b>'+h(p.name)+' · '+h(p.demand)+'</b><div class="btn-row">'+button('MAKE PROMISE','demand-promise','small','data-id="'+p.id+'"')+button('REFUSE','demand-refuse','secondary small','data-id="'+p.id+'"')+'</div></div>').join('');
 const promisePeople=t.roster.filter(p=>p.age>26).slice(0,12).map(p=>'<option value="'+p.id+'">'+h(p.pos+' · '+p.name)+'</option>').join('');
 const young=t.roster.filter(p=>p.age<=25).slice(0,20).map(p=>'<option value="'+p.id+'">'+h(p.pos+' · '+p.name)+'</option>').join('');
 return statBlock([['SQUAD SIZE',r.length],['STARTERS',r.filter(p=>p.starter).length],['INJURIES',r.filter(p=>p.injury).length],['PAYROLL',money(E.payroll(t))]])+
 pane('PLAYER DEVELOPMENT','MANAGE YOUR LOCKER ROOM.',
   '<div class="two-col">'+(demands?'<div>'+demands+'</div>':'<p class="muted">Your locker room is stable. Relationships, roles and personality traits affect chemistry.</p>')+
   '<div class="stack"><label class="field">VETERAN MENTOR<select id="mentorFrom">'+promisePeople+'</select></label><label class="field">YOUNG PROSPECT<select id="mentorTo">'+young+'</select></label>'+button('PAIR MENTOR & ROOKIE','mentor','secondary')+'</div></div>')+
 pane('ALL PLAYERS · PERSONALITIES','MY ROSTER.','<div class="stack">'+rows+'</div>');
}

function renderTrade(s){
 const t=E.getTeam(s),neg=s.negotiation,
 rivals=s.clubs.filter(x=>x!==s.team),target=ui.transferTeam&&s.league[ui.transferTeam]?ui.transferTeam:rivals[0];
 const candidates=s.league[target].roster.slice().sort((a,b)=>b.overall-a.overall).slice(0,45);
 const players=t.roster.slice().sort((a,b)=>b.overall-a.overall).slice(0,45);
 const negotiation=neg?pane('TRADE NEGOTIATION · '+h(neg.status.toUpperCase()),'FRONT OFFICE RESPONSE.',
  '<div class="story-card"><b>'+h(neg.message)+'</b><small>RESPONSE EXPIRES AFTER WEEK '+(neg.deadline+1)+'</small></div>'+
  '<div class="btn-row">'+(neg.status==='accepted'?button('ACCEPT & CONFIRM TRADE','confirm-trade'):'')+
  (neg.status==='counter'?button('ACCEPT COUNTEROFFER','counter-trade','gold'):'')+
  button('WALK AWAY','walk-trade','secondary')+'</div>'):'';
 const options=rivals.map(team=>'<option value="'+h(team)+'" '+(team===target?'selected':'')+'>'+h(team)+'</option>').join('');
 const targetOptions=candidates.map(p=>'<option value="'+p.id+'">'+h(p.name)+' · '+h(p.pos)+' · '+p.overall+' OVR</option>').join('');
 const myOptions=players.map(p=>'<label class="field checkbox-field"><input type="checkbox" name="tradePlayer" value="'+p.id+'"><span>'+h(p.name)+' · '+h(p.pos)+' · '+p.overall+' OVR</span></label>').join('');
 const free=s.freeAgents.slice().sort((a,b)=>b.overall-a.overall).slice(0,16).map(p=>'<div class="player-row"><span class="player-ovr">'+p.overall+'</span><span><b>'+h(p.name)+'</b><small>'+h(p.pos)+' · '+h(p.country||'GLOBAL')+' · '+money(p.salary)+'</small></span><span class="pill">'+h(p.trait.toUpperCase())+'</span>'+button('SIGN','sign','small','data-id="'+p.id+'"')+'</div>').join('');
 const promises=s.playerPromises.slice(-5).map(pr=>'<div class="feed-item"><div><b>'+h(pr.playerName)+' · '+h(pr.type.toUpperCase())+'</b><small>'+(pr.resolved?(pr.kept?'KEPT':'BROKEN'):'ACTIVE')+'</small></div></div>').join('');
 return statBlock([['SALARY CAP',money(E.cap(s.sport))],['PAYROLL',money(E.payroll(t))],['AVAILABLE',money(E.cap(s.sport)-E.payroll(t))],['DRAFT PICKS',t.draftPicks]])+
 pane('TRADE BLOCK','NEGOTIATE A REAL DEAL.',
  '<div class="two-col"><div class="stack"><label class="field">TRADE PARTNER<select id="tradeTeam">'+options+'</select></label>'+
  '<label class="field">TARGET PLAYER<select id="tradeTarget">'+targetOptions+'</select></label>'+
  '<label class="field">DRAFT PICKS OFFERED<select id="tradePicks">'+[0,1,2,3].filter(n=>n<=t.draftPicks).map(n=>'<option value="'+n+'">'+n+' PICK'+(n===1?'':'S')+'</option>').join('')+'</select></label>'+
  '<div class="btn-row">'+button('SEND TRADE OFFER →','propose-trade')+'</div></div>'+
  '<div class="stack"><span class="eyebrow">YOUR TRADE PACKAGE · CHECK UP TO 3</span><div style="max-height:290px;overflow:auto">'+myOptions+'</div></div></div>')+
 negotiation+
 pane('FREE AGENCY FRENZY','AVAILABLE FREE AGENTS.','<div class="stack">'+free+'</div>')+
 pane('PLAYER PROMISES','KEEP YOUR WORD.',
  '<div class="two-col"><label class="field">PROMISE TO PLAYER<select id="promisePlayer">'+t.roster.slice(0,35).map(p=>'<option value="'+p.id+'">'+h(p.name)+'</option>').join('')+'</select></label><label class="field">YOUR PROMISE<select id="promiseType"><option value="starter">STARTING ROLE</option><option value="playoffs">PLAYOFF PUSH</option><option value="title">CHAMPIONSHIP</option></select></label></div>'+
  '<div class="btn-row">'+button('MAKE PROMISE','make-promise')+'</div><div class="news-wire">'+promises+'</div>');
}
function renderDraft(s){
 const t=E.getTeam(s),pos=ui.scout||'Any',positions=['Any',...E.SPORT[s.sport].positions];
 const results=E.selectedProspects(s,pos),top=results.slice(0,24);
 const draftRows=top.map(p=>'<div class="player-row"><span class="player-ovr">'+p.overall+'</span><span><b>'+h(p.name)+'</b><small>'+h(p.pos)+' · '+h(p.country||'GLOBAL')+' · AGE '+p.age+'</small><small>SCOUTED POTENTIAL '+p.low+'–'+p.high+' · EST '+p.estimate+'</small></span><span class="pill">'+(p.high>=95?'HIGH CEILING':'PROSPECT')+'</span>'+
  button(s.phase==='offseason'?'DRAFT':'SCOUT',s.phase==='offseason'?'draft-player':'scout-player','small','data-id="'+p.id+'"')+'</div>').join('');
 const logs=s.draftLog.slice(-8).reverse().map(p=>'<div class="news-item"><span>ROUND '+p.round+'</span><b>'+h(p.team)+' selects '+h(p.name)+'</b></div>').join('');
 return statBlock([['DRAFT PICKS',t.draftPicks],['SCOUT ACCURACY',t.scout+'%'],['PROSPECTS',s.draft.length],['CLASS',s.year]])+
 pane('FRONT OFFICE / DRAFT NIGHT','THE DRAFT WAR ROOM.',
  '<div class="two-col"><label class="field">SCOUT POSITION<select id="scoutPosition">'+positions.map(x=>'<option value="'+h(x)+'" '+(x===pos?'selected':'')+'>'+h(x)+'</option>').join('')+'</select></label><div class="metric"><small>DRAFT STATUS</small><strong>'+(s.phase==='offseason'?'DRAFT OPEN':'SCOUTING')+'</strong></div></div>'+
  '<p class="muted">Prospects have uncertain potential. Some will boom, others will bust. Scouting grades are estimates, not promises.</p>'+
  '<div class="stack">'+draftRows+'</div>')+
 pane('DRAFT HISTORY','AROUND THE LEAGUE.','<div class="news-wire">'+(logs||'<p class="muted">Every team makes its own picks once your draft begins.</p>')+'</div>');
}
function renderCoaches(s){
 const t=E.getTeam(s);
 const cards=E.COACHES.map(c=>'<div class="story-card"><div class="row between"><b>'+h(c.name)+'</b><span class="pill">'+c.skill+' OVR</span></div><p class="muted">'+h(c.style)+' · '+money(c.cost)+'</p>'+
 button(t.coach.name===c.name?'CURRENT COACH':'HIRE COACH','hire-coach','small','data-name="'+h(c.name)+'" '+(t.coach.name===c.name?'disabled':'') )+'</div>').join('');
 const all=t.roster.filter(p=>p.age<=24).sort((a,b)=>b.potential-a.potential).slice(0,6).map(p=>'<div class="feed-item"><div><b>'+h(p.name)+'</b><small>AGE '+p.age+' · '+p.overall+' OVR · '+p.potential+' VISIBLE POTENTIAL</small></div></div>').join('');
 return pane('COACHING CAROUSEL','BUILD YOUR STAFF.',
 '<div class="saving-card"><span><strong>CURRENT HEAD COACH</strong><small>'+h(t.coach.name)+' · '+h(t.coach.style)+' SYSTEM · '+t.coach.skill+' OVR</small></span><span class="pill gold">BUDGET '+money(t.budget)+'</span></div><div class="three-col" style="margin-top:13px">'+cards+'</div>')+
 pane('SCOUTING DEPARTMENT','FIND THE NEXT SUPERSTAR.',
  '<div class="two-col"><div><p class="muted">Scout accuracy improves with investment. Better scouts narrow potential ranges, especially for international players.</p>'+
  '<div class="metric"><small>CURRENT SCOUTING ACCURACY</small><strong>'+t.scout+'%</strong></div>'+
  button('UPGRADE SCOUTS · $7M','upgrade-scout','secondary')+'</div><div><span class="eyebrow">TOP YOUNG PLAYERS</span>'+all+'</div></div>');
}
function renderFinance(s){
 const t=E.getTeam(s),home=s.team;
 return statBlock([['TEAM BUDGET',money(t.budget)],['TICKET REVENUE',money(t.finance.revenue)],['TOTAL ATTENDANCE',stat(t.finance.attendance)],['FAN SUPPORT',t.fan+'%']])+
 pane('OWNER PRESSURE & FANS','RUN THE ENTIRE CLUB.',
  '<div class="two-col"><div><div class="metric"><small>OWNER TRUST</small><strong>'+t.owner+'%</strong></div><p class="muted">Your owner wants competitive results. Losing streaks, expensive deals and broken promises create pressure.</p>'+
  '<div class="story-card"><b>OWNER OBJECTIVE · '+h(t.ownerGoal)+'</b><small>Fail to deliver and you could be offered a different job. Succeed and gain reputation.</small></div></div>'+
  '<div><div class="metric"><small>STADIUM LEVEL</small><strong>LVL '+t.stadium+'</strong></div><p class="muted">A better venue attracts fans and increases matchday revenue. Upgrades cost $'+(12+t.stadium*9)+'M.</p>'+
  button('UPGRADE STADIUM ↗','upgrade-stadium')+'</div></div>')+
 pane('FRANCHISE IDENTITY','EXPANSION & RELOCATION.',
 '<div class="two-col"><div><h3>RELOCATE YOUR TEAM</h3><p class="muted">Rename and relocate your franchise. Current players, trophies and finances stay with the organization.</p>'+
 '<label class="field">NEW FRANCHISE NAME<input id="newTeamName" maxlength="30" placeholder="Example: San Juan Legends"></label>'+button('RELOCATE FRANCHISE','relocate','secondary')+'</div>'+
 '<div><h3>LEAGUE EXPANSION</h3><p class="muted">Add two fictional clubs to your universe. Their rosters grow through prospects and AI decisions.</p>'+
 '<label class="field">EXPANSION TEAM NAME<input id="expansionName" maxlength="30" placeholder="Example: Puerto Rico Royals"></label>'+
 button('EXPAND THE LEAGUE','expand','secondary')+'</div></div>')+
 pane('CAREER OPPORTUNITIES','GM JOB MARKET.',
 '<div class="stack">'+(s.ownerOffers.length?s.ownerOffers.map(x=>'<div class="saving-card"><span><strong>'+h(x.team)+'</strong><small>'+h(x.goal)+' · '+money(x.salary)+'/YEAR</small></span>'+button('ACCEPT JOB','accept-job','small','data-team="'+h(x.team)+'"')+'</div>').join(''):'<p class="muted">Complete a season to build your GM reputation and earn job offers from other franchises.</p>')+'</div>');
}
function renderLeague(s){
 const leaders=E.standings(s),news=s.news.slice(0,ui.feedLimit);
 const standings='<div class="table-scroll"><table class="data-table"><thead><tr><th>#</th><th>TEAM</th><th>W</th><th>L</th><th>D</th><th>PF</th><th>PA</th><th>OVR</th></tr></thead><tbody>'+leaders.map((team,i)=>{
 const t=s.league[team],r=t.record;return '<tr class="'+(team===s.team?'my-team':'')+'"><td>'+(i+1)+'</td><td><b>'+h(team)+'</b>'+(team===s.team?' ★':'')+'</td><td>'+r.w+'</td><td>'+r.l+'</td><td>'+r.d+'</td><td>'+r.for+'</td><td>'+r.against+'</td><td>'+E.teamPower(s,team)+'</td></tr>'}).join('')+'</tbody></table></div>';
 const recent=news.map(n=>'<div class="feed-item"><div><span class="eyebrow">'+h(n.tag)+' · '+h(n.date)+'</span><b>'+h(n.headline)+'</b></div></div>').join('');
 const titleRace=leaders.slice(0,5).map((name,i)=>'<div class="saving-card"><b>#'+(i+1)+' · '+h(name)+'</b><span class="pill">'+E.teamPower(s,name)+' OVR</span></div>').join('');
 const mvp=E.topMVP(s).slice(0,5).map((x,i)=>'<div class="saving-card"><span><strong>#'+(i+1)+' · '+h(x.name)+'</strong><small>'+h(x.team)+' · '+h(x.pos)+'</small></span><span class="pill">'+num(x.score)+' PTS</span></div>').join('');
 const rivals=Object.entries(s.rivalries).filter(([k,v])=>v.heat>=4).sort((a,b)=>b[1].heat-a[1].heat).slice(0,5).map(([k,r])=>'<div class="saving-card"><span><strong>'+h(k.split('|').join(' vs '))+'</strong><small>'+r.games+' MEETINGS</small></span><span class="pill warning">HEAT '+r.heat+'</span></div>').join('');
 return pane('ERA SPORTS NETWORK','THE LEAGUE NEVER STOPS.','<div class="news-wire">'+recent+'</div>'+
 (s.news.length>ui.feedLimit?button('MORE HEADLINES','more-news','secondary wide'):'') )+
 '<div class="two-col" style="margin-top:13px">'+pane('TITLE RACE','CHAMPIONSHIP CONTENDERS.','<div class="stack">'+titleRace+'</div>')+
 pane('SEASON AWARDS','MVP WATCH.','<div class="stack">'+(mvp||'<p class="muted">Player award races begin after the first game.</p>')+'</div>')+'</div>'+
 pane('THE TABLE','CURRENT STANDINGS.',standings)+pane('RIVALRY WATCH','FEUDS & STORYLINES.','<div class="stack">'+(rivals||'<p class="muted">Rivalries build naturally from repeated meetings, close games and playoff defeats.</p>')+'</div>');
}
function renderHistory(s){
 const years=s.history.map(x=>'<div class="saving-card"><span><strong>SEASON '+x.season+' · '+x.year+'</strong><small>'+h(x.champion)+' · '+h(E.SPORT[s.sport].name)+' CHAMPIONS · MVP '+h(x.mvp)+'</small></span><span class="pill gold">🏆</span></div>').join('');
 const awards=s.history.flatMap(x=>(x.awards||[]).map(a=>({year:x.year,...a}))).slice(0,20).map(a=>'<div class="feed-item"><div><b>'+h(a.type)+' · '+h(a.name)+'</b><small>'+h(a.team)+' · '+a.year+'</small></div></div>').join('');
 const museum=s.museum.map(x=>'<div class="story-card"><div class="story-time">'+h(x.type)+' · '+x.year+'</div><b>'+h(x.text)+'</b></div>').join('');
 return pane('ALL TITLES ARE EARNED','THE HISTORY YOU WROTE.',
 '<p class="muted">This new universe starts with zero champions, zero franchise records and no imported seasons. Every future year is recorded here.</p>'+
 '<div class="stack">'+(years||'<div class="metric"><small>UNIVERSE HISTORY</small><strong>0 CHAMPIONS</strong><em>THE FIRST SEASON IS YOURS.</em></div>')+'</div>'+
 '<div class="two-col" style="margin-top:14px">'+pane('AWARDS NIGHT','MVP · ROOKIE · DEFENSE.','<div class="news-wire">'+(awards||'<p class="muted">Awards are presented at the end of the season.</p>')+'</div>')+
 pane('DYNASTY MUSEUM','TROPHY ROOM.','<div class="stack">'+(museum||'<p class="muted">Retired jerseys, championships and records will live here.</p>')+'</div>')+'</div>');
}
function renderLegacy(s){
 const pos=ui.selectedPosition&&E.SPORT[s.sport].positions.includes(ui.selectedPosition)?ui.selectedPosition:E.SPORT[s.sport].positions[0],
 ranks=E.legacyRankings(s,pos).slice(0,30);
 const rows=ranks.map((p,i)=>'<div class="legacy-entry"><b>#'+(i+1)+'</b><span><strong>'+h(p.name)+(p.created?' ★':'')+'</strong><small>'+h(p.team)+' · '+h(p.position)+' · '+(p.real?'HISTORIC BASELINE':'YOUR UNIVERSE')+'</small></span><em>'+stat(p.points)+'</em></div>').join('');
 const opt=E.SPORT[s.sport].positions.map(x=>'<option value="'+h(x)+'" '+(x===pos?'selected':'')+'>'+h(x)+'</option>').join('');
 return pane('GOAT ROOM / BY EXACT POSITION','LEGENDS ARE MADE HERE.',
  '<p class="muted">Your created players and real-world legends are ranked by the same position. Historical baselines are editorial game scores, not official career statistics.</p>'+
  '<label class="field" style="max-width:280px">SELECT POSITION<select id="goatPosition">'+opt+'</select></label><div class="legacy-list" style="margin-top:14px">'+rows+'</div>')+
 pane('CHANGE SPORTS HISTORY','YOUR LEGACY COUNTS.',statBlockLite([['TEAM TITLES',s.seasonsWon],['LEGACY POINTS',stat(s.legacyPoints)],['SEASONS',s.history.length]]));
}

function renderSettings(){
 const s=active();
 const rows=db.saves.map(x=>'<div class="saving-card"><span><strong>'+ICONS[x.sport]+' '+h(x.team)+'</strong><small>'+h(x.era.toUpperCase())+' · SEASON '+x.season+' · '+x.year+'</small></span><div class="btn-row">'+button('OPEN','resume','small','data-id="'+x.id+'"')+button('DELETE','delete-save','danger small','data-id="'+x.id+'"')+'</div></div>').join('');
 const friends=s?pane('FRIENDS LEAGUE · LOCAL SANDBOX','SHARE YOUR WORLD.',
  '<p class="muted">Switch which team you control in the same local league. This is a shared-device sandbox, not online synchronized multiplayer.</p>'+
  '<div class="two-col"><label class="field">FRIEND NAME<input id="friendName" maxlength="30" placeholder="Nickname"></label>'+
  '<label class="field">THEIR TEAM<select id="friendTeam">'+s.clubs.filter(t=>t!==s.team).map(x=>'<option>'+h(x)+'</option>').join('')+'</select></label></div>'+
  '<div class="btn-row">'+button('ADD LOCAL MANAGER','add-friend','secondary')+'</div>'+
  '<div class="stack" style="margin-top:11px">'+(s.friendManagers||[]).map(f=>'<div class="saving-card"><span><strong>'+h(f.name)+'</strong><small>'+h(f.team)+'</small></span>'+button('CONTROL TEAM','switch-control','small','data-team="'+h(f.team)+'"')+'</div>').join('')+'</div>'):'';
 const backups=pane('YOUR DATA','BACKUP & RESTORE.',
  '<p class="muted">Download your saves before resetting. Cloud synchronization is not enabled in this rebuilt version.</p>'+
  '<div class="btn-row">'+button('EXPORT BACKUP','export','secondary')+button('IMPORT BACKUP','import','secondary')+'</div><input type="file" id="importFile" accept=".json,application/json" hidden>');
 const reset=pane('RESET HISTORY','CLEAN SLATE.',
  '<p class="muted">New universes have no past titles. These permanent actions delete only Era Rivals browser saves on this device, not GitHub history or cloud account records.</p>'+
  '<div class="stack">'+button('DELETE ALL REBORN SAVES','reset-all','danger')+button('CLEAR OLDER ERA RIVALS BROWSER SAVES','reset-old','secondary')+'</div>');
 return '<div class="modal-backdrop" id="modal-root"><div class="modal wide-modal" role="dialog" aria-modal="true" aria-label="Universe settings">'+
 '<div class="modal-head"><div><span class="eyebrow"><i></i>ACCOUNTLESS · LOCAL SAVE SYSTEM</span><h2>YOUR UNIVERSES.</h2></div><button class="close" data-action="close">✕</button></div>'+
 pane('CAREER SAVE FILES','ALL SAVES.','<div class="stack">'+(rows||'<p class="muted">No saved careers yet.</p>')+'</div>')+
 (friends?'<div style="margin-top:12px">'+friends+'</div>':'')+
 '<div class="two-col" style="margin-top:12px">'+backups+reset+'</div>'+
 '<div class="btn-row" style="margin-top:14px">'+button('CLOSE SETTINGS','close','secondary')+'</div></div></div>';
}
function renderNewModal(){
 const sp=ui.selectedSport,teams=E.TEAMS[sp];
 const mini=['nba','nfl','soccer','mlb'].map(x=>'<label><input type="radio" name="newSport" value="'+x+'" '+(x===sp?'checked':'')+'><span>'+image(x)+'<b>'+NAMES[x]+'</b></span></label>').join('');
 const fields='<div class="two-col"><label class="field">YOUR MANAGER NAME<input name="manager" maxlength="40" value="My GM" required></label>'+
 '<label class="field">TEAM TO MANAGE<select name="team">'+teams.map(t=>'<option>'+h(t)+'</option>').join('')+'</select></label></div>'+
 '<div class="two-col"><label class="field">PLAYER UNIVERSE<select name="era"><option value="current">CURRENT PLAYERS · MODERN ROSTERS</option><option value="alltime">ALL-TIME FANTASY DRAFT · LEGENDS</option></select></label>'+
 '<label class="field">STARTING YEAR<select name="year"><option value="2026">2026 · MODERN START</option><option value="2010">2010 · ALTERNATE HISTORY</option><option value="2000">2000 · ALTERNATE HISTORY</option><option value="1996">1996 · ALTERNATE HISTORY</option><option value="1980">1980 · ALTERNATE HISTORY</option></select></label></div>'+
 '<div class="two-col"><label class="field">DIFFICULTY<select name="difficulty"><option value="normal">STANDARD GM</option><option value="hard">HARD · SMART RIVALS</option></select></label>'+
 '<div class="story-card"><div class="story-time">NEW UNIVERSE</div><b>ZERO EXISTING CHAMPIONSHIPS. ZERO IMPORTED SEASONS.</b><small>Historical years are alternate-history fantasy scenarios, not exact archived rosters. Game ratings are estimates.</small></div></div>';
 return '<div class="modal-backdrop" id="modal-root"><div class="modal wide-modal" role="dialog" aria-modal="true" aria-labelledby="createTitle">'+
 '<div class="modal-head"><div><span class="eyebrow"><i></i>NEW HISTORY · NEW FRANCHISE</span><h2 id="createTitle">BUILD YOUR WORLD.</h2><p class="muted">Every championship, MVP and league record starts from zero.</p></div><button class="close" data-action="close">✕</button></div>'+
 '<div class="modal-choices">'+mini+'</div>'+
 '<form id="createUniverse" class="stack">'+fields+'<div class="btn-row">'+button('CREATE FRESH UNIVERSE →','launch')+button('CANCEL','close','secondary')+'</div></form></div></div>';
}
function gameRoot(){
 const s=active();
 if(ui.page==='home')return renderHome();
 if(!s)return renderHome();
 if(ui.page==='universe')ui.tab='league';
 if(ui.page==='legacy')ui.tab='legacy';
 return renderHub();
}
function render(){
 const navPage=ui.page==='home'?'home':ui.page==='legacy'?'legacy':ui.page==='universe'?'universe':'hub';
 document.querySelectorAll?.('[data-nav]').forEach(el=>el.classList.toggle('nav-active',el.dataset.nav===navPage));
 const app=$('app');if(app)app.innerHTML=gameRoot()+(ui.modal?(ui.modal==='new'?renderNewModal():renderSettings()):'');
}
function resultMessage(result){if(result)notify(typeof result==='string'?result:result.error||result.message||'Decision recorded.',!!result.error)}
function apply(fn){
 const s=active();if(!s)return notify('Create a universe first.',true);
 let r;try{r=fn(s)}catch(e){console.error(e);notify('Unable to complete that decision: '+e.message,true);return}
 if(r?.error){resultMessage(r);return}
 dataSave();render();resultMessage(r);
}

function exportBackup(){
 const body=JSON.stringify({version:1,exportedAt:new Date().toISOString(),app:'ERA RIVALS REBORN',saves:db.saves,active:db.active});
 const blob=new Blob([body],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='era-rivals-reborn-backup.json';document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1800);notify('Save backup downloaded.');
}
function importBackup(file){
 if(!file||file.size>25000000)return notify('Select a Reborn backup smaller than 25 MB.',true);
 const reader=new FileReader();reader.onload=()=>{
  try{const x=JSON.parse(reader.result);if(x?.app!=='ERA RIVALS REBORN'||!Array.isArray(x.saves))throw new Error('This is not an Era Rivals Reborn backup');
   const saves=x.saves.filter(v=>E.SPORT[v.sport]&&v.league&&v.clubs&&Array.isArray(v.history)).slice(0,20);
   if(!saves.length)throw new Error('No valid universe saves found');
   db={version:1,saves,active:saves[0].id,updatedAt:Date.now()};dataSave();ui.modal=null;ui.page='hub';ui.tab='overview';render();notify('Backup imported successfully.');
  }catch(e){notify('Import failed: '+e.message,true)}
 };reader.readAsText(file);
}
function clearLegacy(){
 const keys=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k!==KEY&&(/era[_-]?rivals/i.test(k)||/^er_franchise/i.test(k)))keys.push(k)}
 if(!keys.length)return notify('No older Era Rivals browser saves were found.');
 if(!confirm('Delete '+keys.length+' older Era Rivals browser save records on this device? This cannot be undone.'))return;
 for(const key of keys)localStorage.removeItem(key);notify('Older Era Rivals browser histories deleted on this device.');
}
function doAction(action,el,event){
 const id=el.dataset.id;
 if(action==='new'){openNew();return}
 if(action==='choose-sport'){openNew(el.dataset.sport);return}
 if(action==='close'){ui.modal=null;render();return}
 if(action==='settings'){ui.modal='settings';render();return}
 if(action==='resume'){resume(id);return}
 if(action==='launch'){
  const form=$('createUniverse');if(!form)return;const manager=form.elements.manager.value.trim(),sport=ui.selectedSport,team=form.elements.team.value,era=form.elements.era.value,year=Number(form.elements.year.value),difficulty=form.elements.difficulty.value;
  if(!manager)return notify('Enter your manager name.',true);
  resultMessage(newGame({name:manager,sport,team,era,year,difficulty}));return;
 }
 if(action==='delete-save'){
  const save=db.saves.find(x=>x.id===id);if(!save)return;
  if(!confirm('Permanently delete '+save.team+' universe and all its titles and records?'))return;
  db.saves=db.saves.filter(x=>x.id!==id);if(db.active===id)db.active=db.saves[0]?.id||null;
  dataSave();render();notify('Universe deleted.');return
 }
 if(action==='reset-old'){clearLegacy();return}
 if(action==='reset-all'){
  if(!confirm('Permanently delete ALL ERA RIVALS REBORN saves on this device?'))return;
  if(!confirm('LAST CONFIRMATION: all your new champions, trades and careers will be erased.'))return;
  db={version:1,saves:[],active:null,updatedAt:Date.now()};try{localStorage.removeItem(KEY);root.indexedDB?.deleteDatabase('era_rivals_reborn_storage')}catch{}
  ui.page='home';ui.modal=null;render();notify('Full Reborn reset complete.');return
 }
 if(action==='export'){exportBackup();return}
 if(action==='import'){$('importFile')?.click();return}
 if(action==='add-friend'){
  apply(s=>{const name=$('friendName')?.value.trim(),team=$('friendTeam')?.value;if(!name||!team)return {error:'Enter a friend name and team'};
   s.friendManagers=s.friendManagers||[];if(s.friendManagers.length>=4)return {error:'Four local managers maximum'};
   s.friendManagers.push({name:name.slice(0,30),team});return {message:'Local manager '+name+' joined.'}});return
 }
 if(action==='switch-control'){apply(s=>{const team=el.dataset.team;if(!s.league[team])return {error:'Team is unavailable'};s.team=team;ui.page='hub';ui.tab='overview';ui.modal=null;return {message:'You now manage '+team+'.'}});return}
 if(gameTabs.some(x=>x[0]===action)){ui.page='hub';ui.tab=action;render();return}
 if(action==='start-match'){apply(s=>E.startMatch(s,document.querySelector('input[name="pregamePlan"]:checked')?.value||'Balanced'));return}
 if(action==='match-decision'){apply(s=>s.match?.stage==='halftime'?E.halftime(s,el.dataset.choice):E.closing(s,el.dataset.choice));return}
 if(action==='press'){apply(s=>E.press(s,el.dataset.choice));return}
 if(action==='next-season'){apply(s=>E.advanceSeason(s));return}
 if(action==='starter'){apply(s=>E.setStarter(s,id));return}
 if(action==='train'){apply(s=>E.train(s,id,'skill development'));return}
 if(action==='mentor'){apply(s=>E.mentor(s,$('mentorFrom')?.value,$('mentorTo')?.value));return}
 if(action==='sign'){apply(s=>E.signFreeAgent(s,id));return}
 if(action==='release'){apply(s=>E.releasePlayer(s,id));return}
 if(action==='make-promise'){apply(s=>E.makePromise(s,$('promiseType')?.value,$('promisePlayer')?.value));return}
 if(action==='demand-promise'){apply(s=>E.respondDemand(s,id,'promise'));return}
 if(action==='demand-refuse'){apply(s=>E.respondDemand(s,id,'refuse'));return}
 if(action==='propose-trade'){
  apply(s=>{const ids=Array.from(document.querySelectorAll('input[name="tradePlayer"]:checked')).slice(0,3).map(x=>x.value);
   return E.negotiate(s,ids,$('tradeTeam')?.value,$('tradeTarget')?.value,Number($('tradePicks')?.value||0))});return
 }
 if(action==='confirm-trade'){apply(s=>E.confirmTrade(s,false));return}
 if(action==='counter-trade'){apply(s=>E.confirmTrade(s,true));return}
 if(action==='walk-trade'){apply(s=>{s.negotiation=null;return {message:'Trade talks ended.'}});return}
 if(action==='draft-player'){apply(s=>E.draftPlayer(s,id));return}
 if(action==='scout-player'){
  apply(s=>{const p=s.draft.find(x=>x.id===id);if(!p)return {error:'Prospect unavailable'};
   const report=E.selectedProspects(s,p.pos).find(x=>x.id===id);if(!report)return {error:'Scout report unavailable'};
   s.scouting.reports.push(report);return {message:p.name+' potential range: '+report.low+'–'+report.high+'.'}});return
 }
 if(action==='hire-coach'){apply(s=>E.hireCoach(s,el.dataset.name));return}
 if(action==='upgrade-scout'){apply(s=>{const t=E.getTeam(s);if(t.budget<7)return {error:'Need $7M'};t.budget-=7;t.scout=E.clamp(t.scout+7,0,99);return {message:'Scout accuracy upgraded to '+t.scout+'%.'}});return}
 if(action==='upgrade-stadium'){apply(s=>E.stadiumUpgrade(s));return}
 if(action==='relocate'){if(!confirm('Relocate and rename this franchise?'))return;apply(s=>E.relocate(s,$('newTeamName')?.value));return}
 if(action==='expand'){apply(s=>E.expandLeague(s,$('expansionName')?.value));return}
 if(action==='accept-job'){apply(s=>E.acceptJob(s,el.dataset.team));return}
 if(action==='more-news'){ui.feedLimit+=10;render();return}
}

function onClick(event){
 const el=event.target.closest?.('[data-action],[data-tab],[data-nav]');if(!el)return;
 if(el.tagName==='A')event.preventDefault();
 if(el.dataset.tab){ui.tab=el.dataset.tab;ui.page='hub';render();return}
 if(el.dataset.nav){
  const nav=el.dataset.nav;
  if(nav==='home')navigation('home');
  else if(!active())openNew();
  else{ui.page=nav==='universe'?'universe':nav==='legacy'?'legacy':'hub';ui.tab=nav==='universe'?'league':nav==='legacy'?'legacy':'overview';render()}
  return;
 }
 if(el.dataset.action)doAction(el.dataset.action,el,event);
}
function onChange(e){
 const el=e.target;
 if(el.name==='newSport'){ui.selectedSport=el.value;render();return}
 if(el.id==='tradeTeam'){ui.transferTeam=el.value;render();return}
 if(el.id==='scoutPosition'){ui.scout=el.value;render();return}
 if(el.id==='goatPosition'){ui.selectedPosition=el.value;render();return}
 if(el.id==='importFile'){importBackup(el.files?.[0]);return}
}
function onSubmit(e){if(e.target?.id==='createUniverse'){e.preventDefault();document.querySelector('[data-action="launch"]')?.click()}}
document.addEventListener('click',onClick);
document.addEventListener('change',onChange);
document.addEventListener('submit',onSubmit);
root.ERRebootApp={getDb:()=>db,active,ui,render,newGame,openNew,apply,summary:()=>active()&&E.summary(active())};
render();restoreIndexedDB();
})(typeof window!=='undefined'?window:globalThis);
