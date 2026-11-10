(function(root){
'use strict';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hash=s=>{let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const sports={nba:'BASKETBALL',nfl:'FOOTBALL',soccer:'SOCCER',mlb:'BASEBALL'};
const capacities={nba:19000,nfl:68000,soccer:58000,mlb:32000};
const coachNames=[{name:'Avery Cole',style:'balanced',cost:2.5,fit:'Adaptable game plans'},{name:'Rafael Stone',style:'attack',cost:3.2,fit:'High-tempo attacking systems'},{name:'Nina Brooks',style:'defense',cost:3.1,fit:'Defensive structure and discipline'},{name:'Jordan Ellis',style:'youth',cost:2.8,fit:'Prospect development and mentorship'},{name:'Marcus Reed',style:'balanced',cost:3.6,fit:'Big-game preparation'},{name:'Sofia Cruz',style:'attack',cost:3.8,fit:'Creative attacking systems'}];
const scoutNames=[{name:'Talia Morgan',region:'North America',specialty:'Ready-made talent',accuracy:72},{name:'Diego Santos',region:'South America',specialty:'Technical prospects',accuracy:68},{name:'Kai Bennett',region:'Europe',specialty:'Tactical prospects',accuracy:74},{name:'Amara Okafor',region:'Global',specialty:'Hidden potential',accuracy:65},{name:'Luca Moretti',region:'International',specialty:'Youth development',accuracy:70}];
function ensure(s){
 if(!s||!s.fo)return null;const f=s.fo;f.living=f.living||{};const l=f.living;l.version=1;
 ['news','rivalries','relationships','press','objectives','history','awards','contractDemands','coachMarket','scouts','scoutMarket'].forEach(k=>{if(!Array.isArray(l[k]))l[k]=[]});
 l.playerArcs=l.playerArcs&&typeof l.playerArcs==='object'?l.playerArcs:{};
 l.franchise=Object.assign({market:'Home market',stadiumLevel:1,capacity:capacities[s.sport]||30000,fanLoyalty:s.fanSupport||65,brand:50,ticketPrice:35,attendance:0,merchandise:0,revenue:0,relocated:false},l.franchise||{});
 l.finances=Object.assign({totalRevenue:0,lastRevenue:0,expenses:0,lastAttendance:0},l.finances||{});
 l.franchise.capacity=Number(l.franchise.capacity)||capacities[s.sport]||30000;l.franchise.fanLoyalty=clamp(Number(l.franchise.fanLoyalty)||s.fanSupport||65,0,100);l.franchise.brand=clamp(Number(l.franchise.brand)||50,0,100);
 if(!l.coachMarket.length)refreshCoachMarket(s,l);if(!l.scoutMarket.length)refreshScoutMarket(s,l);if(!l.objectives.some(o=>o.season===s.season&&o.status==='active'))createObjective(s,l);
 return l;
}
function publish(s,category,title,body,team,priority){
 const l=ensure(s);if(!l)return null;const item={id:'world-'+s.season+'-'+(s.week||0)+'-'+hash(title+':'+(l.news.length||0)),season:s.season,week:s.week||0,year:s.year,category,title,body,team:team||s.team,priority:priority||'normal'};
 l.news.unshift(item);l.news=l.news.slice(0,40);if(Array.isArray(s.feed)){s.feed.unshift('S'+s.season+' · '+title+' — '+body);s.feed=s.feed.slice(0,24)}return item;
}
function createObjective(s,l){const games=s.fo?.rules?.games||17,target=Math.max(3,Math.ceil(games*.5));l.objectives.unshift({id:'objective-'+s.season,season:s.season,type:'wins',title:'Reach '+target+' wins',description:'Give the board a winning season.',target,progress:s.record?.w||0,reward:250,status:'active'});l.objectives=l.objectives.slice(0,8)}
function refreshCoachMarket(s,l){const offset=hash(s.sport+':'+s.season+':coach')%coachNames.length;l.coachMarket=Array.from({length:4},(_,i)=>{const c=coachNames[(offset+i)%coachNames.length];return {id:'coach-'+s.season+'-'+i,name:c.name,style:c.style,cost:c.cost,fit:c.fit}})}
function refreshScoutMarket(s,l){const offset=hash(s.sport+':'+s.season+':scout')%scoutNames.length;l.scoutMarket=Array.from({length:3},(_,i)=>{const q=scoutNames[(offset+i)%scoutNames.length];return {id:'scout-'+s.season+'-'+i,name:q.name,region:q.region,specialty:q.specialty,accuracy:q.accuracy,cost:2.2}})}
function pressConference(s,topic,title,question){
 const l=ensure(s);if(!l||l.press.some(p=>!p.resolved))return null;
 const item={id:'press-'+s.season+'-'+(s.week||0)+'-'+l.press.length,topic,title,question,resolved:false,choices:[{id:'accountability',label:'Take responsibility',effect:'Owner trust +4 · chemistry +2',effects:{trust:4,chemistry:2,fan:1}},{id:'back-team',label:'Back the players',effect:'Player morale +5 · owner trust +1',effects:{morale:5,trust:1}},{id:'demand-more',label:'Demand a response',effect:'Fan loyalty +3 · chemistry +3 · morale −2',effects:{fan:3,chemistry:3,morale:-2}}]};
 l.press.unshift(item);l.press=l.press.slice(0,12);return item;
}
function updateRivalry(s,match){
 const l=ensure(s);if(!l||!match?.opponent)return;let r=l.rivalries.find(x=>x.team===match.opponent);
 if(!r){r={team:match.opponent,heat:0,games:0,wins:0,losses:0,draws:0,lastResult:'—',lastScore:'—'};l.rivalries.push(r)}
 const margin=Math.abs(Number(match.home||0)-Number(match.away||0));r.games++;if(match.result==='WIN')r.wins++;else if(match.result==='LOSS')r.losses++;else r.draws++;
 r.lastResult=match.result;r.lastScore=match.home+'–'+match.away;r.heat=clamp(r.heat+(margin<=3?13:margin<=8?8:4)+(s.playoffs?12:0),0,100);l.rivalries.sort((a,b)=>b.heat-a.heat);
 if(r.heat>=20||s.playoffs||margin<=3)publish(s,'RIVALRY',r.heat>=60?'RIVALRY IS BOILING':'A RIVALRY IS GROWING',s.team+' and '+match.opponent+' added another chapter. Head-to-head: '+r.wins+'–'+r.losses+'.',s.team,r.heat>=60?'major':'normal');
}
function updateRelationships(s,match){
 const l=ensure(s),starters=s.roster.filter(p=>p.starter&&!p.injured&&!p.development).slice(0,18);
 for(let i=0;i<starters.length;i++)for(let j=i+1;j<starters.length;j++){
  const a=starters[i],b=starters[j],mentor=(a.personality==='mentor'&&b.age<25)||(b.personality==='mentor'&&a.age<25),leader=a.personality==='leader'||b.personality==='leader',conflict=a.personality==='hothead'&&b.personality==='hothead';
  if(!mentor&&!leader&&!conflict)continue;let rel=l.relationships.find(x=>(x.a===a.id&&x.b===b.id)||(x.a===b.id&&x.b===a.id));
  if(!rel){rel={a:a.id,b:b.id,names:[a.name,b.name],type:mentor?'MENTORSHIP':conflict?'TENSION':'LEADERSHIP',chemistry:50,games:0};l.relationships.push(rel)}
  rel.games++;rel.chemistry=clamp(rel.chemistry+(match.result==='WIN'?(conflict?-1:3):conflict?-4:1),0,100);
 }
 l.relationships=l.relationships.sort((a,b)=>b.chemistry-a.chemistry).slice(0,12);
}
function updateCareerArcs(s,match){
 const l=ensure(s),mvp=s.roster.find(p=>p.name===match.mvp);if(!mvp)return;const arc=l.playerArcs[mvp.id]||(l.playerArcs[mvp.id]={hot:0,cold:0,breakouts:0,status:'Rising'});
 if(mvp.age<27&&mvp.overall<mvp.potential){arc.hot=match.result==='WIN'?arc.hot+1:Math.max(0,arc.hot-1);arc.cold=0;if(arc.hot>=3){mvp.overall=Math.min(mvp.potential,mvp.overall+1);arc.breakouts++;arc.hot=0;arc.status='Breakout';publish(s,'PLAYER BREAKOUT',mvp.name+' IS ON THE RISE',mvp.name+' is developing into a bigger star. Overall rating increased to '+mvp.overall+'.',s.team,'major')}}
 else if(mvp.age>=33&&match.result==='LOSS'){arc.cold++;if(arc.cold>=4){arc.status='Veteran decline';publish(s,'PLAYER WATCH',mvp.name+' FACES A BIG SEASON','The veteran is showing signs of decline. Review their role and long-term contract.',s.team)}}else{arc.status='In form';arc.cold=0}
}
function updateFinance(s,match){
 const l=ensure(s),f=s.fo,club=l.franchise,win=match.result==='WIN',loss=match.result==='LOSS';club.fanLoyalty=clamp(club.fanLoyalty+(win?1.2:loss?-1:.2),15,100);club.brand=clamp(club.brand+(win?.25:loss?-.1:0),10,100);
 const price=clamp(Number(club.ticketPrice)||35,15,120),rate=clamp(.38+club.fanLoyalty/210+club.brand/520-(price-35)*.0025,.28,.98);club.attendance=Math.round(club.capacity*rate);
 const gate=club.attendance*price/1000000,merch=club.brand*.006+club.fanLoyalty*.004,revenue=gate+merch,expenses=(f.staff||[]).reduce((n,c)=>n+Number(c.cost||0)*.04,0);
 club.merchandise=merch;club.revenue=revenue;f.cash=clamp((Number(f.cash)||0)+revenue*.18-expenses,0,100);l.finances.lastRevenue=revenue;l.finances.totalRevenue+=revenue;l.finances.expenses+=expenses;l.finances.lastAttendance=club.attendance;s.fanSupport=club.fanLoyalty;
}
function updateObjective(s,match){const l=ensure(s),o=l.objectives.find(x=>x.season===s.season&&x.status==='active');if(!o)return;if(match.result==='WIN')o.progress++;o.progress=Math.min(o.target,o.progress)}
function afterMatch(s){
 const match=s.lastMatch;if(!match)return;const l=ensure(s);updateRivalry(s,match);updateRelationships(s,match);updateCareerArcs(s,match);updateFinance(s,match);updateObjective(s,match);
 const margin=Math.abs(match.home-match.away);
 if(match.result==='WIN'&&margin>=10)publish(s,'RESULT','STATEMENT WIN',s.team+' delivered a convincing '+match.home+'–'+match.away+' win over '+match.opponent+'.');
 else if(match.result==='LOSS'&&margin>=10)publish(s,'RESULT','A TOUGH NIGHT',s.team+' fell '+match.home+'–'+match.away+' to '+match.opponent+'. The front office faces questions.');
 else if(match.result==='WIN')publish(s,'MATCHDAY','ANOTHER ONE IN THE BOOKS',s.team+' beat '+match.opponent+' '+match.home+'–'+match.away+'.');
 if(match.result==='LOSS'&&margin>=8)pressConference(s,'loss','POSTGAME PRESS CONFERENCE','What went wrong, and how will you respond?');
 else if(match.result==='WIN'&&margin>=12)pressConference(s,'win','POSTGAME PRESS CONFERENCE','Your team made a statement. Are championship expectations changing?');
 else if(s.playoffs)pressConference(s,'playoffs','PLAYOFF PRESS CONFERENCE','How will your team handle the pressure in the next round?');
 for(const p of s.roster.filter(p=>p.injured>0)){if(!l.press.some(x=>!x.resolved&&x.topic==='injury'&&x.player===p.id)){l.press.unshift({id:'medical-'+p.id+'-'+s.season+'-'+s.week,topic:'injury',player:p.id,title:'MEDICAL ROOM · '+p.name,question:'How should the medical staff handle this injury?',resolved:false,choices:[{id:'rest',label:'Give them more recovery time',effect:'Add one game of recovery and protect long-term health.',effects:{}},{id:'return',label:'Attempt an early return',effect:'Return sooner, but risk a setback.',effects:{}}]})}}
 if(s.week>0&&s.week%4===0&&!l.press.some(x=>!x.resolved))pressConference(s,'season','MIDSEASON MEDIA','What is the biggest priority for the rest of the season?');
}
function seasonEnd(s,title){
 const l=ensure(s),f=s.fo,champion=s.leagueChampion||f.history?.[0]?.champion||s.team,mvp=s.seasonHistory?.[0]?.mvp||'—';
 l.history.unshift({season:s.season,year:s.year,champion,mvp,managedTeam:s.team,record:s.record.w+'-'+s.record.l+(s.record.d?'-'+s.record.d:''),title:!!title});l.history=l.history.slice(0,40);
 const breakout=s.roster.slice().sort((a,b)=>(b.overall-(b.seasonStartOvr||b.overall))-(a.overall-(a.seasonStartOvr||a.overall)))[0],rookie=s.roster.filter(p=>p.age<=23).sort((a,b)=>b.overall-a.overall)[0],defender=s.roster.slice().sort((a,b)=>((b.skills?.defense||0)+b.overall*.2)-((a.skills?.defense||0)+a.overall*.2))[0];
 const awards=[{type:'MVP',player:mvp},{type:'Breakout Player',player:breakout?.name||'—'},{type:'Rookie of the Year',player:rookie?.name||'—'},{type:'Defensive Player',player:defender?.name||'—'}];l.awards.unshift({season:s.season,year:s.year,awards});l.awards=l.awards.slice(0,20);
 publish(s,'CHAMPIONSHIP',champion+' ARE CHAMPIONS',champion+' won the '+s.year+' '+sports[s.sport]+' title. '+(mvp!=='—'?'MVP: '+mvp+'.':''),champion,'major');
 publish(s,'AWARDS','SEASON AWARDS ANNOUNCED','MVP: '+mvp+' · Breakout: '+(breakout?.name||'—')+' · Rookie: '+(rookie?.name||'—')+'.');
 const objective=l.objectives.find(x=>x.season===s.season&&x.status==='active');
 if(objective){const achieved=objective.progress>=objective.target||!!title;objective.status=achieved?'complete':'missed';if(achieved){f.owner.trust=clamp(f.owner.trust+8,0,100);s.gmPoints+=objective.reward;publish(s,'OWNERSHIP','BOARD OBJECTIVE COMPLETE','You met the board objective and earned '+objective.reward+' GM points.')}else{f.owner.trust=clamp(f.owner.trust-6,0,100);publish(s,'OWNERSHIP','BOARD OBJECTIVE MISSED','The owner expected '+objective.target+' wins. The pressure is increasing.')}}
 if(title){l.franchise.brand=clamp(l.franchise.brand+8,0,100);l.franchise.fanLoyalty=clamp(l.franchise.fanLoyalty+8,0,100)}
}
function nextSeason(s){
 const l=ensure(s),f=s.fo;refreshCoachMarket(s,l);refreshScoutMarket(s,l);f.scoutPoints=Math.min(20,(f.scoutPoints||0)+Math.min(3,l.scouts.length));
 for(const p of s.roster){if((p.contractYears||0)<=1||p.morale<48){if(!l.contractDemands.some(x=>x.player===p.id&&x.status==='open')){l.contractDemands.unshift({id:'demand-'+p.id+'-'+s.season,player:p.id,name:p.name,reason:p.morale<48?'Unhappy with their role':'Contract is nearing expiration',status:'open'});publish(s,'CONTRACT WATCH',p.name+' WANTS A DECISION',p.name+' is asking for clarity on their future. Negotiate, trade or risk losing them.')}}}
 for(const p of f.market||[]){const ageFactor=p.age<25?1.25:p.age>32?.72:1,demand=clamp((p.overall-52)*.065+Math.max(0,p.potential-p.overall)*.025,.5,9)*ageFactor;p.marketDemand=Math.round(demand*10)/10;p.salary=Math.max(.5,p.marketDemand)}
 for(const p of s.retired||[]){if(!p.livingRetirementNews){publish(s,'RETIREMENT',p.name+' ANNOUNCES RETIREMENT','A career comes to an end. The Hall of Fame debate begins.');p.livingRetirementNews=true}}
 createObjective(s,l);publish(s,'SEASON','A NEW SEASON BEGINS','The standings reset. Every team starts with a new opportunity.',s.team);
}
function relocate(s,a){
 const old=s.team,name=String(a.name||'').trim().slice(0,42),city=String(a.city||'').trim().slice(0,30);
 if(!name||!city)throw Error('Choose a new city and franchise name.');if(name===old)throw Error('Choose a different franchise identity.');if(s.standings?.[name])throw Error('That team name is already in this league.');
 const f=s.fo;s.team=name;if(s.standings?.[old]){s.standings[name]=s.standings[old];delete s.standings[old]}if(f.teams?.[old]){f.teams[name]=f.teams[old];delete f.teams[old]}
 s.roster.forEach(p=>{if(p.team===old)p.team=name});Object.values(f.teams||{}).forEach(t=>(t.roster||[]).forEach(p=>{if(p.team===old)p.team=name}));
 if(Array.isArray(s.schedule))s.schedule=s.schedule.map(x=>x===old?name:x);
 const l=ensure(s);l.franchise.market=city;l.franchise.relocated=true;l.franchise.brand=clamp(l.franchise.brand-4,0,100);l.franchise.fanLoyalty=clamp(l.franchise.fanLoyalty-5,0,100);
 publish(s,'FRANCHISE','FRANCHISE RELOCATED',old+' moved to '+city+' and became '+name+'. A new chapter begins.',name,'major');return {message:'Franchise relocated to '+city+'.'};
}
function worldAction(s,name,a){
 const l=ensure(s),f=s.fo;if(!l)throw Error('Create a dynasty first.');
 if(name==='world-press'){
  const q=l.press.find(x=>x.id===a.id&&!x.resolved);if(!q)throw Error('That press conference has already closed.');const choice=q.choices.find(x=>x.id===a.choice);if(!choice)throw Error('Choose a valid response.');
  const fx=choice.effects||{};f.owner.trust=clamp(f.owner.trust+(fx.trust||0),0,100);s.chemistry=clamp(s.chemistry+(fx.chemistry||0),0,100);s.morale=clamp(s.morale+(fx.morale||0),0,100);l.franchise.fanLoyalty=clamp(l.franchise.fanLoyalty+(fx.fan||0),0,100);
  if(q.topic==='injury'){const p=s.roster.find(x=>x.id===q.player);if(p){if(a.choice==='rest'){p.injured=Math.max(1,p.injured+1);p.morale=clamp(p.morale+1,0,100)}else if(a.choice==='return'){p.injured=0;p.earlyReturn=true;p.morale=clamp(p.morale-2,0,100)}}}
  q.resolved=true;q.choice=a.choice;s.fanSupport=l.franchise.fanLoyalty;publish(s,'PRESS ROOM','THE FRONT OFFICE RESPONDED',q.title+': '+choice.label+'.');return {message:'Press conference response recorded.'};
 }
 if(name==='world-stadium'){const cost=3+(l.franchise.stadiumLevel||1)*2.5;if((f.cash||0)<cost)throw Error('Not enough franchise cash. Stadium upgrade costs '+cost.toFixed(1)+'M.');f.cash-=cost;l.franchise.stadiumLevel++;l.franchise.capacity+=s.sport==='nfl'?5000:s.sport==='soccer'?4000:2000;l.franchise.brand=clamp(l.franchise.brand+3,0,100);publish(s,'BUSINESS','STADIUM EXPANSION APPROVED','The stadium is now level '+l.franchise.stadiumLevel+'. Capacity and matchday revenue have increased.');return {message:'Stadium upgraded.'}}
 if(name==='world-ticket'){const price=clamp(Number(a.price)||35,15,120);l.franchise.ticketPrice=price;publish(s,'BUSINESS','TICKET PRICING UPDATED','Average ticket price set to $'+price+'. Attendance and revenue will respond.');return {message:'Ticket price updated.'}}
 if(name==='world-hire-coach'){
  const c=l.coachMarket.find(x=>x.id===a.id);if(!c)throw Error('That coach is no longer available.');if(f.staff.some(x=>x.id===c.style))throw Error('You already employ a coach with that system.');if(f.staff.length>=4)throw Error('Your coaching staff is full. Release a coach first.');if((f.cash||0)<c.cost)throw Error('Not enough franchise cash to hire this coach.');
  f.cash-=c.cost;f.staff.push({id:c.style,name:c.name,style:c.style,cost:c.cost});l.coachMarket=l.coachMarket.filter(x=>x.id!==c.id);publish(s,'COACHING','COACHING CAROUSEL MOVE',c.name+' joined the staff with a '+c.style+' philosophy.');return {message:c.name+' hired.'};
 }
 if(name==='world-hire-scout'){
  const q=l.scoutMarket.find(x=>x.id===a.id);if(!q)throw Error('That scout is no longer available.');if(l.scouts.length>=4)throw Error('Your scouting department is full.');if((f.cash||0)<q.cost)throw Error('Not enough franchise cash to hire this scout.');
  f.cash-=q.cost;l.scouts.push({...q,hiredSeason:s.season});l.scoutMarket=l.scoutMarket.filter(x=>x.id!==q.id);publish(s,'SCOUTING','SCOUTING DEPARTMENT EXPANDED',q.name+' joined the department. Specialty: '+q.specialty+'.');return {message:q.name+' hired.'};
 }
 if(name==='world-relocate')return relocate(s,a);
 if(name==='world-contract'){
  const p=s.roster.find(x=>x.id===a.id);if(!p)throw Error('That player is no longer on your roster.');const demand=l.contractDemands.find(x=>x.player===p.id&&x.status==='open');if(demand)demand.status=a.choice||'resolved';
  if(a.choice==='extend'){const salary=Math.round(p.salary*1.12*10)/10;if(s.roster.reduce((n,x)=>n+x.salary,0)-p.salary+salary>(f.rules?.cap||Infinity))throw Error('The extension would exceed your salary cap.');p.contractYears=Math.max(2,p.contractYears||0);p.salary=salary;p.morale=clamp(p.morale+8,0,100);publish(s,'CONTRACT','STAR PLAYER EXTENDED',p.name+' agreed to stay after a new contract offer.')}
  else if(a.choice==='trade'){p.wantsTrade=true;p.morale=clamp(p.morale-2,0,100);publish(s,'TRADE REQUEST',p.name+' REQUESTED A TRADE',p.name+' has asked the front office to find a new team.')}
  else{p.morale=clamp(p.morale-8,0,100);publish(s,'CONTRACT','NEGOTIATIONS TURNED COLD',p.name+' was unhappy with the front office response.')}return {message:'Player situation updated.'};
 }
 if(name==='world-comeback'){
  const p=(s.retired||[]).find(x=>x.id===a.id);if(!p)throw Error('That retired player is unavailable.');if(p.age>38)throw Error('This player is too old to make a comeback.');
  const salary=Math.max(.5,Math.round(p.overall*.055*10)/10);if((f.cash||0)<2)throw Error('Not enough franchise cash to offer a comeback deal.');
  f.cash-=2;s.retired=s.retired.filter(x=>x.id!==p.id);p.retired=false;p.injured=0;p.earlyReturn=false;p.contractYears=1;p.salary=salary;p.morale=65;p.starter=false;s.roster.push(p);publish(s,'COMEBACK',p.name+' RETURNS',p.name+' signed a one-year comeback contract with '+s.team+'.');return {message:p.name+' returned from retirement.'};
 }
 throw Error('Unknown league action.');
}
function afterAction(s,name,a,result){
 if(['trade-confirm','three-trade'].includes(name))publish(s,'TRADE DESK','BLOCKBUSTER TRADE COMPLETED',result?.message||'A major roster move changed the league.');
 else if(name==='free-agent')publish(s,'FREE AGENCY','FREE AGENT SIGNED',result?.message||'A player joined the franchise.');
 else if(name==='contract')publish(s,'CONTRACT','CONTRACT EXTENSION SIGNED',result?.message||'A player agreed to a new deal.');
 else if(name==='job')publish(s,'GM CAREER','NEW FRONT OFFICE JOB',result?.message||'The general manager changed franchises.');
 else if(name==='jersey')publish(s,'LEGACY','RETIRED JERSEY CEREMONY',result?.message||'A franchise legend was honoured.');
 else if(name==='coach'||name==='fire-coach')publish(s,'COACHING','COACHING STAFF CHANGED',result?.message||'The coaching staff changed.');
 else if(name==='expansion-pick')publish(s,'EXPANSION','EXPANSION DRAFT UPDATE',result?.message||'An expansion club added a player.');
}
function summary(s){const l=ensure(s);return {news:l.news.slice(0,8),rivalries:l.rivalries.slice(0,5),history:l.history.slice(0,5),recent:l.history[0]||null}}
function button(action,label,args,disabled){return '<button class="btn '+(disabled?'ghost':'primary')+'" data-world="'+action+'" data-world-args="'+esc(JSON.stringify(args||{}))+'" '+(disabled?'disabled':'')+'>'+esc(label)+'</button>'}
function render(s,e){
 const l=ensure(s),f=s.fo;if(!l)return '<section class="panel"><h2>Start a dynasty first.</h2></section>';
 const news=l.news.slice(0,8).map(x=>'<article class="world-news-card"><span>'+esc(x.category)+' · '+esc(x.year||s.year)+'</span><b>'+esc(x.title)+'</b><p>'+esc(x.body)+'</p></article>').join('');
 const rivals=l.rivalries.slice(0,6).map(r=>'<div class="world-row"><div><b>'+esc(r.team)+'</b><small>'+r.games+' meetings · '+r.wins+'–'+r.losses+' head-to-head</small></div><span class="world-heat">'+r.heat+' HEAT</span></div>').join('');
 const objective=l.objectives.find(x=>x.season===s.season&&x.status==='active'),press=l.press.find(x=>!x.resolved);
 const pressHtml=press?'<div class="world-press"><span class="eyebrow">'+esc(press.title)+'</span><h3>'+esc(press.question)+'</h3><div class="world-choice-grid">'+press.choices.map(c=>'<div><b>'+esc(c.label)+'</b><small>'+esc(c.effect)+'</small>'+button('world-press','RESPOND',{id:press.id,choice:c.id})+'</div>').join('')+'</div></div>':'<p class="muted">No unanswered questions. The press room is quiet.</p>';
 const coaches=l.coachMarket.map(c=>'<div class="world-row"><div><b>'+esc(c.name)+'</b><small>'+esc(c.fit)+' · '+c.cost.toFixed(1)+'M</small></div>'+button('world-hire-coach','HIRE',{id:c.id},f.staff.some(x=>x.id===c.style)||f.cash<c.cost)+'</div>').join('');
 const scouts=l.scoutMarket.map(c=>'<div class="world-row"><div><b>'+esc(c.name)+'</b><small>'+esc(c.region)+' · '+esc(c.specialty)+' · '+c.accuracy+'% accuracy · '+c.cost.toFixed(1)+'M</small></div>'+button('world-hire-scout','HIRE',{id:c.id},l.scouts.length>=4||f.cash<c.cost)+'</div>').join('');
 const demands=l.contractDemands.filter(x=>x.status==='open').map(d=>'<div class="world-row"><div><b>'+esc(d.name)+'</b><small>'+esc(d.reason)+'</small></div>'+button('world-contract','EXTEND',{id:d.player,choice:'extend'})+button('world-contract','TRADE REQUEST',{id:d.player,choice:'trade'})+'</div>').join('');
 const retired=(s.retired||[]).filter(p=>p.age<=38).slice(-5).map(p=>'<div class="world-row"><div><b>'+esc(p.name)+'</b><small>'+esc(p.pos)+' · '+p.age+' years old · '+p.overall+' OVR</small></div>'+button('world-comeback','OFFER COMEBACK',{id:p.id},f.cash<2)+'</div>').join('');
 const relations=l.relationships.slice(0,5).map(r=>'<div class="world-row"><div><b>'+esc(r.names.join(' + '))+'</b><small>'+esc(r.type)+' · '+r.games+' games together</small></div><span class="world-heat">'+r.chemistry+' CHEM</span></div>').join('');
 const hist=l.history.slice(0,5).map(h=>'<div class="world-row"><div><b>'+esc(h.year)+' · '+esc(h.champion)+'</b><small>MVP: '+esc(h.mvp)+' · '+esc(h.managedTeam)+' '+esc(h.record)+'</small></div></div>').join('');
 const fin=l.finances,club=l.franchise;
 return '<div class="page-heading"><div><span class="eyebrow">ERA SPORTS NETWORK · '+esc(sports[s.sport]||s.sport)+'</span><h1>THE WORLD<br><em>NEVER STOPS.</em></h1><p>Rival teams move, stars rise, owners react and history keeps growing.</p></div><span class="status-pill">LIVE UNIVERSE</span></div>'+
 '<section class="world-hero"><div><span class="eyebrow">LEAGUE CENTRAL · SEASON '+s.season+'</span><h2>'+esc(s.team)+'</h2><p>'+esc(club.market)+' · '+esc(sports[s.sport]||'SPORT')+' · '+esc(s.era.toUpperCase())+' ERA</p></div><div class="world-hero-grade"><b>'+Math.round(club.brand)+'</b><small>BRAND</small></div></section>'+
 '<div class="world-stat-grid"><div><small>FAN LOYALTY</small><b>'+Math.round(club.fanLoyalty)+'%</b></div><div><small>ATTENDANCE</small><b>'+(club.attendance?club.attendance.toLocaleString():'—')+'</b></div><div><small>STADIUM</small><b>LEVEL '+club.stadiumLevel+'</b></div><div><small>FRANCHISE CASH</small><b>'+Number(f.cash||0).toFixed(1)+'M</b></div><div><small>LAST MATCHDAY</small><b>'+Number(fin.lastRevenue||0).toFixed(2)+'M</b></div></div>'+
 '<div class="world-grid"><section class="panel"><div class="panel-top"><div><span class="eyebrow">BREAKING · YOUR UNIVERSE</span><h2>WORLD NEWS.</h2></div><span class="status-pill">'+l.news.length+' STORIES</span></div><div class="world-news-grid">'+(news||'<article class="world-news-card"><span>WELCOME</span><b>THE FIRST CHAPTER.</b><p>Play games and make decisions. The league will create its own history.</p></article>')+'</div></section>'+
 '<section class="panel"><span class="eyebrow">BOARDROOM · SEASON '+s.season+'</span><h2>OWNER OBJECTIVE.</h2>'+(objective?'<b>'+esc(objective.title)+'</b><p class="muted">'+esc(objective.description)+'</p><div class="world-progress"><i style="width:'+Math.round(objective.progress/objective.target*100)+'%"></i></div><small>'+objective.progress+' / '+objective.target+' wins · '+objective.reward+' GM points</small>':'<p class="muted">No active objective.</p>')+'</section></div>'+
 '<div class="world-grid"><section class="panel"><span class="eyebrow">RIVALRY WATCH</span><h2>BAD BLOOD.</h2>'+(rivals||'<p class="muted">Rivalries form through close games and playoff battles.</p>')+'</section><section class="panel"><span class="eyebrow">LOCKER ROOM</span><h2>PLAYER RELATIONSHIPS.</h2>'+(relations||'<p class="muted">Player bonds and tension will develop as the team plays together.</p>')+'</section></div>'+
 '<div class="world-grid"><section class="panel"><span class="eyebrow">MEDIA ROOM</span><h2>PRESS CONFERENCE.</h2>'+pressHtml+'</section><section class="panel"><span class="eyebrow">FRANCHISE BUSINESS</span><h2>BUILD YOUR HOME.</h2><div class="world-row"><div><b>STADIUM EXPANSION</b><small>Upgrade capacity and matchday revenue.</small></div>'+button('world-stadium','UPGRADE · '+(3+club.stadiumLevel*2.5).toFixed(1)+'M',{},f.cash<(3+club.stadiumLevel*2.5))+'</div><div class="world-ticket"><b>TICKET PRICING</b>'+[25,35,45,55].map(price=>button('world-ticket','$'+price,{price},price===club.ticketPrice)).join('')+'</div><small>Attendance and merchandise income change with fan loyalty, brand and ticket price.</small></section></div>'+
 '<div class="world-grid"><section class="panel"><span class="eyebrow">COACHING CAROUSEL</span><h2>NEW STAFF.</h2>'+(coaches||'<p class="muted">No candidates available.</p>')+'</section><section class="panel"><span class="eyebrow">SCOUTING DEPARTMENT</span><h2>FIND THE NEXT STAR.</h2>'+(scouts||'<p class="muted">No scouts available.</p>')+'</section></div>'+
 '<div class="world-grid"><section class="panel"><span class="eyebrow">CONTRACT WATCH</span><h2>PLAYER DEMANDS.</h2>'+(demands||'<p class="muted">No players are demanding a decision.</p>')+'</section><section class="panel"><span class="eyebrow">RETIREMENT & COMEBACKS</span><h2>ONE MORE RUN.</h2>'+(retired||'<p class="muted">No eligible retired players are available.</p>')+'</section></div>'+
 '<div class="world-grid"><section class="panel"><span class="eyebrow">DYNASTY RECORD</span><h2>CHAMPIONSHIP HISTORY.</h2>'+(hist||'<p class="muted">No champions yet. Write the first chapter.</p>')+'</section><section class="panel"><span class="eyebrow">FRANCHISE RELOCATION</span><h2>CHANGE YOUR CITY.</h2><p class="muted">Move the franchise, rebuild its identity and grow a new fan base.</p><div class="world-ticket">'+button('world-relocate','SAN JUAN WAVES',{city:'San Juan',name:'San Juan Waves'},club.relocated)+button('world-relocate','LONDON MONARCHS',{city:'London',name:'London Monarchs'},club.relocated)+button('world-relocate','VEGAS OUTLAWS',{city:'Las Vegas',name:'Las Vegas Outlaws'},club.relocated)+'</div></section></div>';
}
const F=root.ERFranchise;
if(F){
 const baseInit=F.init,baseAfter=F.afterMatch,baseEnd=F.onSeasonEnd,baseNext=F.nextSeason,baseAction=F.action,baseBonus=F.bonus;
 F.init=function(s,e){const out=baseInit(s,e);ensure(s);return out};
 F.afterMatch=function(s,ctx,e){const out=baseAfter(s,ctx,e);afterMatch(s,ctx);return out};
 F.onSeasonEnd=function(s,title,e){const out=baseEnd(s,title,e);seasonEnd(s,title);return out};
 F.nextSeason=function(s,e){const out=baseNext(s,e);nextSeason(s);return out};
 F.action=function(s,name,a,e){if(name&&name.indexOf('world-')===0)return worldAction(s,name,a||{});const result=baseAction(s,name,a,e);afterAction(s,name,a||{},result);return result};
 F.bonus=function(s){const l=ensure(s);return baseBonus(s)+(l?(l.franchise.fanLoyalty-50)*.012+l.franchise.stadiumLevel*.12:0)};
}
root.ERLivingLeague={ensure,publish,render,summary,pressConference,refreshCoachMarket,refreshScoutMarket};
})(typeof window==='undefined'?globalThis:window);
