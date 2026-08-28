const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});

async function scores(request,env){
  if(!env.DB)return json({error:'Leaderboard storage is not configured.'},503);
  if(request.method==='GET'){
    const url=new URL(request.url);const limit=Math.min(10,Math.max(1,Number(url.searchParams.get('limit')||10)));
    const {results}=await env.DB.prepare(`SELECT name, MAX(score) AS score, MAX(created_at) AS created_at FROM game_scores GROUP BY name ORDER BY score DESC, created_at ASC LIMIT ?`).bind(limit).all();
    return json({local:false,leaderboard:results||[]});
  }
  if(request.method!=='POST')return json({error:'Method not allowed.'},405);
  let body;try{body=await request.json()}catch{return json({error:'Invalid JSON.'},400)}
  const rawScore=Number(body?.score),rawCorrect=Number(body?.correct),rawWrong=Number(body?.wrong);
  if(!Number.isFinite(rawScore)||rawScore<0||rawScore>1000||!Number.isFinite(rawCorrect)||rawCorrect<0||rawCorrect>200||!Number.isFinite(rawWrong)||rawWrong<0||rawWrong>200)return json({error:'Invalid score payload.'},400);
  const name=String(body?.name||'Student').trim().replace(/\s+/g,' ').slice(0,30)||'Student';
  const score=Math.floor(rawScore),correct=Math.floor(rawCorrect),wrong=Math.floor(rawWrong),mode=['beginner','medium','expert'].includes(body?.mode)?body.mode:'beginner';
  await env.DB.prepare(`INSERT INTO game_scores(name,score,mode,correct,wrong,completed,created_at) VALUES(?,?,?,?,?,?,datetime('now'))`).bind(name,score,mode,correct,wrong,Boolean(body?.completed)?1:0).run();
  const rankRow=await env.DB.prepare(`SELECT COUNT(*)+1 AS rank FROM (SELECT name,MAX(score) AS best_score FROM game_scores GROUP BY name) WHERE best_score > ?`).bind(score).first();
  const {results}=await env.DB.prepare(`SELECT name,MAX(score) AS score,MAX(created_at) AS created_at FROM game_scores GROUP BY name ORDER BY score DESC,created_at ASC LIMIT 10`).all();
  return json({local:false,rank:Number(rankRow?.rank||1),leaderboard:results||[]});
}

export default {async fetch(request,env){const url=new URL(request.url);if(url.pathname==='/api/game-scores')return scores(request,env);return env.ASSETS.fetch(request)}};
