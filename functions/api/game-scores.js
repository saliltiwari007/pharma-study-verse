const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});

export async function onRequestGet({request,env}){
  if(!env.DB)return json({local:true,leaderboard:[]});
  const url=new URL(request.url);const limit=Math.min(10,Math.max(1,Number(url.searchParams.get('limit')||10)));
  const {results}=await env.DB.prepare(`SELECT name, MAX(score) AS score, MAX(created_at) AS created_at FROM game_scores GROUP BY name ORDER BY score DESC, created_at ASC LIMIT ?`).bind(limit).all();
  return json({local:false,leaderboard:results||[]});
}

export async function onRequestPost({request,env}){
  if(!env.DB)return json({error:'Leaderboard storage is not configured yet.'},503);
  let body;try{body=await request.json()}catch{return json({error:'Invalid JSON.'},400)}
  const name=String(body?.name||'Student').trim().replace(/\s+/g,' ').slice(0,30)||'Student';
  const score=Math.max(0,Math.min(1000,Math.floor(Number(body?.score)||0)));
  const correct=Math.max(0,Math.min(200,Math.floor(Number(body?.correct)||0)));
  const wrong=Math.max(0,Math.min(200,Math.floor(Number(body?.wrong)||0)));
  const mode=['beginner','medium','expert'].includes(body?.mode)?body.mode:'beginner';
  const completed=Boolean(body?.completed);
  if(score>1000||correct>200||wrong>200)return json({error:'Invalid score payload.'},400);
  await env.DB.prepare(`INSERT INTO game_scores(name,score,mode,correct,wrong,completed,created_at) VALUES(?,?,?,?,?,?,datetime('now'))`).bind(name,score,mode,correct,wrong,completed?1:0).run();
  const rankRow=await env.DB.prepare(`SELECT COUNT(*)+1 AS rank FROM (SELECT name,MAX(score) AS best_score FROM game_scores GROUP BY name) WHERE best_score > ?`).bind(score).first();
  const {results}=await env.DB.prepare(`SELECT name,MAX(score) AS score,MAX(created_at) AS created_at FROM game_scores GROUP BY name ORDER BY score DESC,created_at ASC LIMIT 10`).all();
  return json({local:false,rank:Number(rankRow?.rank||1),leaderboard:results||[]});
}
