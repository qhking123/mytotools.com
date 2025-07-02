// sidebar.js
export function attachSidebarEventListeners() {
    const categoryTitles = document.querySelectorAll('#left-panel .category-title');

    categoryTitles.forEach(title => {
        title.addEventListener('click', () => {
            const categoryContent = title.nextElementSibling;
            const isActive = categoryContent.classList.contains('active');

            // Collapse other open categories
            document.querySelectorAll('#left-panel .category-content.active').forEach(openContent => {
                if (openContent !== categoryContent) {
                    openContent.classList.remove('active');
                    openContent.previousElementSibling.classList.remove('active');
                }
            });

            // Toggle current category
            if (isActive) {
                categoryContent.classList.remove('active');
                title.classList.remove('active');
            } else {
                categoryContent.classList.add('active');
                title.classList.add('active');
            }
        });
    });

    document.querySelectorAll('#left-panel a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const url = link.dataset.src || link.getAttribute('href'); // 优先使用 data-src，否则使用 href

            if (url) {
                window.location.href = url; // 直接跳转
            }
            // 这里的背景高亮逻辑因为页面跳转会失效，所以移除了
            // 实际高亮由 common.js 中的 highlightCurrentLink 处理
        });
    });
}