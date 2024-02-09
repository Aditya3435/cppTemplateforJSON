const sw=self,VERSION=4,resourceCacheName=`vscode-resource-cache-${VERSION}`,rootPath=sw.location.pathname.replace(/\/service-worker.js$/,""),searchParams=new URL(location.toString()).searchParams,remoteAuthority=searchParams.get("remoteAuthority"),resourceBaseAuthority=searchParams.get("vscode-resource-base-authority"),resolveTimeout=3e4;class RequestStore{constructor(){this.map=new Map,this.requestPool=0}create(){const e=++this.requestPool;let o;const s=new Promise(a=>o=a),r={resolve:o,promise:s};this.map.set(e,r);const l=setTimeout(()=>{clearTimeout(l);const a=this.map.get(e);if(a===r){a.resolve({status:"timeout"}),this.map.delete(e);return}},resolveTimeout);return{requestId:e,promise:s}}resolve(e,o){const s=this.map.get(e);return s?(s.resolve({status:"ok",value:o}),this.map.delete(e),!0):!1}}const resourceRequestStore=new RequestStore,localhostRequestStore=new RequestStore,unauthorized=()=>new Response("Unauthorized",{status:401}),notFound=()=>new Response("Not Found",{status:404}),methodNotAllowed=()=>new Response("Method Not Allowed",{status:405}),requestTimeout=()=>new Response("Request Timeout",{status:408});sw.addEventListener("message",async t=>{switch(t.data.channel){case"version":{const e=t.source;sw.clients.get(e.id).then(o=>{o&&o.postMessage({channel:"version",version:VERSION})});return}case"did-load-resource":{const e=t.data.data;resourceRequestStore.resolve(e.id,e)||console.log("Could not resolve unknown resource",e.path);return}case"did-load-localhost":{const e=t.data.data;localhostRequestStore.resolve(e.id,e.location)||console.log("Could not resolve unknown localhost",e.origin);return}default:{console.log("Unknown message");return}}}),sw.addEventListener("fetch",t=>{const e=new URL(t.request.url);if(e.protocol==="https:"&&e.hostname.endsWith("."+resourceBaseAuthority))switch(t.request.method){case"GET":case"HEAD":{const o=e.hostname.slice(0,e.hostname.length-(resourceBaseAuthority.length+1)),s=o.split("+",1)[0],r=o.slice(s.length+1);return t.respondWith(processResourceRequest(t,{scheme:s,authority:r,path:e.pathname,query:e.search.replace(/^\?/,"")}))}default:return t.respondWith(methodNotAllowed())}if(e.origin!==sw.origin&&e.host===remoteAuthority)switch(t.request.method){case"GET":case"HEAD":return t.respondWith(processResourceRequest(t,{path:e.pathname,scheme:e.protocol.slice(0,e.protocol.length-1),authority:e.host,query:e.search.replace(/^\?/,"")}));default:return t.respondWith(methodNotAllowed())}if(e.origin!==sw.origin&&e.host.match(/^(localhost|127.0.0.1|0.0.0.0):(\d+)$/))return t.respondWith(processLocalhostRequest(t,e))}),sw.addEventListener("install",t=>{t.waitUntil(sw.skipWaiting())}),sw.addEventListener("activate",t=>{t.waitUntil(sw.clients.claim())});async function processResourceRequest(t,e){const o=await sw.clients.get(t.clientId);if(!o)return console.error("Could not find inner client for request"),notFound();const s=getWebviewIdForClient(o);if(!s)return console.error("Could not resolve webview id"),notFound();const r=t.request.method==="GET",d=(i,g)=>{if(i.status==="timeout")return requestTimeout();const n=i.value;if(n.status===304){if(g)return g.clone();throw new Error("No cache found")}if(n.status===401)return unauthorized();if(n.status!==200)return notFound();const f={"Access-Control-Allow-Origin":"*"},m=n.data.byteLength,y=t.request.headers.get("range");if(y){const h=y.match(/^bytes\=(\d+)\-(\d+)?$/g);if(h){const R=Number(h[1]),C=Number(h[2])||m-1;return new Response(n.data.slice(R,C+1),{status:206,headers:{...f,"Content-range":`bytes 0-${C}/${m}`}})}else return new Response(null,{status:416,headers:{...f,"Content-range":`*/${m}`}})}const c={...f,"Content-Type":n.mime,"Content-Length":m.toString()};n.etag&&(c.ETag=n.etag,c["Cache-Control"]="no-cache"),n.mtime&&(c["Last-Modified"]=new Date(n.mtime).toUTCString());const w=new URL(t.request.url).searchParams.get("vscode-coi");w==="3"?(c["Cross-Origin-Opener-Policy"]="same-origin",c["Cross-Origin-Embedder-Policy"]="require-corp"):w==="2"?c["Cross-Origin-Embedder-Policy"]="require-corp":w==="1"&&(c["Cross-Origin-Opener-Policy"]="same-origin");const q=new Response(n.data,{status:200,headers:c});return r&&n.etag&&caches.open(resourceCacheName).then(h=>h.put(t.request,q)),q.clone()},l=await getOuterIframeClient(s);if(!l.length)return console.log("Could not find parent client for request"),notFound();let a;r&&(a=await(await caches.open(resourceCacheName)).match(t.request));const{requestId:p,promise:u}=resourceRequestStore.create();for(const i of l)i.postMessage({channel:"load-resource",id:p,scheme:e.scheme,authority:e.authority,path:e.path,query:e.query,ifNoneMatch:a?.headers.get("ETag")});return u.then(i=>d(i,a))}async function processLocalhostRequest(t,e){const o=await sw.clients.get(t.clientId);if(!o)return fetch(t.request);const s=getWebviewIdForClient(o);if(!s)return console.error("Could not resolve webview id"),fetch(t.request);const r=e.origin,d=async u=>{if(u.status!=="ok"||!u.value)return fetch(t.request);const i=u.value,g=t.request.url.replace(new RegExp(`^${e.origin}(/|$)`),`${i}$1`);return new Response(null,{status:302,headers:{Location:g}})},l=await getOuterIframeClient(s);if(!l.length)return console.log("Could not find parent client for request"),notFound();const{requestId:a,promise:p}=localhostRequestStore.create();for(const u of l)u.postMessage({channel:"load-localhost",origin:r,id:a});return p.then(d)}function getWebviewIdForClient(t){return new URL(t.url).searchParams.get("id")}async function getOuterIframeClient(t){return(await sw.clients.matchAll({includeUncontrolled:!0})).filter(o=>{const s=new URL(o.url);return(s.pathname===`${rootPath}/`||s.pathname===`${rootPath}/index.html`||s.pathname===`${rootPath}/index-no-csp.html`)&&s.searchParams.get("id")===t})}

//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/8b3775030ed1a69b13e4f4c628c612102e30a681/core/vs/workbench/contrib/webview/browser/pre/service-worker.js.map
