// google_search.js

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('google-search-input');
    const searchButton = document.getElementById('google-search-button');

    // 搜索功能
    const performGoogleSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
            // 构建 Google 站内搜索 URL
            // site:mytotools.com 限制搜索范围在您的网站内
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)} site:mytotools.com`;
            window.open(searchUrl, '_blank'); // 在新标签页打开搜索结果
        }
    };

    // 绑定点击事件
    if (searchButton) {
        searchButton.addEventListener('click', performGoogleSearch);
    }

    // 绑定回车键事件
    if (searchInput) {
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                performGoogleSearch();
            }
        });
    }
});