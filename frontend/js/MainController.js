// MainController - consolidated controller combining all functionality
app.controller('MainController', function($scope, $http, $window) {

    // ==================== data management ====================

    $scope.entries = [];       // stores all movie/series entries
    $scope.topActors = [];     // stores top actor data
    $scope.genreStats = [];    // stores calculated genre statistics
    $scope.movieCount = 0;     // total number of movies
    $scope.seriesCount = 0;    // total number of series

    // function to load all movie and series entries from backend api
    $scope.loadEntries = function() {
        $http.get("http://localhost/SMDB/backend/api/smdb.php")
        .then(function(response) {
            $scope.entries = response.data;
            // count number of movies
            $scope.movieCount = $scope.entries.filter(x => x.medium === 'Movie').length;
            // count number of series
            $scope.seriesCount = $scope.entries.filter(x => x.medium === 'Series').length;
            // calculate genre statistics based on loaded entries
            $scope.calculateGenreStats();
        })
        .catch(function(error) {
            console.error('error when loading data:', error);
        });
    };

    // function to load top actors data from backend api
    $scope.loadTopActors = function() {
        $http.get("http://localhost/SMDB/backend/api/topactors.php")
        .then(function(response) {
            $scope.topActors = response.data;
        })
        .catch(function(error) {
            console.error('error when loading top actors:', error);
        });
    };

    // function to calculate statistics about genres in the entries list
    $scope.calculateGenreStats = function() {
        const genreCounts = {};
        let total = 0;
    
        // iterate over each entry and count how many entries per genre
        $scope.entries.forEach(entry => {
            const genre = entry.genre || 'Unknown'; // use 'Unknown' if genre missing
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            total++;
        });
    
        // create an array of objects with genre name, count, and percent share
        $scope.genreStats = Object.keys(genreCounts).map(genre => ({
            name: genre,
            count: genreCounts[genre],
            percent: Math.round((genreCounts[genre] / total) * 100)
        }));
    
        // sort genres descending by count
        $scope.genreStats.sort((a, b) => b.count - a.count);
    };

    // ==================== filtering ====================

    $scope.mediumFilter = 'Movie';       // default medium filter (Movie or Series)
    $scope.searchDirector = '';          // search string for director filter
    $scope.searchTitle = '';             // search string for title filter

    // filter function to keep only entries matching selected medium
    $scope.mediumTypeFilter = function(item) {
        return item.medium === $scope.mediumFilter;
    };

    // filter function to check if director starts with search string (case insensitive)
    $scope.directorFilter = function(item) {
        if (!$scope.searchDirector || $scope.searchDirector.trim() === '') {
            return true; // no filter if empty
        }
        const director = (item.director || '').toLowerCase();
        const search = $scope.searchDirector.toLowerCase();
        return director.indexOf(search) === 0; // check if director starts with search string
    };

    // filter function to check if title starts with search string (case insensitive)
    $scope.startsWithFilter = function(item) {
        if (!$scope.searchTitle || $scope.searchTitle.trim() === '') {
            return true; // no filter if empty
        }
        const title = (item.title || '').toLowerCase();
        const search = $scope.searchTitle.toLowerCase();
        return title.indexOf(search) === 0; // check if title starts with search string
    };

    // ==================== sorting ====================

    $scope.sortBy = "";               // field to sort by (property name or prefixed by '-' for descending)
    $scope.showOptions = false;       // boolean flag to toggle dropdown visibility
    $scope.selectedOption = null;     // currently selected sorting option object
    $scope.ascending = true;          // true for ascending order, false for descending

    // function to toggle the dropdown menu for sorting options
    $scope.toggleDropdown = function() {
        $scope.showOptions = !$scope.showOptions;
        if ($scope.showOptions) {
            // attach a click event listener on document to close dropdown when clicking outside
            setTimeout(function() {
                document.addEventListener('click', closeDropdown);
            }, 0);
        }
    };

    // function to close dropdown if click outside dropdown area
    function closeDropdown(event) {
        if (!event.target.closest('.custom-sort-dropdown')) {
            $scope.$apply(function() {
                $scope.showOptions = false;
            });
            document.removeEventListener('click', closeDropdown);
        }
    }

    // function called when a sorting option is selected from dropdown
    $scope.selectOption = function(option) {
        $scope.selectedOption = option;
        $scope.showOptions = false;  // close dropdown
        updateSortBy();              // update sortBy string accordingly
    };

    // function to toggle ascending/descending order and update sortBy
    $scope.toggleOrder = function() {
        $scope.ascending = !$scope.ascending;
        updateSortBy();
    };

    // helper function to update sortBy string based on selected option and ascending flag
    function updateSortBy() {
        if ($scope.selectedOption) {
            $scope.sortBy = $scope.ascending 
                ? $scope.selectedOption.value  // ascending, use option value as is
                : '-' + $scope.selectedOption.value;  // descending, prefix with '-'
        } else {
            $scope.sortBy = '';  // no sorting if no option selected
        }
    }

    // function to get appropriate icon class for sort order
    $scope.getOrderIcon = function() {
        return $scope.ascending 
            ? 'fa-arrow-up-wide-short' 
            : 'fa-arrow-down-wide-short';
    };

    // function to reset all sorting options to default state
    $scope.resetSorting = function() {
        $scope.selectedOption = null;
        $scope.sortBy = '';
        $scope.ascending = true;
        $scope.showOptions = false;
    };

    // ==================== favorites ====================

    $scope.favorites = [];          // array storing user's favorite movies/series
    $scope.showOnlyFavorites = false;  // toggle to filter only favorites

    // function to add or remove a movie from favorites
    $scope.toggleFavorite = function(movie) {
        const movieId = movie.title + '_' + movie.release_date;  // unique id based on title and release date
        const existingIndex = $scope.favorites.findIndex(fav => fav.id === movieId);
        
        if (existingIndex === -1) {
            // add to favorites if not already present
            $scope.favorites.push({
                id: movieId,
                title: movie.title,
                medium: movie.medium,
                director: movie.director,
                release_date: movie.release_date,
                imdb_rating: movie.imdb_rating,
                img: movie.img,
                category: movie.category,
                descr: movie.descr,
                actor: movie.actor,
                stream_link: movie.stream_link,
                trailer_link: movie.trailer_link
            });
        } else {
            // remove from favorites if already present
            $scope.favorites.splice(existingIndex, 1);
        }

        // save updated favorites list to localStorage if available
        if (typeof(Storage) !== "undefined") {
            try {
                localStorage.setItem('smdb_favorites', JSON.stringify($scope.favorites));
            } catch(e) {
                console.log('localStorage not available');
            }
        }
    };
    
    // function to check if a given movie is in favorites list
    $scope.isFavorite = function(movie) {
        if (!movie) return false;
        const movieId = movie.title + '_' + movie.release_date;
        return $scope.favorites.some(fav => fav.id === movieId);
    };
    
    // function to get the count of favorite items
    $scope.getFavoritesCount = function() {
        return $scope.favorites.length;
    };
    
    // function to load favorites list from localStorage if present
    $scope.loadFavorites = function() {
        if (typeof(Storage) !== "undefined") {
            try {
                const savedFavorites = localStorage.getItem('smdb_favorites');
                if (savedFavorites) {
                    $scope.favorites = JSON.parse(savedFavorites);
                }
            } catch(e) {
                console.log('could not load favorites from localStorage');
                $scope.favorites = [];
            }
        }
    };
    
    // filter function to include only favorites if toggle enabled
    $scope.favoritesFilter = function(movie) {
        if (!$scope.showOnlyFavorites) {
            return true;  // show all if toggle off
        }
        return $scope.isFavorite(movie);
    };

    // ==================== ui functions ====================

    $scope.scrollBtnVisible = false;  // controls visibility of scroll-to-top button

    // event listener to toggle scroll button visibility based on scroll position
    angular.element($window).on('scroll', function() {
        $scope.$applyAsync(() => {
            $scope.scrollBtnVisible = $window.scrollY > 7500;
        });
    });

    // function to smoothly scroll to the top of the page
    $scope.scrollToTop = function() {
        $window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // initialize preloader animation and remove preloader element after delay
    $scope.initPreloader = function() {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const preloaderFrame = document.getElementById('preloader-frame');
                if (preloaderFrame) {
                    preloaderFrame.style.opacity = '0';
                    preloaderFrame.style.transition = 'opacity 0.5s';
                    setTimeout(() => preloaderFrame.remove(), 500);
                }
            }, 3000);
        });
    };

    // initialize custom cursor with trailing effect
    $scope.initCustomCursor = function() {
        const cursor = document.querySelector('.custom-cursor');
        const trailCount = 4;  // number of trailing dots
        const trails = [];

        // create trail elements and append to body
        for (let i = 0; i < trailCount; i++) {
            const trail = document.createElement('div');
            trail.classList.add('trail');
            document.body.appendChild(trail);
            trails.push(trail);
        }

        let mouseX = 0;
        let mouseY = 0;

        // update main cursor position on mouse move
        window.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // store last positions for trailing effect smoothing
        let lastPositions = Array(trailCount).fill({ x: 0, y: 0 });

        // animation function to update trailing dots positions smoothly
        function animate() {
            let x = mouseX;
            let y = mouseY;

            trails.forEach((trail, index) => {
                const lastPos = lastPositions[index];
                lastPositions[index] = {
                    x: lastPos.x + (x - lastPos.x) * 0.3,
                    y: lastPos.y + (y - lastPos.y) * 0.3
                };

                trail.style.left = lastPositions[index].x + 'px';
                trail.style.top = lastPositions[index].y + 'px';
                trail.style.opacity = (trailCount - index) / trailCount;

                x = lastPositions[index].x;
                y = lastPositions[index].y;
            });

            requestAnimationFrame(animate);
        }

        animate();  // start the animation loop
    };

    // ==================== global functions ====================

    // function to reset all filters and sorting options to default states
    $scope.resetFilters = function() {
        // reset filter values
        $scope.mediumFilter = 'Movie';
        $scope.searchDirector = '';
        $scope.searchTitle = '';

        // reset sorting options
        $scope.selectedOption = null;
        $scope.sortBy = '';
        $scope.ascending = true;
        $scope.showOptions = false;
    };

    // ==================== initialization ====================
    
    // load all data and initialize UI components
    $scope.loadEntries();
    $scope.loadTopActors();
    $scope.loadFavorites();
    $scope.initPreloader();
    $scope.initCustomCursor();

    // global event listener to close sort dropdowns if clicking outside (runs on DOMContentLoaded)
    document.addEventListener('DOMContentLoaded', function() {
        document.addEventListener('click', function(event) {
            const sortDropdowns = document.querySelectorAll('.custom-sort-dropdown');
            sortDropdowns.forEach(dropdown => {
                if (!dropdown.contains(event.target)) {
                    const options = dropdown.querySelector('.sort-options');
                    if (options.classList.contains('show')) {
                        options.classList.remove('show');
                    }
                }
            });
        });
    });

    // log initialization success message
    console.log('SMBD application initialized successfully!');

});