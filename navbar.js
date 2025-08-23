// home.js (ή main.js)

document.addEventListener('DOMContentLoaded', () => {
    // Logic for Back to Top Button (αν υπάρχει)
    const backToTopBtn = document.getElementById('backToTopBtn');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });// news.js

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for quick navigation links
    document.querySelectorAll('.quick-nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;

                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - navbarHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Leaks Gallery Logic (Reverted to simple grid display)
    const leaksGalleryContainer = document.querySelector('.leaks-gallery-container');
    const noLeaksMessage = document.getElementById('no-leaks-message');
    let allLeaksData = [];

    const loadLeaksImages = async () => {
        try {
            const response = await fetch('leaks-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allLeaksData = await response.json();
            allLeaksData.sort((a, b) => new Date(b.date_added) - new Date(a.date_added)); // Sort by newest
            displayLeaksImages();
        } catch (error) {
            console.error('Error loading leaks data:', error);
            leaksGalleryContainer.innerHTML = '<p class="error-message">Αδυναμία φόρτωσης των διαρροών. Παρακαλώ δοκιμάστε ξανά αργότερα.</p>';
            noLeaksMessage.classList.add('hidden');
        }
    };

    const displayLeaksImages = () => {
        leaksGalleryContainer.innerHTML = ''; // Clear current images

        if (allLeaksData.length === 0) {
            noLeaksMessage.classList.remove('hidden');
        } else {
            noLeaksMessage.classList.add('hidden');
            allLeaksData.forEach(leak => {
                const leakItem = document.createElement('div');
                leakItem.classList.add('leak-item');
                
                // Clicking the image wrapper (or image itself) will open the image
                const imageWrapper = document.createElement('div');
                imageWrapper.classList.add('image-wrapper');
                imageWrapper.addEventListener('click', () => {
                    window.open(leak.src, '_blank');
                });

                const imgElement = document.createElement('img');
                imgElement.src = leak.src;
                imgElement.alt = leak.alt;
                imgElement.loading = 'lazy';

                const overlay = document.createElement('div');
                overlay.classList.add('overlay');

                const title = document.createElement('h3');
                title.textContent = leak.alt;

                const description = document.createElement('p');
                description.textContent = leak.description;

                const dateAdded = document.createElement('small');
                const displayDate = leak.date_added ? new Date(leak.date_added).toLocaleDateString() : '';
                dateAdded.textContent = `Δημοσιεύτηκε: ${displayDate}`;

                overlay.appendChild(title);
                overlay.appendChild(description);
                overlay.appendChild(dateAdded);

                imageWrapper.appendChild(imgElement);
                imageWrapper.appendChild(overlay);

                leakItem.appendChild(imageWrapper);

                // Add Gemini API analysis button and result area
                const analyzeBtn = document.createElement('button');
                analyzeBtn.classList.add('analyze-leak-btn');
                analyzeBtn.innerHTML = '<i class="fas fa-brain"></i> Ανάλυση Διαρροής';
                
                const analysisResultDiv = document.createElement('div');
                analysisResultDiv.classList.add('leak-analysis-result');
                analysisResultDiv.classList.add('hidden');

                const loadingSpinner = document.createElement('div');
                loadingSpinner.classList.add('loading-spinner');
                loadingSpinner.classList.add('hidden');

                analysisResultDiv.appendChild(loadingSpinner);
                
                analyzeBtn.addEventListener('click', async (event) => {
                    event.stopPropagation();
                    
                    if (analysisResultDiv.classList.contains('hidden')) {
                        analysisResultDiv.classList.remove('hidden');
                        loadingSpinner.classList.remove('hidden');
                        analysisResultDiv.innerHTML = '';
                        analysisResultDiv.appendChild(loadingSpinner);

                        try {
                            const prompt = `Ανάλυσε την ακόλουθη διαρροή (leak) από το παιχνίδι Drakensang Online και πρόβλεψε τον πιθανό αντίκτυπό της στο gameplay, την οικονομία του παιχνιδιού ή τις κλάσεις των χαρακτήρων. Η διαρροή είναι: "${leak.description}".`;
                            
                            let chatHistory = [];
                            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
                            const payload = { contents: chatHistory };
                            const apiKey = "";
                            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                            const response = await fetch(apiUrl, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(payload)
                            });
                            
                            if (!response.ok) {
                                throw new Error(`API request failed with status: ${response.status}`);
                            }

                            const result = await response.json();
                            
                            if (result.candidates && result.candidates.length > 0 &&
                                result.candidates[0].content && result.candidates[0].content.parts &&
                                result.candidates[0].content.parts.length > 0) {
                                const text = result.candidates[0].content.parts[0].text;
                                analysisResultDiv.innerHTML = `<p>${text}</p>`;
                            } else {
                                analysisResultDiv.innerHTML = '<p>Δεν ήταν δυνατή η ανάλυση της διαρροής αυτή τη στιγμή.</p>';
                            }
                        } catch (error) {
                            console.error('Error calling Gemini API:', error);
                            analysisResultDiv.innerHTML = `<p>Σφάλμα ανάλυσης: ${error.message}.</p>`;
                        } finally {
                            loadingSpinner.classList.add('hidden');
                        }
                    } else {
                        analysisResultDiv.classList.add('hidden');
                    }
                });

                leakItem.appendChild(analyzeBtn);
                leakItem.appendChild(analysisResultDiv);

                leaksGalleryContainer.appendChild(leakItem);
            });
        }
    };

    // Initial load of leaks images
    loadLeaksImages();
});

        });
    }

    // NEW: Logic for Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const dropdown = document.querySelector('.navbar .dropdown');
    const dropbtn = document.querySelector('.navbar .dropbtn');
    const dropdownContent = document.querySelector('.navbar .dropdown-content');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Κλείσιμο dropdown αν είναι ανοιχτό όταν κλείνει το hamburger
            if (!navLinks.classList.contains('active') && dropdownContent) {
                dropdownContent.style.display = 'none';
            }
        });

        // NEW: Logic for Dropdown inside Hamburger (click instead of hover)
        if (dropbtn && dropdownContent) {
            dropbtn.addEventListener('click', (event) => {
                // Αποτροπή της προεπιλεγμένης συμπεριφοράς του link (να μην πηγαίνει στο #)
                event.preventDefault(); 
                // Εναλλαγή εμφάνισης του dropdown-content
                // Χρησιμοποιούμε style.display για να παρακάμψουμε το :hover
                if (window.innerWidth <= 1024) { // Εφαρμόζεται μόνο σε μικρές οθόνες
                    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
                }
            });

            // Κλείσιμο dropdown όταν κάνεις click έξω από αυτό
            document.addEventListener('click', (event) => {
                if (window.innerWidth <= 1024) {
                    if (!dropdown.contains(event.target) && dropdownContent.style.display === 'block') {
                        dropdownContent.style.display = 'none';
                    }
                }
            });
        }
    }

    // Logic to hide dropdown content when resizing from mobile to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            if (navLinks) {
                navLinks.classList.remove('active'); // Hide hamburger menu if active
            }
            if (dropdownContent) {
                dropdownContent.style.display = ''; // Reset display for dropdown
            }
        }
    });

    // Handle active class for dropdown items
    // This part ensures the active class is applied correctly for dropdown items
    const currentPath = window.location.pathname.split('/').pop();
    const dropdownLinks = document.querySelectorAll('.dropdown-content a');
    dropdownLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
            // Optionally, if the active link is inside a dropdown,
            // you might want the dropdown to be open by default on load,
            // but this can be complex with dynamic styling.
            // For now, we rely on the user clicking the dropbtn.
        } else {
            link.classList.remove('active');
        }
    });
});