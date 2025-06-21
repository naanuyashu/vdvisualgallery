/**
 * Lightbox functionality
 */
const lightboxOverlay = document.getElementById('lightbox-overlay');
const lightboxContent = document.getElementById('lightbox-content');
const lightboxTitle = document.getElementById('lightbox-title');
let currentMediaIndex = 0;
let filteredMedia = []; // Store currently filtered/sorted media items

function openLightbox(element) {
    const isImage = element.tagName === 'IMG';
    const parentCard = element.closest('.image-card'); // Assuming all media are in .image-card
    const src = parentCard.getAttribute('data-src');
    const title = parentCard.getAttribute('data-title');
    const type = parentCard.getAttribute('data-type'); // 'image' or 'video'

    if (type === 'image') {
        lightboxContent.innerHTML = `<img src="${src}" alt="${title}">`;
        // Apply grayscale to the lightbox image initially
        lightboxContent.querySelector('img').style.filter = 'grayscale(100%)';
        // Remove grayscale on load for a smooth transition
        lightboxContent.querySelector('img').onload = function() {
            this.style.filter = 'grayscale(0%)';
        };
    } else if (type === 'video') {
        lightboxContent.innerHTML = `<video controls autoplay loop><source src="${src}" type="video/mp4"></video>`;
    } else {
        lightboxContent.innerHTML = `<p class="error-message">Unsupported media type.</p>`;
    }

    lightboxTitle.textContent = title;
    lightboxOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    lightboxOverlay.focus(); // Focus the overlay for keyboard navigation

    // Populate filteredMedia based on current visible items
    const visibleCards = Array.from(document.querySelectorAll('#image-grid .image-card:not([style*="display: none"])'));
    filteredMedia = visibleCards.map(card => ({
        src: card.getAttribute('data-src'),
        title: card.getAttribute('data-title'),
        type: card.getAttribute('data-type')
    }));

    // Find the index of the current media in the filtered list
    currentMediaIndex = filteredMedia.findIndex(media => media.src === src);

    updateLightboxNavArrows();
}

function closeLightbox() {
    lightboxOverlay.classList.remove('visible');
    document.body.style.overflow = ''; // Restore scrolling
    lightboxContent.innerHTML = ''; // Clear content
}

function navigateLightbox(direction) {
    if (filteredMedia.length === 0) return;

    currentMediaIndex += direction;
    if (currentMediaIndex < 0) {
        currentMediaIndex = filteredMedia.length - 1;
    } else if (currentMediaIndex >= filteredMedia.length) {
        currentMediaIndex = 0;
    }

    const media = filteredMedia[currentMediaIndex];

    if (media.type === 'image') {
        lightboxContent.innerHTML = `<img src="${media.src}" alt="${media.title}">`;
        lightboxContent.querySelector('img').style.filter = 'grayscale(100%)'; // Apply grayscale
        lightboxContent.querySelector('img').onload = function() {
            this.style.filter = 'grayscale(0%)'; // Remove grayscale on load
        };
    } else if (media.type === 'video') {
        lightboxContent.innerHTML = `<video controls autoplay loop><source src="${media.src}" type="video/mp4"></video>`;
    }
    lightboxTitle.textContent = media.title;
    updateLightboxNavArrows();
}

function updateLightboxNavArrows() {
    const prevArrow = document.getElementById('lightbox-prev');
    const nextArrow = document.getElementById('lightbox-next');

    // Only show arrows if there's more than one item
    if (filteredMedia.length > 1) {
        prevArrow.style.display = 'block';
        nextArrow.style.display = 'block';
    } else {
        prevArrow.style.display = 'none';
        nextArrow.style.display = 'none';
    }
}

// Close lightbox on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && lightboxOverlay.classList.contains('visible')) {
        closeLightbox();
    }
    if (event.key === 'ArrowLeft' && lightboxOverlay.classList.contains('visible')) {
        navigateLightbox(-1);
    }
    if (event.key === 'ArrowRight' && lightboxOverlay.classList.contains('visible')) {
        navigateLightbox(1);
    }
});


/**
 * Gallery Filtering Functionality
 */
function filterGallery(type, category) {
    const galleryItems = document.querySelectorAll(`#image-grid .${type}-card`); // Select all cards of specified type

    galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
            item.style.display = ''; // Show the item
        } else {
            item.style.display = 'none'; // Hide the item
        }
    });

    // Re-sort the gallery after filtering, using the currently selected sort option
    const currentSortValue = document.getElementById('sort-images').value;
    sortGallery(type, currentSortValue);
}

/**
 * Gallery Sorting Functionality
 */
function sortGallery(type, sortBy) {
    const galleryGrid = document.getElementById('image-grid');
    // Select only visible items (after filtering) for sorting
    let itemsToSort = Array.from(galleryGrid.querySelectorAll(`.${type}-card:not([style*="display: none"])`));

    itemsToSort.sort((a, b) => {
        const titleA = a.getAttribute('data-title').toLowerCase();
        const titleB = b.getAttribute('data-title').toLowerCase();

        if (sortBy === 'title-asc') {
            return titleA.localeCompare(titleB);
        } else if (sortBy === 'title-desc') {
            return titleB.localeCompare(titleA);
        }
        // Default (or original) order for other cases
        return 0; // Maintain original order if no specific sort is applied
    });

    // Re-append sorted items to the grid
    itemsToSort.forEach(item => galleryGrid.appendChild(item));
}

// Initial filtering/sorting when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Ensure all items are visible initially before any filter is applied
    document.querySelectorAll('#image-grid .image-card').forEach(item => {
        item.style.display = '';
    });

    // Apply the default sort
    sortGallery('image', 'default');
});