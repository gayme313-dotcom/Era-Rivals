/* Era Rivals Reborn. Curated roster seed data, not official real-time player ratings. */
(function(root){'use strict';
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

root.ERRebootData={SPORT,TEAMS,PLAN,STARTERS,LEGENDS,CURRENT};
})(typeof window!=='undefined'?window:globalThis);
