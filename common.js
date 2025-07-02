// common.js
import { attachSidebarEventListeners } from './sidebar.js';

let translations = {};
let currentLanguage = localStorage.getItem('preferredLanguage') || 'en';

/**
 * Loads translation data from translations.json.
 * @returns {Promise<void>} A promise that resolves when translations are loaded.
 */
export async function loadTranslations() {
    try {
        const response = await fetch('/translations.json'); // 使用绝对路径确保在任何子目录都能找到
        if (!response.ok) {
            throw new Error(`Failed to load translations: ${response.status} (${response.statusText})`);
        }
        translations = await response.json();
        console.log("Translations loaded successfully.");
    } catch (error) {
        console.error("Error loading translations:", error);
    }
}

/**
 * Applies translations to elements with data-i18n attributes.
 * Also updates page title and HTML lang attribute.
 * @param {string} lang - The language code to apply.
 */
export function setLanguage(lang) {
    currentLanguage = lang;
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        } else {
            console.warn(`Missing translation for key: '${key}' in language: '${lang}'.`);
        }
    });
    if (translations[lang] && translations[lang].pageTitle) {
        document.title = translations[lang].pageTitle;
    }
    document.documentElement.lang = lang;
    localStorage.setItem('preferredLanguage', lang);
}

/**
 * Loads the sidebar HTML and attaches event listeners.
 * Also handles highlighting the current page's link.
 * @param {Function} setLanguageFunc - The setLanguage function from the main script.
 * @param {string} currentLang - The current language code.
 */
export async function loadSidebarAndHighlight(setLanguageFunc, currentLang) {
    const leftPanel = document.getElementById('left-panel');
    const sidebarLoadStatus = document.getElementById('sidebar-load-status'); // 如果有这个元素

    if (!leftPanel) {
        console.error("Left panel not found. Cannot load sidebar.");
        return;
    }

    try {
        if (sidebarLoadStatus) {
            sidebarLoadStatus.textContent = 'Loading navigation...';
            sidebarLoadStatus.style.color = 'blue';
        }

        const response = await fetch('/sidebar.html'); // 使用绝对路径
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} (${response.statusText})`);
        }
        const sidebarHtml = await response.text();
        leftPanel.innerHTML = sidebarHtml;

        if (sidebarLoadStatus) {
            sidebarLoadStatus.textContent = ''; // Clear status
        }
        
        // 应用翻译
        setLanguageFunc(currentLang);

        // 附加侧边栏事件监听器
        attachSidebarEventListeners(setLanguageFunc, currentLang); // 注意：sidebar.js 内部会再次调用 setLanguageFunc

        // 高亮当前页面链接
        highlightCurrentLink();

    } catch (error) {
        console.error("Error loading sidebar:", error);
        if (sidebarLoadStatus) {
            sidebarLoadStatus.textContent = `Error loading navigation. Please try again. Details: ${error.message}`;
            sidebarLoadStatus.style.color = 'red';
        }
    }
}


export function highlightCurrentLink() { // 导出此函数
    const currentPath = window.location.pathname; // 获取当前页面的路径，例如 /converters/length.html
    const sidebarLinks = document.querySelectorAll('#left-panel a');

    if(currentPath.includes("index.html") || currentPath == "/")
        return;
    
    var tag_currentPath = currentPath;
    if(!currentPath.includes(".html"))
        tag_currentPath = currentPath + ".html";

    alert(tag_currentPath);
        
    sidebarLinks.forEach(link => {
        const linkHref = link.getAttribute('href'); // 获取链接的 href 属性，例如 converters/length.html

        // 构建完整的链接 URL，以便与 currentPath 比较
        // 假设所有链接都是相对路径，且与当前页面在同一级别或子级别
        // 确保比较的是绝对路径或相对于网站根目录的路径
        const absoluteLinkHref = new URL(linkHref, window.location.origin).pathname;   

        if (absoluteLinkHref == tag_currentPath) {
            link.style.backgroundColor = '#d0d0d0'; // 设置高亮背景色
            // 可选：展开其父类别
            let parentCategoryContent = link.closest('.category-content');
            if (parentCategoryContent) {
                parentCategoryContent.classList.add('active');
                let parentCategoryTitle = parentCategoryContent.previousElementSibling;
                if (parentCategoryTitle && parentCategoryTitle.classList.contains('category-title')) {
                    parentCategoryTitle.classList.add('active');
                }
            }
        } else {
            link.style.backgroundColor = ''; // 移除其他链接的高亮
        }
    });
}

// 导出 loadTranslations 和 setLanguage，以便主页面和内容页面都可以使用
export { translations, currentLanguage}; // 也可以导出这些变量