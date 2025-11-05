const GAS_URL = "https://script.google.com/macros/s/AKfycbz_wE12NjbORzio-M9KAzI9gAr41WuXqSsgFLuZeJfthUVIlqzG37bokYsy8rJm-k1l6w/exec";
document.addEventListener('DOMContentLoaded', function() {
  const basePath = location.pathname;
  const searchParams = new URLSearchParams(location.search);

  // Sayfa yönlendirme
  if (!searchParams.has('postId')) {
    if (!searchParams.has('sayfa') || !searchParams.has('limit')) {
      const newSearchParams = new URLSearchParams(location.search);
      if (!newSearchParams.has('date')) newSearchParams.set('date', 'date:yeni');
      if (!newSearchParams.has('sayfa')) newSearchParams.set('sayfa', '1');
      if (!newSearchParams.has('limit')) newSearchParams.set('limit', '5');
      const newUrl = `${location.origin}${basePath}?${newSearchParams.toString()}`;
      history.replaceState({}, "", newUrl);
    }
  }

  const mobileToggle = document.getElementById('menuToggle');
  const sidebar = document.querySelector('aside[role="leftbar"]');
  const body = document.body;

  // Mobil menü toggle
  mobileToggle.addEventListener('click', e => {
    e.stopPropagation();
    sidebar.classList.toggle('active');
    body.classList.toggle('sidebar-active');
  });

  document.addEventListener('click', e => {
    if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && e.target !== mobileToggle) {
      sidebar.classList.remove('active');
      body.classList.remove('sidebar-active');
    }
  });

  const site = location.origin;
  const pathname = location.pathname;
  const parts = pathname.split('/').filter(Boolean);
  const repository = parts.length > 0 ? `/${parts[0]}/` : '/';

  // Arama formu dinleyicisi
  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const searchInput = document.getElementById('search');
      const searchText = searchInput.value.trim();
      if (searchText) {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('ara', searchText);
        urlParams.delete('postId'); // PostId varsa kaldır
        urlParams.delete('sayfa'); // Sayfa numarasını sıfırla
        urlParams.set('sayfa', '1');
        const newUrl = `${location.origin}${basePath}?${urlParams.toString()}`;
        window.location.href = newUrl;
      }
    });
  }

  // Arama parametresi varsa, arama kutusuna odaklan
  const urlParams = new URLSearchParams(window.location.search);
  const ara = urlParams.get('ara');
  if (ara) {
    const searchInput = document.getElementById('search');
    if (searchInput) {
      searchInput.value = ara;
      setTimeout(() => searchInput.focus(), 500);
    }
  }

  // Göreceli zaman
  function timeAgo(dateStr, timeStr = '00:00') {
    const now = new Date();
    const [day, month, year] = dateStr.split('.');
    const [hours, minutes] = timeStr.split(':');
    const isoStr = `${year}-${month}-${day}T${hours}:${minutes}:00+03:00`;
    const postDate = new Date(isoStr);
    const diffMs = now - postDate;
    const seconds = Math.floor(diffMs / 1000);
    const minutesDiff = Math.floor(seconds / 60);
    const hoursDiff = Math.floor(minutesDiff / 60);
    const days = Math.floor(hoursDiff / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    if (years > 0) return `${years} yıl önce`;
    if (months > 0) return `${months} ay önce`;
    if (weeks > 0) return `${weeks} hf önce`;
    if (days > 0) return `${days} gün önce`;
    if (hoursDiff > 0) return `${hoursDiff} sa önce`;
    if (minutesDiff > 0) return `${minutesDiff} dk önce`;
    return `${seconds} sn önce`;
  }

  // Metni kısalt
  function truncateText(text, maxLength, postId) {
    const cleanText = text.replace(/<[^>]*>/g, '');
    return cleanText.length <= maxLength ? cleanText + `<a href="${site}${repository}?postId=${postId}" data-tooltip-bottom="devamını oku"> [...]</a>` : cleanText.substring(0, maxLength) + `<a href="${site}${repository}?postId=${postId}" data-tooltip-bottom="devamını oku"> [...]</a>`;
  }

  // Breadcrumb
  function generateBreadcrumb(postTitle = '', isSinglePost = false) {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    const tag = urlParams.get('tag');
    const date = urlParams.get('date');
    const time = urlParams.get('time');
    const sayfa = urlParams.get('sayfa');
    const ara = urlParams.get('ara');
    let breadcrumbHTML = `<div class="breadcrumb"><section role="breadcrumb-left"><a href="${site}${repository}">blog</a>`;

    if (tag) {breadcrumbHTML += `<data size="0.5"><i icon="chevron-right"></i></data><a href="${site}${repository}?tag=tag:${tag.replace('tag:', '')}">etiket: ${tag.replace('tag:', '')}</a>`;} 
    else if (date) {
      if (date.replace('date:', '') !== "yeni") {
        breadcrumbHTML += `<data size="0.5"><i icon="chevron-right"></i></data><a href="${site}${repository}?date=date:${date.replace('date:', '')}">tarih: ${date.replace('date:', '')}</a>`;
      }
    } 
    else if (time) {breadcrumbHTML += `<data size="0.5"><i icon="chevron-right"></i></data><a href="${site}${repository}?time=time:${time.replace('time:', '')}">saat: ${time.replace('time:', '')}</a>`;} 
    else if (ara) {breadcrumbHTML += `<data size="0.5"><i icon="chevron-right"></i></data><a href="${site}${repository}?ara=${ara}">arama: ${ara}</a>`;} 
    else if (postId && postTitle) {breadcrumbHTML += `<data size="0.5"><i icon="chevron-right"></i></data><a href="${site}${repository}?postId=${postId}">${postTitle}</a>`;} 
    else if (sayfa && sayfa > 1) {breadcrumbHTML += `<data size="0.5"><i icon="chevron-right"></i></data><a href="${site}${repository}?sayfa=${sayfa}&limit=5">Sayfa ${sayfa}</a>`;}
    if (!isSinglePost) {
      breadcrumbHTML += `</section><section role="breadcrumb-right">
        <details class="dropdown">
          <summary role="button" class="secondary">tarih</summary>
          <ul>
            <li><a href="${site}${repository}?date=date:yeni">en yeni</a></li>
            <li><a href="${site}${repository}?date=date:eski">en eski</a></li>
            <li><a href="${site}${repository}?date=date:bugun">bugün</a></li>
            <li><a href="${site}${repository}?date=date:dun">dün</a></li>
            <li><a href="${site}${repository}?date=date:hafta">geçen hafta</a></li>
            <li><a href="${site}${repository}?date=date:ay">geçen ay</a></li>
            <li><a href="${site}${repository}?date=date:yil">geçen yıl</a></li>
          </ul>
        </details>
      </section></div>`;
    } else {
      breadcrumbHTML += `</section></div>`;
    }
    
    return breadcrumbHTML;
  }

  // API: yorum çek
  async function fetchComments(postId) {
    try {
      const res = await fetch(`${GAS_URL}?action=getComments&postId=${postId}`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return { success: false, comments: [] };
    }
  }

  // API: yorum ekle
  async function addComment(postId, author, content) {
    try {
      const gasUrl = `${GAS_URL}?action=addComment&postId=${encodeURIComponent(postId)}&author=${encodeURIComponent(author)}&content=${encodeURIComponent(content)}`;
      const res = await fetch(gasUrl, {method: 'POST', mode: 'no-cors', headers: {'Content-Type': 'application/json'}});
      return { success: true, message: "yorum eklendi" };
    } catch (error) {
      console.error('Yorum ekleme hatası:', error);
      return {success: false, message: 'yorum eklenirken hata oluştu!'};
    }
  }

  // Form submit event handler
  function setupCommentForm(postId) {
    const form = document.getElementById('commentForm');
    if (!form) return;
    // Önceki event listener'ları temizle
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    newForm.addEventListener('submit', async e => {
      e.preventDefault();
      const authorInput = document.getElementById('commentAuthor');
      const contentInput = document.getElementById('commentContent');
      const author = authorInput.value.trim();
      const content = contentInput.value.trim();
      if (!author || !content) {
        showToast('danger', 'lütfen tüm alanları doldurun!', 'red')
        return;
      }
      // Input sanitization
      const sanitizedAuthor = sanitizeInput(author);
      const sanitizedContent = sanitizeInput(content);
      // Submit butonunu devre dışı bırak
      const submitBtn = newForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'gönderiliyor...';
      const result = await addComment(postId, sanitizedAuthor, sanitizedContent);
      if (result.success) {
        showToast('check', 'yorumunuz eklendi', 'blue')
        authorInput.value = '';
        contentInput.value = '';
        await loadComments(postId);
      } else {
        showToast('check', result.message, 'blue')
      }
      submitBtn.disabled = false;
      submitBtn.textContent = 'gönder';
    });
  }
  function sanitizeInput(input) {return input.replace(/[<>"'&]/g, '');}

  // Yorumları göster
  function displayComments(comments, postId) {
    const section = document.createElement('div');
    section.className = 'comments-section';
    section.innerHTML = `<h3><data size="1"><i icon="comment"></i></data> Yorumlar <span class="comment-count" data-tooltip-right="${comments.length} yorum">${comments.length}</span></h3>`;
    const formDiv = document.createElement('div');
    formDiv.className = 'comment-form';
    formDiv.innerHTML = `
      <h4>Yorum Ekle</h4>
      <form id="commentForm">
        <div class="form-group">
          <input type="text" id="commentAuthor" placeholder="isim" required>
        </div>
        <div class="form-group">
          <textarea id="commentContent" placeholder="yorum" required></textarea>
        </div>
        <button type="submit" class="btn-submit" data-tooltip-left="yorumu gönder">Gönder</button>
      </form>
    `;
    
    section.appendChild(formDiv);
    const listDiv = document.createElement('div');
    listDiv.className = 'comment-list';
    if (!comments.length) listDiv.innerHTML = '<div class="no-comments">Henüz yorum yok! İlk yorumu siz yapın.</div>';
    else comments.forEach(c => {
      const cDiv = document.createElement('div');
      cDiv.className = 'comment';
      cDiv.innerHTML = `
        <div class="comment-header">
          <span class="comment-author">${c.author}</span>
          <span class="comment-date" data-tooltip-left="${c.timestamp}">${timeAgo(c.timestamp)}</span>
        </div>
        <div class="comment-content">${sanitizeInput(c.content)}</div>
      `;
      listDiv.appendChild(cDiv);
    });
    section.appendChild(listDiv);
    return section;
  }

  // Yorumları yükle
  async function loadComments(postId) {
    const container = document.getElementById('commentsContainer');
    if (!container) return;
    container.innerHTML = '<div class="loading"><data size="1"><i icon="spinner"></i></data> yorumlar yükleniyor...</div>';
    try {
      const gasUrl = `${GAS_URL}?action=getComments&postId=${encodeURIComponent(postId)}`;
      const response = await fetch(gasUrl);
      if (!response.ok) throw new Error('Yorumlar alınamadı');
      const result = await response.json();
      container.innerHTML = '';
      
      if (result.success) {
        container.appendChild(displayComments(result.comments, postId));
        setupCommentForm(postId);
      } else {
        container.innerHTML = '<div class="no-comments">yorumlar yüklenemedi.</div>';
      }
    } catch (error) {
      console.error('yorum yükleme hatası:', error);
      container.innerHTML = '<div class="no-comments">yorumlar yüklenirken hata oluştu.</div>';
    }
  }

  // Query string güncelle
  function updateQueryString(key, value) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(key, value);
    return `?${urlParams.toString()}`;
  }

  function normalizeHTML(html) {return html.replace(/""/g, '"').replace(/\s+/g, ' ').trim();}

  // Postları çek
  async function fetchPostData() {
    const main = document.querySelector('main');
    main.innerHTML = '<div class="loading"><data size="1"><i icon="spinner"></i></data> yükleniyor...</div>';
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    const ara = urlParams.get('ara');
    let queryString = window.location.search ? `?${window.location.search.slice(1)}` : '';
    let workerUrl;
    
    if (ara) {workerUrl = `https://spreadsheets.ckoglu.workers.dev/1T5JvKh7vNA7apvdR2SFEeFw1N5oN6-ueBN-oVZNseJ8/post?ara=${encodeURIComponent(ara)}${queryString.includes('?') ? '&' + queryString.slice(1) : queryString}`;} 
    else {workerUrl = `https://spreadsheets.ckoglu.workers.dev/1T5JvKh7vNA7apvdR2SFEeFw1N5oN6-ueBN-oVZNseJ8/post${queryString}`;}

    try {
      const response = await fetch(workerUrl);
      if (!response.ok) throw new Error('Veri alınamadı');
      const data = await response.json();
      main.innerHTML = '';
      const isSinglePost = postId && data.results.length === 1;
      if (!data.results.length) {
        if (ara) {main.innerHTML = `<div class="loading"><data size="1"><i icon="unavailable"></i></data> "${ara}" için sonuç bulunamadı.</div>`;} 
        else {main.innerHTML = '<div class="loading"><data size="1"><i icon="unavailable"></i></data> içerik yok.</div>';}
        return;
      }

      let postTitle = '';
      if (isSinglePost) postTitle = data.results[0].title;
      main.innerHTML = generateBreadcrumb(postTitle, isSinglePost);

      data.results.forEach(post => {
        const article = document.createElement('article');
        const header = document.createElement('header');
        header.innerHTML = `
          <h2><a href="${site}${repository}?postId=${post.postId}">${post.title}</a></h2>
          <time>
            <a href="${site}${repository}?date=date:${post.date}" data-tooltip-bottom="${post.date}"><data size="0.8"><i icon="calendar-dates"></i></data> ${timeAgo(post.date, post.time)}</a>
            <a href="${site}${repository}?time=time:${post.time}" data-tooltip-bottom="gönderi saati"><data size="0.7"><i icon="time"></i></data> ${post.time}</a>
          </time>
        `;
        const section = document.createElement('section');
        if (!isSinglePost) {section.setAttribute("role", "blog-page");}
        else {section.setAttribute("role", "main-page");}
        section.innerHTML = `<p>${isSinglePost ? normalizeHTML(post.text) : truncateText(post.text, 140, post.postId)}</p>`;
        const footer = document.createElement('footer');
        footer.innerHTML = post.tag.split(',').map(t => `<a href="${site}${repository}?tag=tag:${t.trim()}" data-tooltip-top="etiket: ${t.trim()}">${t.trim()}</a>`).join('');
        article.appendChild(header);
        article.appendChild(section);
        article.appendChild(footer);
        main.appendChild(article);
      });

      if (isSinglePost) {
        const commentFooter = document.createElement('footer');
        commentFooter.setAttribute('role','comments');
        const commentsContainer = document.createElement('div');
        commentsContainer.id = 'commentsContainer';
        commentFooter.appendChild(commentsContainer);
        main.appendChild(commentFooter);
        loadComments(postId);
      }

      // Sayfalama
      if (!isSinglePost) {
        const pagesFooter = document.createElement('footer');
        pagesFooter.setAttribute('role','pagination');
        main.appendChild(pagesFooter);
        const totalPages = Math.ceil(data.total / (parseInt(urlParams.get('limit')) || 5));
        const currentPage = parseInt(urlParams.get('sayfa')) || 1;
        
        // önceki buton
        if (currentPage > 1) {
          const prevLink = document.createElement('a');
          prevLink.href = updateQueryString('sayfa', currentPage - 1);
          prevLink.innerHTML = '<data size="1"><i icon="chevron-left"></i></data>';
          pagesFooter.appendChild(prevLink);
        }
    
        const createPageLink = (page) => {
          const pageLink = document.createElement('a');
          pageLink.href = updateQueryString('sayfa', page);
          pageLink.textContent = page;
          if (page === currentPage) pageLink.className = 'active';
          pagesFooter.appendChild(pageLink);
        };
    
        // sayfa numaraları
        for (let i = 1; i <= totalPages; i++) {
          if (
            i === 1 || // her zaman ilk
            i === totalPages || // her zaman son
            (i >= currentPage - 2 && i <= currentPage + 2) // aktifin çevresi
          ) {
            createPageLink(i);
          } else if (
            i === 2 && currentPage > 4 || // baştan sonra "..."
            i === totalPages - 1 && currentPage < totalPages - 3
          ) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            pagesFooter.appendChild(dots);
          }
        }
    
        // sonraki buton
        if (currentPage < totalPages) {
          const nextLink = document.createElement('a');
          nextLink.href = updateQueryString('sayfa', currentPage + 1);
          nextLink.innerHTML = '<data size="1"><i icon="chevron-right"></i></data>';
          pagesFooter.appendChild(nextLink);
        }
      }
      
    } catch (error) {
      console.error('Hata:', error);
      main.innerHTML = generateBreadcrumb() + '<div class="loading"><data size="1"><i icon="unavailable"></i></data> içerik yüklenemedi!</div>';
    }
  }

  fetchPostData();
  window.addEventListener('popstate', fetchPostData);

  // Pürüzsüz scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (window.innerWidth <= 1024) {
          sidebar.classList.remove('active');
          body.classList.remove('sidebar-active');
        }
      }
    });
  });
});
