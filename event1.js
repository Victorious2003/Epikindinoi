// events.js
let allEventsData = {};

// 1. Φόρτωση δεδομένων κατά την εκκίνηση
async function loadEvents() {
    try {
        const response = await fetch('events-data.json');
        if (!response.ok) throw new Error("Απέτυχε η φόρτωση του JSON");
        
        allEventsData = await response.json();
        
        // Βρες όλα τα διαθέσιμα έτη και ταξινόμησέ τα (φθίνουσα)
        const years = Object.keys(allEventsData).sort((a, b) => b - a);
        
        if (years.length > 0) {
            populateDropdown(years);
            renderMonths(years[0]); // Δείξε το πιο πρόσφατο έτος αυτόματα
        }
    } catch (error) {
        console.error("Σφάλμα:", error);
        document.getElementById('calendarGrid').innerHTML = "<p style='color:red; text-align:center;'>Σφάλμα φόρτωσης δεδομένων.</p>";
    }
}

// 2. Γέμισμα του Dropdown Menu
function populateDropdown(years) {
    const select = document.getElementById('yearSelect');
    select.innerHTML = years.map(year => 
        `<option value="${year}">${year}</option>`
    ).join('');
}

// 3. Όταν ο χρήστης αλλάζει έτος από το Dropdown
function selectYear(year) {
    renderMonths(year);
}

// 4. Εμφάνιση των καρτών (Μήνες) στο Grid
function renderMonths(year) {
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = ''; // Καθαρισμός προηγούμενων
    
    if (!allEventsData[year]) return;

    const months = allEventsData[year];

    // Δημιουργία HTML για κάθε μήνα
    for (const [key, data] of Object.entries(months)) {
        grid.innerHTML += `
            <div class="month-card" onclick="openModal('${year}', '${key}')">
                <div class="month-icon">
                    <i class="fas ${data.icon}"></i>
                </div>
                <div class="month-name">${data.name}</div>
                <div class="year-label">${year}</div>
            </div>
        `;
    }
}

// 5. Διαχείριση Modal (Αναδυόμενο Παράθυρο)
function openModal(year, monthKey) {
    const data = allEventsData[year][monthKey];
    const modal = document.getElementById('eventModal');
    
    document.getElementById('modalTitle').innerText = `${data.name} ${year}`;
    document.getElementById('modalBody').innerHTML = `<pre>${data.content}</pre>`;
    
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Απενεργοποίηση scroll στη σελίδα
}

function closeModal() {
    document.getElementById('eventModal').style.display = "none";
    document.body.style.overflow = "auto"; // Επαναφορά scroll
}

// Κλείσιμο με κλικ έξω από το παράθυρο
window.onclick = function(event) {
    const modal = document.getElementById('eventModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Εκκίνηση
document.addEventListener('DOMContentLoaded', loadEvents);