// events.js

document.addEventListener('DOMContentLoaded', () => {
    const monthButtons = document.querySelectorAll('.event-month-btn');
    const calendarItems = document.querySelectorAll('.event-calendar-item');

    // Function to show a specific calendar and hide others
    function showCalendar(monthId) {
        calendarItems.forEach(item => {
            if (item.id === monthId) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    // Function to set active button state
    function setActiveButton(activeButton) {
        monthButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        activeButton.classList.add('active');
    }

    // Add click event listeners to month buttons
    monthButtons.forEach(button => {
        button.addEventListener('click', () => {
            const monthId = button.dataset.month; // Get the month ID from data-month attribute
            showCalendar(monthId);
            setActiveButton(button);
        });
    });

    // Set the initial active month when the page loads
    // This will activate the month that has 'active' class in HTML, or the first one if none is active
    const initialActiveButton = document.querySelector('.event-month-btn.active');
    if (initialActiveButton) {
        showCalendar(initialActiveButton.dataset.month);
    } else if (monthButtons.length > 0) {
        // If no active button is set in HTML, activate the first one and show its content
        monthButtons[0].classList.add('active');
        showCalendar(monthButtons[0].dataset.month);
    }
});