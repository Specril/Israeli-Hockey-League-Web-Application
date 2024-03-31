document.addEventListener('DOMContentLoaded', () => {
    // Example of dynamic behavior: Highlight current day's games
    highlightTodaysGames();
});

function highlightTodaysGames() {
    const today = new Date().toISOString().split('T')[0];
    const gameRows = document.querySelectorAll('#upcoming-games tbody tr');
    gameRows.forEach(row => {
        const gameDate = row.cells[0].textContent;
        if (gameDate === today) {
            row.style.backgroundColor = '#ffff99'; // Highlight with a light yellow color
        }
    });
}
document.addEventListener('scroll', () => {
    const navbar = document.querySelector('nav');
    const scrollThreshold = 100; // Change as needed
    navbar.style.opacity = window.scrollY > scrollThreshold ? '0.9' : '1';
});
function toggleLoginForm() {
    var form = document.getElementById('login-form');
    if (form.style.display === 'block') {
        form.style.display = 'none';
    } else {
        form.style.display = 'block';
    }
}

function login() {
    // Placeholder function for login action
    alert('Login functionality not implemented yet.');
}
