// gallery.js

document.addEventListener('DOMContentLoaded', () => {
    // Selectors for gallery elements
    const categoryButtons = document.querySelectorAll('.gallery-tab-btn');
    const imageGalleryContainer = document.getElementById('image-gallery-container');
    const loadingMessage = document.getElementById('loading-images-message'); 
    const noFilteredImagesMessage = document.getElementById('no-filtered-images-message'); 
    
    // Path to your JSON data file
    const API_GALLERY_DATA_URL = 'gallery-data.json'; 

    let allImages = []; // Array to store all images fetched from JSON

    // --- Function to render images into the gallery container ---
    const renderImages = (imagesToRender) => {
        imageGalleryContainer.innerHTML = ''; // Clear existing images
        loadingMessage.classList.add('hidden'); // Hide loading message

        if (imagesToRender.length === 0) {
            noFilteredImagesMessage.classList.remove('hidden'); // Show "no images" message
        } else {
            noFilteredImagesMessage.classList.add('hidden'); // Hide "no images" message
            
            imagesToRender.forEach(image => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';

                // Image Wrapper
                const imageWrapper = document.createElement('div');
                imageWrapper.className = 'image-wrapper';

                const img = document.createElement('img');
                img.src = image.url; // Use the 'url' field from JSON (ensure it's a direct URL!)
                img.alt = image.alt || image.title || 'Gallery image'; // Fallback alt text
                
                // Fallback for broken images
                img.onerror = () => {
                    console.error(`Failed to load image: ${image.url}. Displaying fallback.`);
                    img.src = 'https://placehold.co/400x400/382D4A/E0E0E0?text=Image+Error'; // Generic error placeholder
                };

                imageWrapper.appendChild(img);
                galleryItem.appendChild(imageWrapper);

                // Image Overlay (for title, description, submitter info)
                const imageOverlay = document.createElement('div');
                imageOverlay.className = 'image-overlay';

                const titleElement = document.createElement('h3');
                titleElement.textContent = image.alt || image.title || 'Χωρίς Τίτλο'; // Use alt or title, fallback
                imageOverlay.appendChild(titleElement);

                const descriptionElement = document.createElement('p');
                descriptionElement.className = 'image-description';
                descriptionElement.textContent = image.description || 'Χωρίς περιγραφή.'; // Fallback description
                imageOverlay.appendChild(descriptionElement);

                const submitterInfo = document.createElement('span');
                submitterInfo.className = 'submitter-info';
                
                // Format date_added from YYYY-MM-DD to DD/MM/YYYY for display
                let formattedDate = '';
                if (image.date_added) {
                    try {
                        const dateParts = image.date_added.split('-'); // Assumes YYYY-MM-DD
                        if (dateParts.length === 3) {
                            formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
                        } else {
                            formattedDate = image.date_added; // Use as-is if format is unexpected
                        }
                    } catch (e) {
                        console.warn("Could not parse date_added:", image.date_added, e);
                        formattedDate = image.date_added; // Fallback
                    }
                }
                
                submitterInfo.textContent = `Από: ${image.submitterName || 'Άγνωστος'} | Ημ/νία: ${formattedDate || 'Άγνωστη'}`;
                imageOverlay.appendChild(submitterInfo);
                
                galleryItem.appendChild(imageOverlay);
                imageGalleryContainer.appendChild(galleryItem);

                // --- Open image in new tab on click ---
                galleryItem.addEventListener('click', () => {
                    if (image.url) {
                        window.open(image.url, '_blank'); // Open the image URL in a new tab
                    } else {
                        console.warn('Cannot open image: URL is missing for:', image.alt);
                    }
                });
            });
        }
    };

    // --- Function to fetch all images from JSON ---
    const fetchAllImages = async () => {
        loadingMessage.classList.remove('hidden'); // Show loading message
        noFilteredImagesMessage.classList.add('hidden'); // Hide any previous "no images" message

        try {
            const response = await fetch(API_GALLERY_DATA_URL);
            if (!response.ok) {
                // If JSON file not found or inaccessible, show error
                imageGalleryContainer.innerHTML = `<p class="error-message">Σφάλμα: Το αρχείο δεδομένων ${API_GALLERY_DATA_URL} δεν βρέθηκε ή δεν φορτώθηκε.</p>`;
                loadingMessage.classList.add('hidden');
                throw new Error(`HTTP error! status: ${response.status} for ${API_GALLERY_DATA_URL}`);
            }
            allImages = await response.json();
            console.log('Fetched All Images:', allImages); // Log fetched data for debugging
            renderImages(allImages); // Render all images initially
        } catch (error) {
            console.error('Error fetching gallery data:', error);
            // If already set an error message, don't override, just ensure loading is hidden
            if (imageGalleryContainer.innerHTML === '') { 
                imageGalleryContainer.innerHTML = `<p class="error-message">Αδυναμία φόρτωσης των εικόνων. Παρακαλώ δοκιμάστε ξανά αργότερα.</p>`;
            }
            loadingMessage.classList.add('hidden'); // Hide loading message on error
        }
    };

    // --- Event Listeners for category buttons ---
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            button.classList.add('active');
            // Filter images based on data-category attribute
            const category = button.dataset.category;
            
            let filteredImages = [];
            if (category === 'all') {
                filteredImages = allImages;
            } else {
                filteredImages = allImages.filter(image => image.category === category);
            }
            renderImages(filteredImages); // Render filtered images
        });
    });

    // --- Image Submission Form Logic (from previous version) ---
    const submissionForm = document.querySelector('.submission-form');
    if (submissionForm) {
        const formMessage = document.querySelector('.form-message');
        const serviceID = 'service_3x8ab6p';
        const templateID = 'template_5ibb8su';
        const publicKey = 'feiRl1GQitWf1Egib';

        submissionForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            formMessage.textContent = 'Υποβολή φωτογραφίας...';
            formMessage.className = 'form-message submitting';
            formMessage.classList.remove('hidden');

            // Get form values
            const imageUrl = document.getElementById('imageUrl').value;
            const imageAlt = document.getElementById('imageAlt').value;
            const imageDescription = document.getElementById('imageDescription').value;
            const imageCategory = document.getElementById('imageCategory').value;
            const submitterName = document.getElementById('submitterName').value;

            // Basic validation
            if (!imageUrl || !imageAlt || !imageDescription || !imageCategory || !submitterName) {
                formMessage.textContent = 'Παρακαλώ συμπληρώστε όλα τα πεδία.';
                formMessage.className = 'form-message error';
                return;
            }
            
            // Generate submission date in YYYY-MM-DD format
            const submissionDate = new Date().toISOString().slice(0, 10);

            const templateParams = {
                image_url: imageUrl,
                image_alt: imageAlt,
                image_description: imageDescription,
                image_category: imageCategory,
                submitter_name: submitterName,
                submission_date: submissionDate 
            };

            try {
                if (typeof emailjs === 'undefined') {
                    console.error('EmailJS library is not loaded. Please ensure script tag is present in HTML before gallery.js.');
                    formMessage.textContent = 'Σφάλμα: Η βιβλιοθήκη EmailJS δεν φορτώθηκε. Δοκιμάστε αργότερα.';
                    formMessage.className = 'form-message error';
                    return;
                }

                const response = await emailjs.send(serviceID, templateID, templateParams, publicKey);
                console.log('EmailJS Success:', response);

                formMessage.textContent = 'Η φωτογραφία υποβλήθηκε επιτυχώς!';
                formMessage.className = 'form-message success';
                
                submissionForm.reset(); // Clear the form
                
            } catch (error) {
                console.error('EmailJS Failed:', error);
                formMessage.textContent = 'Αδυναμία υποβολής της φωτογραφίας. Δοκιμάστε ξανά.';
                formMessage.className = 'form-message error';
            }
        });
    }

    // --- Initial call: Fetch images when the page loads ---
    fetchAllImages();
});
