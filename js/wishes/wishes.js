(function () {
  "use strict";

  function createWishesSection() {
    const wishesSection = document.querySelector('#wishes-section');
    if (!wishesSection) {
      console.error('無法找到 #wishes-section 元素');
      return;
    }

    const wishesContainer = wishesSection.querySelector('#wishes-container');
    const prevBtn = wishesSection.querySelector('.prev-btn');
    const nextBtn = wishesSection.querySelector('.next-btn');

    if (!wishesContainer) {
      console.error('無法找到 #wishes-container 元素');
      return;
    }

    let currentIndex = 0;
    let wishes = [];

    function loadWishes() {
      fetch("https://script.google.com/macros/s/AKfycbxG8HjX2ZT4syWYT3Yu4U2tnY8TwJVIpndh8j6mQbO4ECxVh6Ryb6iv8g6LJOxhEFzP4Q/exec")
        .then(response => response.json())
        .then(data => {
          if (data.result !== "success") {
            console.error('API 返回錯誤結果');
            return;
          }
          wishes = data.data;
          renderWish();
          setupNavigation();
        })
        .catch(error => console.error('加載祝福時出錯:', error));
    }

    function renderWish() {
      const wish = wishes[currentIndex];
      wishesContainer.innerHTML = `
        <div class="w-100 px-3">
          <div class="bg-white p-4 rounded shadow-sm text-center animate__animated animate__fadeIn">
            <p class="mb-3">"${wish.message}"</p>
            <p class="fw-bold mb-0">- ${wish.name}</p>
          </div>
        </div>
      `;
    }

    function nextWish() {
      currentIndex = (currentIndex + 1) % wishes.length;
      renderWish();
    }

    function prevWish() {
      currentIndex = (currentIndex - 1 + wishes.length) % wishes.length;
      renderWish();
    }

    function setupNavigation() {
      if (prevBtn) {
        prevBtn.addEventListener('click', prevWish);
      } else {
        console.warn('無法找到 .prev-btn 元素');
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', nextWish);
      } else {
        console.warn('無法找到 .next-btn 元素');
      }
    }

    loadWishes();
  }

  document.addEventListener('DOMContentLoaded', createWishesSection);
})();