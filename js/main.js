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
  /* 1. 建立分頁：預設顯示全部 */
  const pager = new Pagination({
    listSelector : '.mywallet-list',
    itemSelector : '.mywallet-list__item',
    pagerSelector: '#pagination',
    perPage      : 'all'
  });

  /* 2. 監聽所有可調筆數的 <select> */
  document.querySelectorAll('.select_num, .mywallet-select__sel')
    .forEach(sel => sel.addEventListener('change', () => pager.updatePerPage(sel.value)));

  /* 3. 即時列印項目總數（可刪） */
  // const list = document.querySelector('.mywallet-list');
  // if (list) {
  //   const logCnt = () =>
  //     console.log('mywallet-list__item total:', list.querySelectorAll('.mywallet-list__item').length);
  //   logCnt();
  //   new MutationObserver(logCnt).observe(list, { childList: true });
  // }
});

