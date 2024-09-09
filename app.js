window.onload = function () {
    const apiKey = '0c9cd8d696a74c7ebd18978460d6955e';
    const apiUrl = `https://newsapi.org/v2/everything?q=apple&from=2024-09-08&to=2024-09-08&sortBy=popularity&apiKey=${apiKey}`;

    const newsList = document.getElementById("news-list");
    const searchInput = document.getElementById("search");
    const sortSelect = document.getElementById("sort");
    const pagination = document.getElementById("pagination");
    const articlesPerPage = 6; 
    const articlesPerRow = 3;  
    let articlesData = [];
    let currentPage = 1;

    async function fetchNews() {
        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();
            articlesData = data.articles;

            displayNews(articlesData, currentPage);
        } catch (error) {
            console.error('Error fetching data:', error);
            newsList.innerHTML = `<p>Error fetching data. Please try again later.</p>`;
        }
    }

    function displayNews(articles, page) {
        newsList.innerHTML = "";
        const startIndex = (page - 1) * articlesPerPage;
        const endIndex = Math.min(startIndex + articlesPerPage, articles.length);
        const paginatedArticles = articles.slice(startIndex, endIndex);

        const rows = Math.ceil(paginatedArticles.length / articlesPerRow);
        for (let i = 0; i < rows; i++) {
            const row = document.createElement("div");
            row.className = "news-row";
            const rowArticles = paginatedArticles.slice(i * articlesPerRow, (i + 1) * articlesPerRow);
            
            rowArticles.forEach(article => {
                const articleItem = document.createElement("div");
                articleItem.className = "news-item";
                articleItem.innerHTML = `
                    <img src="${article.urlToImage}" alt="${article.title} cover" class="news-cover">
                    <h3>${article.title}</h3>
                    <p><strong>Author:</strong> ${article.author || "Unknown"}</p>
                    <p><strong>Description:</strong> ${article.description}</p>
                    <p><a href="${article.url}" target="_blank">Read more</a></p>
                `;
                row.appendChild(articleItem);
            });
            
            newsList.appendChild(row);
        }

        updatePaginationControls(articles.length, page);
    }

    function updatePaginationControls(totalArticles, page) {
        const totalPages = Math.ceil(totalArticles / articlesPerPage);
        pagination.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.className = i === page ? "active" : "";
            button.addEventListener("click", () => {
                currentPage = i;
                displayNews(articlesData, currentPage);
            });
            pagination.appendChild(button);
        }
    }
    
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        if (query === "") {
            displayNews(articlesData, currentPage); 
            updatePaginationControls(articlesData.length, currentPage); 
        } else {
            const filteredArticles = articlesData.filter(article =>
                article.title.toLowerCase().includes(query) || (article.description && article.description.toLowerCase().includes(query))
            );
            displayNews(filteredArticles, currentPage);
            updatePaginationControls(filteredArticles.length, currentPage); 
        }
    });
    

    sortSelect.addEventListener("change", () => {
        const sortBy = sortSelect.value;
        const sortedArticles = [...articlesData].sort((a, b) => {
            if (sortBy === "title") {
                return a.title.localeCompare(b.title);
            } else if (sortBy === "date") {
                return new Date(b.publishedAt) - new Date(a.publishedAt);
            }
        });
        displayNews(sortedArticles, currentPage);
    });

    
    fetchNews();
};
