// Простая блокировка scrollIntoView для input полей
(function() {
  const originalScrollIntoView = Element.prototype.scrollIntoView;
  
  Element.prototype.scrollIntoView = function(arg) {
    // Блокируем скролл для input элементов
    if (this.tagName === 'INPUT') {
      return;
    }
    return originalScrollIntoView.call(this, arg);
  };
})(); 