// Deploy som Supabase Edge Function. Kald via et beskyttet cron-job.
import { createClient } from 'npm:@supabase/supabase-js@2';
Deno.serve(async (req) => {
  const secret=Deno.env.get('CLEANUP_CRON_SECRET');
  if(!secret || req.headers.get('x-cleanup-secret')!==secret) return new Response('Unauthorized',{status:401});
  const url=Deno.env.get('SUPABASE_URL')!;
  const key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const db=createClient(url,key,{auth:{persistSession:false}});
  const {data:settings,error:settingsError}=await db.from('app_settings').select('retention_days').eq('id',1).single();
  if(settingsError)return new Response('Settings error',{status:500});
  const cutoff=new Date(Date.now()-settings.retention_days*86400000).toISOString();
  const {data:orders,error}=await db.from('orders').select('id,image_paths').eq('status','Afsluttet').lte('completed_at',cutoff).limit(100);
  if(error)return new Response('Query error',{status:500});
  let deleted=0,failed=0;
  for(const order of orders??[]){
    const paths=Array.isArray(order.image_paths)?order.image_paths:[];
    // Slet billeder via Storage API, ikke direkte SQL. Fejl forhindrer ordresletning.
    if(paths.length){const {error:storageError}=await db.storage.from('order-images').remove(paths);if(storageError){failed++;continue}}
    const {error:deleteError}=await db.from('orders').delete().eq('id',order.id).eq('status','Afsluttet').lte('completed_at',cutoff);
    if(deleteError)failed++;else deleted++;
  }
  return Response.json({deleted,failed});
});
