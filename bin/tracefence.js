#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import {inspectTrace} from '../public/src/standout.js';
const args=process.argv.slice(2);
if(args.includes('--help')){console.log('tracefence [--json] TRACE.json|-\nInspect JSON/NDJSON tool calls. Outputs an inspection-only JSON replay plan. Never executes tools. Exit 0 success, 2 invalid input.');process.exit(0);}
try {
 const positional=args.filter(x=>x!=='--json');if(positional.length!==1||positional[0].startsWith('--'))throw new Error('Use tracefence [--json] TRACE.json|-; see --help.');
 const raw=readFileSync(positional[0]==='-'?0:positional[0],'utf8');if(Buffer.byteLength(raw)>5242880)throw new Error('Input exceeds 5 MiB.');
 let data;try{data=JSON.parse(raw);}catch{data=raw.split(/\r?\n/).filter(x=>x.trim()).map(x=>JSON.parse(x));}
 console.log(JSON.stringify(inspectTrace(data),null,2));
} catch(error){console.error(JSON.stringify({error:error.message}));process.exitCode=2;}
