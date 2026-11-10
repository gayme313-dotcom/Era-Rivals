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
function dataSave(){try{localStorage.setItem(KEY,JSON.stringify(db));return true}catch(e){notify('Storage is full. Export a backup in Settings.','error');return false}}
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
function button(text,action,style='secondary',attrs=''){return '<button class="btn '+style+'" data-action="'+action+'" '+attrs+'>'+text+'</button>'}
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
