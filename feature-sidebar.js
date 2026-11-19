(function(){
'use strict';
const groups=[
 {title:'PLAYER SYSTEMS',items:[
  ['relationships','◉','PLAYER RELATIONSHIPS','universe','feature-relationships','LIVE'],
  ['development','↗','PLAYER DEVELOPMENT','franchise','feature-development','LIVE','people'],
  ['personalities','✦','PLAYER PERSONALITIES','franchise','feature-personalities','LIVE','people'],
  ['mentorship','♧','MENTORSHIP & CHEMISTRY','franchise','feature-mentorship','LIVE','people'],
  ['recovery','♡','INJURY & COMEBACKS','franchise','feature-development','LIVE','people']
 ]},
 {title:'FRONT OFFICE',items:[
  ['trades','⇄','TRADE NEGOTIATIONS','franchise','feature-trades','LIVE','market'],
  ['free-agency','$','FREE AGENCY','franchise','feature-free-agency','LIVE','market'],
  ['draft-war-room','⌕','DRAFT WAR ROOM','franchise','feature-draft-war-room','EXPANDING','scouting'],
  ['coaches','♟','COACHES','universe','feature-coaches','LIVE'],
  ['scouts','⌖','SCOUTS','universe','feature-scouts','LIVE'],
  ['finances','◈','FRANCHISE FINANCES','universe','feature-franchise-finances','LIVE'],
  ['stadium','⌂','STADIUM & RELOCATION','universe','feature-relocation','LIVE'],
  ['objectives','◎','OWNER OBJECTIVES','universe','feature-owner-objectives','LIVE']
 ]},
 {title:'LEAGUE & LEGACY',items:[
  ['news','▤','SPORTS NEWS','universe','feature-world-news','LIVE'],
  ['rivalries','⚔','RIVALRIES','universe','feature-rivalries','LIVE'],
  ['press','◉','PRESS CONFERENCES','universe','feature-press-conferences','LIVE'],
  ['championships','♛','CHAMPIONSHIP HISTORY','universe','feature-championship-history','LIVE'],
  ['museum','▣','DYNASTY MUSEUM','franchise','feature-dynasty-museum','EXPANDING','history'],
  ['alternate-history','⤴','ALTERNATE HISTORY','franchise','feature-alternate-history','EXPANDING','history'],
  ['friends','♧','FRIENDS LEAGUE','franchise','feature-friends-league','LIVE','friends'],
  ['hof','♛','HALL OF FAME','legacy','feature-rating-quality','LIVE'],
  ['rating-qa','◉','PLAYER RATINGS & DATA','roster','feature-rating-quality','NEEDS QA']
 ]},
 {title:'ON THE ROADMAP',items:[
  ['academy','✧','YOUTH ACADEMY','', '', 'PLANNED'],
  ['coaching-trees','♟','COACHING TREES','', '', 'PLANNED'],
  ['analytics','▥','ADVANCED ANALYTICS','', '', 'PLANNED'],
  ['multiplayer','◎','REAL-TIME MULTIPLAYER','', '', 'PLANNED']
 ]}
];
let activeKey=null,navigatingFromFeature=false,observer=null;
function buildGroup(group){
 const details=document.createElement('details');details.className='side-feature-group';details.open=true;
 const summary=document.createElement('summary');summary.textContent=group.title;details.appendChild(summary);
 const list=document.createElement('div');list.className='side-feature-links';
 group.items.forEach(item=>{
  const [key,icon,label,page,anchor,status,tab]=item;
  const button=document.createElement('button');button.type='button';
  button.className='side-feature-link'+(activeKey===key?' active':'');
  button.dataset.featureLink='';button.dataset.featureKey=key;
  if(page)button.dataset.featurePage=page;
  if(anchor)button.dataset.featureAnchor=anchor;
  if(tab)button.dataset.featureTab=tab;
  if(!page){button.disabled=true;button.classList.add('planned')}
  const glyph=document.createElement('span');glyph.className='feature-icon';glyph.textContent=icon;
  const name=document.createElement('span');name.className='feature-label';name.textContent=label;
  const state=document.createElement('small');state.className='feature-status '+(status==='LIVE'?'live':status==='NEEDS QA'?'qa':'building');state.textContent=status;
  button.append(glyph,name,state);list.appendChild(button);
 });
 details.appendChild(list);return details;
}
function install(){
 const sidebar=document.getElementById('sidebar');if(!sidebar)return;
 const hasCareer=!!sidebar.querySelector('.nav-item');
 const old=sidebar.querySelector('.feature-directory');
 if(!hasCareer){old?.remove();return}
 if(old)return;
 const directory=document.createElement('div');directory.className='feature-directory';
 const heading=document.createElement('div');heading.className='side-label feature-directory-label';heading.textContent='FEATURE DIRECTORY';directory.appendChild(heading);
 groups.forEach(g=>directory.appendChild(buildGroup(g)));
 const bottom=sidebar.querySelector('.sidebar-bottom');sidebar.insertBefore(directory,bottom||null);
}
function scrollToAnchor(id){
 if(!id)return;
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
  const target=document.getElementById(id);if(target)target.scrollIntoView({behavior:'smooth',block:'start'});
 }));
}
document.addEventListener('click',event=>{
 const feature=event.target.closest?.('[data-feature-link]');
 if(feature){
  if(feature.disabled)return;
  event.preventDefault();event.stopImmediatePropagation();
  activeKey=feature.dataset.featureKey||null;
  document.querySelectorAll('.side-feature-link.active').forEach(x=>x.classList.remove('active'));
  feature.classList.add('active');
  const page=feature.dataset.featurePage;
  const nav=document.querySelector('.sidebar .nav-item[data-page="'+page+'"]');
  if(!nav)return;
  navigatingFromFeature=true;nav.click();
  const tab=feature.dataset.featureTab;
  const finish=()=>{
   if(tab){const tabButton=document.querySelector('[data-fo-tab="'+tab+'"]');if(tabButton)tabButton.click();}
   scrollToAnchor(feature.dataset.featureAnchor);
  };
  if(tab)requestAnimationFrame(finish);else scrollToAnchor(feature.dataset.featureAnchor);
  return;
 }
 if(event.target.closest?.('.sidebar .nav-item[data-page]')){
  if(navigatingFromFeature){navigatingFromFeature=false;return}
  activeKey=null;document.querySelectorAll('.side-feature-link.active').forEach(x=>x.classList.remove('active'));
 }
},true);
const sidebar=document.getElementById('sidebar');
if(sidebar&&typeof MutationObserver!=='undefined'){
 observer=new MutationObserver(install);observer.observe(sidebar,{childList:true});
}
install();
})();