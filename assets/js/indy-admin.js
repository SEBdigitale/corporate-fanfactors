(function(){
  const form = document.querySelector('[data-indy-form]');
  const list = document.querySelector('[data-indy-post-list]');
  const preview = document.querySelector('[data-indy-preview]');
  const note = document.querySelector('[data-indy-note]');
  const newButton = document.querySelector('[data-indy-new]');
  const deleteButton = document.querySelector('[data-indy-delete]');
  const resetButton = document.querySelector('[data-indy-reset]');
  const storageKey = 'fanfactors-indy-posts';
  let posts = [];
  let selectedId = '';

  if(!form || !list || !preview) return;

  const escapeHtml = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const createId = () => `post-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const slugify = (value) => String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'untitled-post';

  async function loadSeedPosts(){
    try{
      const response = await fetch('data/blog-posts.json', {cache:'no-store'});
      const seed = await response.json();
      return seed.map((post) => ({
        id: post.slug,
        title: post.title,
        slug: post.slug,
        category: post.category,
        status: post.status,
        excerpt: post.excerpt,
        body: post.excerpt,
        featuredImage: post.featuredImage,
        socialImage: post.socialImage || post.featuredImage,
        tags: (post.tags || []).join(', '),
        links: `Live page | ${post.file}`,
      }));
    }catch(error){
      return [];
    }
  }

  function savePosts(){
    localStorage.setItem(storageKey, JSON.stringify(posts));
  }

  function setNote(message, type){
    if(!note) return;
    note.textContent = message;
    note.classList.toggle('success', type === 'success');
    note.classList.toggle('error', type === 'error');
  }

  function renderList(){
    list.innerHTML = posts.map((post) => `
      <button type="button" class="${post.id === selectedId ? 'active' : ''}" data-indy-select="${escapeHtml(post.id)}">
        <strong>${escapeHtml(post.title)}</strong>
        <span>${escapeHtml(post.status)} · ${escapeHtml(post.category)}</span>
      </button>
    `).join('') || '<span>No local posts yet.</span>';
  }

  function renderPreview(post){
    if(!post){
      preview.innerHTML = '<h3>Select or create a post.</h3><p>Saved local posts will appear here before the Supabase-backed admin is built.</p>';
      return;
    }
    const links = String(post.links || '').split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
      const parts = line.split('|').map((part) => part.trim());
      const label = parts[0] || 'Link';
      const href = parts[1] || '#';
      return `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
    }).join('');
    preview.innerHTML = `
      <img src="${escapeHtml(post.featuredImage || 'assets/images/artist-dj-turntables.webp')}" alt="">
      <span>${escapeHtml(post.category)} · ${escapeHtml(post.status)}</span>
      <h3>${escapeHtml(post.title)}</h3>
      <p>${escapeHtml(post.excerpt)}</p>
      <div>${escapeHtml(post.body).replace(/\n/g, '<br>')}</div>
      <nav aria-label="Post links">${links}</nav>
    `;
  }

  function fillForm(post){
    form.elements.id.value = post.id;
    form.elements.title.value = post.title || '';
    form.elements.slug.value = post.slug || '';
    form.elements.category.value = post.category || '';
    form.elements.status.value = post.status || 'draft';
    form.elements.excerpt.value = post.excerpt || '';
    form.elements.body.value = post.body || '';
    form.elements.featuredImage.value = post.featuredImage || '';
    form.elements.socialImage.value = post.socialImage || '';
    form.elements.tags.value = post.tags || '';
    form.elements.links.value = post.links || '';
  }

  function selectPost(id){
    selectedId = id;
    const post = posts.find((item) => item.id === id);
    if(post) fillForm(post);
    renderList();
    renderPreview(post);
  }

  function createBlankPost(){
    const post = {
      id: createId(),
      title: 'Untitled blog post',
      slug: 'untitled-blog-post',
      category: 'FanFactors',
      status: 'draft',
      excerpt: '',
      body: '',
      featuredImage: 'assets/images/artist-dj-turntables.webp',
      socialImage: 'assets/images/artist-dj-turntables.webp',
      tags: '',
      links: '',
    };
    posts.unshift(post);
    savePosts();
    selectPost(post.id);
    setNote('New local draft created.', 'success');
  }

  form.addEventListener('input', () => {
    if(!form.elements.slug.value.trim()){
      form.elements.slug.value = slugify(form.elements.title.value);
    }
    const post = Object.fromEntries(new FormData(form).entries());
    renderPreview(post);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const post = Object.fromEntries(new FormData(form).entries());
    post.id = post.id || createId();
    post.slug = slugify(post.slug || post.title);
    const existingIndex = posts.findIndex((item) => item.id === post.id);
    if(existingIndex >= 0) posts[existingIndex] = post;
    else posts.unshift(post);
    selectedId = post.id;
    savePosts();
    renderList();
    renderPreview(post);
    setNote('Post saved locally in this browser.', 'success');
  });

  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-indy-select]');
    if(button) selectPost(button.dataset.indySelect);
  });

  newButton?.addEventListener('click', createBlankPost);
  deleteButton?.addEventListener('click', () => {
    if(!selectedId) return;
    posts = posts.filter((post) => post.id !== selectedId);
    selectedId = posts[0]?.id || '';
    savePosts();
    renderList();
    if(selectedId) selectPost(selectedId);
    else {
      form.reset();
      renderPreview(null);
    }
    setNote('Post deleted locally.', 'success');
  });
  resetButton?.addEventListener('click', async () => {
    localStorage.removeItem(storageKey);
    posts = await loadSeedPosts();
    savePosts();
    selectPost(posts[0]?.id || '');
    setNote('Local drafts reset to the static blog seed.', 'success');
  });

  (async function init(){
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    posts = stored.length ? stored : await loadSeedPosts();
    if(posts.length) savePosts();
    selectPost(posts[0]?.id || '');
  })();
})();
