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

/* ---------- 單一 DOMContentLoaded ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const pager = new Pagination({
    listSelector : '.mywallet-list',
    itemSelector : '.mywallet-list__item',
    pagerSelector: '#pagination',
    perPage      : 'all'
  });

  if (pager && pager.updatePerPage) {
    // 筆數與類型變更
    document.querySelectorAll('.select_num, .mywallet-select__sel')
      .forEach(sel => sel.addEventListener('change', () => {
        pager.updatePerPage(sel.value);
        pager.update();
      }));

    // 日期快捷按鈕
    document.querySelectorAll('.btn-tab__item').forEach(item => {
      item.addEventListener('click', () => {
        const input = document.getElementById('search-range');
        if (input) input.value = item.dataset.range;
        pager.update();
      });
    });

    // 日期欄位選擇器變更（補上這個 ✅）
    const rangeInput = document.getElementById('search-range');
    if (rangeInput) {
      rangeInput.addEventListener('input', () => pager.update());
    }
  }
});


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
document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.querySelector('.record-list');
  const pagerEl = document.querySelector('#pagination2');
  let pager = null;

  if (listEl && pagerEl) {
    // 建立分頁
    pager = new Pagination2({
      listSelector : '.record-list',
      itemSelector : '.record-list__item',
      pagerSelector: '#pagination2',
      perPage      : 'all'
    });

    // 監聽筆數選單
    document.querySelectorAll('.select_num, .mywallet-select__sel')
      .forEach(sel => sel.addEventListener('change', () => {
        pager.updatePerPage(sel.value);
        handleFilterChange(); // ✅ 每次變更條件時觸發篩選
      }));
  }

  // 監聽快速日期按鈕
  document.querySelectorAll('.btn-tab__item').forEach(item => {
    item.addEventListener('click', () => {
      const input = document.getElementById('search-range');
      if (input) input.value = item.dataset.range;
      handleFilterChange(); // ✅ 點選時也觸發篩選
    });
  });

  // ✅ 統一的觸發點（你可以在這裡做過濾 / 重新請求 / 重設分頁）
  function handleFilterChange() {
    const type = document.getElementById('search-type')?.value;
    const status = document.getElementById('search-status')?.value;
    const range = document.getElementById('search-range')?.value;

    console.log('🔍 條件變更：', { type, status, range });

    // 這裡你可以依條件過濾 DOM 或重新撈資料
    // 假設你有篩選邏輯，資料變更後可以呼叫 pager.update()
    if (pager) pager.update();
  }
});
