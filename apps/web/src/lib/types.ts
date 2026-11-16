export type Team={id:string;name:string;abbreviation:string;primary:string;secondary:string;country:string;kind:string;gender:string};
export type Player={id:string;teamId:string;name:string;number:number;position:string;imageUrl:string|null;stats:Record<string,number>};
export type Competition={id:string;name:string;shortName:string;gender:string;region:string;season:string;description:string;historicNames:string[]};
export type MatchEvent={id:string;minute:number;type:string;teamId:string;player:string;score:string};
export type Match={id:string;homeId:string;awayId:string;competitionId:string;date:string;kickoff:string;status:'LIVE'|'FINISHED'|'SCHEDULED';homeScore:number|null;awayScore:number|null;minute:number|null;venue:string;sample:boolean;coverage:'full'|'scores';lastUpdated:string|null;stats:Record<string,[number,number]>|null;events:MatchEvent[]};
export type Data={mode:string;defaultDate:string;teams:Team[];competitions:Competition[];players:Player[];matches:Match[]};
export type Selection={kind:'match'|'team'|'player'|'competition';id:string}|null;
export type Tab='Overview'|'Events'|'Lineups'|'Stats';
