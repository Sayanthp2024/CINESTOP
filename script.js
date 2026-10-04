/* ==========================================================================
   TOXIC POP — JAVASCRIPT LOGIC & UNDERGROUND COMIC ENGINE 🟢💥
   Preserving all existing state, routing, and functions while powering
   the high-energy, comic-book cinema visual experience.
   ========================================================================== */

/* =========================================
   MOVIE DATASET (THE TOXIC VAULT)
   ========================================= */

const defaultMovies = [
    {
        id: 1,
        title: "Spider-Man: Across the Spider-Verse",
        year: 2023,
        genre: "Animation",
        language: "English",
        rating: 8.7,
        emoji: "🕷️",
        duration: "2h 20m",
        tagline: "A MULTIVERSAL COLLISION IN FOUR-COLOR HALFTONE!",
        moods: ["hype", "chill"],
        comicBadge: "💥 BOOM!",
        speechQuote: "“Visually insane! The most mind-blowing animated spectacle ever put on 35mm.”",
        trailer: "cqGjhVJWtEg",
        poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
        description:
            "Miles Morales catapults across the multiverse, meeting an elite team of Spider-People charged with protecting its very existence. When the heroes clash over how to handle a cosmic threat, Miles must redefine what it means to be a hero.",
        director: "Joaquim Dos Santos & Kemp Powers",
        cast: [
            "Shameik Moore",
            "Hailee Steinfeld",
            "Oscar Isaac",
            "Jake Johnson",
            "Daniel Kaluuya"
        ]
    },
    {
        id: 2,
        title: "Guardians of the Galaxy Vol. 3",
        year: 2023,
        genre: "Action",
        language: "English",
        rating: 8.0,
        emoji: "🚀",
        duration: "2h 30m",
        tagline: "ONE FINAL COSMIC MISSION WITH THE GALAXY'S BADASSES!",
        moods: ["hype", "terrified"],
        comicBadge: "🔥 HOT!",
        speechQuote: "“Rocket's origin story will tear your heart out and blast it with a laser cannon.”",
        trailer: "u3V5KDHRQvk",
        poster: "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctetGCSp27qMFgFu.jpg",
        description:
            "Still reeling from the loss of Gamora, Peter Quill rallies his ragtag team to defend the universe and protect one of their own on a mission that could lead to the dissolution of the Guardians if not successful.",
        director: "James Gunn",
        cast: [
            "Chris Pratt",
            "Zoe Saldana",
            "Dave Bautista",
            "Bradley Cooper",
            "Karen Gillan"
        ]
    },
    {
        id: 3,
        title: "The Super Mario Bros. Movie",
        year: 2023,
        genre: "Animation",
        language: "English",
        rating: 7.0,
        emoji: "🍄",
        duration: "1h 32m",
        tagline: "PURE 8-BIT NOSTALGIA OVERLOAD IN TECHNICOLOR!",
        moods: ["chill"],
        comicBadge: "★ POP!",
        speechQuote: "“Jack Black singing Peaches is pure unadulterated gold.”",
        trailer: "TnGl01FkMMo",
        poster: "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg",
        description:
            "Brooklyn plumbers Mario and his brother Luigi are transported down a mysterious pipe and wander into a magical new realm. When the brothers are separated, Mario embarks on an epic quest to find Luigi.",
        director: "Aaron Horvath & Michael Jelenic",
        cast: [
            "Chris Pratt",
            "Anya Taylor-Joy",
            "Charlie Day",
            "Jack Black",
            "Seth Rogen"
        ]
    },
    {
        id: 4,
        title: "Interstellar",
        year: 2014,
        genre: "Sci-Fi",
        language: "English",
        rating: 8.7,
        emoji: "🌌",
        duration: "2h 49m",
        tagline: "MIND-MELTING WORMHOLE ODYSSEY BEYOND HUMAN COMPREHENSION!",
        moods: ["think", "cry"],
        comicBadge: "🧠 BRAIN!",
        speechQuote: "“Nolan's ultimate masterpiece. The docking scene will make your heart stop dead.”",
        trailer: "zSWdZVtXT7E",
        poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        description:
            "When Earth becomes uninhabitable, an intrepid team of ex-NASA astronauts and physicists travel through a newly discovered wormhole near Saturn in search of a hospitable celestial sanctuary for human survival.",
        director: "Christopher Nolan",
        cast: [
            "Matthew McConaughey",
            "Anne Hathaway",
            "Jessica Chastain",
            "Michael Caine",
            "Matt Damon"
        ]
    },
    {
        id: 5,
        title: "Toy Story 4",
        year: 2019,
        genre: "Animation",
        language: "English",
        rating: 7.7,
        emoji: "🤠",
        duration: "1h 40m",
        tagline: "FORKY'S EXISTENTIAL CRISIS HITS DIFFERENT!",
        moods: ["chill", "cry", "romantic"],
        comicBadge: "★ WOW!",
        speechQuote: "“Keanu Reeves as Duke Caboom steals the entire flick. An absolute delight.”",
        trailer: "wmiIUN-7U80",
        poster: "https://image.tmdb.org/t/p/w500/w9kR8qbmQ01HwnvK4alvnQ2v0Zw.jpg",
        description:
            "Woody, Buzz Lightyear, and the gang embark on a road trip with Bonnie and a newly fashioned toy named Forky. The journey turns into an unexpected reunion as Woody's slight detour leads him to his long-lost friend Bo Peep.",
        director: "Josh Cooley",
        cast: [
            "Tom Hanks",
            "Tim Allen",
            "Annie Potts",
            "Tony Hale",
            "Keanu Reeves"
        ]
    },
    {
        id: 6,
        title: "Jumanji: The Next Level",
        year: 2019,
        genre: "Adventure",
        language: "English",
        rating: 7.0,
        emoji: "🦁",
        duration: "1h 59m",
        tagline: "LEVEL UP OR GET WIPED OUT IN THE JUNGLE!",
        moods: ["hype", "chill"],
        comicBadge: "💥 WILD!",
        speechQuote: "“Danny DeVito channeling The Rock is comedy cinema perfection.”",
        trailer: "rBxcF-r9Ibs",
        poster: "https://image.tmdb.org/t/p/w500/jyw8VKYEiM1UDzPB77gaAG1qAAv.jpg",
        description:
            "The gang returns to Jumanji to rescue one of their own, only to discover that the rules have mutated and the terrain is fraught with arid deserts and treacherous snowcapped peaks.",
        director: "Jake Kasdan",
        cast: [
            "Dwayne Johnson",
            "Kevin Hart",
            "Jack Black",
            "Karen Gillan",
            "Danny DeVito"
        ]
    },
    {
        id: 7,
        title: "Inside Out",
        year: 2015,
        genre: "Animation",
        language: "English",
        rating: 8.1,
        emoji: "😊",
        duration: "1h 35m",
        tagline: "INSIDE THE BRAIN'S WILD EMOTIONAL ROLLERCOASTER!",
        moods: ["cry", "think", "chill"],
        comicBadge: "😭 TEARS!",
        speechQuote: "“Bing Bong's sacrifice broke me into a million pieces. A Pixar titan.”",
        trailer: "yRUAzGQ3nSY",
        poster: "https://image.tmdb.org/t/p/w500/lRHE0vzf3oYJrhbsHXjIkF4Tl5A.jpg",
        description:
            "After young Riley is uprooted from her Midwest life and moved to San Francisco, her emotions - Joy, Fear, Anger, Disgust, and Sadness - struggle over how best to navigate a new city, house, and school.",
        director: "Pete Docter",
        cast: [
            "Amy Poehler",
            "Phyllis Smith",
            "Bill Hader",
            "Lewis Black",
            "Mindy Kaling"
        ]
    },
    {
        id: 8,
        title: "Avengers: Endgame",
        year: 2019,
        genre: "Action",
        language: "English",
        rating: 8.4,
        emoji: "🦸",
        duration: "3h 2m",
        tagline: "WHATEVER IT TAKES. THE GREATEST COMIC EVENT ON CELLULOID!",
        moods: ["hype", "cry"],
        comicBadge: "💥 EPIC!",
        speechQuote: "“Portals scene. Theatre screamed at the top of its lungs. Historic cinema.”",
        trailer: "TcMBFSGVi1c",
        poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        description:
            "After the devastating events of Infinity War, the universe is in ruins. With the aid of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the cosmos.",
        director: "Anthony & Joe Russo",
        cast: [
            "Robert Downey Jr.",
            "Chris Evans",
            "Mark Ruffalo",
            "Chris Hemsworth",
            "Scarlett Johansson"
        ]
    },
    {
        id: 9,
        title: "The Batman",
        year: 2022,
        genre: "Drama",
        language: "English",
        rating: 7.8,
        emoji: "🦇",
        duration: "2h 56m",
        tagline: "I AM THE SHADOWS. PURE GRITTY NOIR IN GOTHAM!",
        moods: ["terrified", "think"],
        comicBadge: "🦇 NOIR!",
        speechQuote: "“Pattinson's Batmobile roar gave me chills down my entire spine.”",
        trailer: "mqqft2x_Aa4",
        poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
        description:
            "When a sadistic serial killer begins murdering key political figures in Gotham, the nocturnal vigilante is forced to investigate the city's hidden corruption and question his family's involvement.",
        director: "Matt Reeves",
        cast: [
            "Robert Pattinson",
            "Zoë Kravitz",
            "Paul Dano",
            "Colin Farrell",
            "Jeffrey Wright"
        ]
    },
    {
        id: 10,
        title: "Kung Fu Panda 4",
        year: 2024,
        genre: "Animation",
        language: "English",
        rating: 6.8,
        emoji: "🐼",
        duration: "1h 34m",
        tagline: "SKADOOSH! PO RETURNS FOR ANOTHER HIGH-KICKING BRAWL!",
        moods: ["chill"],
        comicBadge: "★ FUN!",
        speechQuote: "“Fast, colorful, and packs a mean punch. Viola Davis is a menacing villain.”",
        trailer: "_inKs4eeHiI",
        poster: "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
        description:
            "After Po is tapped to become the Spiritual Leader of the Valley of Peace, he needs to find and train a new Dragon Warrior, while a wicked sorceress plans to re-summon all the master villains whom Po has vanquished.",
        director: "Mike Mitchell",
        cast: [
            "Jack Black",
            "Awkwafina",
            "Dustin Hoffman",
            "Viola Davis",
            "Bryan Cranston"
        ]
    },
    {
        id: 11,
        title: "Dune: Part Two",
        year: 2024,
        genre: "Sci-Fi",
        language: "English",
        rating: 8.8,
        emoji: "🏜️",
        duration: "2h 46m",
        tagline: "LONG LIVE THE FIGHTERS! AN ABSOLUTE SCI-FI JUGGERNAUT!",
        moods: ["hype", "think", "terrified"],
        comicBadge: "★ 8.8 GOD-TIER",
        speechQuote: "“The sound design shakes your bones. Austin Butler is terrifyingly brilliant.”",
        trailer: "Way9Dexny3w",
        poster: "https://image.tmdb.org/t/p/w500/1pdfLvk8qq9ZmgBKhxStqNw9spD.jpg",
        description:
            "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
        director: "Denis Villeneuve",
        cast: [
            "Timothée Chalamet",
            "Zendaya",
            "Rebecca Ferguson",
            "Austin Butler",
            "Javier Bardem"
        ]
    },
    {
        id: 12,
        title: "Free Guy",
        year: 2021,
        genre: "Comedy",
        language: "English",
        rating: 7.1,
        emoji: "🎮",
        duration: "1h 55m",
        tagline: "LIFE'S TOO SHORT TO BE A BACKGROUND CHARACTER!",
        moods: ["chill", "romantic"],
        comicBadge: "🔥 HYPER!",
        speechQuote: "“Ryan Reynolds doing what he does best with killer video game references!”",
        trailer: "X2m-08cVLmg",
        poster: "https://image.tmdb.org/t/p/w500/xmbU4JTUm8rsdtn7Y3Fcm30GpeT.jpg",
        description:
            "A bank teller called Guy discovers he is actually a non-player character in an open-world video game and decides to become the hero of his own story... one that he can rewrite himself.",
        director: "Shawn Levy",
        cast: [
            "Ryan Reynolds",
            "Jodie Comer",
            "Taika Waititi",
            "Lil Rel Howery",
            "Joe Keery"
        ]
    }
];

/* =========================================
   LOCAL STORAGE PERSISTENCE
   ========================================= */

let movies = JSON.parse(localStorage.getItem("cineMovies"));
if (!movies || !Array.isArray(movies) || movies.length === 0) {
    movies = defaultMovies;
    localStorage.setItem("cineMovies", JSON.stringify(movies));
}

let watchlist = JSON.parse(localStorage.getItem("cineWatchlist")) || [];
let favorites = JSON.parse(localStorage.getItem("cineFavorites")) || [];
let reviews = JSON.parse(localStorage.getItem("cineReviews")) || [
    {
        id: 101,
        movieId: 11,
        movieTitle: "Dune: Part Two",
        rating: 5,
        text: "ABSOLUTELY INSANE! The sand-worm sequence made the entire cinema theater shake. Denis Villeneuve is untouchable!",
        date: "OCT 2, 2026"
    },
    {
        id: 102,
        movieId: 4,
        movieTitle: "Interstellar",
        rating: 5,
        text: "A visceral punch straight to the gut. The tesseract sequence is pure cosmic poetry on 35mm celluloid!",
        date: "SEP 29, 2026"
    }
];

let currentRating = 0;
let activeMood = "";

function saveMovies() {
    localStorage.setItem("cineMovies", JSON.stringify(movies));
}

/* =========================================
   PAGE ROUTING & NAVIGATION
   ========================================= */

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add("active");
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // Update active nav state
    document.querySelectorAll("nav a").forEach(link => {
        link.classList.remove("active");
        const onclickAttr = link.getAttribute("onclick") || "";
        if (onclickAttr.includes(`'${pageId}'`)) {
            link.classList.add("active");
        }
    });

    if (pageId === "home") renderHome();
    if (pageId === "movies") renderMovies(movies);
    if (pageId === "watchlist") renderWatchlist();
    if (pageId === "favorites") renderFavorites();
    if (pageId === "recommendations") renderRecommendations();
    if (pageId === "reviews") renderReviews();
    if (pageId === "admin") renderAdmin();
    if (pageId === "profile") updateCounts();
}

function toggleMenu() {
    const menu = document.getElementById("mobileMenu");
    if (menu) {
        menu.classList.toggle("show");
    }
}

/* =========================================
   COMIC MOVIE CARD COMPONENT
   ========================================= */

function createMovieCard(movie, index) {
    const isFavorite = favorites.includes(movie.id);
    const posterSrc = movie.poster || "";
    const badge = movie.comicBadge || `★ ${movie.rating}`;

    return `
        <article class="movie-card" onclick="openMovie(${movie.id})">
            
            <!-- Comic Corner Sticker -->
            <span class="card-comic-tag">${badge}</span>

            <!-- Heart favorite toggle -->
            <button
                class="favorite-icon ${isFavorite ? "active" : ""}"
                title="${isFavorite ? "Remove from Hit List" : "Add to Hit List"}"
                onclick="event.stopPropagation(); toggleFavorite(${movie.id})">
                <i class="fa-solid fa-heart"></i>
            </button>

            <!-- Comic Poster Panel -->
            <div class="poster-container">
                ${
                    posterSrc
                        ? `<img 
                             class="poster-img" 
                             src="${posterSrc}" 
                             alt="${movie.title} Poster"
                             loading="lazy"
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                           />
                           <div class="poster-fallback" style="display:none;">
                               <span>${movie.emoji || "🎬"}</span>
                           </div>`
                        : `<div class="poster-fallback">
                               <span>${movie.emoji || "🎬"}</span>
                           </div>`
                }
                <div class="poster-comic-score">★ ${movie.rating}</div>
            </div>

            <!-- Content -->
            <div class="movie-card-content">
                <h3>${movie.title}</h3>
                <div class="movie-meta-bar">
                    <span class="genre-badge">${movie.genre}</span>
                    <span>${movie.year} · ${movie.duration}</span>
                </div>
            </div>

        </article>
    `;
}

/* =========================================
   HOMEPAGE RENDERING (TOXIC POP HOME)
   ========================================= */

function renderHome() {
    // 1. Hero Section (Watch Something Wild)
    const featuredMovie = movies.find(m => m.id === 1) || movies[0]; // Spider-Man or top pick
    const heroContainer = document.getElementById("heroFeatureArea");

    if (heroContainer && featuredMovie) {
        const inWatchlist = watchlist.includes(featuredMovie.id);
        heroContainer.innerHTML = `
            <div class="hero-toxic-box">
                <div class="hero-toxic-grid">
                    
                    <div class="hero-toxic-left">
                        <div class="hero-stickers-strip">
                            <span class="comic-sticker green">💥 TOXIC SPOTLIGHT</span>
                            <span class="comic-sticker orange">MUST WATCH NOW</span>
                            <span class="comic-sticker pink">8.7 ★</span>
                        </div>

                        <h1>WATCH<br><span>SOMETHING WILD.</span></h1>
                        <div class="hero-toxic-tagline">“${featuredMovie.tagline}”</div>

                        <div class="hero-meta-bar">
                            <span class="hero-chip rating">★ ${featuredMovie.rating} / 10 SCORE</span>
                            <span class="hero-chip genre">${featuredMovie.genre}</span>
                            <span class="hero-chip">${featuredMovie.year}</span>
                            <span class="hero-chip">${featuredMovie.duration}</span>
                        </div>

                        <p class="hero-synopsis">
                            ${featuredMovie.description}
                        </p>

                        <div class="hero-actions-row">
                            <button class="btn primary" onclick="playTrailer(${featuredMovie.id})">
                                <i class="fa-solid fa-play"></i>
                                WATCH TRAILER
                            </button>

                            <button class="btn orange" onclick="addToWatchlist(${featuredMovie.id})">
                                <i class="fa-solid fa-plus"></i>
                                ${inWatchlist ? "✓ LOCKED IN HIT LIST" : "+ ADD TO HIT LIST"}
                            </button>

                            <button class="btn secondary" onclick="openMovie(${featuredMovie.id})">
                                <i class="fa-solid fa-bolt"></i>
                                EXPLORE DOSSIER
                            </button>
                        </div>
                    </div>

                    <div class="hero-poster-frame">
                        <div class="poster-burst-badge">
                            HOT! 🔥
                        </div>
                        ${
                            featuredMovie.poster
                                ? `<img src="${featuredMovie.poster}" alt="${featuredMovie.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                                   <div class="hero-poster-fallback" style="display:none;">${featuredMovie.emoji}</div>`
                                : `<div class="hero-poster-fallback">${featuredMovie.emoji}</div>`
                        }
                    </div>

                </div>
            </div>
        `;
    }

    // 2. What's Hot? (Numbered Ranking List)
    const hotListContainer = document.getElementById("hotRankingList");
    if (hotListContainer) {
        const sorted = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 4);
        hotListContainer.innerHTML = sorted.map((m, idx) => {
            const num = String(idx + 1).padStart(2, "0");
            return `
                <div class="hot-ranking-row" onclick="openMovie(${m.id})">
                    <span class="hot-num">${num}</span>
                    <div class="hot-title">
                        ${m.title}
                        <small>DIR. ${m.director.toUpperCase()}</small>
                    </div>
                    <span class="hot-genre">${m.genre}</span>
                    <span class="hot-score">★ ${m.rating}</span>
                </div>
            `;
        }).join("");
    }

    // 3. Trending Comic Cards
    const trendingCardsContainer = document.getElementById("trendingCards");
    if (trendingCardsContainer) {
        trendingCardsContainer.innerHTML = movies.slice(0, 4).map(createMovieCard).join("");
    }

    // 4. Popular Flicks
    const popularCardsContainer = document.getElementById("popularCards");
    if (popularCardsContainer) {
        const popular = [...movies].sort((a, b) => b.year - a.year).slice(0, 4);
        popularCardsContainer.innerHTML = popular.map(createMovieCard).join("");
    }

    // 5. Hall of Fame (Top Rated)
    const topRatedCardsContainer = document.getElementById("topRatedCards");
    if (topRatedCardsContainer) {
        const topRated = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 4);
        topRatedCardsContainer.innerHTML = topRated.map(createMovieCard).join("");
    }
}

/* =========================================
   MOOD DISCOVERY ENGINE (WHAT'S YOUR VIBE?)
   ========================================= */

function pickVibe(mood, event) {
    activeMood = mood;

    // Highlight clicked button
    document.querySelectorAll(".vibe-btn").forEach(btn => btn.classList.remove("active"));
    if (event && event.currentTarget) {
        event.currentTarget.classList.add("active");
    }

    const banner = document.getElementById("vibeBanner");
    const grid = document.getElementById("vibeResultsGrid");

    const vibeMap = {
        "chill": { title: "CHILL & UNWIND 😎", desc: "Wholesome, funny, and feel-good flicks for low-stress movie nights." },
        "hype": { title: "TOTAL HYPE MODE 🔥", desc: "Full-throttle action spectacles, high kicks, explosions, and cosmic battles!" },
        "romantic": { title: "ROMANTIC VIBES ❤️", desc: "Heartfelt romances, emotional connections, and unforgettable chemistry." },
        "terrified": { title: "PURE TERROR & THRILLS 😱", desc: "Nail-biting suspense, dark vigilante justice, and grim tension." },
        "think": { title: "CEREBRAL MIND-BENDER 🧠", desc: "Wormholes, complex plots, and cinema that will keep your gears turning." },
        "cry": { title: "TEARJERKERS & HEARTSTRINGS 😭", desc: "Emotional titans designed to obliterate your feelings in the best way." }
    };

    const selectedInfo = vibeMap[mood] || { title: "YOUR VIBE SELECTION 💥", desc: "Curated cinematic explosions for this exact mood!" };

    let filtered = movies.filter(m => m.moods && m.moods.includes(mood));
    if (filtered.length === 0) {
        if (mood === "chill") filtered = movies.filter(m => m.genre === "Animation" || m.genre === "Comedy");
        else if (mood === "hype") filtered = movies.filter(m => m.genre === "Action" || m.genre === "Sci-Fi");
        else if (mood === "think") filtered = movies.filter(m => m.genre === "Sci-Fi" || m.genre === "Drama");
        else filtered = movies.slice(0, 4);
    }

    if (banner) {
        banner.innerHTML = `
            <span>YOUR VIBE → <strong>${selectedInfo.title}</strong></span> · ${selectedInfo.desc}
        `;
        banner.classList.add("show");
    }

    if (grid) {
        grid.innerHTML = filtered.map(createMovieCard).join("");
        grid.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
}

/* =========================================
   SEARCH & REPERTORY CATALOG
   ========================================= */

function renderMovies(movieList) {
    const container = document.getElementById("allMovies");
    const countDisplay = document.getElementById("archiveCount");

    if (countDisplay) {
        countDisplay.innerText = `VAULT CONTAINS: ${movieList.length} REPERTORY TITLES`;
    }

    if (!movieList.length) {
        container.innerHTML = `
            <div class="empty-hitlist">
                <div class="emoji">🔍</div>
                <h2>NO MOVIES FOUND</h2>
                <p>Try a different search term or clear your filters to see all movies.</p>
                <button class="btn primary" onclick="resetFilters()">
                    CLEAR FILTERS
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = movieList.map(createMovieCard).join("");
}

function populateYearFilter() {
    const yearSelect = document.getElementById("yearFilter");
    if (!yearSelect) return;

    const currentVal = yearSelect.value;
    const years = [...new Set(movies.map(m => m.year))].sort((a, b) => b - a);

    yearSelect.innerHTML = `<option value="">ALL YEARS</option>` +
        years.map(y => `<option value="${y}">${y}</option>`).join("");

    if (currentVal) {
        yearSelect.value = currentVal;
    }
}

function resetFilters() {
    const searchInput = document.getElementById("movieSearch");
    const genreFilter = document.getElementById("genreFilter");
    const yearFilter = document.getElementById("yearFilter");
    const sortFilter = document.getElementById("sortFilter");

    if (searchInput) searchInput.value = "";
    if (genreFilter) genreFilter.value = "";
    if (yearFilter) yearFilter.value = "";
    if (sortFilter) sortFilter.value = "rating";

    filterMovies();
}

function searchMovies() {
    const search = document.getElementById("navbarSearch").value.toLowerCase().trim();
    if (!search) return;

    showPage("movies");
    const movieSearch = document.getElementById("movieSearch");
    if (movieSearch) movieSearch.value = search;
    searchMoviesPage();
}

function searchMoviesPage() {
    const search = (document.getElementById("movieSearch").value || "").toLowerCase().trim();
    const genre = document.getElementById("genreFilter") ? document.getElementById("genreFilter").value : "";
    const year = document.getElementById("yearFilter") ? document.getElementById("yearFilter").value : "";
    const sort = document.getElementById("sortFilter") ? document.getElementById("sortFilter").value : "rating";

    let results = movies.filter(movie => {
        const matchesQuery = movie.title.toLowerCase().includes(search) ||
                             movie.director.toLowerCase().includes(search) ||
                             movie.description.toLowerCase().includes(search);
        const matchesGenre = !genre || movie.genre === genre;
        const matchesYear = !year || movie.year.toString() === year;
        return matchesQuery && matchesGenre && matchesYear;
    });

    if (sort === "rating") results.sort((a, b) => b.rating - a.rating);
    if (sort === "year") results.sort((a, b) => b.year - a.year);
    if (sort === "title") results.sort((a, b) => a.title.localeCompare(b.title));

    renderMovies(results);
}

function filterMovies() {
    searchMoviesPage();
}

function filterGenre(genre) {
    showPage("movies");
    const genreSelect = document.getElementById("genreFilter");
    if (genreSelect) {
        genreSelect.value = genre;
    }
    filterMovies();
}

/* =========================================
   MOVIE DETAILS (COMIC POSTER FEATURE)
   ========================================= */

function openMovie(id) {
    const movie = movies.find(m => m.id === id);
    if (!movie) return;

    const inWatchlist = watchlist.includes(movie.id);
    const inFavorites = favorites.includes(movie.id);

    const castHtml = movie.cast
        .map(person => `
            <div class="cast-comic-card">
                <div class="cast-comic-avatar">👤</div>
                <strong>${person}</strong>
            </div>
        `)
        .join("");

    const related = movies
        .filter(m => m.id !== movie.id && (m.genre === movie.genre || m.rating >= 8.0))
        .slice(0, 4);

    const detailsContainer = document.getElementById("movieDetails");
    if (!detailsContainer) return;

    detailsContainer.innerHTML = `
        <article class="details-comic-feature">
            
            <div class="details-comic-header">
                <div style="display:flex; gap:10px; margin-bottom:12px;">
                    <span class="comic-sticker green">CLASSIFIED DOSSIER</span>
                    <span class="comic-sticker orange">ID NO. ${movie.id}</span>
                </div>

                <h1>${movie.title}</h1>
                <div class="details-comic-tagline">“${movie.tagline || movie.description.slice(0, 80)}”</div>

                <div class="details-meta-chips">
                    <span class="hero-chip rating">★ ${movie.rating} / 10 CRITIC RATING</span>
                    <span class="hero-chip genre">${movie.genre}</span>
                    <span class="hero-chip">${movie.year}</span>
                    <span class="hero-chip">${movie.duration}</span>
                    <span class="hero-chip">LANGUAGE: ${movie.language}</span>
                </div>
            </div>

            <div class="details-comic-layout">
                
                <!-- Left: Framed Poster & CTA Buttons -->
                <div class="details-poster-box">
                    <div class="details-framed-poster">
                        <div class="poster-burst-badge">★ HOT!</div>
                        ${
                            movie.poster
                                ? `<img src="${movie.poster}" alt="${movie.title} Poster" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                                   <div class="details-framed-fallback" style="display:none;">${movie.emoji}</div>`
                                : `<div class="details-framed-fallback">${movie.emoji}</div>`
                        }
                    </div>

                    <button class="btn primary full" onclick="playTrailer(${movie.id})">
                        <i class="fa-solid fa-play"></i>
                        WATCH OFFICIAL TRAILER
                    </button>

                    <button class="btn orange full" onclick="addToWatchlist(${movie.id})">
                        <i class="fa-solid fa-bookmark"></i>
                        ${inWatchlist ? "✓ LOCKED IN HIT LIST" : "+ ADD TO HIT LIST"}
                    </button>

                    <button class="btn pink full" onclick="toggleFavorite(${movie.id})">
                        <i class="fa-solid fa-heart"></i>
                        ${inFavorites ? "❤️ REMOVE OBSESSION" : "♡ MARK AS OBSESSION"}
                    </button>
                </div>

                <!-- Right: Comic Speech Bubbles & Content -->
                <div class="details-comic-content">
                    
                    <div class="comic-speech-box">
                        <strong>CRITIC'S EXPLOSIVE VERDICT 💥</strong>
                        <p>${movie.speechQuote || "An absolute triumph of cinema daring and visceral power!"}</p>
                    </div>

                    <h2 style="font-family:var(--font-heading); font-size:32px; letter-spacing:1.5px; color:var(--pure-white); margin-bottom:8px;">THE PLOT</h2>
                    <p style="font-family:var(--font-body); font-size:17px; line-height:1.7; color:var(--off-white); margin-bottom:26px;">
                        ${movie.description}
                    </p>

                    <div class="comic-speech-box" style="border-color:var(--hot-pink); box-shadow:5px 5px 0px var(--hot-pink);">
                        <strong style="color:var(--hot-pink);">DIRECTOR'S BLUEPRINT</strong>
                        <p>Directed with relentless vision by <em>${movie.director}</em>. A landmark entry in the ${movie.genre.toLowerCase()} canon.</p>
                    </div>

                    <h2 style="font-family:var(--font-heading); font-size:32px; letter-spacing:1.5px; color:var(--pure-white); margin-bottom:8px;">ENSEMBLE SQUAD</h2>
                    <div class="cast-comic-grid">
                        ${castHtml}
                    </div>

                </div>

            </div>

            <div class="section-toxic-header" style="margin-top:40px;">
                <div>
                    <span class="section-toxic-kicker">RELATED CHAOS</span>
                    <h2 class="section-toxic-title">SIMILAR MOVIES</h2>
                </div>
            </div>

            <div class="movie-grid">
                ${related.map(createMovieCard).join("")}
            </div>

        </article>
    `;

    showPage("details");
}

/* =========================================
   CINEMA SCREENING MODAL (TRAILER PROJECTOR)
   ========================================= */

function playTrailer(id) {
    const movie = movies.find(m => m.id === id);
    if (!movie) return;

    const modal = document.getElementById("trailerModal");
    const container = document.getElementById("trailerFrameContainer");
    const titleHeader = document.getElementById("trailerMovieTitle");

    if (modal && container) {
        if (titleHeader) {
            titleHeader.innerText = `NOW SCREENING: ${movie.title.toUpperCase()} 💥`;
        }
        const trailerKey = movie.trailer || "cqGjhVJWtEg";
        container.innerHTML = `
            <iframe 
                src="https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0" 
                title="${movie.title} Trailer" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
        modal.classList.add("show");
    } else {
        showToast(`Screening trailer for ${movie.title} 🎬`);
    }
}

function closeTrailer() {
    const modal = document.getElementById("trailerModal");
    const container = document.getElementById("trailerFrameContainer");
    if (container) container.innerHTML = "";
    if (modal) modal.classList.remove("show");
}

/* =========================================
   MY HIT LIST (WATCHLIST & FAVORITES)
   ========================================= */

function addToWatchlist(id) {
    if (watchlist.includes(id)) {
        watchlist = watchlist.filter(mId => mId !== id);
        showToast("Removed from Watchlist.");
    } else {
        watchlist.push(id);
        showToast("Added to Watchlist! 🎯");
    }

    localStorage.setItem("cineWatchlist", JSON.stringify(watchlist));
    updateCounts();
    renderWatchlist();

    const currentActive = document.querySelector(".page.active");
    if (currentActive && currentActive.id === "details") {
        openMovie(id);
    }
}

function renderWatchlist() {
    const container = document.getElementById("watchlistMovies");
    if (!container) return;

    const list = movies.filter(m => watchlist.includes(m.id));

    if (!list.length) {
        container.innerHTML = `
            <div class="empty-hitlist">
                <div class="emoji">🎯</div>
                <h2>YOUR WATCHLIST IS EMPTY</h2>
                <p>Save movies here to watch later — tap the <strong>+ Watchlist</strong> button on any movie.</p>
                <button class="btn primary" onclick="showPage('movies')">
                    BROWSE MOVIES
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = list.map(createMovieCard).join("");
}

function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(mId => mId !== id);
        showToast("Removed from Favorites.");
    } else {
        favorites.push(id);
        showToast("Added to Favorites! ❤️");
    }

    localStorage.setItem("cineFavorites", JSON.stringify(favorites));
    updateCounts();
    renderHome();
    renderFavorites();

    const currentActive = document.querySelector(".page.active");
    if (currentActive && currentActive.id === "details") {
        openMovie(id);
    }
}

function renderFavorites() {
    const container = document.getElementById("favoriteMovies");
    if (!container) return;

    const list = movies.filter(m => favorites.includes(m.id));

    if (!list.length) {
        container.innerHTML = `
            <div class="empty-hitlist">
                <div class="emoji">❤️</div>
                <h2>NO FAVORITES YET</h2>
                <p>Tap the <strong>❤️ heart icon</strong> on any movie card to add it to your favorites.</p>
                <button class="btn primary" onclick="showPage('movies')">
                    BROWSE MOVIES
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = list.map(createMovieCard).join("");
}

/* =========================================
   SECRET VAULT PICKS (RECOMMENDATIONS)
   ========================================= */

function renderRecommendations() {
    const container = document.getElementById("recommendedMovies");
    if (!container) return;

    const recommended = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 8);
    container.innerHTML = recommended.map(createMovieCard).join("");
}

/* =========================================
   REVIEWS (COMIC SPEECH BUBBLES)
   ========================================= */

function setRating(rating) {
    currentRating = rating;
    document.querySelectorAll(".comic-stars span").forEach((star, index) => {
        star.classList.toggle("active", index < rating);
    });
    const hint = document.getElementById("ratingHint");
    if (hint) {
        const labels = ["", "Poor", "Fair", "Good", "Great", "Excellent!"];
        if (rating > 0) {
            hint.textContent = `You rated: ${rating}/5 — ${labels[rating]}`;
            hint.style.color = rating >= 4 ? "var(--toxic-green)" : "var(--text-muted)";
        } else {
            hint.textContent = "Click a star to rate";
            hint.style.color = "";
        }
    }
}

function submitReview() {
    const selectElem = document.getElementById("reviewMovie");
    const textElem = document.getElementById("reviewText");

    const movieId = parseInt(selectElem.value);
    const text = textElem.value.trim();

    if (!movieId) { showToast("Please select a movie first."); selectElem.focus(); return; }
    if (!currentRating) { showToast("Please select a star rating (1–5)."); return; }
    if (!text || text.length < 10) { showToast("Please write at least 10 characters in your review."); textElem.focus(); return; }

    const movie = movies.find(m => m.id === movieId);

    reviews.unshift({
        id: Date.now(),
        movieId: movieId,
        movieTitle: movie ? movie.title : "Unknown Movie",
        rating: currentRating,
        text: text,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    });

    localStorage.setItem("cineReviews", JSON.stringify(reviews));

    textElem.value = "";
    selectElem.value = "";
    currentRating = 0;
    setRating(0);

    renderReviews();
    updateCounts();
    showToast(`Review for "${movie ? movie.title : 'movie'}" submitted! ⭐`);
}

function renderReviews() {
    const select = document.getElementById("reviewMovie");
    if (select) {
        select.innerHTML = `<option value="">SELECT A MOVIE TO REVIEW</option>` +
            movies.map(m => `<option value="${m.id}">${m.title} (${m.year})</option>`).join("");
    }

    const container = document.getElementById("userReviews");
    if (!container) return;

    if (!reviews.length) {
        container.innerHTML = `
            <div class="empty-hitlist">
                <div class="emoji">💬</div>
                <h2>NO SPEECH BUBBLE REVIEWS YET!</h2>
                <p>Be the very first rebel to drop your explosive review here.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = reviews.map(review => `
        <div class="speech-bubble">
            <div class="bubble-header">
                <h3>${review.movieTitle}</h3>
                <span class="bubble-stars">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span>
            </div>

            <p>“${review.text}”</p>

            <div class="bubble-footer">
                <span>— REBEL CRITIC · ${review.date}</span>
                <button class="bubble-del-btn" onclick="deleteReview(${review.id})">
                    DELETE BUBBLE
                </button>
            </div>
        </div>
    `).join("");
}

function deleteReview(id) {
    reviews = reviews.filter(r => r.id !== id);
    localStorage.setItem("cineReviews", JSON.stringify(reviews));
    renderReviews();
    updateCounts();
    showToast("Review speech bubble removed.");
}

/* =========================================
   TOXIC AUTHENTICATION
   ========================================= */

function login() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
        showToast("Please enter your email and password.");
        return;
    }

    showToast("Welcome back to CineStop! 🎬");
    setTimeout(() => {
        showPage("home");
    }, 700);
}

function register() {
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();

    if (!name || !email || !password) {
        showToast("Please fill in all fields to create your account.");
        return;
    }
    if (password.length < 6) {
        showToast("Password must be at least 6 characters.");
        return;
    }

    showToast(`Account created! Welcome, ${name}! 🎉`);
    setTimeout(() => {
        showPage("home");
    }, 700);
}

function logout() {
    showToast("Logged out. See you next time! 👋");
    setTimeout(() => {
        showPage("login");
    }, 700);
}

/* =========================================
   ADMIN: UNDERGROUND HQ
   ========================================= */

function renderAdmin() {
    const table = document.getElementById("adminMovieTable");
    const totalCountElem = document.getElementById("adminTotalMovies");

    if (totalCountElem) {
        totalCountElem.innerText = movies.length;
    }

    if (!table) return;

    table.innerHTML = movies.map(movie => `
        <tr>
            <td>
                <strong>${movie.title}</strong>
                <div style="font-size:12px; color:var(--text-muted);">${movie.director}</div>
            </td>
            <td><span class="comic-sticker green">${movie.genre}</span></td>
            <td>${movie.year}</td>
            <td><strong style="color:var(--toxic-green);">★ ${movie.rating}</strong></td>
            <td>
                <button class="table-action" onclick="deleteMovie(${movie.id})">
                    PURGE
                </button>
            </td>
        </tr>
    `).join("");
}

function filterAdminTable() {
    const search = (document.getElementById("adminSearchInput") ? document.getElementById("adminSearchInput").value : "").toLowerCase();
    const table = document.getElementById("adminMovieTable");
    if (!table) return;

    const filtered = movies.filter(m => m.title.toLowerCase().includes(search) || m.genre.toLowerCase().includes(search));
    table.innerHTML = filtered.map(movie => `
        <tr>
            <td>
                <strong>${movie.title}</strong>
                <div style="font-size:12px; color:var(--text-muted);">${movie.director}</div>
            </td>
            <td><span class="comic-sticker green">${movie.genre}</span></td>
            <td>${movie.year}</td>
            <td><strong style="color:var(--toxic-green);">★ ${movie.rating}</strong></td>
            <td>
                <button class="table-action" onclick="deleteMovie(${movie.id})">
                    PURGE
                </button>
            </td>
        </tr>
    `).join("");
}

function openAddMovie() {
    const modal = document.getElementById("addMovieModal");
    if (modal) modal.classList.add("show");
}

function closeAddMovie() {
    const modal = document.getElementById("addMovieModal");
    if (modal) modal.classList.remove("show");
}

function addMovie() {
    const title = document.getElementById("newTitle").value.trim();
    const year = parseInt(document.getElementById("newYear").value);
    const genre = document.getElementById("newGenre").value.trim();
    const rating = parseFloat(document.getElementById("newRating").value);
    const emoji = document.getElementById("newPoster").value.trim() || "🎬";
    const posterUrl = document.getElementById("newPosterUrl") ? document.getElementById("newPosterUrl").value.trim() : "";

    if (!title || !year || !genre || isNaN(rating)) {
        showToast("Please fill in title, year, genre, and rating!");
        return;
    }

    const newMovie = {
        id: Date.now(),
        title,
        year,
        genre,
        language: "English",
        rating,
        emoji,
        duration: "2h",
        tagline: "FRESH ADDICTION ADDED TO THE VAULT!",
        comicBadge: "NEW! 💥",
        trailer: "Way9Dexny3w",
        poster: posterUrl || "",
        description: "An explosive new title indexed into the Toxic Pop underground film vault.",
        director: "Underground Director",
        speechQuote: "“Fresh out of the editing bay. Destined to be a cult phenomenon!”",
        cast: ["Lead Star", "Co-Star"]
    };

    movies.unshift(newMovie);
    saveMovies();

    document.getElementById("newTitle").value = "";
    document.getElementById("newYear").value = "";
    document.getElementById("newGenre").value = "";
    document.getElementById("newRating").value = "";
    document.getElementById("newPoster").value = "";
    if (document.getElementById("newPosterUrl")) document.getElementById("newPosterUrl").value = "";

    closeAddMovie();
    populateYearFilter();
    renderAdmin();
    renderHome();
    showToast("New movie locked into Toxic Vault! 🟢🎬");
}

function deleteMovie(id) {
    const movie = movies.find(m => m.id === id);
    const title = movie ? movie.title : "this movie";
    if (!confirm(`Remove "${title}" from the catalog? This cannot be undone.`)) return;

    movies = movies.filter(m => m.id !== id);
    saveMovies();

    populateYearFilter();
    renderAdmin();
    renderMovies(movies);
    renderHome();
    showToast(`"${title}" removed from catalog.`);
}

function closeModal() {
    document.querySelectorAll(".modal").forEach(modal => {
        modal.classList.remove("show");
    });
    closeTrailer();
}

function updateCounts() {
    const favCountElem = document.getElementById("favoriteCount");
    const watchCountElem = document.getElementById("watchlistCount");
    const rateCountElem = document.getElementById("ratedCount");

    if (favCountElem) favCountElem.innerText = favorites.length;
    if (watchCountElem) watchCountElem.innerText = watchlist.length;
    if (rateCountElem) rateCountElem.innerText = reviews.length;

    // Update nav badges
    const watchBadge = document.getElementById("navWatchlistBadge");
    const favBadge = document.getElementById("navFavBadge");
    if (watchBadge) {
        if (watchlist.length > 0) { watchBadge.textContent = watchlist.length; watchBadge.classList.add("show"); }
        else { watchBadge.classList.remove("show"); }
    }
    if (favBadge) {
        if (favorites.length > 0) { favBadge.textContent = favorites.length; favBadge.classList.add("show"); }
        else { favBadge.classList.remove("show"); }
    }

    // Admin live stats
    const adminWatchlistCount = document.getElementById("adminWatchlistCount");
    const adminReviewCount = document.getElementById("adminReviewCount");
    if (adminWatchlistCount) adminWatchlistCount.innerText = watchlist.length;
    if (adminReviewCount) adminReviewCount.innerText = reviews.length;
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.innerHTML = `✅ ${message}`;
    toast.classList.add("show");

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}

/* =========================================
   INITIALIZATION
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
    populateYearFilter();
    renderHome();
    renderMovies(movies);
    renderWatchlist();
    renderFavorites();
    renderRecommendations();
    renderReviews();
    renderAdmin();
    updateCounts();

    // Default Vibe Trigger
    pickVibe("hype");

    const adminSearch = document.getElementById("adminSearchInput");
    if (adminSearch) {
        adminSearch.addEventListener("input", filterAdminTable);
    }

    // Enter key: navbar search
    const navbarSearch = document.getElementById("navbarSearch");
    if (navbarSearch) {
        navbarSearch.addEventListener("keydown", function(e) {
            if (e.key === "Enter") searchMovies();
        });
    }

    // Escape key: close any open modal
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") closeModal();
    });

    // Back-to-top visibility on scroll
    const backToTopBtn = document.getElementById("backToTop");
    if (backToTopBtn) {
        window.addEventListener("scroll", function() {
            if (window.scrollY > 400) backToTopBtn.classList.add("visible");
            else backToTopBtn.classList.remove("visible");
        });
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleModalBackdropClick(event, modalId, closeFn) {
    if (event.target.id === modalId) closeFn();
}