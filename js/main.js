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


// ===== 交易紀錄統計數額（只統計「金額」欄位） =====
function updateMoneySum() {

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
        // console.log('✅ 加總這筆金額:', num);
      }
    }
  });

  // console.log(`💰 總金額加總：${total}`);
  moneyBox.textContent = `加總金額：${total.toLocaleString()}`;
}

// ===== 直接執行，不等 DOMContentLoaded =====
(function waitForTarget() {
  const listEl = document.querySelector('.mywallet-list');
  const moneyEl = document.querySelector('.mywallet-money');

  if (listEl && moneyEl) {
    // 初始跑
    updateMoneySum();
    setTimeout(updateMoneySum, 300);

    // 監聽列表變化
    const observer = new MutationObserver(() => {
      // console.log('🔄 DOM 變更觸發更新');
      updateMoneySum();
    });
    observer.observe(listEl, { childList: true, subtree: false });


  } else {
    setTimeout(waitForTarget, 300);
  }
})();


// 充值紀錄統計金額
// ===== 充值紀錄統計金額 =====
function updateMyRecordMoney() {
  // console.log('🚀 [updateMyRecordMoney] 執行中');

  const moneyBox = document.querySelector('.myrecord-money');
  const listBox  = document.querySelector('.record-list');
  if (!moneyBox || !listBox) return;

  let total = 0;

  listBox.querySelectorAll('.record-money').forEach(el => {
    const numStr = el.textContent.trim().replace(/[, ]/g, '');
    const num = parseFloat(numStr);
    if (!isNaN(num)) {
      total += num;
      // console.log('✅ 加總這筆金額:', num);
    }
  });

  // console.log(`💰 總金額加總：${total}`);
  moneyBox.textContent = `加總金額：${total.toLocaleString()}`;
}

// ===== 啟動定時器，每 3 秒更新一次金額 =====
(function waitForMyRecordReady() {
  const listEl  = document.querySelector('.record-list');
  const moneyEl = document.querySelector('.myrecord-money');

  if (listEl && moneyEl) {
    updateMyRecordMoney();
    setTimeout(updateMyRecordMoney, 300); 

    // 監聽列表變化
    const observer = new MutationObserver(() => {
      // console.log('🔄 [MutationObserver] 列表變更');
      updateMyRecordMoney();
    });
    observer.observe(listEl, { childList: true, subtree: false });


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
      // console.log('clicked and toggled class');
    });
  });
});