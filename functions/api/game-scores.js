const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const MAX_SCORE=1000, TARGETS=100;
const normaliseName=v=>String(v??'Student').trim().replace(/\s+/g,' ').slice(0,30)||'Student';

export async function onRequestGet({request,env}){
  if(!env.DB)return json({local:true,leaderboard:[],message:'Shared leaderboard storage is not configured yet.'},503);
  const url=new URL(request.url);const limit=Math.min(10,Math.max(1,Number(url.searchParams.get('limit')||10)));
  const {results}=await env.DB.prepare(`SELECT name, MAX(score) AS score, MAX(created_at) AS created_at FROM game_scores WHERE completed=1 GROUP BY name ORDER BY score DESC, created_at ASC LIMIT ?`).bind(limit).all();
  return json({local:false,leaderboard:results||[],verification:'server-payload-validated'});
}

export async function onRequestPost({request,env}){
  if(!env.DB)return json({error:'Leaderboard storage is not configured yet.'},503);
  const length=Number(request.headers.get('content-length')||0);if(length>4096)return json({error:'Payload too large.'},413);
  let body;try{body=await request.json()}catch{return json({error:'Invalid JSON.'},400)}
  const score=Number(body?.score),correct=Number(body?.correct),wrong=Number(body?.wrong),mode=body?.mode,completed=body?.completed===true;
  if(!completed||!['beginner','medium','expert'].includes(mode))return json({error:'Only completed full challenges can enter the shared leaderboard.'},400);
  if(!Number.isInteger(score)||!Number.isInteger(correct)||!Number.isInteger(wrong))return json({error:'Score fields must be integers.'},400);
  if(correct!==TARGETS||wrong<0||wrong>200||score<0||score>MAX_SCORE)return json({error:'Invalid full-challenge result.'},400);
  const expected=Math.max(0,MAX_SCORE-(wrong*5));if(score!==expected)return json({error:'Score does not match the challenge scoring rules.'},400);
  const name=normaliseName(body?.name);
  await env.DB.prepare(`INSERT INTO game_scores(name,score,mode,correct,wrong,completed,created_at) VALUES(?,?,?,?,?,?,datetime('now'))`).bind(name,score,mode,correct,wrong,1).run();
  const rankRow=await env.DB.prepare(`SELECT COUNT(*)+1 AS rank FROM (SELECT name,MAX(score) AS best_score FROM game_scores WHERE completed=1 GROUP BY name) WHERE best_score > ?`).bind(score).first();
  const {results}=await env.DB.prepare(`SELECT name,MAX(score) AS score,MAX(created_at) AS created_at FROM game_scores WHERE completed=1 GROUP BY name ORDER BY score DESC,created_at ASC LIMIT 10`).all();
  return json({local:false,rank:Number(rankRow?.rank||1),leaderboard:results||[],verification:'server-payload-validated'});
}
