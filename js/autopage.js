// 交易紀錄分頁
/* ---------- Pagination 類 ---------- */
class Pagination {
  constructor({ listSelector, itemSelector, pagerSelector, perPage = 'all' }) {
    this.listEl  = document.querySelector(listSelector);
    this.pagerEl = document.querySelector(pagerSelector);

    // ✅ 先確認 DOM 元素存在
    if (!this.listEl || !this.pagerEl) return;

    this.items   = [...this.listEl.querySelectorAll(itemSelector)];

    // ✅ 如果找不到任何項目也不初始化
    if (this.items.length === 0) return;

    this.updatePerPage(perPage); // 初始化
  }

  /* 更新每頁筆數 (val 可為 'all' 或數字字串) */
  updatePerPage(val) {
    this.perPage = (val === 'all') ? this.items.length : parseInt(val, 10);
    this.pageCnt = Math.max(Math.ceil(this.items.length / this.perPage), 1);
    this._buildUI();
    this._showPage(1);
  }

  /* 建立分頁 UI */
  _buildUI() {
    this.pagerEl.innerHTML = '';
    this.prevBtn = this._btn('prevBtn', '&laquo;');
    // 先隱藏
    this.prevBtn.style.display = 'none'; 
    this.pagerEl.appendChild(this.prevBtn);

    for (let i = 1; i <= this.pageCnt; i++) {
      const r = document.createElement('input');
      r.type = 'radio'; r.name = 'page'; r.id = `page${i}`;
      if (i === 1) r.checked = true;
      const lb = document.createElement('label');
      lb.htmlFor = r.id; lb.textContent = i;
      this.pagerEl.append(r, lb);
    }

    this.nextBtn = this._btn('nextBtn', '&raquo;');
    // 先隱藏
    this.nextBtn.style.display = 'none';
    this.pagerEl.appendChild(this.nextBtn);

    this.pagerEl.onchange = e => e.target.name === 'page' && this._showPage(this._current());
    this.prevBtn.onclick  = () => this._move(-1);
    this.nextBtn.onclick  = () => this._move(1);

    /* 只有 1 頁就隱藏整列 */
    this.pagerEl.style.display = (this.pageCnt <= 1) ? 'none' : 'flex';
  }

  _showPage(p) {
    const s = (p - 1) * this.perPage, e = s + this.perPage;
    this.items.forEach((el, i) => {
      el.style.display = (i >= s && i < e) ? '' : 'none';
    });
    this._updateArrows();
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

  _btn(id, html) {
    const b = document.createElement('button');
    b.id = id;
    b.innerHTML = html;
    return b;
  }
}

(function waitForPagerReady() {
  const listEl  = document.querySelector('.mywallet-list');
  const pagerEl = document.querySelector('#pagination');

  if (listEl && pagerEl) {
    const pager = new Pagination({
      listSelector : '.mywallet-list',
      itemSelector : '.mywallet-list__item',
      pagerSelector: '#pagination',
      perPage      : 'all'
    });

    // 監聽筆數與類型選單變更
    document.querySelectorAll('.select_num, .mywallet-select__sel')
      .forEach(sel => sel.addEventListener('change', () => {
        pager.updatePerPage(sel.value);
        pager.update();
      }));

    // 監聽快捷日期按鈕
    document.querySelectorAll('.btn-tab__item').forEach(item => {
      item.addEventListener('click', () => pager.update());
    });

    // 監聽列表內容變更，自動更新分頁
    const observer = new MutationObserver(() => {
      // console.log('🔄 DOM 變更觸發更新');
      pager.update();
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
  constructor({ listSelector, itemSelector, pagerSelector, perPage = 'all' }) {
    this.listEl  = document.querySelector(listSelector);
    this.items   = [...this.listEl.querySelectorAll(itemSelector)];
    this.pagerEl = document.querySelector(pagerSelector);
    if (!this.listEl || !this.pagerEl || this.items.length === 0) return;
    this.updatePerPage(perPage);        // 初始化
  }

  /* 更新每頁筆數 (val 可為 'all' 或數字字串) */
  updatePerPage(val) {
    this.perPage = (val === 'all') ? this.items.length : parseInt(val, 10);
    this.pageCnt = Math.max(Math.ceil(this.items.length / this.perPage), 1);
    this._buildUI();
    this._showPage(1);
  }

  /* 建立分頁 UI */
  _buildUI() {
    this.pagerEl.innerHTML = '';
    this.prevBtn = this._btn('prevBtn', '&laquo;');
    // 先隱藏
    this.prevBtn.style.display = 'none'; 
    this.pagerEl.appendChild(this.prevBtn);

    for (let i = 1; i <= this.pageCnt; i++) {
      const r = document.createElement('input');
      r.type = 'radio'; r.name = 'page'; r.id = `page${i}`;
      if (i === 1) r.checked = true;
      const lb = document.createElement('label');
      lb.htmlFor = r.id; lb.textContent = i;
      this.pagerEl.append(r, lb);
    }

    this.nextBtn = this._btn('nextBtn', '&raquo;');
        // 先隱藏
    this.nextBtn.style.display = 'none';
    this.pagerEl.appendChild(this.nextBtn);

    this.pagerEl.onchange = e => e.target.name === 'page' && this._showPage(this._current());
    this.prevBtn.onclick  = () => this._move(-1);
    this.nextBtn.onclick  = () => this._move(1);

    /* 只有 1 頁就隱藏整列 */
    this.pagerEl.style.display = (this.pageCnt <= 1) ? 'none' : 'flex';
  }

  _showPage(p) {
    const s = (p - 1) * this.perPage, e = s + this.perPage;
    this.items.forEach((el, i) => el.style.display = (i >= s && i < e) ? '' : 'none');
    this._updateArrows();
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
  _btn(id, html) {
    const b = document.createElement('button');
    b.id = id; b.innerHTML = html;
    return b;
  }
}
(function waitForRecordPagerReady() {
  const listEl  = document.querySelector('.record-list');
  const pagerEl = document.querySelector('#pagination2');

  if (listEl && pagerEl) {
    const pager = new Pagination2({
      listSelector : '.record-list',
      itemSelector : '.record-list__item',
      pagerSelector: '#pagination2',
      perPage      : 'all'
    });

    // 監聽筆數選單變更
    document.querySelectorAll('.select_num, .mywallet-select__sel')
      .forEach(sel => sel.addEventListener('change', () => {
        pager.updatePerPage(sel.value);
        pager.update();
      }));

    // 快速日期按鈕觸發更新
    document.querySelectorAll('.btn-tab__item').forEach(item => {
      item.addEventListener('click', () => pager.update());
    });

    // 監聽 .record-list DOM 子元素變化，自動更新分頁
    const observer = new MutationObserver(() => {
      pager.update();
    });
    observer.observe(listEl, { childList: true, subtree: false });

  } else {
    setTimeout(waitForRecordPagerReady, 300);
  }
})();
