document.addEventListener('DOMContentLoaded', () => {

    // NAVEGAÇÃO SPA (Alternar abas das páginas)
    const menuButtons = document.querySelectorAll('.menu-btn');
    const pages = document.querySelectorAll('.tab-content');

    menuButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            menuButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            const targetId = e.target.getAttribute('data-target');

            pages.forEach(page => {
                page.classList.remove('active-page');
                if (page.id === `page-${targetId}`) {
                    page.classList.add('active-page');
                }
            });
        });
    });

    // ELEMENTOS ORIGINAIS
    const postForm = document.getElementById('post-form');
    const feed = document.getElementById('announcements-feed');
    const toggleContrast = document.getElementById('toggle-contrast');
    const btnTtsWelcome = document.getElementById('tts-welcome');
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.btn-filter');

    let announcements = [
        {
            id: 1,
            title: "Uso Obrigatório de EPIs",
            content: "Todos os colaboradores devem utilizar os equipamentos de proteção individual durante o expediente.",
            category: "⚠️ Segurança",
            views: 32
        },
        {
            id: 2,
            title: "Meta Zero Papel",
            content: "A empresa está substituindo documentos impressos por soluções digitais para reduzir impactos ambientais.",
            category: "🌱 Sustentabilidade",
            views: 18
        },
        {
            id: 3,
            title: "Treinamento de Integração",
            content: "Novos colaboradores devem comparecer ao treinamento na próxima segunda-feira às 08h.",
            category: "ℹ️ Geral",
            views: 25
        }
    ];

    let currentCategoryFilter = 'all';
    let currentSearchQuery = '';

    function renderFeed() {
        feed.innerHTML = '';

        const filteredAnnouncements = announcements.filter(item => {
            const matchesCategory =
                currentCategoryFilter === 'all' ||
                item.category === currentCategoryFilter;

            const matchesSearch =
                item.title.toLowerCase().includes(currentSearchQuery) ||
                item.content.toLowerCase().includes(currentSearchQuery);

            return matchesCategory && matchesSearch;
        });

        if (filteredAnnouncements.length === 0) {
            feed.innerHTML = `
                <div class="card">
                    <h3>Nenhum comunicado encontrado.</h3>
                </div>
            `;
            return;
        }

        filteredAnnouncements.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('card');

            card.innerHTML = `
                <div class="card-header-info">
                    <span class="card-tag">
                        ${item.category}
                    </span>
                    <span class="view-counter" id="view-count-${item.id}">
                        👁️ ${item.views} visualizações
                    </span>
                </div>
                <h3>${item.title}</h3>
                <p>${item.content}</p>
                <div class="card-footer">
                    <button class="btn-listen-card" data-id="${item.id}">
                        🔊 Ouvir Comunicado
                    </button>
                </div>
            `;

            const listenButton = card.querySelector('.btn-listen-card');
            listenButton.addEventListener('click', () => {
                incrementViews(item.id);
                speakText(`${item.title}. Categoria ${item.category}. ${item.content}`);
            });

            feed.appendChild(card);
        });
    }

    function incrementViews(id) {
        const item = announcements.find(a => a.id === id);
        if (item) {
            item.views++;
            const counter = document.getElementById(`view-count-${id}`);
            if (counter) {
                counter.textContent = `👁️ ${item.views} visualizações`;
            }
        }
    }

    postForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newAnnouncement = {
            id: Date.now(),
            title: document.getElementById('title').value,
            content: document.getElementById('content').value,
            category: document.getElementById('category').value,
            views: 0
        };

        announcements.unshift(newAnnouncement);
        renderFeed();
        postForm.reset();

        speakText("Comunicado publicado com sucesso no mural digital.");

        // Redireciona para a página do Mural automaticamente para ver o card criado
        document.querySelector('[data-target="mural"]').click();
    });

    searchInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value.toLowerCase();
        renderFeed();
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');
            currentCategoryFilter = e.target.dataset.filter;
            renderFeed();
        });
    });

    function speakText(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            utterance.rate = 1;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        } else {
            alert("Seu navegador não suporta leitura por voz.");
        }
    }

    btnTtsWelcome.addEventListener('click', () => {
        speakText("Bem-vindo ao IndusConnect. Plataforma digital de comunicação industrial acessível, inclusiva e sustentável.");
    });

    toggleContrast.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
    });

    renderFeed();
});