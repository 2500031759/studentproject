/* ============================= PREMIUM MICRO-INTERACTIONS ============================= */
(function(){
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Add subtle reveal animation to major cards/sections without touching application logic.
  function premiumReveal(){
    if(prefersReduced) return;
    const targets=document.querySelectorAll(
      '.section-head,.t-card,.panel,.feed-card,.team-hero,.live-board,.admin-stat-card,.admin-quick-btn,.table-wrap,.lb-table-wrap,.t-header'
    );
    targets.forEach((el,i)=>{
      if(el.classList.contains('reveal-premium')) return;
      el.classList.add('reveal-premium');
      el.style.transitionDelay=Math.min((i%6)*45,220)+'ms';
    });
    requestAnimationFrame(()=>{
      const io=new IntersectionObserver(entries=>{
        entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}});
      },{threshold:.08});
      document.querySelectorAll('.reveal-premium').forEach(el=>io.observe(el));
    });
  }

  // Elegant pointer glow for premium cards.
  function pointerGlow(){
    if(prefersReduced || !window.matchMedia('(pointer:fine)').matches) return;
    document.addEventListener('pointermove',e=>{
      const card=e.target.closest('.t-card,.admin-stat-card,.panel,.team-hero,.live-board,.admin-quick-btn');
      if(!card) return;
      const r=card.getBoundingClientRect();
      card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
      card.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
    },{passive:true});
  }

  // Improve keyboard feel on clickable controls.
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      document.body.classList.remove('no-scroll');
    }
  });

  // Refresh enhancements after SPA view changes.
  const refresh=()=>setTimeout(premiumReveal,80);
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-view-link],.tabbtn,.chip,.settings-nav-btn,.admin-side-item')) refresh();
  });

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>{premiumReveal();pointerGlow()});
  }else{
    premiumReveal();pointerGlow();
  }
})();

