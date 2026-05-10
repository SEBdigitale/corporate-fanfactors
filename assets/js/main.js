
(function(){
  const body = document.body;
  body.classList.add('loaded');

  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  if(toggle && nav){
    toggle.addEventListener('click', () => {
      const open = body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  document.querySelectorAll('.dropdown-toggle').forEach((button)=>{
    button.addEventListener('click', (event)=>{
      const item = event.currentTarget.closest('.has-dropdown');
      const isMobile = window.matchMedia('(max-width: 920px)').matches;
      if(isMobile){
        item.classList.toggle('open');
        event.currentTarget.setAttribute('aria-expanded', item.classList.contains('open'));
      }
    });
  });

  const revealItems = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold: .14, rootMargin: '0px 0px -40px 0px'});
  revealItems.forEach((el)=>revealObserver.observe(el));

  const counterObserver = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
      if(!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const duration = 1200;
      const start = performance.now();
      const step = (now)=>{
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString();
        if(progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, {threshold: .35});
  document.querySelectorAll('[data-count]').forEach((el)=>counterObserver.observe(el));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduceMotion){
    document.querySelectorAll('.tilt-card').forEach((card)=>{
      card.addEventListener('pointermove', (event)=>{
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.transform = `perspective(900px) rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*4).toFixed(2)}deg) translateY(-2px)`;
      });
      card.addEventListener('pointerleave', ()=>{card.style.transform='';});
    });
  }

  document.querySelectorAll('.faq-question').forEach((button)=>{
    button.addEventListener('click', ()=>{
      const item = button.closest('.faq-item');
      const open = item.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
      button.querySelector('.faq-plus').textContent = open ? '−' : '+';
    });
  });

  const back = document.querySelector('[data-back-to-top]');
  if(back){
    window.addEventListener('scroll', ()=>{
      back.classList.toggle('visible', window.scrollY > 800);
    }, {passive:true});
    back.addEventListener('click', ()=>window.scrollTo({top:0, behavior:'smooth'}));
  }

  document.querySelectorAll('.contact-form').forEach((form)=>{
    form.addEventListener('submit', (event)=>{
      event.preventDefault();
      const note = form.querySelector('.form-note');
      const required = [...form.querySelectorAll('[required]')];
      const invalid = required.filter((field)=>!field.value.trim() || (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(field.value.trim())));
      if(invalid.length){
        invalid[0].focus();
        note.textContent = 'Please complete the required fields with a valid email.';
        note.classList.remove('success');
        note.classList.add('error');
        return;
      }
      note.textContent = 'Request captured in demo mode. Connect a backend endpoint to send real messages.';
      note.classList.remove('error');
      note.classList.add('success');
      form.reset();
    });
  });
})();

// v3 admin demo behavior
(function(){
  const adminLogin = document.querySelector('[data-admin-login]');
  if(adminLogin){adminLogin.addEventListener('submit', function(e){e.preventDefault(); window.location.href='admin-dashboard.html';});}
  const form = document.querySelector('[data-admin-post-form]');
  const list = document.querySelector('[data-draft-list]');
  const key = 'fanfactors-v3-drafts';
  function esc(s){return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
  function render(){if(!list)return; const drafts=JSON.parse(localStorage.getItem(key)||'[]'); list.innerHTML=drafts.length?drafts.map(d=>`<div class="draft-item"><strong>${esc(d.title)}</strong><span>${esc(d.cat)} · ${esc(d.summary)}</span><em>Local draft</em></div>`).join(''):'<div class="draft-item"><strong>No local drafts yet.</strong><span>Create a demo draft above. It stores in this browser only.</span><em>Demo</em></div>';}
  if(form){render(); form.addEventListener('submit', function(e){e.preventDefault(); const fd=new FormData(form); const drafts=JSON.parse(localStorage.getItem(key)||'[]'); drafts.unshift({title:fd.get('title'),cat:fd.get('category'),summary:fd.get('summary')}); localStorage.setItem(key,JSON.stringify(drafts.slice(0,10))); form.reset(); render();});}
})();
