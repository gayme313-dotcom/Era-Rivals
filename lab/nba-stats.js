/* ERA RIVALS — NBA season-stat engine
   Per-game regular-season data is sourced to Basketball-Reference season tables.
   ERA OVR is an original, transparent 0–99 model; it is not an NBA 2K rating.
   Historical steals/blocks/turnovers that were not officially tracked are null, never treated as zero.
*/
(() => {
  const R = {
    "nba-0":[80,36.3,23.9,6.3,12.2,.522,.205,.8,.848,1.7,.5,3.8,82,215,["MVP","NBA1","AS"]],
    "nba-1":[79,34.2,30.1,5.4,6.7,.504,.454,11.2,.908,2.1,.2,3.3,75,185,["MVP","NBA1","AS"]],
    "nba-2":[64,34.5,25.5,5.2,6.3,.437,.380,11.7,.923,1.3,.4,3.2,75,185,["NBA2","AS"]],
    "nba-3":[78,37.4,17.2,2.6,14.5,.514,.416,.7,.819,2.7,.2,3.5,73,175,["NBA3","AS"]],
    "nba-4":[80,37.6,21.1,4.0,11.6,.488,.369,2.3,.851,2.7,.1,2.5,72,175,["NBA2","AS"]],
    "nba-5":[62,35.0,19.1,4.3,10.7,.467,.368,3.3,.855,2.5,.1,2.3,72,175,["NBA1","AS","DEF1"]],
    "nba-6":[79,35.4,18.8,4.2,10.5,.512,.439,4.3,.921,.8,.1,3.5,75,195,["MVP","NBA1","AS"]],
    "nba-7":[81,37.0,18.4,3.8,9.4,.438,.309,1.5,.775,1.3,.2,4.0,73,180,["AS","NBA2"]],
    "nba-8":[79,44.3,30.8,12.5,11.4,.478,null,null,.803,null,null,null,77,205,["NBA1","AS"]],
    "nba-9":[53,31.5,19.6,3.0,4.7,.448,.321,4.9,.885,1.1,.3,2.3,74,195,[]],
    "nba-10":[70,37.5,33.9,9.2,9.8,.487,.382,10.6,.786,1.4,.5,4.0,79,230,["NBA1","AS"]],
    "nba-11":[76,34.2,32.7,5.0,6.4,.519,.375,5.7,.898,1.7,1.0,2.4,78,195,["MVP","NBA1","AS"]],
    "nba-12":[57,33.1,27.4,5.7,6.7,.493,.344,4.5,.761,1.2,.4,3.4,75,174,["NBA2","AS"]],
    "nba-13":[66,37.5,30.0,4.3,8.0,.463,.401,10.2,.888,1.1,.3,2.9,74,195,["NBA2","AS"]],
    "nba-14":[81,34.6,31.6,10.7,10.4,.425,.343,7.2,.845,1.6,.4,5.4,75,200,["MVP","NBA1","AS"]],
    "nba-15":[81,39.0,19.3,4.2,7.5,.484,.328,3.7,.748,2.9,.2,3.2,76,180,["DPOY","DEF1","NBA2","AS"]],
    "nba-16":[82,37.3,14.7,7.3,9.9,.391,.321,4.0,.814,2.1,.3,3.5,76,205,["NBA2","AS"]],
    "nba-17":[66,32.9,20.3,3.0,7.6,.522,.353,1.9,.799,.8,.1,2.6,74,185,["NBA2","AS"]],
    "nba-18":[81,37.4,25.0,4.1,7.7,.445,.332,4.8,.858,1.0,.6,3.4,75,200,["MVP","NBA1","AS"]],
    "nba-19":[82,40.4,35.0,5.5,5.9,.535,.132,.6,.841,3.2,1.6,3.1,78,216,["MVP","DPOY","NBA1","DEF1","AS"]],
    "nba-20":[82,37.0,31.5,6.0,5.5,.539,.312,1.1,.851,2.7,.9,2.5,78,216,["MVP","NBA1","DEF1","AS"]],
    "nba-21":[80,41.0,35.4,5.3,4.5,.450,.347,6.5,.850,1.8,.4,3.1,78,212,["NBA1","AS"]],
    "nba-22":[79,38.6,30.2,5.0,7.5,.491,.317,1.8,.765,2.2,1.3,3.4,76,220,["NBA1","AS"]],
    "nba-23":[78,36.8,36.1,6.6,7.5,.442,.368,13.2,.879,2.0,.7,5.0,77,220,["NBA1","AS"]],
    "nba-24":[71,42.0,31.1,3.8,4.6,.420,.320,4.3,.814,2.5,.3,3.3,72,165,["MVP","NBA1","AS"]],
    "nba-25":[80,33.3,22.1,3.8,2.1,.470,.425,8.1,.873,.8,.6,1.7,79,215,["NBA3","AS"]],
    "nba-26":[53,34.6,27.8,4.5,5.5,.494,.351,6.0,.855,1.0,.3,2.7,77,206,[]],
    "nba-27":[79,35.1,25.9,5.4,5.1,.461,.357,6.7,.836,1.3,.5,3.1,76,225,["AS"]],
    "nba-28":[73,35.9,17.4,3.7,3.1,.445,.398,5.3,.907,.9,.2,1.7,77,205,["AS"]],
    "nba-29":[81,32.9,19.6,3.0,3.1,.462,.415,4.3,.897,1.0,.2,2.0,79,185,["AS"]],
    "nba-30":[75,39.7,27.6,5.5,3.9,.460,.408,4.9,.765,1.5,1.1,2.1,78,220,["NBA2","AS"]],
    "nba-31":[75,39.4,32.1,6.5,5.5,.457,.386,6.0,.793,1.7,.8,2.6,80,210,["NBA1","AS"]],
    "nba-32":[74,29.6,16.0,4.4,3.9,.472,.376,2.3,.803,1.6,.4,2.2,78,205,["AS"]],
    "nba-33":[68,35.8,28.3,4.3,4.4,.484,.386,9.3,.867,1.5,.4,2.6,74,215,["AS"]],
    "nba-34":[64,33.4,22.9,5.9,5.3,.539,.350,1.6,.850,1.8,.3,1.6,79,230,[]],
    "nba-35":[76,36.2,25.0,6.6,6.7,.470,.337,1.2,.794,1.8,.9,3.2,79,222,["NBA1","AS"]],
    "nba-36":[76,37.9,26.8,8.0,7.3,.565,.406,3.3,.753,1.7,.9,3.0,81,250,["MVP","NBA1","DEF1","AS"]],
    "nba-37":[82,36.9,27.5,8.6,9.1,.542,.367,5.0,.731,1.4,.9,4.2,81,250,["NBA1","AS"]],
    "nba-38":[82,38.0,25.8,9.8,6.8,.496,.423,2.4,.896,2.0,.6,3.2,81,220,["MVP","NBA1","AS"]],
    "nba-39":[81,38.5,32.0,7.4,5.5,.503,.391,6.1,.873,1.3,.7,3.5,82,240,["MVP","NBA1","AS"]],
    "nba-40":[62,33.4,25.1,8.3,4.8,.537,.375,5.0,.875,1.1,1.6,2.2,82,240,["NBA2","AS"]],
    "nba-41":[60,34.0,26.6,7.3,3.3,.496,.371,5.0,.854,1.8,.4,2.0,79,225,["NBA2","DEF2","AS"]],
    "nba-42":[77,36.7,19.4,6.4,5.9,.463,.374,3.0,.679,1.7,.7,3.0,80,210,["NBA1","DEF1","AS"]],
    "nba-43":[74,35.7,26.9,8.1,4.9,.471,.376,8.2,.833,1.0,.6,2.5,80,210,["NBA1","AS"]],
    "nba-44":[80,36.2,21.7,6.8,3.5,.424,.364,6.3,.864,1.8,.3,2.8,80,220,["NBA3","DEF1","AS"]],
    "nba-45":[67,37.0,28.7,6.9,2.6,.449,.379,6.2,.830,.8,.5,2.6,80,238,["NBA2","AS"]],
    "nba-46":[72,33.6,21.4,6.8,3.7,.517,.286,1.0,.754,1.8,1.1,2.6,79,210,["NBA1","AS"]],
    "nba-47":[78,37.8,30.7,6.4,2.9,.464,.295,1.7,.826,1.3,.6,2.8,80,200,["NBA2","AS"]],
    "nba-48":[80,35.9,19.6,5.1,4.5,.464,.392,4.8,.843,1.3,.5,2.5,79,235,["NBA3","AS"]],
    "nba-49":[80,39.3,21.4,9.0,7.3,.496,.303,1.4,.711,1.8,.6,3.2,80,225,["NBA2","AS"]],
    "nba-50":[48,44.4,38.3,18.6,4.6,.428,null,null,.754,null,null,null,77,225,["NBA1","AS"]],
    "nba-51":[76,37.6,25.6,12.2,5.1,.520,.305,1.4,.765,1.6,1.0,3.1,78,252,["MVP","NBA1","AS"]],
    "nba-52":[81,39.3,23.3,12.9,3.9,.513,.273,.3,.710,.7,2.9,3.1,83,250,["MVP","NBA1","AS"]],
    "nba-53":[82,39.4,24.2,13.9,5.0,.499,.256,.5,.791,1.5,2.2,2.6,83,240,["MVP","NBA1","DEF1","AS"]],
    "nba-54":[63,30.4,29.5,13.6,5.6,.553,.304,4.7,.633,1.0,1.0,3.7,83,243,["MVP","DPOY","NBA1","DEF1","AS"]],
    "nba-55":[73,34.3,23.0,7.0,2.6,.517,.393,2.3,.892,.8,.6,1.9,84,245,["NBA2","AS","FMVP"]],
    "nba-56":[62,34.4,26.1,9.3,3.2,.503,.330,3.5,.846,1.5,2.3,2.5,82,253,["NBA1","DEF1","AS"]],
    "nba-57":[82,37.4,27.4,9.9,4.5,.550,.000,.1,.755,1.4,.6,3.2,81,250,["MVP","NBA1","AS"]],
    "nba-58":[70,40.5,27.1,11.1,4.2,.481,.071,.4,.703,1.3,1.7,3.2,81,245,["NBA1","AS"]],
    "nba-59":[81,37.0,18.9,9.6,3.5,.567,.500,.1,.781,.6,1.0,2.0,84,250,["NBA3","AS"]],
    "nba-60":[64,32.6,5.5,14.9,2.5,.480,null,null,.528,.6,.4,2.2,79,210,["DEF1"]],
    "nba-61":[61,33.2,27.0,7.2,3.7,.611,.294,.6,.698,.9,.6,2.7,78,284,["AS"]],
    "nba-62":[81,34.7,14.0,9.5,7.4,.490,.388,3.2,.696,1.5,1.4,3.2,78,230,["NBA2","DEF1","AS"]],
    "nba-63":[64,33.3,19.6,11.4,2.2,.561,.417,.1,.742,1.2,1.6,3.2,82,230,["NBA2","AS"]],
    "nba-64":[79,34.6,26.4,12.4,9.0,.583,.359,3.4,.817,1.4,.9,3.0,83,284,["MVP","NBA1","AS"]],
    "nba-65":[79,40.0,29.7,13.6,3.8,.574,null,null,.524,.5,3.0,2.8,85,325,["MVP","NBA1","AS","DEF2"]],
    "nba-66":[82,38.3,24.8,10.8,4.5,.604,null,null,.765,.9,3.4,3.6,86,225,["MVP","NBA1","AS"]],
    "nba-67":[80,48.5,50.4,25.7,2.4,.506,null,null,.613,null,null,null,85,275,["NBA1","AS"]],
    "nba-68":[76,45.2,18.9,23.6,4.5,.457,null,null,.595,null,null,null,82,215,["MVP","NBA1","AS"]],
    "nba-69":[80,41.0,27.3,11.9,3.6,.528,.421,.2,.716,1.6,3.7,3.4,83,255,["MVP","DPOY","NBA1","DEF1","AS"]],
    "nba-70":[81,38.0,27.6,10.8,2.9,.530,.300,.4,.774,1.7,3.2,2.9,85,235,["NBA1","AS"]],
    "nba-71":[66,34.6,33.1,10.2,4.2,.548,.330,3.0,.857,1.0,1.7,3.4,84,280,["MVP","NBA1","AS"]],
    "nba-72":[46,33.2,24.3,11.0,3.8,.476,.352,8.8,.836,1.1,3.8,3.1,88,235,["AS"]],
    "nba-73":[78,37.6,22.9,14.1,1.4,.593,null,null,.596,1.4,2.4,3.6,83,265,["DPOY","NBA1","DEF1","AS"]],
    "nba-74":[82,38.6,28.6,10.9,2.2,.551,.250,.2,.775,1.0,4.0,3.4,84,240,["NBA1","AS"]],
    "nba-75":[78,37.5,24.5,15.3,1.3,.501,null,null,.761,1.1,1.3,2.6,82,215,["MVP","NBA1","AS"]],
    "nba-76":[48,33.8,25.0,9.4,2.0,.516,null,null,.862,.4,2.0,3.0,87,310,["AS","NBA2"]],
    "nba-77":[81,37.7,9.5,12.4,1.7,.421,null,null,.490,1.8,3.0,1.5,81,240,["DPOY","DEF1","NBA2","AS"]],
    "nba-78":[81,33.2,17.4,7.8,3.8,.494,.176,.4,.795,.9,1.6,2.3,83,255,["DPOY","NBA1","AS"]]
  };
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const eraBase=year=>year<1970?{fg:.43,ft:.73,three:0}:year<1980?{fg:.45,ft:.74,three:.25}:year<1990?{fg:.47,ft:.75,three:.30}:year<2000?{fg:.46,ft:.75,three:.33}:year<2010?{fg:.45,ft:.76,three:.34}:year<2020?{fg:.45,ft:.77,three:.35}:{fg:.46,ft:.78,three:.36};
  const weights={
    PG:{Scoring:.19,Finishing:.12,Passing:.18,Handles:.15,Shooting:.15,Defense:.08,Athleticism:.07,IQ:.06,Rebounding:0},
    SG:{Scoring:.21,Finishing:.14,Shooting:.17,Handles:.11,Defense:.13,Athleticism:.09,Passing:.08,IQ:.07,Rebounding:0},
    SF:{Scoring:.19,Finishing:.14,Shooting:.14,Defense:.14,Athleticism:.09,Passing:.11,Handles:.07,IQ:.12,Rebounding:0},
    PF:{Scoring:.14,Finishing:.14,Shooting:.08,Defense:.19,Rebounding:.20,Athleticism:.09,Passing:.06,IQ:.10,Handles:0},
    C:{Scoring:.15,Finishing:.14,Shooting:.05,Defense:.20,Rebounding:.22,Athleticism:.10,Passing:.05,IQ:.09,Handles:0}
  };
  const score=(v)=>Math.round(clamp(v,55,99));
  function hydrate(p){
    const row=R[p.id]; if(!row)return null;
    const [g,mp,pts,reb,ast,fg,three,threeAtt,ft,stl,blk,tov,ht,wt,awards]=row;
    const s={g,mp,pts,reb,ast,fg,three,threeAtt,ft,stl,blk,tov,ht,wt,awards,perGame:true};
    const base=eraBase(p.season),stocksTracked=stl!==null&&blk!==null,ratio=ast/Math.max(1,tov===null?3.5:tov);
    const scoring=score(72+pts*.85+(fg-base.fg)*70+(ft-base.ft)*12);
    const finishing=score(74+pts*.55+(fg-base.fg)*90+(ft-base.ft)*10);
    const shooting=score(75+(fg-base.fg)*100+(ft-base.ft)*25+(three!==null&&threeAtt!==null&&threeAtt>2?(three-base.three)*80:0)+pts*.2);
    const passing=score(68+ast*2.5+(ratio-1)*2);
    const handles=score(66+ast*1.8+ratio*4+pts*.12);
    const defense=score(68+(stl||0)*6+(blk||0)*5+reb*.25+(awards.includes('DPOY')?8:0)+(awards.includes('DEF1')?4:0));
    const rebounding=score(68+reb*2.5);
    const athleticism=score(72+(stocksTracked?(stl+blk)*4+reb*.45:reb*.65)+Math.max(0,ht-78)*.2);
    const iq=score(72+g/82*4+mp/40*4+ratio*3);
    const speed=score(72+(stl||0)*4+Math.max(0,78-ht)*.35+pts*.15);
    const bounce=score(72+(blk||0)*6+reb*.7+Math.max(0,ht-78)*.4);
    const height=score(60+(ht-72)*4);
    const attrs={Scoring:scoring,Finishing:finishing,Shooting:shooting,Passing:passing,Handles:handles,Defense:defense,Rebounding:rebounding,Athleticism:athleticism,Speed:speed,Bounce:bounce,IQ:iq,Height:height};
    const w=weights[(p.pos||[])[0]]||weights.SF;
    const awardBoost=(awards.includes('MVP')?2:0)+(awards.includes('DPOY')?1.5:0)+(awards.includes('NBA1')?1:awards.includes('NBA2')?.5:0)+(awards.includes('DEF1')?.8:awards.includes('DEF2')?.4:0)+(awards.includes('AS')?.3:0)+(awards.includes('FMVP')?.8:0);
    const dominance=Math.min(5,Math.max(0,(pts-25)*.10)+Math.max(0,reb-10)*.08+Math.max(0,ast-8)*.08);
    const availability=g>=80?.5:g<55?-1.5:g<65?-.8:0;
    const overall=clamp(Math.round(Object.keys(w).reduce((sum,k)=>sum+(attrs[k]||0)*w[k],0)+awardBoost+dominance+availability),55,99);
    const statsUrl='https://www.basketball-reference.com/leagues/NBA_'+p.season+'_per_game.html';
    return {...p,stats:s,attributes:attrs,rating:overall,statsVerified:true,ratingLabel:'ERA OVR',statsSource:'Basketball-Reference',statsUrl,statSeason:(p.season-1)+'–'+String(p.season).slice(-2)};
  }
  window.ERA_NBA_STATS={hydrate,raw:R,count:Object.keys(R).length};
})();