(() => {
  const storageKey = 'fanfactors-indy-posts';
  const seedUrl = 'data/blog-posts.json';

  const form = document.querySelector('[data-indy-form]');
  const postList = document.querySelector('[data-indy-post-list]');
  const preview = document.querySelector('[data-indy-preview]');
  const note = document.querySelector('[data-indy-note]');
  const newButtons = document.querySelectorAll('[data-indy-new]');
  const openCurrentButton = document.querySelector('[data-indy-open-current]');
  const deleteButton = document.querySelector('[data-indy-delete]');
  const resetButton = document.querySelector('[data-indy-reset]');
  const modal = document.querySelector('[data-indy-modal]');
  const modalTitle = document.querySelector('[data-indy-modal-title]');
  const closeModalButtons = document.querySelectorAll('[data-indy-close-modal]');
  const folderButtons = document.querySelectorAll('[data-indy-folder-toggle]');

  if (!form || !postList || !preview) {
    return;
  }

  let posts = [];
  let selectedId = '';

  const defaultPost = {
    id: '',
    title: 'Untitled Blog Post',
    slug: 'untitled-blog-post',
    category: 'Strategy',
    status: 'Draft',
    excerpt: '',
    body: '',
    featuredImage: 'assets/images/artist-mohawk-rebel.jpg',
    socialImage: 'assets/images/artist-mohawk-rebel.jpg',
    tags: [],
    links: [],
  };

  const makeId = () => {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }

    return `post-${Date.now()}-${Math.round(Math.random() * 100000)}`;
  };

  const slugify = (value) =>
    String(value || '')
      .trim()
      .toLowerCase()
      .replace(/['"]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'untitled-blog-post';

  const escapeHtml = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const splitList = (value) => {
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }

    return String(value || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const parseLinks = (value) => {
    if (Array.isArray(value)) {
      return value
        .map((link) => ({
          label: String(link.label || link.href || '').trim(),
          href: String(link.href || '').trim(),
        }))
        .filter((link) => link.href);
    }

    return String(value || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, href] = line.includes('|') ? line.split('|').map((part) => part.trim()) : [line, line];
        return { label, href };
      })
      .filter((link) => link.href);
  };

  const serializeLinks = (links) =>
    parseLinks(links)
      .map((link) => `${link.label} | ${link.href}`)
      .join('\n');

  const normalizePost = (post = {}, index = 0) => {
    const title = String(post.title || defaultPost.title).trim();
    const slug = slugify(post.slug || title || `${defaultPost.slug}-${index + 1}`);

    return {
      ...defaultPost,
      ...post,
      id: String(post.id || makeId()),
      title,
      slug,
      category: String(post.category || defaultPost.category).trim(),
      status: String(post.status || defaultPost.status).trim(),
      excerpt: String(post.excerpt || '').trim(),
      body: String(post.body || '').trim(),
      featuredImage: String(post.featuredImage || defaultPost.featuredImage).trim(),
      socialImage: String(post.socialImage || defaultPost.socialImage).trim(),
      tags: splitList(post.tags),
      links: parseLinks(post.links),
    };
  };

  const getCurrentPost = () => posts.find((post) => post.id === selectedId) || posts[0] || null;

  const setNote = (message) => {
    if (note) {
      note.textContent = message;
    }
  };

  const readStoredPosts = () => {
    try {
      const value = window.localStorage.getItem(storageKey);
      if (!value) {
        return null;
      }

      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) {
        return null;
      }

      return parsed.map(normalizePost);
    } catch (error) {
      return null;
    }
  };

  const savePosts = () => {
    window.localStorage.setItem(storageKey, JSON.stringify(posts));
  };

  const loadSeedPosts = async () => {
    try {
      const response = await fetch(seedUrl, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Seed request failed: ${response.status}`);
      }

      const data = await response.json();
      const items = Array.isArray(data.posts) ? data.posts : data;
      return Array.isArray(items) ? items.map(normalizePost) : [];
    } catch (error) {
      return [];
    }
  };

  const renderList = () => {
    if (!posts.length) {
      postList.innerHTML = '<p class="indy-empty-row">No blog posts yet.</p>';
      return;
    }

    postList.innerHTML = posts
      .map((post) => {
        const isActive = post.id === selectedId ? ' is-selected' : '';
        return `
          <button class="indy-post-row${isActive}" type="button" data-post-id="${escapeHtml(post.id)}">
            <span class="indy-post-row-title">${escapeHtml(post.title)}</span>
            <span class="indy-post-row-meta">${escapeHtml(post.status)} · ${escapeHtml(post.category)}</span>
          </button>
        `;
      })
      .join('');
  };

  const renderPreview = (post = getCurrentPost()) => {
    if (!post) {
      preview.innerHTML = `
        <span class="indy-preview-kicker">Blog</span>
        <h2>Select a blog post</h2>
        <p>Choose an article in the left sidebar to edit title, images, links, tags, excerpt and body copy.</p>
      `;
      return;
    }

    const tagMarkup = post.tags.length
      ? `<div class="indy-preview-tags">${post.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>`
      : '';

    const linkMarkup = post.links.length
      ? `<div class="indy-preview-links">${post.links
          .map((link) => `<a href="${escapeHtml(link.href)}" target="_blank" rel="noopener">${escapeHtml(link.label)}</a>`)
          .join('')}</div>`
      : '';

    const imageMarkup = post.featuredImage
      ? `<img src="${escapeHtml(post.featuredImage)}" alt="" loading="lazy">`
      : '';

    preview.innerHTML = `
      <span class="indy-preview-kicker">${escapeHtml(post.category)} · ${escapeHtml(post.status)}</span>
      <h2>${escapeHtml(post.title)}</h2>
      <p>${escapeHtml(post.excerpt || post.body || 'Draft body is empty.')}</p>
      ${imageMarkup}
      ${tagMarkup}
      ${linkMarkup}
    `;
  };

  const fillForm = (post) => {
    const elements = form.elements;
    elements.id.value = post.id;
    elements.title.value = post.title;
    elements.slug.value = post.slug;
    elements.category.value = post.category;
    elements.status.value = post.status;
    elements.excerpt.value = post.excerpt;
    elements.body.value = post.body;
    elements.featuredImage.value = post.featuredImage;
    elements.socialImage.value = post.socialImage;
    elements.tags.value = post.tags.join(', ');
    elements.links.value = serializeLinks(post.links);

    if (modalTitle) {
      modalTitle.textContent = post.title || 'Edit Article';
    }
  };

  const getFormPost = () =>
    normalizePost({
      id: form.elements.id.value,
      title: form.elements.title.value,
      slug: form.elements.slug.value,
      category: form.elements.category.value,
      status: form.elements.status.value,
      excerpt: form.elements.excerpt.value,
      body: form.elements.body.value,
      featuredImage: form.elements.featuredImage.value,
      socialImage: form.elements.socialImage.value,
      tags: form.elements.tags.value,
      links: form.elements.links.value,
    });

  const openModal = (post) => {
    if (!modal || !post) {
      return;
    }

    selectedId = post.id;
    fillForm(post);
    renderList();
    renderPreview(post);
    modal.hidden = false;
    document.body.classList.add('is-indy-modal-open');
    window.setTimeout(() => form.elements.title.focus(), 20);
  };

  const closeModal = () => {
    if (!modal) {
      return;
    }

    modal.hidden = true;
    document.body.classList.remove('is-indy-modal-open');
  };

  const createPost = () => {
    const post = normalizePost({
      ...defaultPost,
      id: makeId(),
      title: 'New Blog Post',
      slug: `new-blog-post-${posts.length + 1}`,
    });

    posts = [post, ...posts];
    selectedId = post.id;
    savePosts();
    renderList();
    openModal(post);
    setNote('New draft created locally.');
  };

  const saveCurrentPost = (event) => {
    event.preventDefault();

    const nextPost = getFormPost();
    const index = posts.findIndex((post) => post.id === nextPost.id);
    if (index >= 0) {
      posts[index] = nextPost;
    } else {
      posts = [nextPost, ...posts];
    }

    selectedId = nextPost.id;
    savePosts();
    renderList();
    renderPreview(nextPost);
    fillForm(nextPost);
    setNote('Saved locally.');
  };

  const deleteCurrentPost = () => {
    const current = getCurrentPost();
    if (!current) {
      return;
    }

    const confirmed = window.confirm(`Delete "${current.title}" from local drafts?`);
    if (!confirmed) {
      return;
    }

    posts = posts.filter((post) => post.id !== current.id);
    selectedId = posts[0]?.id || '';
    savePosts();
    renderList();
    renderPreview();
    closeModal();
    setNote('Post deleted locally.');
  };

  const resetSeedPosts = async () => {
    posts = await loadSeedPosts();
    if (!posts.length) {
      posts = [normalizePost(defaultPost)];
    }

    selectedId = posts[0].id;
    savePosts();
    renderList();
    renderPreview();
    closeModal();
    setNote('Seed blog posts restored.');
  };

  const hydrate = async () => {
    posts = readStoredPosts() || (await loadSeedPosts());
    if (!posts.length) {
      posts = [normalizePost(defaultPost)];
    }

    selectedId = posts[0].id;
    renderList();
    renderPreview();
    setNote('Local draft editor ready.');
  };

  folderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const controls = button.getAttribute('aria-controls');
      const content = controls ? document.getElementById(controls) : null;
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));

      if (content) {
        content.hidden = expanded;
      }
    });
  });

  postList.addEventListener('click', (event) => {
    const row = event.target.closest('[data-post-id]');
    if (!row) {
      return;
    }

    const post = posts.find((item) => item.id === row.dataset.postId);
    openModal(post);
  });

  newButtons.forEach((button) => {
    button.addEventListener('click', createPost);
  });

  if (openCurrentButton) {
    openCurrentButton.addEventListener('click', () => {
      openModal(getCurrentPost());
    });
  }

  closeModalButtons.forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  form.addEventListener('submit', saveCurrentPost);
  form.addEventListener('input', () => {
    const draft = getFormPost();
    if (modalTitle) {
      modalTitle.textContent = draft.title || 'Edit Article';
    }
    renderPreview(draft);
  });

  if (deleteButton) {
    deleteButton.addEventListener('click', deleteCurrentPost);
  }

  if (resetButton) {
    resetButton.addEventListener('click', resetSeedPosts);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && !modal.hidden) {
      closeModal();
    }
  });

  hydrate();
})();
