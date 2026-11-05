"""Fetch a dated ESPN roster snapshot; game ratings are independent estimates.
Run manually, not on every deployment, to keep saved universes stable.
"""
import concurrent.futures, datetime, hashlib, json, pathlib, subprocess, unicodedata, urllib.request
ROOT=pathlib.Path(__file__).resolve().parents[1]
API='https://site.api.espn.com/apis/site/v2/sports/'
LEAGUES={'nba':['basketball/nba'],'nfl':['football/nfl'],'mlb':['baseball/mlb'],'soccer':['soccer/eng.1','soccer/esp.1','soccer/ger.1','soccer/ita.1','soccer/fra.1','soccer/por.1']}
def fetch(path):
    for attempt in range(3):
        try:
            with urllib.request.urlopen(API+path,timeout=25) as r:return json.load(r)
        except Exception:
            if attempt==2:raise

def normal(s):return ''.join(c for c in unicodedata.normalize('NFKD',s.lower()) if c.isalnum())
config=json.loads(subprocess.check_output(['node','-e', "const fs=require('fs'),s=fs.readFileSync('manager.js','utf8'),out={};for(const key of ['TEAMS','CURRENT','LEGENDS','STARTERS']){const a=s.indexOf('const '+key+'=')+key.length+7,b=s.indexOf('\\n};',a)+2;out[key]=Function('return ('+s.slice(a,b)+')')()}process.stdout.write(JSON.stringify(out));"],cwd=ROOT,text=True))
known={sp:{normal(p[0]):(pos,p[2]) for pos,rows in config['CURRENT'][sp].items() for p in rows} for sp in LEAGUES}
# ESPN club names normalized to the existing save names.
aliases={'LA Clippers':'LA Clippers','LA Lakers':'Los Angeles Lakers','Athletics':'Athletics','Atletico Madrid':'Atlético Madrid','Barcelona':'FC Barcelona','Paris Saint-Germain':'Paris Saint-Germain','Internazionale':'Inter Milan','AS Roma':'Roma','FC Porto':'Porto','Sport Lisboa e Benfica':'Benfica','Borussia Dortmund':'Borussia Dortmund','Tottenham Hotspur':'Tottenham Hotspur','Bayer Leverkusen':'Bayer Leverkusen'}
targets=set(config['TEAMS']['soccer'])
def teams(sp,league):
    result=[]
    for x in fetch(league+'/teams?limit=100')['sports'][0]['leagues'][0]['teams']:
        t=x['team'];name=aliases.get(t['displayName'],t['displayName'])
        if sp=='soccer' and name not in targets:continue
        result.append((sp,league,t,name))
    return result

def roster(task):
    sp,league,t,name=task;j=fetch(league+'/teams/'+t['id']+'/roster'); raw=[]
    for a in j.get('athletes',[]):raw.extend(a.get('items',[]) if 'items' in a else [a])
    players=[];counts={};seen=set()
    for a in raw:
        if a.get('id') in seen:continue
        seen.add(a.get('id')); n=a.get('displayName',a.get('fullName',''))
        if not n:continue
        p=a.get('position',{}).get('abbreviation',''); key=normal(n); k=known[sp].get(key); seed=int(hashlib.sha256(n.encode()).hexdigest()[:8],16)
        if sp=='nba':
            if p not in ['PG','SG','SF','PF','C']:p=k[0] if k else ('PG' if p=='G' and counts.get('PG',0)<=counts.get('SG',0) else 'SG' if p=='G' else 'PF' if a.get('height',0)>=81 else 'SF')
        elif sp=='nfl':p={'OT':'OL','OG':'OL','C':'OL','G':'OL','T':'OL','LS':'OL','DE':'DL','DT':'DL','NT':'DL','EDGE':'DL','OLB':'LB','ILB':'LB','MLB':'LB','CB':'DB','S':'DB','FS':'DB','SS':'DB','SAF':'DB','FB':'RB'}.get(p,p)
        elif sp=='soccer':
            if p not in config['STARTERS']['soccer']:
                group={'G':['GK'],'GK':['GK'],'D':['CB','RB','CB','LB'],'M':['CM','CDM','CAM'],'F':['ST','RW','LW']}.get(p,['CM'])
                p=k[0] if k else min(group,key=lambda pos:counts.get(pos,0)/(2 if pos=='CB' else 1))
        elif sp=='mlb':p={'P':'SP' if counts.get('SP',0)<5 else 'RP','DH':'RF','OF':min(['LF','CF','RF'],key=lambda pos:counts.get(pos,0))}.get(p,p)
        if p not in config['STARTERS'][sp] and p not in ['K','P']:continue
        counts[p]=counts.get(p,0)+1
        experience=a.get('experience',{}).get('years',3) or 0
        base=k[1] if k else min(85,70+min(experience,8)+seed%7)
        players.append({'name':n,'pos':p,'base':base,'age':a.get('age',25),'jersey':a.get('jersey',''),'photo':a.get('headshot',{}).get('href',''),'espnId':a.get('id'),'team':name,'source':'ESPN roster snapshot','listedPosition':a.get('position',{}).get('displayName',p)})
    if len(players)<8:raise ValueError(name+' roster too small: '+str(len(players)))
    return sp,name,{'id':t['id'],'name':name,'abbr':t.get('abbreviation',name[:3]),'color':'#'+t.get('color','4ad4b4'),'logo':(t.get('logos') or [{}])[0].get('href',''),'source':'https://www.espn.com/'+('soccer/team/squad/_/id/' if sp=='soccer' else sp+'/team/roster/_/id/')+t['id'],'season':j.get('season',{}).get('displayName',''),'players':players}
if __name__=='__main__':
    tasks=[];out={sp:{} for sp in LEAGUES}
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
        for group in ex.map(lambda pair:teams(*pair),[(sp,l) for sp,ls in LEAGUES.items() for l in ls]):tasks.extend(group)
        for sp,name,data in ex.map(roster,tasks):out[sp][name]=data;print(sp,name,len(data['players']),flush=True)
    payload={'fetchedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'provider':'ESPN','ratings':'ERA RIVALS estimates; not official ratings or contracts.','teams':out}
    (ROOT/'team-rosters.js').write_text('/* Dated roster snapshot. Refresh with scripts/build-team-rosters.py. */\nwindow.ERTeamRosters = '+json.dumps(payload,ensure_ascii=False,separators=(',',':'))+';\n')
    print('Saved',sum(len(x) for x in out.values()),'clubs')
