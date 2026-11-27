// A música está na raiz do repositório: "musica.mp3"
(function(){
  var SRC = 'musica', K = 'musica_estado';
  var a = new Audio(); a.loop = true; a.preload = 'auto'; a.volume = 0.6; a.src = SRC;
  var st = {}; try { st = JSON.parse(localStorage.getItem(K) || '{}'); } catch(e){}
  var pausadoPeloUsuario = st.pausado === true;

  var b = document.createElement('button');
  b.setAttribute('aria-label','Música');
  b.style.cssText = 'position:fixed;right:max(14px,env(safe-area-inset-right,0px));bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:20;width:48px;height:48px;border-radius:50%;border:1px solid #ffffff55;background:#ffffff2e;color:#fff;font-size:1.3rem;line-height:1;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);cursor:pointer';
  function ui(){ b.textContent = a.paused ? '♪' : '❚❚'; b.style.opacity = a.paused ? '.7' : '1'; }
  document.body.appendChild(b);

  function salvar(){ try { localStorage.setItem(K, JSON.stringify({t:a.currentTime, pausado:pausadoPeloUsuario})); } catch(e){} }

  // Tenta tocar com som; se o navegador bloquear, toca mudo e libera o som no primeiro toque
  function iniciar(){
    if (pausadoPeloUsuario || !a.paused) return;
    var p = a.play();
    if (p && p.catch) p.catch(function(){
      a.muted = true;
      var p2 = a.play();
      if (p2 && p2.catch) p2.catch(function(){});
    });
  }

  a.addEventListener('loadedmetadata', function(){
    if (st.t && a.duration) a.currentTime = st.t % a.duration;
    iniciar();
  });
  a.addEventListener('canplay', iniciar);
  a.addEventListener('play', ui); a.addEventListener('pause', ui);

  b.addEventListener('click', function(e){
    e.stopPropagation();
    if (a.paused){ pausadoPeloUsuario = false; a.muted = false; a.play().catch(function(){}); }
    else { pausadoPeloUsuario = true; a.pause(); }
    salvar();
  });

  function primeiro(){
    if (!pausadoPeloUsuario){
      a.muted = false;
      if (a.paused) a.play().catch(function(){});
    }
    ['click','touchstart','keydown','scroll','mousemove'].forEach(function(ev){ document.removeEventListener(ev, primeiro); });
  }
  ['click','touchstart','keydown','scroll','mousemove'].forEach(function(ev){ document.addEventListener(ev, primeiro); });

  setInterval(salvar, 500);
  window.addEventListener('pagehide', salvar);
  document.addEventListener('visibilitychange', function(){ if (document.hidden) salvar(); });
  ui();
  iniciar();
})();
