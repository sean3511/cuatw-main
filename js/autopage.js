// 交易紀錄分頁
/* ---------- Pagination 類 ---------- */
class Pagination {
  constructor({ listSelector, itemSelector, pagerSelector, perPage = 'all', maxVisiblePages = 5 }) {
    this.listEl = document.querySelector(listSelector);
    this.pagerEl = document.querySelector(pagerSelector);
    this.maxVisiblePages = maxVisiblePages;

    if (!this.listEl || !this.pagerEl) return;

    this.items = [...this.listEl.querySelectorAll(itemSelector)];
    if (this.items.length === 0) return;

    this.currentPage = 1;
    this.updatePerPage(perPage);
  }

  updatePerPage(val) {
    this.perPage = (val === 'all') ? this.items.length : parseInt(val, 10);
    this.update();
  }

  update() {
  // 1. 顯示所有項目
  this.listEl.querySelectorAll('.mywallet-list__item').forEach(el => {
    el.style.display = '';
  });

  // 2. 重新篩選當前項目（如果有篩選功能）
  this.items = [...this.listEl.querySelectorAll('.mywallet-list__item')]
    .filter(el => el.style.display !== 'none');

  // 3. 重新計算分頁
  this.pageCnt = Math.max(Math.ceil(this.items.length / this.perPage), 1);
  this._buildUI();
  this._showPage(Math.min(this.currentPage, this.pageCnt));
}

  _buildUI() {
    this.pagerEl.innerHTML = '';
    this.prevBtn = this._btn('prevBtn', '&laquo;');
    this.pagerEl.appendChild(this.prevBtn);

    this.pageBtns = [];

    for (let i = 1; i <= this.pageCnt; i++) {
      const r = document.createElement('input');
      r.type = 'radio'; r.name = 'page'; r.id = `page${i}`;
      if (i === this.currentPage) r.checked = true;

      const lb = document.createElement('label');
      lb.htmlFor = r.id; lb.textContent = i;

      this.pageBtns.push({ input: r, label: lb });
      this.pagerEl.append(r, lb);
    }

    this.nextBtn = this._btn('nextBtn', '&raquo;');
    this.pagerEl.appendChild(this.nextBtn);

    this.pagerEl.onchange = e => {
      if (e.target.name === 'page') {
        const selected = parseInt(e.target.id.replace('page', ''), 10);
        this._showPage(selected);
      }
    };
    this.prevBtn.onclick = () => this._move(-1);
    this.nextBtn.onclick = () => this._move(1);

    this.pagerEl.style.display = (this.pageCnt <= 1) ? 'none' : 'flex';
    this._updateArrowDisplay();
  }

  _showPage(p) {
    this.currentPage = p;

    const s = (p - 1) * this.perPage, e = s + this.perPage;
    this.items.forEach((el, i) => {
      el.style.display = (i >= s && i < e) ? '' : 'none';
    });

    this.pageBtns.forEach(({ input }) => input.checked = false);
    const input = this.pagerEl.querySelector(`#page${p}`);
    if (input) input.checked = true;

    this._updateArrows();
    this._updateArrowDisplay();
  }

  _move(d) {
    const target = this.currentPage + d;
    if (target < 1 || target > this.pageCnt) return;
    this._showPage(target);
  }

  _current() {
    return this.currentPage;
  }

  _updateArrows() {
    const p = this.currentPage;
    this.prevBtn.classList.toggle('disabled', p === 1);
    this.nextBtn.classList.toggle('disabled', p === this.pageCnt);
  }

  _updateArrowDisplay() {
  const current = this.currentPage;
  const pageCount = this.pageCnt;
  const maxVisible = this.maxVisiblePages;

  const edgeCount = 2; // 固定顯示第一頁與最後一頁
  const middleCount = maxVisible;

  let start = current - Math.floor(middleCount / 2);
  let end = current + Math.floor(middleCount / 2);

  if (start < 2) {
    start = 2;
    end = start + middleCount - 1;
  }
  if (end > pageCount - 1) {
    end = pageCount - 1;
    start = end - middleCount + 1;
  }

  start = Math.max(2, start);
  end = Math.min(pageCount - 1, end);

  this.pageBtns.forEach(({ input, label }, i) => {
    const page = i + 1;
    const isEdge = page === 1 || page === pageCount;
    const isVisible = isEdge || (page >= start && page <= end);
    label.style.display = isVisible ? '' : 'none';
  });

  this._addEllipses(start, end);
}

  _addEllipses(start, end) {
    this.pagerEl.querySelectorAll('.ellipsis').forEach(el => el.remove());

    const insertEllipsis = (afterInput) => {
      const span = document.createElement('span');
      span.className = 'ellipsis';
      span.textContent = '...';
      this.pagerEl.insertBefore(span, afterInput);
    };

    if (start > 2) {
      const el = this.pageBtns[start - 2];
      if (el) insertEllipsis(el.input);
    }
    if (end < this.pageCnt - 1) {
      const el = this.pageBtns[end];
      if (el) insertEllipsis(el.input);
    }
  }

  _btn(id, html) {
    const b = document.createElement('button');
    b.id = id;
    b.innerHTML = html;
    return b;
  }
  
}

/* ---------- 單一 DOMContentLoaded ---------- */
(function waitForPagerReady() {
  const listEl = document.querySelector('.mywallet-list');
  const pagerEl = document.querySelector('#pagination');

  if (listEl && pagerEl) {
    const pager = new Pagination({
      listSelector : '.mywallet-list',
      itemSelector : '.mywallet-list__item',
      pagerSelector: '#pagination',
      perPage      : 'all',
      maxVisiblePages: 5
    });

    document.querySelectorAll('.select_num, .mywallet-select__sel')
      .forEach(sel => sel.addEventListener('change', () => {
        pager.updatePerPage(sel.value);
        if (pager.update) pager.update();
      }));

    const observer = new MutationObserver(() => {
      if (pager.update) pager.update();
    });

    observer.observe(listEl, { childList: true, subtree: false });
  } else {
    setTimeout(waitForPagerReady, 300);
  }
})();


// 充提紀錄分頁

// 充提紀錄部分
/* ---------- Pagination 類 ---------- */
class Pagination2 {
  constructor({ listSelector, itemSelector, pagerSelector, perPage = 'all', maxVisiblePages = 5 }) {
    this.listEl = document.querySelector(listSelector);
    this.pagerEl = document.querySelector(pagerSelector);
    this.maxVisiblePages = maxVisiblePages;

    if (!this.listEl || !this.pagerEl) return;

    this.items = [...this.listEl.querySelectorAll(itemSelector)];
    if (this.items.length === 0) return;

    this.currentPage = 1;
    this.updatePerPage(perPage);
  }

  updatePerPage(val) {
    this.perPage = (val === 'all') ? this.items.length : parseInt(val, 10);
    this.update();
  }

  update() {
    this.listEl.querySelectorAll('.record-list__item').forEach(el => {
      el.style.display = '';
    });

    this.items = [...this.listEl.querySelectorAll('.record-list__item')]
      .filter(el => el.style.display !== 'none');

    this.pageCnt = Math.max(Math.ceil(this.items.length / this.perPage), 1);
    this._buildUI();
    this._showPage(Math.min(this.currentPage, this.pageCnt));
  }

  _buildUI() {
    this.pagerEl.innerHTML = '';
    this.prevBtn = this._btn('prevBtn', '&laquo;');
    this.pagerEl.appendChild(this.prevBtn);

    this.pageBtns = [];

    for (let i = 1; i <= this.pageCnt; i++) {
      const r = document.createElement('input');
      r.type = 'radio'; r.name = 'page'; r.id = `page${i}`;
      if (i === this.currentPage) r.checked = true;

      const lb = document.createElement('label');
      lb.htmlFor = r.id; lb.textContent = i;

      this.pageBtns.push({ input: r, label: lb });
      this.pagerEl.append(r, lb);
    }

    this.nextBtn = this._btn('nextBtn', '&raquo;');
    this.pagerEl.appendChild(this.nextBtn);

    this.pagerEl.onchange = e => {
      if (e.target.name === 'page') {
        const selected = parseInt(e.target.id.replace('page', ''), 10);
        this._showPage(selected);
      }
    };

    this.prevBtn.onclick = () => this._move(-1);
    this.nextBtn.onclick = () => this._move(1);

    this.pagerEl.style.display = (this.pageCnt <= 1) ? 'none' : 'flex';
    this._updateArrowDisplay();
  }

  _showPage(p) {
    this.currentPage = p;

    const s = (p - 1) * this.perPage, e = s + this.perPage;
    this.items.forEach((el, i) => {
      el.style.display = (i >= s && i < e) ? '' : 'none';
    });

    this.pageBtns.forEach(({ input }) => input.checked = false);
    const input = this.pagerEl.querySelector(`#page${p}`);
    if (input) input.checked = true;

    this._updateArrows();
    this._updateArrowDisplay();
  }

  _move(d) {
    const target = this.currentPage + d;
    if (target < 1 || target > this.pageCnt) return;
    this._showPage(target);
  }

  _current() {
    return this.currentPage;
  }

  _updateArrows() {
    const p = this.currentPage;
    this.prevBtn.classList.toggle('disabled', p === 1);
    this.nextBtn.classList.toggle('disabled', p === this.pageCnt);
  }

  _updateArrowDisplay() {
    const current = this.currentPage;
    const pageCount = this.pageCnt;
    const maxVisible = this.maxVisiblePages;

    const edgeCount = 2;
    const middleCount = maxVisible;

    let start = current - Math.floor(middleCount / 2);
    let end = current + Math.floor(middleCount / 2);

    if (start < 2) {
      start = 2;
      end = start + middleCount - 1;
    }
    if (end > pageCount - 1) {
      end = pageCount - 1;
      start = end - middleCount + 1;
    }

    start = Math.max(2, start);
    end = Math.min(pageCount - 1, end);

    this.pageBtns.forEach(({ input, label }, i) => {
      const page = i + 1;
      const isEdge = page === 1 || page === pageCount;
      const isVisible = isEdge || (page >= start && page <= end);
      label.style.display = isVisible ? '' : 'none';
    });

    this._addEllipses(start, end);
  }

  _addEllipses(start, end) {
    this.pagerEl.querySelectorAll('.ellipsis').forEach(el => el.remove());

    const insertEllipsis = (afterInput) => {
      const span = document.createElement('span');
      span.className = 'ellipsis';
      span.textContent = '...';
      this.pagerEl.insertBefore(span, afterInput);
    };

    if (start > 2) {
      const el = this.pageBtns[start - 2];
      if (el) insertEllipsis(el.input);
    }
    if (end < this.pageCnt - 1) {
      const el = this.pageBtns[end];
      if (el) insertEllipsis(el.input);
    }
  }

  _btn(id, html) {
    const b = document.createElement('button');
    b.id = id;
    b.innerHTML = html;
    return b;
  }
}

(function waitForRecordPagerReady() {
  const listEl = document.querySelector('.record-list');
  const pagerEl = document.querySelector('#pagination2');

  if (listEl && pagerEl) {
    const pager = new Pagination2({
      listSelector : '.record-list',
      itemSelector : '.record-list__item',
      pagerSelector: '#pagination2',
      perPage      : 'all'
    });

    // 下拉變更每頁筆數
    document.querySelectorAll('.select_num, .mywallet-select__sel')
      .forEach(sel => sel.addEventListener('change', () => {
        pager.updatePerPage(sel.value);
        if (pager.update) pager.update();
      }));

    // 如果需要觀察 DOM 新增/刪除自動更新
    const observer = new MutationObserver(() => {
      if (pager.update) pager.update();
    });
    observer.observe(listEl, { childList: true, subtree: false });

  } else {
    setTimeout(waitForRecordPagerReady, 300); // Retry until ready
  }
})();

// 投注紀錄分頁

/* ---------- Pagination 類 ---------- */
class Pagination3 {
  constructor({ listSelector, itemSelector, pagerSelector, perPage = 'all', maxVisiblePages = 5 }) {
    this.listEl = document.querySelector(listSelector);
    this.pagerEl = document.querySelector(pagerSelector);
    this.maxVisiblePages = maxVisiblePages;

    if (!this.listEl || !this.pagerEl) return;

    this.items = [...this.listEl.querySelectorAll(itemSelector)];
    if (this.items.length === 0) return;

    this.currentPage = 1;
    this.updatePerPage(perPage);
  }

  updatePerPage(val) {
    this.perPage = (val === 'all') ? this.items.length : parseInt(val, 10);
    this.update();
  }

  update() {
    this.listEl.querySelectorAll('tr').forEach(el => {
      el.style.display = '';
    });

    this.items = [...this.listEl.querySelectorAll('tr')]
      .filter(el => el.style.display !== 'none');

    this.pageCnt = Math.max(Math.ceil(this.items.length / this.perPage), 1);
    this._buildUI();
    this._showPage(Math.min(this.currentPage, this.pageCnt));
  }

  _buildUI() {
    this.pagerEl.innerHTML = '';
    this.prevBtn = this._btn('prevBtn', '&laquo;');
    this.pagerEl.appendChild(this.prevBtn);

    this.pageBtns = [];

    for (let i = 1; i <= this.pageCnt; i++) {
      const r = document.createElement('input');
      r.type = 'radio'; r.name = 'page'; r.id = `page${i}`;
      if (i === this.currentPage) r.checked = true;

      const lb = document.createElement('label');
      lb.htmlFor = r.id; lb.textContent = i;

      this.pageBtns.push({ input: r, label: lb });
      this.pagerEl.append(r, lb);
    }

    this.nextBtn = this._btn('nextBtn', '&raquo;');
    this.pagerEl.appendChild(this.nextBtn);

    this.pagerEl.onchange = e => {
      if (e.target.name === 'page') {
        const selected = parseInt(e.target.id.replace('page', ''), 10);
        this._showPage(selected);
      }
    };

    this.prevBtn.onclick = () => this._move(-1);
    this.nextBtn.onclick = () => this._move(1);

    this.pagerEl.style.display = (this.pageCnt <= 1) ? 'none' : 'flex';
    this._updateArrowDisplay();
  }

  _showPage(p) {
    this.currentPage = p;

    const s = (p - 1) * this.perPage, e = s + this.perPage;
    this.items.forEach((el, i) => {
      el.style.display = (i >= s && i < e) ? '' : 'none';
    });

    this.pageBtns.forEach(({ input }) => input.checked = false);
    const input = this.pagerEl.querySelector(`#page${p}`);
    if (input) input.checked = true;

    this._updateArrows();
    this._updateArrowDisplay();
  }

  _move(d) {
    const target = this.currentPage + d;
    if (target < 1 || target > this.pageCnt) return;
    this._showPage(target);
  }

  _current() {
    return this.currentPage;
  }

  _updateArrows() {
    const p = this.currentPage;
    this.prevBtn.classList.toggle('disabled', p === 1);
    this.nextBtn.classList.toggle('disabled', p === this.pageCnt);
  }

  _updateArrowDisplay() {
    const current = this.currentPage;
    const pageCount = this.pageCnt;
    const maxVisible = this.maxVisiblePages;

    const edgeCount = 2;
    const middleCount = maxVisible;

    let start = current - Math.floor(middleCount / 2);
    let end = current + Math.floor(middleCount / 2);

    if (start < 2) {
      start = 2;
      end = start + middleCount - 1;
    }
    if (end > pageCount - 1) {
      end = pageCount - 1;
      start = end - middleCount + 1;
    }

    start = Math.max(2, start);
    end = Math.min(pageCount - 1, end);

    this.pageBtns.forEach(({ input, label }, i) => {
      const page = i + 1;
      const isEdge = page === 1 || page === pageCount;
      const isVisible = isEdge || (page >= start && page <= end);
      label.style.display = isVisible ? '' : 'none';
    });

    this._addEllipses(start, end);
  }

  _addEllipses(start, end) {
    this.pagerEl.querySelectorAll('.ellipsis').forEach(el => el.remove());

    const insertEllipsis = (afterInput) => {
      const span = document.createElement('span');
      span.className = 'ellipsis';
      span.textContent = '...';
      this.pagerEl.insertBefore(span, afterInput);
    };

    if (start > 2) {
      const el = this.pageBtns[start - 2];
      if (el) insertEllipsis(el.input);
    }
    if (end < this.pageCnt - 1) {
      const el = this.pageBtns[end];
      if (el) insertEllipsis(el.input);
    }
  }

  _btn(id, html) {
    const b = document.createElement('button');
    b.id = id;
    b.innerHTML = html;
    return b;
  }
}

(function waitForRecordPagerReady() {
  const tableEl = document.querySelector('#table tbody');
  const pagerEl = document.querySelector('#pagination');

  if (tableEl && pagerEl) {
    const pager = new Pagination3({
      listSelector : '#table tbody',
      itemSelector : 'tr',
      pagerSelector: '#pagination',
      perPage      : 'all'
    });

    // 下拉變更每頁筆數
    document.querySelectorAll('.select_num, .mywallet-select__sel')
      .forEach(sel => sel.addEventListener('change', () => {
            console.log("有反應篩炫氣");
        pager.updatePerPage(sel.value);
        if (pager.update) pager.update();
      }));

    // 如果需要觀察 DOM 新增/刪除自動更新
    const observer = new MutationObserver(() => {
      if (pager.update) pager.update();
    });
    observer.observe(tableEl, { childList: true });

  } else {
    setTimeout(waitForRecordPagerReady, 300); // Retry until ready
  }
})();