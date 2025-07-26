/* ==================== PROKOLESA ADMIN CUSTOM JAVASCRIPT ==================== */
/* Кастомные скрипты для админки ProKolesa */

document.addEventListener('DOMContentLoaded', function() {
    console.log('ProKolesa Admin Interface загружен!');
    
    // ==================== УЛУЧШЕНИЯ UX ==================== 
    
    // Добавляем анимации для кнопок
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Создаем ripple эффект
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // ==================== АВТОСОХРАНЕНИЕ ФОРМ ==================== 
    
    // Автосохранение черновиков (для длинных форм)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.type !== 'password' && input.type !== 'submit') {
                // Загружаем сохраненные данные
                const savedValue = localStorage.getItem(`prokolesa_draft_${input.name}`);
                if (savedValue && !input.value) {
                    input.value = savedValue;
                }
                
                // Сохраняем изменения
                input.addEventListener('input', function() {
                    localStorage.setItem(`prokolesa_draft_${this.name}`, this.value);
                });
            }
        });
        
        // Очищаем черновики при успешной отправке
        form.addEventListener('submit', function() {
            inputs.forEach(input => {
                localStorage.removeItem(`prokolesa_draft_${input.name}`);
            });
        });
    });
    
    // ==================== УЛУЧШЕННАЯ НАВИГАЦИЯ ==================== 
    
    // Добавляем активные состояния для навигации
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
    
    // ==================== ПОИСК В РЕАЛЬНОМ ВРЕМЕНИ ==================== 
    
    // Улучшенный поиск с задержкой
    const searchInputs = document.querySelectorAll('input[type="search"], #searchbar');
    searchInputs.forEach(input => {
        let searchTimeout;
        input.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                // Здесь можно добавить AJAX поиск
                console.log('Поиск:', this.value);
            }, 300);
        });
    });
    
    // ==================== УВЕДОМЛЕНИЯ ==================== 
    
    // Автоскрытие уведомлений
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        if (!alert.classList.contains('alert-danger')) {
            setTimeout(() => {
                alert.style.opacity = '0';
                setTimeout(() => {
                    alert.remove();
                }, 300);
            }, 5000);
        }
    });
    
    // ==================== ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ ==================== 
    
    // Улучшенное подтверждение удаления
    const deleteLinks = document.querySelectorAll('a[href*="delete"], .deletelink');
    deleteLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const itemName = this.getAttribute('data-item-name') || 'элемент';
            
            if (confirm(`Вы уверены, что хотите удалить "${itemName}"? Это действие нельзя отменить.`)) {
                window.location.href = this.href;
            }
        });
    });
    
    // ==================== KEYBOARD SHORTCUTS ==================== 
    
    // Горячие клавиши
    document.addEventListener('keydown', function(e) {
        // Ctrl+S для сохранения
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            const saveButton = document.querySelector('input[type="submit"], .btn-primary');
            if (saveButton) {
                saveButton.click();
            }
        }
        
        // Ctrl+N для создания нового элемента
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            const addButton = document.querySelector('.addlink, a[href*="add"]');
            if (addButton) {
                window.location.href = addButton.href;
            }
        }
        
        // Escape для отмены/назад
        if (e.key === 'Escape') {
            const cancelButton = document.querySelector('a[href*="changelist"], .btn-secondary');
            if (cancelButton) {
                window.location.href = cancelButton.href;
            }
        }
    });
    
    // ==================== DRAG & DROP ДЛЯ ФАЙЛОВ ==================== 
    
    // Улучшенная загрузка файлов
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        const wrapper = input.parentElement;
        wrapper.style.position = 'relative';
        
        // Создаем drop zone
        const dropZone = document.createElement('div');
        dropZone.className = 'drop-zone';
        dropZone.innerHTML = `
            <div style="text-align: center; padding: 20px; border: 2px dashed #495057; border-radius: 8px; background: #343a40;">
                <i class="fas fa-cloud-upload-alt" style="font-size: 2rem; color: #F72525; margin-bottom: 10px;"></i>
                <p style="margin: 0; color: white;">Перетащите файлы сюда или нажмите для выбора</p>
            </div>
        `;
        
        // Обработчики drag & drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight(e) {
            dropZone.classList.add('dragover');
        }
        
        function unhighlight(e) {
            dropZone.classList.remove('dragover');
        }
        
        dropZone.addEventListener('drop', handleDrop, false);
        dropZone.addEventListener('click', () => input.click());
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            input.files = files;
            
            // Показываем имена файлов
            if (files.length > 0) {
                const fileNames = Array.from(files).map(file => file.name).join(', ');
                dropZone.querySelector('p').textContent = `Выбрано: ${fileNames}`;
            }
        }
        
        // Вставляем drop zone после input
        input.style.display = 'none';
        input.parentNode.insertBefore(dropZone, input.nextSibling);
    });
    
    // ==================== ПРОГРЕСС БАР ДЛЯ ФОРМ ==================== 
    
    // Показываем прогресс при отправке форм
    const submitButtons = document.querySelectorAll('input[type="submit"], button[type="submit"]');
    submitButtons.forEach(button => {
        button.addEventListener('click', function() {
            const originalText = this.value || this.textContent;
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Сохранение...';
            
            // Возвращаем кнопку в исходное состояние через 30 секунд (если форма не отправилась)
            setTimeout(() => {
                this.disabled = false;
                this.innerHTML = originalText;
            }, 30000);
        });
    });
    
    // ==================== СТАТИСТИКА И АНАЛИТИКА ==================== 
    
    // Отправляем статистику использования (анонимно)
    const startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const sessionTime = Date.now() - startTime;
        console.log(`Сессия в админке: ${Math.round(sessionTime / 1000)} секунд`);
    });
    
    // ==================== КАСТОМНЫЕ СОБЫТИЯ ==================== 
    
    // Создаем кастомное событие для ProKolesa
    const prokolesaEvent = new CustomEvent('prokolesaAdminReady', {
        detail: {
            version: '1.0',
            timestamp: new Date().toISOString()
        }
    });
    
    document.dispatchEvent(prokolesaEvent);
    
    console.log('✅ ProKolesa Admin Interface полностью загружен и настроен!');
});

// ==================== ГЛОБАЛЬНЫЕ ФУНКЦИИ ==================== 

// Функция для показа уведомлений
window.showProkolesaNotification = function(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" aria-label="Close"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Автоудаление через 5 секунд
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    // Удаление по клику
    notification.querySelector('.btn-close').addEventListener('click', () => {
        notification.remove();
    });
};

// Функция для подтверждения действий
window.confirmProkolesaAction = function(message, callback) {
    if (confirm(`ProKolesa: ${message}`)) {
        callback();
    }
};

// CSS для ripple эффекта
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute !important;
        border-radius: 50% !important;
        background: rgba(255, 255, 255, 0.3) !important;
        transform: scale(0) !important;
        animation: ripple-animation 0.6s linear !important;
        pointer-events: none !important;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4) !important;
            opacity: 0 !important;
        }
    }
    
    .drop-zone.dragover {
        border-color: #F72525 !important;
        background-color: rgba(247, 37, 37, 0.1) !important;
    }
`;
document.head.appendChild(rippleStyle); 