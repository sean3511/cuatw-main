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

    this.updatePerPage(perPage);
  }

  updatePerPage(val) {
    this.perPage = (val === 'all') ? this.items.length : parseInt(val, 10);
    this.pageCnt = Math.max(Math.ceil(this.items.length / this.perPage), 1);
    this._buildUI();
    this._showPage(1);
  }

  _buildUI() {
    this.pagerEl.innerHTML = '';
    this.prevBtn = this._btn('prevBtn', '&laquo;');
    this.pagerEl.appendChild(this.prevBtn);

    this.pageBtns = [];

    for (let i = 1; i <= this.pageCnt; i++) {
      const r = document.createElement('input');
      r.type = 'radio'; r.name = 'page'; r.id = `page${i}`;
      if (i === 1) r.checked = true;

      const lb = document.createElement('label');
      lb.htmlFor = r.id; lb.textContent = i;

      this.pageBtns.push({ input: r, label: lb });
      this.pagerEl.append(r, lb);
    }

    this.nextBtn = this._btn('nextBtn', '&raquo;');
    this.pagerEl.appendChild(this.nextBtn);

    this.pagerEl.onchange = e => {
      if (e.target.name === 'page') this._showPage(this._current());
    };
    this.prevBtn.onclick = () => this._move(-1);
    this.nextBtn.onclick = () => this._move(1);

    this.pagerEl.style.display = (this.pageCnt <= 1) ? 'none' : 'flex';
    this._updateArrowDisplay();
  }

  _showPage(p) {
    const s = (p - 1) * this.perPage, e = s + this.perPage;
    this.items.forEach((el, i) => {
      el.style.display = (i >= s && i < e) ? '' : 'none';
    });
    this._updateArrows();
    this._updateArrowDisplay();
  }

  _move(d) {
    const n = this._current() + d;
    if (n < 1 || n > this.pageCnt) return;
    this.pagerEl.querySelector(`#page${n}`).checked = true;
    this._showPage(n);
  }

  _current() {
    return +this.pagerEl.querySelector('input[name="page"]:checked').id.replace('page','');
  }

  _updateArrows() {
    const p = this._current();
    this.prevBtn.classList.toggle('disabled', p === 1);
    this.nextBtn.classList.toggle('disabled', p === this.pageCnt);
  }

  _updateArrowDisplay() {
    const current = this._current();
    const range = Math.floor(this.maxVisiblePages / 2);

    let start = Math.max(current - range, 1);
    let end = start + this.maxVisiblePages - 1;
    if (end > this.pageCnt) {
      end = this.pageCnt;
      start = Math.max(end - this.maxVisiblePages + 1, 1);
    }

    this.pageBtns.forEach(({ input, label }, i) => {
      const page = i + 1;
      const visible = page >= start && page <= end;
      input.style.display = visible ? '' : 'none';
      label.style.display = visible ? '' : 'none';
    });
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
      perPage      : 'all'
    });

    // 如果要根據下拉選單重新設置每頁筆數
    document.querySelectorAll('.select_num, .mywallet-select__sel')
      .forEach(sel => sel.addEventListener('change', () => {
        pager.updatePerPage(sel.value);
        if (pager.update) pager.update();
      }));

    // 若要監控 DOM 增減，更新金額或刷新資料
    const observer = new MutationObserver(() => {
      updateMoneySum(); // 這是你自定義的函式
      if (pager.update) pager.update();
    });

    observer.observe(listEl, { childList: true, subtree: false });

  } else {
    setTimeout(waitForPagerReady, 300); // Retry until DOM ready
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

    this.updatePerPage(perPage);
  }

  updatePerPage(val) {
    this.perPage = (val === 'all') ? this.items.length : parseInt(val, 10);
    this.pageCnt = Math.max(Math.ceil(this.items.length / this.perPage), 1);
    this._buildUI();
    this._showPage(1);
  }

  _buildUI() {
    this.pagerEl.innerHTML = '';
    this.prevBtn = this._btn('prevBtn', '&laquo;');
    this.pagerEl.appendChild(this.prevBtn);

    this.pageBtns = [];

    for (let i = 1; i <= this.pageCnt; i++) {
      const r = document.createElement('input');
      r.type = 'radio';
      r.name = 'page';
      r.id = `page${i}`;
      if (i === 1) r.checked = true;

      const lb = document.createElement('label');
      lb.htmlFor = r.id;
      lb.textContent = i;

      this.pageBtns.push({ input: r, label: lb });
      this.pagerEl.append(r, lb);
    }

    this.nextBtn = this._btn('nextBtn', '&raquo;');
    this.pagerEl.appendChild(this.nextBtn);

    this.pagerEl.onchange = e => {
      if (e.target.name === 'page') this._showPage(this._current());
    };
    this.prevBtn.onclick = () => this._move(-1);
    this.nextBtn.onclick = () => this._move(1);

    this.pagerEl.style.display = (this.pageCnt <= 1) ? 'none' : 'flex';
    this._updateArrowDisplay();
  }

  _showPage(p) {
    const s = (p - 1) * this.perPage;
    const e = s + this.perPage;
    this.items.forEach((el, i) => {
      el.style.display = (i >= s && i < e) ? '' : 'none';
    });
    this._updateArrows();
    this._updateArrowDisplay();
  }

  _move(d) {
    const n = this._current() + d;
    if (n < 1 || n > this.pageCnt) return;
    this.pagerEl.querySelector(`#page${n}`).checked = true;
    this._showPage(n);
  }

  _current() {
    return +this.pagerEl.querySelector('input[name="page"]:checked').id.replace('page', '');
  }

  _updateArrows() {
    const p = this._current();
    this.prevBtn.classList.toggle('disabled', p === 1);
    this.nextBtn.classList.toggle('disabled', p === this.pageCnt);
  }

  _updateArrowDisplay() {
    const current = this._current();
    const range = Math.floor(this.maxVisiblePages / 2);

    let start = Math.max(current - range, 1);
    let end = start + this.maxVisiblePages - 1;
    if (end > this.pageCnt) {
      end = this.pageCnt;
      start = Math.max(end - this.maxVisiblePages + 1, 1);
    }

    this.pageBtns.forEach(({ input, label }, i) => {
      const page = i + 1;
      const visible = page >= start && page <= end;
      input.style.display = visible ? '' : 'none';
      label.style.display = visible ? '' : 'none';
    });
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
