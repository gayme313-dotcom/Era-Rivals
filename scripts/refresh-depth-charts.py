"""Add ESPN depth-chart roles to the dated roster snapshot for NBA/NFL/MLB."""
import concurrent.futures,json,pathlib,urllib.request
root=pathlib.Path(__file__).resolve().parents[1];path=root/'team-rosters.js';text=path.read_text();data=json.loads(text.split('window.ERTeamRosters = ',1)[1].rstrip(';\n'))
leagues={'nba':'basketball/nba','nfl':'football/nfl','mlb':'baseball/mlb'}
def map_pos(sp,key):
 key=key.lower()
 if sp=='nba':return key.upper() if key in ['pg','sg','sf','pf','c'] else None
 if sp=='nfl':
  if key in ['lt','lg','c','rg','rt']:return 'OL'
  if key in ['lde','rde','dt','nt','de','ldt','rdt']:return 'DL'
  if 'lb' in key:return 'LB'
  if 'cb' in key or key in ['ss','fs','nb','s']:return 'DB'
  if key.startswith('wr'):return 'WR'
  return {'qb':'QB','rb':'RB','fb':'RB','te':'TE','pk':'K','k':'K','p':'P'}.get(key)
 if sp=='mlb':return {'sp':'SP','rp':'RP','cl':'CP','cp':'CP','c':'C','1b':'1B','2b':'2B','3b':'3B','ss':'SS','lf':'LF','cf':'CF','rf':'RF'}.get(key)
def update(task):
 sp,name,club=task;url='https://site.api.espn.com/apis/site/v2/sports/'+leagues[sp]+'/teams/'+club['id']+'/depthcharts'
 try:
  with urllib.request.urlopen(url,timeout=20) as r:d=json.load(r)
  assigned={}
  for chart in d.get('depthchart',[]):
   for key,row in chart.get('positions',{}).items():
    pos=map_pos(sp,key)
    if not pos:continue
    for rank,a in enumerate(row.get('athletes',[])):
     old=assigned.get(a['id']);candidate=(rank,pos)
     if old is None or rank<old[0]:assigned[a['id']]=candidate
  for p in club['players']:
   if p['espnId'] in assigned:
    rank,pos=assigned[p['espnId']];p['depthRank']=rank;p['pos']=pos
    if p['base']<90:p['base']=max(68,85-min(rank,4)*4+(sum(map(ord,p['name']))%3))
   else:p['depthRank']=9;p['base']=min(p['base'],78)
  return name,len(assigned)
 except Exception as e:return name,str(e)
if __name__=='__main__':
 with concurrent.futures.ThreadPoolExecutor(max_workers=10) as ex:
  for result in ex.map(update,[(sp,n,c) for sp in leagues for n,c in data['teams'][sp].items()]):print(*result,flush=True)
 path.write_text('/* Dated ESPN roster and depth chart snapshot. Ratings are game estimates. */\nwindow.ERTeamRosters = '+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n')
