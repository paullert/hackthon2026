document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".resource-card");
    const categoryFilter = document.getElementById("categoryFilter");
    const itemFilter = document.getElementById("itemFilter");
    const resultsCount = document.getElementById("resultsCount");
    const quickBtns = document.querySelectorAll(".quick-btn");
    const clearBtn = document.getElementById("clearFilters");

    function updateCount() {
        let visible = 0;
        cards.forEach((card) => {
            if (card.style.display !== "none") {
                visible++;
            }
        });
        resultsCount.textContent = `Showing ${visible} resource${visible === 1 ? "" : "s"}`;
    }

    function filterCards() {
        const selectedCategory = categoryFilter.value;
        const selectedItem = itemFilter.value;

        cards.forEach((card) => {
            const category = card.dataset.category;
            const items = card.dataset.items.split(",");

            const categoryMatch =
                selectedCategory === "all" || category === selectedCategory;

            const itemMatch =
                selectedItem === "all" || items.includes(selectedItem);

            if (categoryMatch && itemMatch) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });

        updateCount();
    }

    quickBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            const value = this.dataset.category;
            categoryFilter.value = value;

            quickBtns.forEach((b) => b.classList.remove("active"));
            this.classList.add("active");

            filterCards();
        });
    });

    categoryFilter.addEventListener("change", function () {
        quickBtns.forEach((b) => {
            if (b.dataset.category === categoryFilter.value) {
                b.classList.add("active");
            } else {
                b.classList.remove("active");
            }
        });

        filterCards();
    });

    itemFilter.addEventListener("change", filterCards);

    clearBtn.addEventListener("click", function () {
        categoryFilter.value = "all";
        itemFilter.value = "all";

        quickBtns.forEach((b) => b.classList.remove("active"));
        document.querySelector('[data-category="all"]').classList.add("active");

        filterCards();
    });

    filterCards();
});