// recipes.js

document.addEventListener('DOMContentLoaded', () => {
    // Selectors for main category buttons
    const categoryButtons = document.querySelectorAll('.recipes-tab-btn');
    const recipeCategoryContents = document.querySelectorAll('.recipe-category-content');

    // Since there are no sub-category buttons, these selectors are no longer needed
    // const subCategorySelection = document.querySelector('.sub-category-selection');
    // const subCategoryButtons = document.querySelectorAll('.sub-recipes-tab-btn');
    // const recipeSubCategoryContents = document.querySelectorAll('.recipe-subcategory-content');

    // --- Function to show a specific category content ---
    const showCategory = (categoryToShow) => {
        recipeCategoryContents.forEach(content => {
            if (content.id === `${categoryToShow}-content`) {
                content.classList.remove('hidden');
            } else {
                content.classList.add('hidden');
            }
        });

        // Handle the "gems-runes" category directly, no sub-buttons needed
        // If "gems-runes" is selected, its content (the runes) will be displayed.
        // No need for a sub-category selection bar or sub-category buttons.
    };

    // --- Event Listeners for main category buttons ---
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.dataset.category;
            showCategory(category);
        });
    });

    // --- Initial display on page load ---
    // Activate the default category (Kitchen)
    const defaultCategoryButton = document.querySelector('.recipes-tab-btn.active');
    if (defaultCategoryButton) {
        showCategory(defaultCategoryButton.dataset.category);
    } else {
        // Fallback if no active class is set
        showCategory('kitchen'); 
        document.querySelector('.recipes-tab-btn[data-category="kitchen"]').classList.add('active');
    }

});
