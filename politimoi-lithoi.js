// politimoi-lithoi.js

document.addEventListener('DOMContentLoaded', () => {

    // Δεδομένα για κάθε αντικείμενο
    const gemsData = {
        'damage-stone': {
            title: 'Πέτρα της Ζημιάς',
            image: 'images/damage_gem.jpg',
            statsImage: 'images/damage_gem_stats.jpg'
        },

        'health-stone': {
            title: 'Πέτρα της Ζωής',
            image: 'images/health_gem.jpg', 
            statsImage: 'images/health_gem_stats.jpg'
        },

        'attack_speed-stone': {
            title: 'Πέτρα της Επιτάχυνσης Επίθεσης',
            image: 'images/attack_speed_gem.jpg', 
            statsImage: 'images/attack_speed_gem_stats.jpg'
        },

        'movement_speed-stone': {
            title: 'Πέτρα της Ταχύτητας Κίνησης',
            image: 'images/movement_speed_gem.jpg', 
            statsImage: 'images/movement_speed_gem_stats.jpg'
        },

        'block-stone': {
            title: 'Πέτρα του Φραγμού',
            image: 'images/block_gem.jpg', 
            statsImage: 'images/block_gem_stats.jpg'
        },

        'critical-stone': {
            title: 'Πέτρα της Κρίσιμης Ζημιάς',
            image: 'images/crit_gem.jpg', 
            statsImage: 'images/crit_gem_stats.jpg'
        },

        'armor-stone': {
            title: 'Πέτρα της Πανοπλίας',
            image: 'images/stones/imperial-ruby.jpg', 
            statsImage: 'images/tooltips/ruby-tooltip.png'
        },

        'fire_res-stone': {
            title: 'Πέτρα της Αντίστασης στην Φωτιά',
            image: 'images/stones/imperial-ruby.jpg', 
            statsImage: 'images/tooltips/ruby-tooltip.png'
        },

        'poison_res-stone': {
            title: 'Πέτρα της Αντίστασης στο Δηλητήριο',
            image: 'images/stones/imperial-ruby.jpg', 
            statsImage: 'images/tooltips/ruby-tooltip.png'
        },

        'ice_res-stone': {
            title: 'Πέτρα της Αντίστασης στον Πάγο',
            image: 'images/stones/imperial-ruby.jpg', 
            statsImage: 'images/tooltips/ruby-tooltip.png'
        },

        'lightning_res-stone': {
            title: 'Πέτρα της Αντίστασης στον Κεραυνό',
            image: 'images/stones/imperial-ruby.jpg', 
            statsImage: 'images/tooltips/ruby-tooltip.png'
        }
    };

    // ----- Λειτουργία Εμφάνισης/Απόκρυψης Λίστας (Προηγούμενο βήμα) -----
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const categoryId = button.dataset.category;
            const gemList = document.getElementById(categoryId);
            gemList.classList.toggle('show');
            if (gemList.classList.contains('show')) {
                button.innerHTML = '<i class="fas fa-minus-circle"></i> Απόκρυψη';
            } else {
                button.innerHTML = '<i class="fas fa-plus-circle"></i> Εμφάνιση';
            }
        });
    });

    // ----- Νέα Λειτουργία για το Modal (Μόνο Εικόνα) -----
    const modal = document.getElementById('gemModal');
    const closeBtn = document.querySelector('.close-btn');
    
    // Στοιχεία του Modal
    const modalGemImage = document.getElementById('modalGemImage'); // Μικρή εικόνα τίτλου
    const modalGemTitle = document.getElementById('modalGemTitle'); // Τίτλος
    const modalStatsImage = document.getElementById('modalStatsImage'); // Μεγάλη εικόνα στατιστικών
    
    const gemItems = document.querySelectorAll('.gem-item'); 

    // Όταν πατάμε σε ένα αντικείμενο
    gemItems.forEach(item => {
        item.addEventListener('click', () => {
            const gemId = item.dataset.gemId;
            const gemInfo = gemsData[gemId];

            if (gemInfo) {
                // 1. Βάζουμε τη μικρή εικόνα και τον τίτλο
                modalGemImage.src = gemInfo.image;
                modalGemTitle.textContent = gemInfo.title;

                // 2. Βάζουμε τη ΜΕΓΑΛΗ εικόνα (tooltip)
                // Αν δεν υπάρχει εικόνα, βάζουμε μια κενή ή placeholder
                if (gemInfo.statsImage) {
                    modalStatsImage.src = gemInfo.statsImage;
                    modalStatsImage.style.display = 'inline-block';
                } else {
                    modalStatsImage.style.display = 'none'; // Αν ξέχασες να βάλεις φώτο, να μην φαίνεται σπασμένο εικονίδιο
                }

                // 3. Εμφανίζουμε το παράθυρο
                modal.style.display = 'block';
            }
        });
    });

    // Κλείσιμο παραθύρου
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

});