(function(){
  var rot=document.documentElement;
  rot.classList.add('js');

  /* Skygge under menyen når siden er scrollet */
  var hdr=document.querySelector('header');
  var skygge=function(){hdr.classList.toggle('skygge',window.scrollY>8);};
  window.addEventListener('scroll',skygge,{passive:true});skygge();

  /* Bildevisning for galleriet og sertifikatene. Uten JavaScript åpner lenkene bare bildet. */
  var lb=document.querySelector('.lysboks');
  if(lb&&lb.showModal){
    var lbBilde=lb.querySelector('img'),lbTekst=lb.querySelector('figcaption'),gruppe=[],pos=0;
    var forrige=lb.querySelector('.lb-forrige'),neste=lb.querySelector('.lb-neste');
    var vis=function(i){
      pos=(i+gruppe.length)%gruppe.length;
      var a=gruppe[pos],liten=a.querySelector('img'),tekst=liten?liten.alt:'';
      lbBilde.src=a.getAttribute('href');lbBilde.alt=tekst;lbTekst.textContent=tekst;
      forrige.hidden=neste.hidden=gruppe.length<2;
    };
    document.querySelectorAll('a[data-gruppe]').forEach(function(a){
      a.addEventListener('click',function(e){
        e.preventDefault();
        gruppe=[].slice.call(document.querySelectorAll('a[data-gruppe="'+a.getAttribute('data-gruppe')+'"]'));
        vis(gruppe.indexOf(a));lb.showModal();document.body.style.overflow='hidden';
      });
    });
    lb.addEventListener('close',function(){document.body.style.overflow='';});
    lb.querySelector('.lb-lukk').addEventListener('click',function(){lb.close();});
    forrige.addEventListener('click',function(){vis(pos-1);});
    neste.addEventListener('click',function(){vis(pos+1);});
    lb.addEventListener('click',function(e){if(e.target===lb||e.target.tagName==='FIGURE')lb.close();});
    lb.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')vis(pos-1);else if(e.key==='ArrowRight')vis(pos+1);});
    var x0=null;
    lb.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});
    lb.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>45&&gruppe.length>1)vis(pos+(dx<0?1:-1));});
  }

  /* Innhold glir litt på plass når det kommer til syne */
  var rolig=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var elementer=document.querySelectorAll('.vis');
  if(!('IntersectionObserver' in window)||rolig){elementer.forEach(function(el){el.classList.add('inne');});return;}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('inne');io.unobserve(e.target);}});},{threshold:.08,rootMargin:'0px 0px -6% 0px'});
  elementer.forEach(function(el){io.observe(el);});
})();
