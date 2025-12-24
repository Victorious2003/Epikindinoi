// guides.js

document.addEventListener('DOMContentLoaded', () => {
    const classTabButtons = document.querySelectorAll('.class-tab-btn');
    const classGuideContents = document.querySelectorAll('.class-guide-content');

    classTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'active' class from all buttons
            classTabButtons.forEach(btn => btn.classList.remove('active'));

            // Add 'active' class to the clicked button
            button.classList.add('active');

            // Hide all guide contents
            classGuideContents.forEach(content => content.classList.add('hidden'));

            // Show the corresponding guide content
            const targetClass = button.dataset.class; // Get the data-class value (e.g., 'warrior')
            const targetContent = document.getElementById(targetClass);
            if (targetContent) {
                targetContent.classList.remove('hidden');

                // Add 'active' class after a tiny delay to trigger CSS animation
                setTimeout(() => {
                    targetContent.classList.add('active');
                }, 10); // Very small delay (e.g., 10ms)
            }
        });
    });
});