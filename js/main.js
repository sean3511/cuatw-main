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


// ===== 交易紀錄統計數額（只統計「金额」欄位） =====
function updateMoneySum() {
  console.log('🚀 有成功執行');

  const moneyBox = document.querySelector('.mywallet-money');
  const listBox  = document.querySelector('.mywallet-list');
  if (!moneyBox || !listBox) return;

  let total = 0;

  // ⬇️ 遍歷所有交易項目
  listBox.querySelectorAll('.mywallet-list__item').forEach(item => {
    const results = item.querySelectorAll('.list__text__result');
    if (results.length >= 2) {
      const value = results[1].textContent.trim().replace(/[, ]/g, '');
      const num = parseFloat(value);
      if (!isNaN(num)) {
        total += num;
        console.log('✅ 加總這筆金額:', num);
      }
    }
  });

  console.log(`💰 總金額加總：${total}`);
  moneyBox.textContent = `加总金额：${total.toLocaleString()}`;
}

// ===== 直接執行，不等 DOMContentLoaded =====
(function waitForTarget() {
  const listEl = document.querySelector('.mywallet-list');
  const moneyEl = document.querySelector('.mywallet-money');
  const rangeEl = document.getElementById('search-range');
  const typeEl = document.getElementById('search-type');

  if (listEl && moneyEl) {
    // 初始跑
    updateMoneySum();
    setTimeout(updateMoneySum, 300); // 延遲補一刀

    // 監聽列表變化
    const observer = new MutationObserver(() => {
      // console.log('🔄 DOM 變更觸發更新');
      updateMoneySum();
    });
    observer.observe(listEl, { childList: true, subtree: false });

    // 監聽快速日期點擊
    document.querySelectorAll('.btn-tab__item').forEach(btn => {
      btn.addEventListener('click', () => {
        // console.log('📅 快速日期被點擊');
        setTimeout(updateMoneySum, 500);
      });
    });

    // 監聽類型篩選
    if (typeEl) {
      typeEl.addEventListener('change', () => {
        // console.log('📂 類型篩選改變');
        setTimeout(updateMoneySum, 500);
      });
    }

    // 監聽日期輸入欄變更（非 flatpickr 事件）
    if (rangeEl) {
      let lastVal = rangeEl.value;
      setInterval(() => {
        const nowVal = rangeEl.value;
        if (nowVal !== lastVal) {
          lastVal = nowVal;
          // console.log('📆 search-range 變動:', nowVal);
          updateMoneySum();
        }
      }, 500); // 還是保留觀察欄位文字是否變動（不算每秒跑邏輯，只針對日期）
    }

  } else {
    setTimeout(waitForTarget, 300);
  }
})();

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


// 充值紀錄統計金額
// ===== 充值紀錄統計金額 =====
function updateMyRecordMoney() {
  console.log('🚀 [updateMyRecordMoney] 執行中');

  const moneyBox = document.querySelector('.myrecord-money');
  const listBox  = document.querySelector('.record-list');
  if (!moneyBox || !listBox) return;

  let total = 0;

  listBox.querySelectorAll('.record-money').forEach(el => {
    const numStr = el.textContent.trim().replace(/[, ]/g, '');
    const num = parseFloat(numStr);
    if (!isNaN(num)) {
      total += num;
      console.log('✅ 加總這筆金額:', num);
    }
  });

  console.log(`💰 總金額加總：${total}`);
  moneyBox.textContent = `加总金额：${total.toLocaleString()}`;
}

// ===== 啟動定時器，每 3 秒更新一次金額 =====
(function waitForMyRecordReady() {
  const listEl  = document.querySelector('.record-list');
  const moneyEl = document.querySelector('.myrecord-money');
  const rangeEl = document.getElementById('search-range');
  const typeEl  = document.getElementById('search-type');

  if (listEl && moneyEl) {
    updateMyRecordMoney();
    setTimeout(updateMyRecordMoney, 300); // 延遲補一刀

    // 監聽列表變化
    const observer = new MutationObserver(() => {
      console.log('🔄 [MutationObserver] 列表變更');
      updateMyRecordMoney();
    });
    observer.observe(listEl, { childList: true, subtree: false });

    // 監聽快速日期按鈕
    document.querySelectorAll('.btn-tab__item').forEach(btn => {
      btn.addEventListener('click', () => {
        console.log('📅 快速日期點擊');
        setTimeout(updateMyRecordMoney, 500);
      });
    });

    // 監聽 select 類型改變
    if (typeEl) {
      typeEl.addEventListener('change', () => {
        console.log('📂 類型下拉選單變更');
        setTimeout(updateMyRecordMoney, 500);
      });
    }

    // 監聽日期欄變動（非 flatpickr）
    if (rangeEl) {
      let lastVal = rangeEl.value;
      setInterval(() => {
        const nowVal = rangeEl.value;
        if (nowVal !== lastVal) {
          lastVal = nowVal;
          console.log('📆 日期輸入框變更:', nowVal);
          updateMyRecordMoney();
        }
      }, 500);
    }

  } else {
    setTimeout(waitForMyRecordReady, 300);
  }
})();


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