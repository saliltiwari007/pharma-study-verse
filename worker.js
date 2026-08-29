const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const BOARD_TARGETS=100;
function normaliseName(value){return String(value??'Student').trim().replace(/\s+/g,' ').slice(0,30)||'Student'}
async function scores(request,env){
 if(!env.DB)return json({local:true,leaderboard:[],message:'Shared leaderboard storage is not configured yet.'},503);
 if(request.method==='GET'){
  const url=new URL(request.url);const limit=Math.min(10,Math.max(1,Number(url.searchParams.get('limit')||10)));
  const {results}=await env.DB.prepare(`SELECT name, MAX(score) AS score, MAX(created_at) AS created_at FROM game_scores WHERE completed=1 GROUP BY name ORDER BY score DESC, created_at ASC LIMIT ?`).bind(limit).all();
  return json({local:false,leaderboard:results||[],verification:'server-payload-validated'});
 }
 if(request.method!=='POST')return json({error:'Method not allowed.'},405);
 const length=Number(request.headers.get('content-length')||0);if(length>4096)return json({error:'Payload too large.'},413);
 let body;try{body=await request.json()}catch{return json({error:'Invalid JSON.'},400)}
 const rawScore=Number(body?.score),rawCorrect=Number(body?.correct),rawWrong=Number(body?.wrong);const mode=['beginner','medium','expert'].includes(body?.mode)?body.mode:null;
 if(body?.completed!==true||!mode)return json({error:'Only completed full challenges can enter the shared leaderboard.'},400);
 if(!Number.isInteger(rawScore)||!Number.isInteger(rawCorrect)||!Number.isInteger(rawWrong))return json({error:'Score fields must be integers.'},400);
 if(rawCorrect!==BOARD_TARGETS||rawWrong<0||rawWrong>200||rawScore<0||rawScore>1000)return json({error:'Invalid full-challenge result.'},400);
 // Full challenge: 100 target catches × 10 points, minus 5 per wrong catch. Score is never accepted if it does not match the formula.
 const expectedScore=Math.max(0,BOARD_TARGETS-(rawWrong*5));if(rawScore!==expectedScore)return json({error:'Score does not match the challenge scoring rules.'},400);
 const name=normaliseName(body?.name);await env.DB.prepare(`INSERT INTO game_scores(name,score,mode,correct,wrong,completed,created_at) VALUES(?,?,?,?,?,?,datetime('now'))`).bind(name,rawScore,mode,rawCorrect,rawWrong,1).run();
 const rankRow=await env.DB.prepare(`SELECT COUNT(*)+1 AS rank FROM (SELECT name,MAX(score) AS best_score FROM game_scores WHERE completed=1 GROUP BY name) WHERE best_score > ?`).bind(rawScore).first();
 const {results}=await env.DB.prepare(`SELECT name,MAX(score) AS score,MAX(created_at) AS created_at FROM game_scores WHERE completed=1 GROUP BY name ORDER BY score DESC,created_at ASC LIMIT 10`).all();return json({local:false,rank:Number(rankRow?.rank||1),leaderboard:results||[],verification:'server-payload-validated'});
}
export default {async fetch(request,env){const url=new URL(request.url);if(url.pathname==='/api/game-scores')return scores(request,env);return env.ASSETS.fetch(request)}};
