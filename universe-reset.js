(function(root){
'use strict';
const RESET_FLAG='era_rivals_universe_reset_v3';
const OLD_KEYS=['era_rivals_universe_v2','era_rivals_front_office_v1','era_rivals_pro_v1','er_career_saves_v2','er_arenav5','er_active_sport','era-rivals-state-1','era-rivals-career-universe-v1','era-rivals-custom-schools-v1','era_rivals_world_history_v1','era_rivals_universe_reset_v2'];
function clearAll(){
 try{
  OLD_KEYS.forEach(k=>localStorage.removeItem(k));
  localStorage.removeItem('era_rivals_universe_v3');
  localStorage.setItem('era_rivals_universe_v3',JSON.stringify({saves:{nba:[],nfl:[],soccer:[],mlb:[]},active:{nba:null,nfl:null,soccer:null,mlb:null}}));
  localStorage.setItem('era_rivals_world_history_v1',JSON.stringify({mode:'rewrite-history',sports:{nba:[],nfl:[],soccer:[],mlb:[]}}));
  localStorage.setItem(RESET_FLAG,'done');return true;
 }catch(e){return false}
}
function bootstrap(){try{if(localStorage.getItem(RESET_FLAG)!=='done')clearAll()}catch(e){}}
root.ERResetUniverse={bootstrap,reset:clearAll,oldKeys:OLD_KEYS.slice()};bootstrap();
})(typeof window==='undefined'?globalThis:window);
