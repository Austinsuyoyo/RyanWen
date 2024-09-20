(function () {
  "use strict";

  function createTextSlider() {
    const sliderContainer = document.querySelector('.text-slider-container');
    const slider = document.querySelector('.text-slider');
    const prevBtn = sliderContainer.querySelector('.prev');
    const nextBtn = sliderContainer.querySelector('.next');
    let slideWidth = 0;
    let currentPosition = 0;
    let maxPosition = 0;
  
    function loadWishes() {
      fetch("https://script.google.com/macros/s/AKfycbx0H9RgZFrByeEnLCIIEvfEllWGxWwluEj6b9KWT-hOdqBbcxxwutgE7XJkMuFIbFm4Og/exec")
        .then(response => response.json())
        .then(data => {
          if (data.result !== "success") return;
          
          data.data.forEach(wish => {
            const wishCard = document.createElement('div');
            wishCard.className = 'wish-card';
            wishCard.innerHTML = `
            <div class="card-body">
              <h5 class="wish-name">${truncateName(wish.name)}</h5>
              <p class="wish-message">${wish.message}</p>
              <a href="#" class="read-more" style="display: none;">閱讀更多</a>
              </div>
            `;
            slider.appendChild(wishCard);
          });
  
          initializeSlider();
          addReadMoreListeners();
        })
        .catch(error => console.error('Error:', error));
    }

    function truncateName(name, maxLength = 10) {
      return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
    }

    function initializeSlider() {
      const cards = slider.querySelectorAll('.wish-card');
      slideWidth = cards[0].offsetWidth;
      maxPosition = -(cards.length - 3) * slideWidth;  // Assuming 3 cards visible at a time
  
      equalizeCardHeights();
      updateSliderPosition();
    }

    function equalizeCardHeights() {
      const cards = slider.querySelectorAll('.wish-card');
      let maxHeight = 0;
      cards.forEach(card => {
        card.style.height = 'auto';
        maxHeight = Math.max(maxHeight, card.offsetHeight);
      });
      cards.forEach(card => card.style.height = `${maxHeight}px`);
    }

    function updateSliderPosition() {
      slider.style.transform = `translateX(${currentPosition}px)`;
    }

    function slideNext() {
      currentPosition = Math.max(currentPosition - slideWidth, maxPosition);
      updateSliderPosition();
    }

    function slidePrev() {
      currentPosition = Math.min(currentPosition + slideWidth, 0);
      updateSliderPosition();
    }

    function addReadMoreListeners() {
      const cards = slider.querySelectorAll('.wish-card');
      cards.forEach(card => {
        const message = card.querySelector('.wish-message');
        const readMoreLink = card.querySelector('.read-more');
        
        // 創建一個臨時元素來測量文本高度
        const tempElement = document.createElement('div');
        tempElement.style.visibility = 'hidden';
        tempElement.style.position = 'absolute';
        tempElement.style.width = message.offsetWidth + 'px';
        tempElement.style.fontSize = window.getComputedStyle(message).fontSize;
        tempElement.style.lineHeight = window.getComputedStyle(message).lineHeight;
        tempElement.innerHTML = message.innerHTML;
        document.body.appendChild(tempElement);
  
        // 檢查文字是否超過三行
        const lineHeight = parseInt(window.getComputedStyle(message).lineHeight);
        const threeLineHeight = lineHeight * 2;
        
        if (tempElement.offsetHeight > threeLineHeight) {
          readMoreLink.style.display = 'inline-block';
          message.style.maxHeight = threeLineHeight + 'px';
          message.style.overflow = 'hidden';
        }
        
        // // 添加檢查線
        // const checkLine = document.createElement('div');
        // checkLine.className = 'check-line';
        // checkLine.style.top = threeLineHeight + 'px';
        // message.appendChild(checkLine);
  
        document.body.removeChild(tempElement);
  
        readMoreLink.addEventListener('click', function(e) {
          e.preventDefault();
          if (this.textContent === '閱讀更多') {
            message.style.maxHeight = 'none';
            message.style.overflow = 'visible';
            this.textContent = '收起';
          } else {
            message.style.maxHeight = threeLineHeight + 'px';
            message.style.overflow = 'hidden';
            this.textContent = '閱讀更多';
          }
          equalizeCardHeights();
        });
      });
    }

    nextBtn.addEventListener('click', slideNext);
    prevBtn.addEventListener('click', slidePrev);
    window.addEventListener('resize', initializeSlider);

    loadWishes(); 
  }
  
  document.addEventListener('DOMContentLoaded', createTextSlider);
})();