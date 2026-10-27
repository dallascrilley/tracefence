// Pure planning: never executes a tool or assumes an idempotency key is enforced.
export function canonical(value) {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k)+':'+canonical(value[k])).join(',') + '}';
  return JSON.stringify(value);
}
export function inspectTrace(rows) {
  if (!Array.isArray(rows) || !rows.length || rows.length > 10000) throw new Error('Use an array of 1–10,000 tool calls.');
  rows = rows.map(row => {
    if (row && typeof row.arguments === 'string') {
      try { return {...row, arguments: JSON.parse(row.arguments)}; } catch { throw new Error('CSV arguments must contain a valid JSON object.'); }
    }
    return row;
  });
  const ids = new Set();
  for (const row of rows) {
    if (!row || typeof row !== 'object' || typeof row.id !== 'string' || !row.id || ids.has(row.id)) throw new Error('Every call needs a unique nonempty string id.');
    ids.add(row.id);
    if (typeof row.tool !== 'string' || !row.tool) throw new Error('Every call needs a tool name.');
    if (!['read','write','unknown'].includes(row.effect)) throw new Error('effect must be read, write or unknown; effects are declared, never guessed.');
    if (!['succeeded','failed','timeout','unknown'].includes(row.status)) throw new Error('status must be succeeded, failed, timeout or unknown.');
    if (!row.arguments || typeof row.arguments !== 'object' || Array.isArray(row.arguments)) throw new Error('arguments must be a JSON object.');
    if (row.idempotency_key !== undefined && (typeof row.idempotency_key !== 'string' || !row.idempotency_key)) throw new Error('idempotency_key must be a nonempty string when supplied.');
  }
  const keyed = new Map();
  const signatures = new Map();
  for (const row of rows) {
    const sig = row.tool+'\0'+canonical(row.arguments);
    const group = signatures.get(sig) || []; group.push(row); signatures.set(sig, group);
    if (row.idempotency_key) {
      const key = row.tool+'\0'+row.idempotency_key;
      const values = keyed.get(key) || new Set(); values.add(canonical(row.arguments)); keyed.set(key, values);
    }
  }
  const calls = rows.map(row => {
    const same = signatures.get(row.tool+'\0'+canonical(row.arguments));
    const conflict = row.idempotency_key && keyed.get(row.tool+'\0'+row.idempotency_key).size > 1;
    let action, reason;
    if (conflict) { action='review'; reason='Same tool + idempotency key has different arguments. Reconcile the key conflict.'; }
    else if (row.effect === 'unknown') { action='review'; reason='Effect is unknown. Classify the tool before replay.'; }
    else if (row.effect === 'read') { action='replay_read'; reason='Declared read-only. Replay is a proposal, not an execution.'; }
    else if (row.status === 'succeeded') { action='skip_completed'; reason='Write is recorded as completed. Skip it in a replay.'; }
    else { action='review'; reason='Write outcome is uncertain. Check the destination before retrying; a key alone proves no guarantee.'; }
    return {id:row.id,tool:row.tool,effect:row.effect,status:row.status,action,reason,related_ids:same.filter(x=>x.id!==row.id).map(x=>x.id),key_conflict:Boolean(conflict)};
  });
  return {schema_version:1,mode:'inspection_only',calls,summary:{total:calls.length,reads:calls.filter(x=>x.action==='replay_read').length,skipped:calls.filter(x=>x.action==='skip_completed').length,review:calls.filter(x=>x.action==='review').length,key_conflicts:calls.filter(x=>x.key_conflict).length,writes_scheduled:0},assumptions:['Input effects and statuses are assertions supplied by the trace producer.','No tool is executed. This is not an exactly-once guarantee.']};
}
export const rankRows = rows => inspectTrace(rows).calls;
