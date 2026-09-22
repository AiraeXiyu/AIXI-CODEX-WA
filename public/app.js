const $=id=>document.getElementById(id)
const setBusy=(btn,busy)=>{btn.disabled=busy;btn.dataset.old=btn.textContent;if(busy)btn.textContent='PROCESSING...';else btn.textContent=btn.dataset.old||btn.textContent}
const phone=()=>$('phone').value.replace(/\D/g,'').replace(/^0+/,'')
const showCode=(code)=>{if(!code)return;$('code').textContent=code;$('codeBox').classList.remove('hidden')}
const setStatus=(connected,connection='close')=>{const dot=$('dot'),text=$('statusText'),tag=$('sessionState');dot.parentElement.classList.toggle('ok',connected);text.textContent=connected?'WhatsApp connected':`Runtime: ${connection}`;tag.textContent=connected?'CONNECTED':connection.toUpperCase()}
async function status(){try{const r=await fetch('/api/status');const d=await r.json();setStatus(d.connected,d.connection||'close');if(d.phone&&!$('phone').value)$('phone').value=d.phone}catch{setStatus(false,'offline')}}
$('pair').onclick=async()=>{const n=phone();if(!/^\d{7,15}$/.test(n))return alert('Masukkan nomor WhatsApp internasional tanpa +.');setBusy($('pair'),true);try{const r=await fetch('/api/pairing',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:n})});const d=await r.json();if(!r.ok)throw new Error(d.error);if(d.code)showCode(d.code);setStatus(d.connected,'open')}catch(e){alert(e.message)}finally{setBusy($('pair'),false)}}
$('reconnect').onclick=async()=>{setBusy($('reconnect'),true);try{const r=await fetch('/api/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:phone()||undefined})});const d=await r.json();if(!r.ok)throw new Error(d.error);if(d.code)showCode(d.code);setStatus(d.connected,d.connection||'close');if(d.message)alert(d.message)}catch(e){alert(e.message)}finally{setBusy($('reconnect'),false)}}
$('refresh').onclick=status
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText($('code').textContent);$('copy').textContent='COPIED'}catch{}setTimeout(()=>$('copy').textContent='COPY',1300)}
status();setInterval(status,10000)
