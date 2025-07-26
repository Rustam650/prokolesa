/* ==================== PROKOLESA ADMIN CUSTOM JAVASCRIPT (FIXED) ==================== */
/* Исправленная версия без конфликтов с формами выхода */

document.addEventListener('DOMContentLoaded', function() {
    console.log('ProKolesa Admin Interface (Fixed) загружен!');
    
    // ==================== БЕЗОПАСНЫЕ УЛУЧШЕНИЯ UX ==================== 
    
    // Улучшенная навигация (без конфликтов)
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
    
    // ==================== УВЕДОМЛЕНИЯ ==================== 
    
    // Автоскрытие уведомлений (безопасно)
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
    
    // ==================== ПОИСК В РЕАЛЬНОМ ВРЕМЕНИ ==================== 
    
    // Улучшенный поиск с задержкой (безопасно)
    const searchInputs = document.querySelectorAll('input[type="search"], #searchbar');
    searchInputs.forEach(input => {
        let searchTimeout;
        input.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                console.log('Поиск:', this.value);
            }, 300);
        });
    });
    
    // ==================== KEYBOARD SHORTCUTS (БЕЗОПАСНЫЕ) ==================== 
    
    // Только безопасные горячие клавиши
    document.addEventListener('keydown', function(e) {
        // Ctrl+N для создания нового элемента
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            const addButton = document.querySelector('.addlink, a[href*="add"]');
            if (addButton) {
                window.location.href = addButton.href;
            }
        }
        
        // Escape для отмены/назад (только если не в форме)
        if (e.key === 'Escape' && !e.target.matches('input, textarea, select')) {
            const cancelButton = document.querySelector('a[href*="changelist"], .btn-secondary');
            if (cancelButton) {
                window.location.href = cancelButton.href;
            }
        }
    });
    
    // ==================== УЛУЧШЕНИЯ ИНТЕРФЕЙСА ==================== 
    
    // Добавляем подсказки для кнопок
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        if (!button.title && button.textContent.trim()) {
            button.title = button.textContent.trim();
        }
    });
    
    // ==================== ОТЛАДКА ==================== 
    
    // Лог для отслеживания проблем
    console.log('Jazzmin UI инициализирован без конфликтных обработчиков');
    
    // Проверяем наличие проблемных элементов
    const logoutForms = document.querySelectorAll('form[action*="logout"]');
    if (logoutForms.length > 0) {
        console.log('Найдено форм выхода:', logoutForms.length);
        logoutForms.forEach((form, index) => {
            console.log(`Форма выхода ${index + 1}:`, form);
        });
    }
    
    // Проверяем кнопки выхода
    const logoutLinks = document.querySelectorAll('a[href*="logout"]');
    if (logoutLinks.length > 0) {
        console.log('Найдено ссылок выхода:', logoutLinks.length);
        logoutLinks.forEach((link, index) => {
            console.log(`Ссылка выхода ${index + 1}:`, link.href);
        });
    }
});

// ==================== ГЛОБАЛЬНЫЕ ФУНКЦИИ ==================== 

// Функция для безопасной отправки форм
window.safeSubmitForm = function(form) {
    if (form && form.submit) {
        console.log('Отправка формы:', form.action);
        form.submit();
    }
};

// Функция для отладки проблем с выходом
window.debugLogout = function() {
    console.log('=== ОТЛАДКА ВЫХОДА ===');
    console.log('URL:', window.location.href);
    console.log('Cookies:', document.cookie);
    
    const logoutElements = document.querySelectorAll('[href*="logout"], [action*="logout"]');
    console.log('Элементы выхода:', logoutElements);
    
    logoutElements.forEach((el, i) => {
        console.log(`Элемент ${i + 1}:`, {
            tag: el.tagName,
            href: el.href,
            action: el.action,
            text: el.textContent?.trim(),
            onclick: el.onclick
        });
    });
};

// Добавляем функцию отладки в глобальную область
window.addEventListener('load', function() {
    // Добавляем кнопку отладки в консоль
    console.log('Для отладки выхода выполните: debugLogout()');
}); 