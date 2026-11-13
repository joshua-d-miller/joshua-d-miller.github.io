/* joshua-d-miller.com — small progressive enhancements. Everything works without this file. */
(function () {
  'use strict';
  var root = document.documentElement;

  /* ---- Theme switch: Auto / Light / Dark ---- */
  function savedTheme() {
    try { return localStorage.getItem('theme') || 'auto'; } catch (e) { return 'auto'; }
  }
  function applyTheme(value) {
    if (value === 'light' || value === 'dark') {
      root.dataset.theme = value;
    } else {
      delete root.dataset.theme;
    }
    try {
      if (value === 'auto') localStorage.removeItem('theme');
      else localStorage.setItem('theme', value);
    } catch (e) {}
  }
  var current = savedTheme();
  document.querySelectorAll('input[name="theme"]').forEach(function (input) {
    input.checked = input.value === current;
    input.addEventListener('change', function () { if (input.checked) applyTheme(input.value); });
  });

  /* ---- Make wide tables and code blocks keyboard-scrollable ---- */
  document.querySelectorAll('.prose table').forEach(function (table) {
    if (table.closest('pre, .highlight') || table.parentElement.classList.contains('table-wrap')) return;
    var wrap = document.createElement('div');
    wrap.className = 'table-wrap';
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
    if (wrap.scrollWidth > wrap.clientWidth) {
      wrap.tabIndex = 0;
      wrap.setAttribute('role', 'region');
      var label = table.querySelector('caption') || findHeading(wrap);
      wrap.setAttribute('aria-label', label ? label.textContent.trim() + ' (table)' : 'Table');
    }
  });
  var codeCount = 0;
  document.querySelectorAll('.prose pre').forEach(function (pre) {
    if (pre.closest('td')) pre = pre.closest('table').closest('pre, div') || pre;
    if (pre.dataset.scrollable || pre.scrollWidth <= pre.clientWidth) return;
    pre.dataset.scrollable = '1';
    pre.tabIndex = 0;
    pre.setAttribute('role', 'region');
    pre.setAttribute('aria-label', 'Code example ' + (++codeCount));
  });
  function findHeading(el) {
    var n = el.previousElementSibling;
    while (n) { if (/^H[2-4]$/.test(n.tagName)) return n; n = n.previousElementSibling; }
    return null;
  }

  /* ---- Search page ---- */
  var form = document.querySelector('.search-page-form');
  if (!form) return;
  var input = document.getElementById('search-q');
  var status = document.getElementById('search-status');
  var list = document.getElementById('search-results');
  var index = null;

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function snippet(text, terms) {
    var lower = text.toLowerCase();
    var at = -1;
    terms.some(function (t) { at = lower.indexOf(t); return at >= 0; });
    var start = Math.max(0, at - 60);
    var s = (start > 0 ? '…' : '') + text.substr(start, 200) + (text.length > start + 200 ? '…' : '');
    s = escapeHtml(s);
    terms.forEach(function (t) {
      var re = new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      s = s.replace(re, '<mark>$1</mark>');
    });
    return s;
  }
  function run(q) {
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    list.innerHTML = '';
    if (!terms.length) { status.textContent = ''; return; }
    var hits = index.filter(Boolean).map(function (item) {
      var title = item.title.toLowerCase();
      var tags = (item.tags || []).join(' ').toLowerCase();
      var text = item.text.toLowerCase();
      var score = 0;
      for (var i = 0; i < terms.length; i++) {
        var t = terms[i];
        var s = (title.indexOf(t) >= 0 ? 10 : 0) + (tags.indexOf(t) >= 0 ? 5 : 0) + (text.indexOf(t) >= 0 ? 1 : 0);
        if (!s) return null; // every word must match somewhere
        score += s;
      }
      return { item: item, score: score };
    }).filter(Boolean).sort(function (a, b) { return b.score - a.score; });

    status.textContent = hits.length === 0
      ? 'No results for “' + q + '”.'
      : hits.length + (hits.length === 1 ? ' result' : ' results') + ' for “' + q + '”.';
    hits.slice(0, 30).forEach(function (h) {
      var li = document.createElement('li');
      li.innerHTML = '<a href="' + h.item.url + '">' + escapeHtml(h.item.title) + '</a>' +
        (h.item.date ? ' <span class="post-meta">' + escapeHtml(h.item.date) + '</span>' : '') +
        '<p>' + snippet(h.item.text, terms) + '</p>';
      list.appendChild(li);
    });
  }
  function load(cb) {
    if (index) return cb();
    status.textContent = 'Loading search…';
    fetch(form.dataset.index || '/search.json')
      .then(function (r) { return r.json(); })
      .then(function (data) { index = data; cb(); })
      .catch(function () { status.textContent = 'Search could not be loaded. Try browsing all posts instead.'; });
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = input.value.trim();
    history.replaceState(null, '', q ? '?q=' + encodeURIComponent(q) : location.pathname);
    load(function () { run(q); });
  });
  var initial = new URLSearchParams(location.search).get('q');
  if (initial) {
    input.value = initial;
    load(function () { run(initial.trim()); });
  }
})();
