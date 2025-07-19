$(function () {
  $(".layout-tabbar").load("./component/footer.html");
});


window.rotate = () => {
  var t = document.getElementById('refresh');
  t.classList.add('refresh--active');
  setTimeout(function () {
    t.classList.remove('refresh--active');
  }, 3000);
};
window.iconrotate = () => {
  var t = document.getElementById('iconrefresh');
  t.classList.add('icon-refresh--active');
  setTimeout(function () {
    t.classList.remove('icon-refresh--active');
  }, 400);
};

window.toast = () => {
  var yourUl = document.getElementById('toast');
  yourUl.style.display = yourUl.style.display === 'none' ? '' : 'none';
  setTimeout(function () {
    yourUl.style.display = 'none';
  }, 1000);
};
// window.addEventListener('load', function () {
//   window.innerWidth < 576 && investmentListShow()
//   window.innerWidth > 576 && investmentListHide()
//   window.addEventListener('resize', function () {
//     console.log(window.innerWidth)
//     window.innerWidth < 576 && investmentListShow()
//     window.innerWidth > 576 && investmentListHide()
//   })
// })

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

  // 確保有成功建立 pager 才監聽 select（防止 undefined）
  if (pager && pager.updatePerPage) {
    document.querySelectorAll('.select_num, .mywallet-select__sel')
      .forEach(sel => sel.addEventListener('change', () => pager.updatePerPage(sel.value)));
  }
});


// 交易紀錄統計數額
/* ===== 只統計「金额」欄位的數值 ===== */
function updateMoneySum() {
  const moneyBox = document.querySelector('.mywallet-money');
  const listBox  = document.querySelector('.mywallet-list');
  if (!moneyBox || !listBox) return;

  let total = 0;

  listBox.querySelectorAll('.mywallet-list__item').forEach(item => {
    item.querySelectorAll('.list__text').forEach(li => {
      const title = li.querySelector('.list__text__title')?.textContent.trim();
      if (title?.includes('金额')) {
        const result = li.querySelector('.list__text__result')?.textContent.trim() || '';
        const num = parseFloat(result.replace(/[, ]/g, ''));
        if (!isNaN(num)) total += num;
      }
    });
  });

  moneyBox.textContent = `加总金额：${total.toLocaleString()}`;
}
/* ===== 頁面載入時立即結算一次 ===== */
document.addEventListener('DOMContentLoaded', () => {
  // 第一次跑
  updateMoneySum();

  // 預防載入中插入資料 → 延遲補跑一次
  setTimeout(updateMoneySum, 200);
});

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
/* ---------- 單一 DOMContentLoaded ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.querySelector('.record-list');
  const pagerEl = document.querySelector('#pagination2');

  if (listEl && pagerEl) {
    /* 1. 建立分頁：預設顯示全部 */
    const pager = new Pagination2({
      listSelector : '.record-list',
      itemSelector : '.record-list__item',
      pagerSelector: '#pagination2',
      perPage      : 'all'
    });

    /* 2. 監聽所有可調筆數的 <select> */
    document.querySelectorAll('.select_num, .mywallet-select__sel')
      .forEach(sel => sel.addEventListener('change', () => pager.updatePerPage(sel.value)));
  } else {
    // console.warn('Pagination2 初始化失敗：找不到 .record-list 或 #pagination2');
  }
});


// 充值紀錄統計金額
// 加總 .record-money 的數值，顯示到 .myrecord-money
function updateMyRecordMoney() {
  const moneyBox = document.querySelector('.myrecord-money'); // 顯示總額的區塊
  if (!moneyBox) return;

  let total = 0;

  // 統計所有 .record-money 元素的內容數字
  document.querySelectorAll('.record-money').forEach(el => {
    const numStr = el.textContent || '';
    const num = parseFloat(numStr.replace(/[, ]/g, '')); // 去除逗號與空格
    if (!isNaN(num)) total += num;
  });

  // 顯示加總結果
  moneyBox.textContent = `加总金额：${total.toLocaleString()}`;
}

// 頁面載入完成時執行
document.addEventListener('DOMContentLoaded', updateMyRecordMoney);


// 首頁
// 控制index的條列通知
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.bulletin__item').forEach(item => {
    item.addEventListener('click', () => {
      const content = item.querySelector('.bulletin__content');
      content.classList.toggle('bulletin-heightauto');
      console.log('clicked and toggled class');
    });
  });
});