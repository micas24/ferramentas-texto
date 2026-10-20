(function(){
function run(auto){
var LIM=135,TLIM=150;
var D=document,$=function(i){return D.getElementById(i)};
if(!$('txTituloSite')||!$('txDescricaoSite')){if(!auto)alert('Abra um imóvel na Kenlo (Imóveis > Alterar) e clique no botão de novo.');return;}
if(window.__dkT)clearInterval(window.__dkT);
var old=D.getElementById('dk-host');if(old)old.remove();
var v=function(i){var e=$(i)||D.querySelector('[name="'+i+'"]');return e&&e.value?String(e.value).trim():''};
var st=function(i){var e=$(i);return e&&e.selectedOptions&&e.selectedOptions[0]?e.selectedOptions[0].text.trim():''};
var ck=function(i){var e=$(i);return !!(e&&e.checked)};
var num=function(s){if(!s)return 0;var n=parseFloat(String(s).replace(/\./g,'').replace(',','.'));return isNaN(n)?0:n};
var int=function(s){return parseInt(s,10)||0};
var m2=function(n){return n.toLocaleString('pt-BR',{maximumFractionDigits:2})};
var pl=function(n,a,b){return n+' '+(n===1?a:b)};
var jn=function(a){return a.length<=1?(a[0]||''):a.slice(0,-1).join(', ')+' e '+a[a.length-1]};
var cap=function(s){return s?s.charAt(0).toUpperCase()+s.slice(1):s};
var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var prep=function(n){return /^(vila|chácara|chacara|fazenda|estância|estancia|rua|avenida|colina|região|reserva|quinta|praça)\b/i.test(n)?'na':'no'};

var G={
 'Lazer':[['piscina','piscina'],['varanda_gourmet','varanda gourmet'],['churrasqueira','churrasqueira'],['playground','playground'],['quadra_tenis','quadra de tênis'],['quadra_poliesportiva','quadra poliesportiva'],['campo_futebol','campo de futebol'],['quintal','quintal'],['sauna','sauna'],['solarium','solarium'],['ofuro','ofurô'],['adega','adega']],
 'Social':[['escritorio','escritório'],['sacada','sacada'],['varanda','varanda'],['lavabo','lavabo'],['hidro','hidromassagem'],['dormitorio_reversivel','dormitório reversível']],
 'Infra':[['ar','ar-condicionado'],['aquecimento_energia_solar','aquecimento solar'],['aquecimento_gas','aquecimento a gás'],['placa_fotovoltaica','placas fotovoltaicas'],['lareira','lareira'],['calefacao','calefação'],['portao','portão eletrônico'],['alarme','alarme'],['jardim_inverno','jardim de inverno'],['mezanino','mezanino'],['deposito','depósito'],['gerador','gerador'],['mobiliado','mobiliado'],['semi_mobiliado','semimobiliado']],
 'Servicos':[['area_servico','área de serviço'],['lavanderia','lavanderia'],['copa','copa'],['despensa','despensa'],['edicula','edícula'],['dorm_empregada','dormitório de empregada'],['ban_empregada','banheiro de empregada'],['guarita','guarita'],['caseiro','casa de caseiro']],
 'Piso':[['piso_porcelanato','porcelanato'],['piso_ceramica','cerâmica'],['piso_laminado','laminado'],['piso_vinilico','vinílico'],['piso_marmore','mármore'],['piso_granito','granito'],['piso_taco_madeira','taco de madeira'],['piso_taboa','tábua'],['piso_aquecido','piso aquecido'],['piso_cimento_queimado','cimento queimado']],
 'Rural':[['pomar','pomar'],['lago','lago'],['rio','rio'],['poco_artesiano','poço artesiano'],['casa_sede','casa sede'],['casa_colono','casa de colono'],['barracao','barracão'],['estabulo','estábulo'],['pastagem','pastagem'],['estrada_interna','estrada interna']]
};
var tem=function(k){return ck('fl_'+k)};
var lista=function(g){return G[g].filter(function(x){return tem(x[0])}).map(function(x){return x[1]})};

var condEl=D.querySelector('#s2id_txCondominio .select2-chosen');
var cond=condEl?condEl.textContent.trim():'';if(/^(selecione|nenhum|-|n[ãa]o\b)/i.test(cond))cond='';
var d={
 ref:v('hdTxReferencia').toUpperCase(),tipo:st('cboTipo'),
 venda:ck('chkPretVenda'),loc:ck('chkPretLocacao'),
 cond:cond,bairro:v('bairro'),cidade:v('cidade'),uf:v('estado'),
 at:num(v('txAreaTotal')),ac:num(v('txAreaUtil')),
 dorm:int(v('in_dorm')),suites:int(v('in_suites')),ban:int(v('in_banheiros')),salas:int(v('in_salas')),
 vagas:int(v('in_vagas')),vc:int(v('in_garagens')),vd:int(v('in_garagens_descobertas')),
 fin:st('cboAceitaFinanciamento'),perm:st('cboPermuta'),ocup:st('cboOcupacao'),
 ano:v('txAnoConstrucao'),ref2:v('txAnoReforma'),pet:tem('aceita_pet'),
 titulo:v('txTituloSite'),desc:$('txDescricaoSite').value
};
if(!d.vagas)d.vagas=d.vc+d.vd;
var pret=d.venda&&d.loc?'para venda ou locação':d.loc?'para alugar':'à venda';
var terreno=/^terreno|^lote/i.test(d.tipo);
var local=d.cond||(d.bairro?'bairro '+d.bairro:''),cid=[d.cidade,d.uf].filter(Boolean).join('/');

var cands=[];
if(d.suites)cands.push(['suites',pl(d.suites,'suíte','suítes')]);else if(d.dorm)cands.push(['dorm',pl(d.dorm,'dormitório','dormitórios')]);
if(tem('piscina'))cands.push(['piscina','piscina']);
if(tem('varanda_gourmet'))cands.push(['varanda_gourmet','varanda gourmet']);
if(tem('churrasqueira'))cands.push(['churrasqueira','churrasqueira']);
if(d.at)cands.push(['at',terreno?m2(d.at)+' m²':m2(d.at)+' m² de terreno']);
if(d.ac&&!terreno)cands.push(['ac',m2(d.ac)+' m² construídos']);
if(d.vagas)cands.push(['vagas',pl(d.vagas,'vaga','vagas')]);
['Lazer','Social','Infra','Rural'].forEach(function(g){G[g].forEach(function(x){if(tem(x[0])&&!cands.some(function(c){return c[0]===x[0]}))cands.push([x[0],x[1]])})});
if(d.pet)cands.push(['pet','aceita pet']);
var AUTO=['suites','dorm','piscina','varanda_gourmet','churrasqueira','at','ac'];
var dest=[];
var ganchoAuto=d.fin==='Sim'&&d.perm==='Sim'?'Aceita financiamento e permuta':d.fin==='Sim'?'Aceita financiamento':d.perm==='Sim'?'Aceita permuta':'';
var gancho='auto',modo='atual',editado=null;

function resumo(){
 var cab=d.tipo+' '+pret;if(local)cab+=' '+prep(local)+' '+local;if(cid)cab+=local?', '+cid:' em '+cid;
 var mp={};cands.forEach(function(c){mp[c[0]]=c[1]});
 var it=dest.filter(function(k){return mp[k]}).map(function(k){return mp[k]});
 if(!it.length)it=cands.filter(function(c){return AUTO.indexOf(c[0])>=0}).slice(0,4).map(function(c){return c[1]});
 if(it.length<2)it=cands.slice(0,2).map(function(c){return c[1]});
 var g=gancho==='auto'?ganchoAuto:gancho,cut=[];
 var f=function(){return cab+(it.length?': '+jn(it):'')+'.'+(g?' '+g+'.':'')};
 var s=f();while(s.length>LIM&&it.length>2){cut.push(it.pop());s=f()}
 if(s.length>LIM&&g){cut.push(g);g='';s=f()}
 return {s:s,it:it,cut:cut};
}
function titulo(){
 var l=d.cond?(/condom[ií]nio/i.test(d.cond)?d.cond:'Condomínio '+d.cond):(d.bairro?'bairro '+d.bairro:'');
 var t=d.tipo+' '+pret;if(l)t+=' '+prep(l)+' '+l;if(cid)t+=' - '+cid;if(d.ref)t+=' - '+d.ref;return t;
}
function corpo(){
 var p=[],m=[];if(d.at)m.push(m2(d.at)+' m² de área total');if(d.ac)m.push(m2(d.ac)+' m² de área construída');if(m.length)p.push(cap(jn(m))+'.');
 var c=[];if(d.dorm)c.push(d.suites?pl(d.dorm,'dormitório','dormitórios')+', sendo '+pl(d.suites,'suíte','suítes'):pl(d.dorm,'dormitório','dormitórios'));else if(d.suites)c.push(pl(d.suites,'suíte','suítes'));
 if(d.ban)c.push(pl(d.ban,'banheiro','banheiros'));if(d.salas)c.push(pl(d.salas,'sala','salas'));
 var s=c.length?'São '+jn(c)+'.':'';var so=lista('Social');if(so.length)s+=(s?' ':'')+'Tem também '+jn(so)+'.';if(s)p.push(s);
 var lz=lista('Lazer');if(lz.length)p.push('Área de lazer com '+jn(lz)+'.');
 if(d.vagas){var vs=pl(d.vagas,'vaga','vagas')+' de garagem',dt=[];if(d.vc)dt.push(pl(d.vc,'coberta','cobertas'));if(d.vd)dt.push(pl(d.vd,'descoberta','descobertas'));if(dt.length)vs+=', '+jn(dt);p.push(cap(vs)+'.')}
 var pi=lista('Piso');if(pi.length)p.push('Piso em '+jn(pi)+'.');
 var inf=lista('Infra');if(inf.length)p.push('Infraestrutura: '+jn(inf)+'.');
 var sv=lista('Servicos');if(sv.length)p.push('Serviços: '+jn(sv)+'.');
 var ru=lista('Rural');if(ru.length)p.push('Na área rural: '+jn(ru)+'.');
 var co='';
 if(d.fin==='Sim')co+=(co?' ':'')+'Aceita financiamento.';if(d.perm==='Sim')co+=(co?' ':'')+'Aceita permuta.';if(d.pet)co+=(co?' ':'')+'Aceita pet.';if(co)p.push(co);
 if(local&&cid)p.push('Localizado '+prep(local)+' '+local+', em '+cid+'.');else if(cid)p.push('Localizado em '+cid+'.');
 if(d.ref)p.push('Referência: '+d.ref+'.');
 return p.join('\n\n');
}
function textoAtual(){
 var t=d.desc.replace(/\r/g,'').trim();var paras=t.split(/\n\s*\n/);
 if(paras.length>1&&paras[0].length<=LIM+20&&paras[0].toLowerCase().indexOf((d.tipo+' '+pret).toLowerCase())===0)paras.shift();
 return paras.join('\n\n').trim();
}
var FRASE='Se você procura comprar casa em condomínio no interior de São Paulo, especialmente em Indaiatuba, nós da Azevedo Alves temos várias opções.';
var AVISO='Imóvel sujeito a alteração sem aviso prévio.';
var semFrase=function(t){return t.replace(/\s*Se voc[êe] procura comprar[^.]*Azevedo Alves[^.]*\.?/gi,'').replace(/\s*Im[óo]vel sujeito a altera[çc][ãa]o sem aviso pr[ée]vio\.?/gi,'').trim()};
var quebrar=function(t){var out=[],lista=[];var fecha=function(){if(lista.length){out.push(lista.join('\n'));lista=[]}};t.replace(/\r/g,'').split(/\n+/).map(function(l){return l.trim()}).filter(Boolean).forEach(function(l){if(l.length<60&&!/[.!?]$/.test(l)){lista.push(l);return}fecha();l.split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ])/).forEach(function(f){if(f.trim())out.push(f.trim())})});fecha();return out.join('\n\n')};
var EV=[[/\b(linda|lindo|maravilhos[ao]|imperd[ií]vel|incr[ií]vel|espetacular|fant[áa]stic[ao])\b/i,'adjetivo vazio'],[/\b(AT|AC|dorms?|qtos?)\b|c\/|s\//,'abreviação'],[/bem[- ]vind/i,'saudação'],[/R\$\s?\d/,'preço'],[/[☀-➿]|[\uD83C-\uDBFF][\uDC00-\uDFFF]/,'emoji']];

var host=D.createElement('div');host.id='dk-host';host.style.cssText='position:fixed;top:0;right:0;bottom:0;width:440px;max-width:100vw;z-index:2147483646';
D.body.appendChild(host);var R=host.attachShadow({mode:'open'});
R.innerHTML='<style>'+
':host{all:initial}*{box-sizing:border-box}.p{height:100%;overflow:auto;background:#fff;color:#1c2420;font:14px/1.45 system-ui,-apple-system,Segoe UI,sans-serif;border-left:1px solid #d9e0db;box-shadow:-8px 0 24px rgba(0,0,0,.12);padding:16px 18px 24px;display:grid;gap:14px;align-content:start}'+
'h1{font-size:17px;margin:0}h2{font-size:13px;margin:0;text-transform:uppercase;letter-spacing:.06em;color:#5d6b63}.hd{display:flex;justify-content:space-between;align-items:center;gap:8px}'+
'.x{border:0;background:none;font-size:22px;cursor:pointer;color:#5d6b63}.sec{display:grid;gap:8px;border-top:1px solid #e6ebe8;padding-top:12px}'+
'.n{font:12px ui-monospace,Menlo,monospace;padding:2px 7px;border-radius:5px;background:#e3efe8;color:#2f6b4f}.n.o{background:#fbe5e3;color:#b3261e}'+
'.r{font-size:15px;margin:0}.chips{display:flex;flex-wrap:wrap;gap:6px}.chip{font:13px system-ui,sans-serif;border:1px dashed #c9d3cd;background:#fff;border-radius:99px;padding:4px 10px;cursor:pointer;color:#1c2420}.chip[aria-pressed=true]{border:1px solid #2f6b4f;background:#e3efe8}.chip b{color:#2f6b4f;margin-right:3px}'+
'select,input,textarea{font:14px system-ui,sans-serif;border:1px solid #d9e0db;border-radius:7px;padding:7px 9px;width:100%;color:#1c2420;background:#f6f8f6}textarea{min-height:220px;resize:vertical}'+
'ul{list-style:none;margin:0;padding:0;display:grid;gap:4px}li.ok:before{content:"✓ ";color:#2f6b4f;font-weight:700}li.no:before{content:"! ";color:#b3261e;font-weight:700}'+
'.al{background:#fbf0dc;color:#7a4800;border-radius:7px;padding:7px 9px;font-size:13px}.seg{display:flex;gap:12px;flex-wrap:wrap}.seg label{display:flex;gap:5px;align-items:center}.seg input{width:auto}'+
'.b{font:600 14px system-ui,sans-serif;border-radius:8px;padding:9px 14px;cursor:pointer;border:1px solid #2f6b4f}.b1{background:#2f6b4f;color:#fff}.b2{background:#fff;color:#2f6b4f}.acts{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.ok2{color:#2f6b4f;font-size:13px}.h{font-size:12px;color:#5d6b63}'+
'</style><div class="p"><div class="hd"><h1>Descritivo · '+esc(d.ref||'imóvel')+'</h1><span><button class="x" id="rf" title="Atualizar com o imóvel aberto">↻</button><button class="x" id="x" title="Fechar">×</button></span></div>'+
'<div class="sec"><div class="hd"><h2>Resumo para o Google</h2><span class="n" id="cr"></span></div><p class="r" id="rs"></p><div class="chips" id="ch"></div>'+
'<label class="h">Gancho no fim <select id="g"><option value="auto">Pela ficha</option><option>Aceita financiamento</option><option>Aceita permuta</option><option>Aceita financiamento e permuta</option><option>Pronta para morar</option><option>Pronto para morar</option><option value="">Sem gancho</option></select></label>'+
'<ul id="cl"></ul><div id="al" style="display:grid;gap:6px"></div></div>'+
'<div class="sec"><div class="hd"><h2>Título para portais</h2><span class="n" id="ct"></span></div><input id="ti" maxlength="150"></div>'+
'<div class="sec"><div class="hd"><h2>Descrição do site</h2><span class="n" id="cd"></span></div>'+
'<div class="seg"><label><input type="radio" name="m" value="atual" checked> Resumo + texto atual</label><label><input type="radio" name="m" value="novo"> Resumo + texto novo</label></div>'+
'<textarea id="ds"></textarea><span class="h">Você pode editar aqui antes de preencher.</span></div>'+
'<div class="acts"><button class="b b1" id="ap">Preencher na Kenlo</button><button class="b b2" id="cp">Copiar descrição</button><span class="ok2" id="ms"></span></div>'+
'<span class="h">O botão só preenche os campos. Confira e clique em Salvar na Kenlo.</span></div>';
var q=function(i){return R.getElementById(i)};

function render(keepText){
 var r=resumo();q('rs').textContent=r.s;q('cr').textContent=r.s.length+'/'+LIM;q('cr').className='n'+(r.s.length>LIM?' o':'');
 if(!q('ti').dataset.touched)q('ti').value=titulo();
 q('ct').textContent=q('ti').value.length+'/'+TLIM;
 if(!keepText){editado=null;var base=quebrar(semFrase(modo==='atual'?textoAtual():corpo()));q('ds').value=r.s+(base?'\n\n'+base:'')+'\n\n'+(d.cond?FRASE+'\n\n':'')+AVISO}
 q('cd').textContent=q('ds').value.length+' caracteres';
 var ch=q('ch');ch.innerHTML='';cands.forEach(function(c){var b=D.createElement('button');b.className='chip';var i=dest.indexOf(c[0]);b.setAttribute('aria-pressed',i>=0);b.innerHTML=(i>=0?'<b>'+(i+1)+'</b>':'')+esc(c[1]);b.onclick=function(){var j=dest.indexOf(c[0]);if(j>=0)dest.splice(j,1);else if(dest.length<4)dest.push(c[0]);render(false)};ch.appendChild(b)});
 var conc=r.it.filter(function(x){return /\d|piscina|gourmet|churrasqueira|quadra|sauna|lago|pomar/i.test(x)}).length;
 var L=[[!!(d.tipo&&d.cidade),'Tipo, "'+pret+'" e cidade logo no começo'],[conc>=2,'Pelo menos 2 diferenciais concretos'],[r.s.length<=LIM,'No máximo '+LIM+' caracteres, frase completa']];
 q('cl').innerHTML=L.map(function(x){return '<li class="'+(x[0]?'ok':'no')+'">'+esc(x[1])+'</li>'}).join('');
 var A=[];if(r.cut.length)A.push('Para caber em '+LIM+' caracteres ficou de fora: '+r.cut.join(', ')+'.');
 if(!d.cidade)A.push('A cidade está vazia na ficha.');
 var tx=q('ds').value.slice(r.s.length);
 if(/financ/i.test(tx)&&d.fin!=='Sim')A.push('O texto fala em financiamento, mas o campo "Aceita financiamento" está "'+(d.fin||'vazio')+'". Ajuste a ficha ou o texto.');
 if(/permuta/i.test(tx)&&d.perm!=='Sim')A.push('O texto fala em permuta, mas o campo "Aceita permuta?" está "'+(d.perm||'vazio')+'".');
 var vm=tx.match(/(\d+)\s*vagas?/i);if(vm&&d.vagas&&int(vm[1])!==d.vagas&&int(vm[1])!==d.vc&&int(vm[1])!==d.vd)A.push('O texto cita '+vm[1]+' vagas e a ficha tem '+d.vagas+'.');
 var sm=tx.match(/(\d+)\s*su[ií]tes?/i);if(sm&&d.suites&&int(sm[1])!==d.suites)A.push('O texto cita '+sm[1]+' suítes e a ficha tem '+d.suites+'.');
 EV.forEach(function(e){var m=tx.match(e[0]);if(m)A.push('Evite '+e[1]+' no texto: "'+m[0]+'".')});
 q('al').innerHTML=A.map(function(a){return '<div class="al">'+esc(a)+'</div>'}).join('');
}
function setVal(el,val){var proto=el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;var s=Object.getOwnPropertyDescriptor(proto,'value').set;s.call(el,val);['input','change','keyup','blur'].forEach(function(t){el.dispatchEvent(new Event(t,{bubbles:true}))});if(window.jQuery)try{jQuery(el).trigger('change')}catch(e){}}
q('x').onclick=function(){if(window.__dkT)clearInterval(window.__dkT);host.remove()};
q('rf').onclick=function(){run()};
q('g').onchange=function(){gancho=this.value;render(false)};
q('ti').oninput=function(){this.dataset.touched=1;render(true)};
q('ds').oninput=function(){render(true)};
[].forEach.call(R.querySelectorAll('input[name=m]'),function(r){r.onchange=function(){modo=this.value;render(false)}});
q('ap').onclick=function(){var t=$('txTituloSite'),s=$('txDescricaoSite');setVal(t,q('ti').value.slice(0,TLIM));setVal(s,q('ds').value);s.scrollIntoView({block:'center'});[t,s].forEach(function(e){e.style.outline='3px solid #2f6b4f'});q('ms').textContent='Campos preenchidos. Confira e salve.'};
q('cp').onclick=function(){var t=q('ds').value;var ok=function(){q('ms').textContent='Descrição copiada.'};if(navigator.clipboard)navigator.clipboard.writeText(t).then(ok,function(){q('ds').select()});else q('ds').select()};
render(false);
window.__dkT=setInterval(function(){if(!D.getElementById('dk-host')){clearInterval(window.__dkT);return}var nr=v('hdTxReferencia').toUpperCase();if($('txTituloSite')&&nr&&nr!==d.ref)run(true)},1500);
}
run();
})();