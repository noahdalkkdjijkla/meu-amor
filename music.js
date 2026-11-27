(function(){
  var CANDIDATOS = ['musica.mp3','musica','Musica.mp3','musica/musica.mp3'], idx = 0, K = 'musica_estado';
  var a = new Audio(); a.loop = true; a.preload = 'auto'; a.volume = 0.6; a.src = CANDIDATOS[0];
  var st = {}; try { st = JSON.parse(localStorage.getItem(K) || '{}'); } catch(e){}
  var pausadoPeloUsuario = st.pausado === true, erro = '';

  var b = document.createElement('button');
  b.setAttribute('aria-label','Música');
  b.style.cssText = 'position:fixed;right:max(14px,env(safe-area-inset-right,0px));bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:20;width:48px;height:48px;border-radius:50%;border:1px solid #ffffff55;background:#ffffff2e;color:#fff;font-size:1.3rem;line-height:1;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);cursor:pointer';
  function ui(){ b.textContent = erro ? '!' : (a.paused ? '♪' : '❚❚'); b.style.opacity = a.paused ? '.7' : '1'; }
  document.body.appendChild(b);

  function salvar(){ try { localStorage.setItem(K, JSON.stringify({t:a.currentTime, pausado:pausadoPeloUsuario})); } catch(e){} }
  function tocar(){ var p = a.play(); if (p && p.catch) p.catch(function(){}); }

  a.addEventListener('error', function(){
    idx++;
    if (idx < CANDIDATOS.length){ a.src = CANDIDATOS[idx]; a.load(); if (!pausadoPeloUsuario) tocar(); }
    else { erro = 'Nenhum arquivo de música foi encontrado. Tentei: ' + CANDIDATOS.join(', ') + '. Confira o nome do arquivo no GitHub (precisa ser musica.mp3).'; ui(); }
  });
  a.addEventListener('loadedmetadata', function(){
    if (st.t && a.duration) a.currentTime = st.t % a.duration;
    if (!pausadoPeloUsuario) tocar();
  });
  a.addEventListener('canplay', function(){ if (!pausadoPeloUsuario && a.paused) tocar(); });
  a.addEventListener('play', ui); a.addEventListener('pause', ui);

  b.addEventListener('click', function(e){
    e.stopPropagation();
    if (erro){ alert(erro); return; }
    if (a.paused){ pausadoPeloUsuario = false; tocar(); } else { pausadoPeloUsuario = true; a.pause(); }
    salvar();
  });

  var evs = ['pointerdown','click','touchend','keydown'];
  function primeiro(e){
    if (pausadoPeloUsuario || b.contains(e.target)) return;
    var p = a.play();
    if (p && p.then) p.then(function(){ evs.forEach(function(ev){ document.removeEventListener(ev, primeiro, true); }); }).catch(function(){});
  }
  evs.forEach(function(ev){ document.addEventListener(ev, primeiro, true); });

  setInterval(salvar, 500);
  window.addEventListener('pagehide', salvar);
  document.addEventListener('visibilitychange', function(){ if (document.hidden) salvar(); });
  ui();
  tocar();
})();
