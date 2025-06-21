// script.js

function setActiveNavLinks() {
    const currentPath = window.location.pathname.split('/').pop();
    // If the path is empty (e.g., just the domain), assume it's index.html
    const currentPage = currentPath === '' || currentPath === 'index.html' ? 'index.html' : currentPath;

    // Handle Top Navigation (Desktop) - As per your preference, no active class styling here
    const topNavLinks = document.querySelectorAll('.top-navbar .navbar-link');
    topNavLinks.forEach(link => {
        // No 'active' class applied or removed for desktop navigation links
        // If you later decide to add active styling for desktop, uncomment and adjust:
        // if (link.getAttribute('href').split('/').pop() === currentPage) {
        //     link.classList.add('active'); // You'd need to define .active styles for .navbar-link
        // } else {
        //     link.classList.remove('active');
        // }
    });

    // Handle Bottom Navigation (Mobile) - Apply active class for current page
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    bottomNavItems.forEach(item => {
        item.classList.remove('active'); // Remove 'active' from all items first
        const itemPath = item.getAttribute('data-path');
        if (itemPath === currentPage) {
            item.classList.add('active'); // Add 'active' to the matching item
        }
    });
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', setActiveNavLinks);

// Also call it if the URL's hash changes (though not typically needed for multi-page sites)
window.addEventListener('hashchange', setActiveNavLinks);
