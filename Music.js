// Coloque a música em "musica/musica.mp3" (ou mude o caminho abaixo)
(function(){
  var SRC = 'musica/musica.mp3', K = 'musica_estado';
  var a = new Audio(SRC); a.loop = true; a.preload = 'auto'; a.volume = 0.6;
  var st = {}; try { st = JSON.parse(localStorage.getItem(K) || '{}'); } catch(e){}
  var pausadoPeloUsuario = st.pausado === true;

  var b = document.createElement('button');
  b.setAttribute('aria-label','Música');
  b.style.cssText = 'position:fixed;right:max(14px,env(safe-area-inset-right,0px));bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:20;width:48px;height:48px;border-radius:50%;border:1px solid #ffffff55;background:#ffffff2e;color:#fff;font-size:1.3rem;line-height:1;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);cursor:pointer';
  function ui(){ b.textContent = a.paused ? '♪' : '❚❚'; b.style.opacity = a.paused ? '.7' : '1'; }
  document.body.appendChild(b);

  function salvar(){ try { localStorage.setItem(K, JSON.stringify({t:a.currentTime, pausado:pausadoPeloUsuario})); } catch(e){} }
  function tocar(){ var p = a.play(); if (p && p.catch) p.catch(function(){}); }

  a.addEventListener('loadedmetadata', function(){
    if (st.t && a.duration) a.currentTime = st.t % a.duration;
    if (!pausadoPeloUsuario) tocar();
  });
  a.addEventListener('play', ui); a.addEventListener('pause', ui);

  b.addEventListener('click', function(e){
    e.stopPropagation();
    if (a.paused){ pausadoPeloUsuario = false; tocar(); } else { pausadoPeloUsuario = true; a.pause(); }
    salvar();
  });

  // navegadores bloqueiam autoplay: começa no primeiro toque/clique na página
  function primeiro(){
    if (!pausadoPeloUsuario && a.paused) tocar();
    ['click','touchstart','keydown'].forEach(function(ev){ document.removeEventListener(ev, primeiro); });
  }
  ['click','touchstart','keydown'].forEach(function(ev){ document.addEventListener(ev, primeiro); });

  setInterval(salvar, 500);
  window.addEventListener('pagehide', salvar);
  document.addEventListener('visibilitychange', function(){ if (document.hidden) salvar(); });
  ui();
})();