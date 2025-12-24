document.addEventListener('DOMContentLoaded', () => {
    const categoryButtons = document.querySelectorAll('.gallery-tab-btn');
    const imageGalleryContainer = document.getElementById('image-gallery-container');
    const loadingMessage = document.getElementById('loading-images-message'); 
    const noFilteredImagesMessage = document.getElementById('no-filtered-images-message'); 
    const uploadForm = document.getElementById('uploadForm'); // Η φόρμα μας
    const uploadStatus = document.getElementById('upload-status'); // Μήνυμα κατάστασης
    
    // ΑΛΛΑΓΗ: Πλέον παίρνουμε δεδομένα από το PHP αρχείο, όχι το JSON
    const API_GALLERY_DATA_URL = 'get_images.php'; 

    let allImages = []; 

    // --- Function: Render Images ---
    const renderImages = (imagesToRender) => {
        imageGalleryContainer.innerHTML = ''; 
        loadingMessage.classList.add('hidden'); 

        if (imagesToRender.length === 0) {
            noFilteredImagesMessage.classList.remove('hidden'); 
        } else {
            noFilteredImagesMessage.classList.add('hidden'); 
            
            imagesToRender.forEach(image => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';

                // Image Wrapper
                const imageWrapper = document.createElement('div');
                imageWrapper.className = 'image-wrapper';

                const img = document.createElement('img');
                img.src = image.image_url; 
                img.alt = image.description || 'Drakensang Image'; 
                
                img.onerror = () => {
                    img.src = 'https://placehold.co/400x400/382D4A/E0E0E0?text=Image+Error'; 
                };

                imageWrapper.appendChild(img);
                galleryItem.appendChild(imageWrapper);

                // Image Overlay
                const imageOverlay = document.createElement('div');
                imageOverlay.className = 'image-overlay';

                // Εμφάνιση περιγραφής αν υπάρχει
                if(image.description) {
                    const desc = document.createElement('p');
                    desc.className = 'image-description';
                    desc.textContent = image.description;
                    imageOverlay.appendChild(desc);
                }

                const submitterInfo = document.createElement('span');
                submitterInfo.className = 'submitter-info';
                submitterInfo.textContent = `Από: ${image.submitter_name}`; 
                imageOverlay.appendChild(submitterInfo);
                
                galleryItem.appendChild(imageOverlay);
                imageGalleryContainer.appendChild(galleryItem);

                galleryItem.addEventListener('click', () => {
                    if (image.image_url) { 
                        window.open(image.image_url, '_blank'); 
                    }
                });
            });
        }
    };
    
    // --- Function: Fetch Images ---
    const fetchAllImages = async () => {
        try {
            const response = await fetch(API_GALLERY_DATA_URL);
            if (!response.ok) throw new Error('Network error');
            allImages = await response.json();
            renderImages(allImages); 
        } catch (error) {
            console.error('Error fetching gallery data:', error);
            imageGalleryContainer.innerHTML = `<p class="error-message">Αδυναμία φόρτωσης. Ελέγξτε τη σύνδεση με τη βάση.</p>`;
            loadingMessage.classList.add('hidden'); 
        }
    };

    // --- Function: Handle Form Submit (AJAX) ---
    if(uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Σταματάει το refresh της σελίδας
            
            const formData = new FormData(uploadForm);
            uploadStatus.textContent = "Ανέβασμα...";
            uploadStatus.style.color = "#FF6700";

            try {
                const response = await fetch('upload.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();

                if (result.success) {
                    uploadStatus.textContent = "Επιτυχία! Η εικόνα προστέθηκε.";
                    uploadStatus.style.color = "#90EE90";
                    
                    // Καθαρισμός φόρμας
                    uploadForm.reset();

                    // Προσθήκη της νέας εικόνας στην αρχή της λίστας
                    allImages.unshift(result.data);
                    
                    // Ξανα-ζωγραφίζουμε τη gallery αμέσως
                    renderImages(allImages);
                } else {
                    uploadStatus.textContent = "Σφάλμα: " + result.message;
                    uploadStatus.style.color = "red";
                }
            } catch (error) {
                console.error("Upload error:", error);
                uploadStatus.textContent = "Σφάλμα σύνδεσης με τον server.";
            }
        });
    }

    // --- Tab Filtering ---
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.dataset.category;
            
            let filteredImages = (category === 'all') 
                ? allImages 
                : allImages.filter(img => img.category === category);
            
            renderImages(filteredImages); 
        });
    });

    fetchAllImages();
});