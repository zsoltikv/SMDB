# SMDB - Series & Movies Database

![Tech Stack](https://skillicons.dev/icons?i=html,js,css,php,tailwind,mysql,angular)

**SMDB** (Series & Movies Database) is a dynamic, AngularJS-based web application designed to help users explore, filter, sort, and manage a collection of movies and series. With a sleek user interface, custom animations, and a robust backend, SMDB offers an intuitive way to browse media, track favorites, and discover top genres and actors. Whether you're a movie buff or a series enthusiast, SMDB provides a seamless experience to dive into your favorite entertainment.

---

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Technologies Used](#technologies-used)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

SMDB is packed with features to enhance your media browsing experience:

- **Dynamic Media Catalog**: Browse a comprehensive list of movies and series with details like title, director, actors, release date, IMDb rating, and streaming links.
- **Filtering Options**:
  - Filter by medium (Movies or Series).
  - Search by title or director with case-insensitive, starts-with matching.
  - Toggle to display only favorite items.
- **Sorting Capabilities**:
  - Sort entries by title, release date, director, or IMDb rating.
  - Toggle between ascending and descending order.
- **Favorites Management**:
  - Add or remove movies/series to/from a favorites list.
  - Persist favorites in localStorage for seamless access across sessions.
- **Genre and Actor Insights**:
  - View top genres with percentage distribution based on the catalog.
  - Discover top-featured actors with their movie counts and share percentages.
- **Interactive UI**:
  - Custom preloader with a visually engaging seat-shuffling animation.
  - Smooth scroll-to-top functionality.
  - Custom cursor with a trailing effect for an enhanced user experience.
- **Responsive Design**: Optimized for various screen sizes with Tailwind CSS.
- **Backend Integration**: Fetches data from a MySQL database via PHP APIs with CORS support.
- **Error Handling**: Graceful handling of API errors and empty search results with user-friendly messages.

---

## Screenshot

![SMDB Screenshot](https://github.com/zsoltikaa/SMDB/blob/main/frontend/assets/screenshots/main_page.jpg?raw=true)

---

## Installation

Follow these steps to set up SMDB locally:

### Prerequisites
- **Web Server**: Apache, Nginx, or any server supporting PHP (e.g., XAMPP, WAMP).
- **MySQL**: A MySQL server to host the database.
- **Node.js**: Optional, for local development or additional tooling.
- **Git**: To clone the repository.

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/smdb.git
   cd smdb
   ```

2. **Set Up the Database**:
   - Import the `smdb.sql` file into your MySQL server to create the `SMDB` database and populate the `entries` table:
     ```bash
     mysql -u root -p SMDB < smdb.sql
     ```
   - Ensure the database uses `utf8mb4` encoding with `utf8mb4_hungarian_ci` collation.

3. **Configure the Backend**:
   - Update `connect.php` with your MySQL credentials if different from the defaults:
     ```php
     $servername = "localhost";
     $username = "root";
     $password = "";
     $dbname = "SMDB";
     ```
   - Place the PHP files (`connect.php`, `smdb.php`, `topactors.php`) in your server's root directory (e.g., `/htdocs` for XAMPP).

4. **Host the Frontend**:
   - Copy the frontend files (`index.html`, `preloader.html`, `app.js`, `MainController.js`, `PreloaderController.js`, and any CSS/JS assets) to your server's public directory.
   - Ensure the AngularJS and Font Awesome CDNs are accessible or host them locally.

5. **Start the Server**:
   - Start your web server (e.g., Apache via XAMPP).
   - Ensure the MySQL server is running.

6. **Access the Application**:
   - Open your browser and navigate to `http://localhost/SMDB` (adjust the path based on your server setup).

---

## Usage

1. **Browse the Catalog**:
   - Upon loading, SMDB fetches all movies and series from the backend API.
   - View the total count of movies, series, and favorites at the top.
   - Explore top genres and featured actors with their respective statistics.

2. **Filter and Search**:
   - Use the dropdown to switch between Movies and Series.
   - Enter a title or director name in the search inputs to filter results.
   - Toggle the "Show Favorites" option to view only your saved favorites.

3. **Sort Results**:
   - Select a sorting option (Title, Release Date, Director, IMDb Rating) from the dropdown.
   - Toggle the sort order (ascending/descending) using the arrow button.

4. **Manage Favorites**:
   - Click the heart icon next to an entry to add/remove it from your favorites.
   - Favorites are saved to localStorage and persist across sessions.

5. **Interact with the UI**:
   - Enjoy the preloader animation on page load, which fades out after 3 seconds.
   - Move your mouse to see the custom cursor with trailing dots.
   - Scroll down the page to reveal the "Scroll to Top" button for quick navigation.

6. **Handle No Results**:
   - If your search yields no results, a friendly message will prompt you to try another query.

---

## File Structure

```
smdb/
├── backend/
│   ├── api/
│   │   ├── connect.php          # Database connection configuration
│   │   ├── smdb.php             # API to fetch all movies/series
│   │   ├── topactors.php        # API to fetch top actors
│   ├── database/
│   │   ├── smdb.sql             # SQL script for database setup
├── frontend/
│   ├── assets/
│   │   ├── icon/                # Directory for icon files
│   │   ├── img/                 # Directory for image files
│   │   ├── screenshots/         # Directory for screenshot files
│   ├── css/
│   │   ├── animations.css       # CSS for animations
│   │   ├── base.css             # Base CSS styles
│   │   ├── components.css       # Styles for components
│   │   ├── cursor.css           # Styles for custom cursor
│   │   ├── interactions.css     # Styles for interactive elements
│   │   ├── layout.css           # Layout-related CSS
│   │   ├── output.css           # Compiled output CSS
│   │   ├── preloader.css        # Styles for preloader
│   │   ├── scroll.css           # Styles for scroll behavior
│   │   ├── sections.css         # Styles for sections
│   │   ├── typography.css       # Typography styles
│   ├── js/
│   │   ├── node_modules/        # Node.js modules (if used)
│   │   ├── app.js               # AngularJS module initialization
│   │   ├── MainController.js    # Main AngularJS controller for app logic
│   │   ├── PreloaderController.js # JavaScript for preloader animation
│   ├── index.html               # Main application HTML
│   ├── preloader.html           # Preloader HTML with seat animation
├── README.md                    # This file
```

## Technologies Used

- **Frontend**:
  - **AngularJS**: For dynamic data binding and application logic.
  - **Tailwind CSS**: For responsive and modern styling.
  - **Font Awesome**: For icons (e.g., sort order, favorites).
  - **HTML5/CSS3**: For structure and custom animations.
  - **JavaScript**: For custom cursor and preloader effects.

- **Backend**:
  - **PHP**: For API endpoints to fetch data.
  - **MySQL**: For storing movie and series data.
  - **CORS**: Enabled for cross-origin API access.

- **External Libraries**:
  - AngularJS (via CDN)
  - Font Awesome (via CDN)

---

## Database Schema

The database (`SMDB`) contains a single table, `entries`, with the following schema:

```sql
CREATE TABLE entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  img VARCHAR(255) NOT NULL,           -- Poster image URL
  title VARCHAR(255) NOT NULL,         -- Movie/Series title
  director VARCHAR(255) NOT NULL,      -- Director's name
  descr VARCHAR(255) NOT NULL,         -- Short description
  actor VARCHAR(255) NOT NULL,         -- Main actors
  release_date VARCHAR(255) NOT NULL,  -- Release date
  imdb_rating VARCHAR(255) NOT NULL,   -- IMDb rating
  stream_link VARCHAR(255) NOT NULL,   -- Streaming platform URL
  trailer_link VARCHAR(255) NOT NULL,  -- Trailer URL
  medium ENUM('Movie', 'Series') NOT NULL, -- Type: Movie or Series
  genre VARCHAR(255) NOT NULL          -- Genre
);
```

The table is populated with 141 entries, including popular movies and series across genres like Sci-Fi, Crime, Action, and more.

---

## API Endpoints

SMDB uses two PHP-based API endpoints to fetch data:

1. **`smdb.php`**:
   - **URL**: `http://localhost/SMDB/backend/api/smdb.php`
   - **Method**: GET
   - **Response**: JSON array of all entries from the `entries` table.
   - **Example**:
     ```json
     [
       {
         "id": 1,
         "img": "alien.jpg",
         "title": "Alien",
         "director": "Ridley Scott",
         ...
       },
       ...
     ]
     ```

2. **`topactors.php`**:
   - **URL**: `http://localhost/SMDB/backend/api/topactors.php`
   - **Method**: GET
   - **Response**: JSON array of the top 3 actors with their movie counts and percentage share.
   - **Example**:
     ```json
     [
       {
         "name": "Tom Hardy",
         "moviesCount": 5,
         "percent": 4
       },
       ...
     ]
     ```

---

## Contributing

Contributions are welcome! To contribute to SMDB:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -m "Add your feature"`).
4. Push to your branch (`git push origin feature/your-feature`).
5. Open a pull request with a detailed description of your changes.

Please ensure your code follows the project's coding style and includes appropriate tests.

---

**Created with ❤️ by Me**

Enjoy exploring the world of movies and series with SMDB! 🎬
