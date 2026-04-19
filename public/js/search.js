document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".resource-card");
    const categoryFilter = document.getElementById("categoryFilter");
    const itemFilter = document.getElementById("itemFilter");
    const resultsCount = document.getElementById("resultsCount");
    const quickBtns = document.querySelectorAll(".quick-btn");
    const clearBtn = document.getElementById("clearFilters");

    function normalize(value) {
        return (value || "")
            .toString()
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-");
    }

    function parseItems(value) {
        return (value || "")
            .split(",")
            .map(item => normalize(item))
            .filter(Boolean);
    }

    function updateCount() {
        let visible = 0;

        cards.forEach((card) => {
            if (card.style.display !== "none") {
                visible++;
            }
        });

        resultsCount.textContent = `Showing ${visible} resource${visible === 1 ? "" : "s"}`;
    }

    function setActiveQuickButton(value) {
        const normalizedValue = normalize(value);

        quickBtns.forEach((btn) => {
            btn.classList.toggle(
                "active",
                normalize(btn.dataset.category) === normalizedValue
            );
        });
    }

    function filterCards() {
        const selectedCategory = normalize(categoryFilter.value || "all");
        const selectedItem = normalize(itemFilter.value || "all");

        cards.forEach((card) => {
            const category = normalize(card.dataset.category);
            const items = parseItems(card.dataset.items);

            const categoryMatch =
                selectedCategory === "all" || category === selectedCategory;

            const itemMatch =
                selectedItem === "all" || items.includes(selectedItem);

            card.style.display = categoryMatch && itemMatch ? "block" : "none";
        });

        updateCount();
    }

    quickBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            const value = normalize(this.dataset.category || "all");
            categoryFilter.value = value;
            setActiveQuickButton(value);
            filterCards();
        });
    });

    categoryFilter.addEventListener("change", function () {
        setActiveQuickButton(categoryFilter.value);
        filterCards();
    });

    itemFilter.addEventListener("change", filterCards);

    clearBtn.addEventListener("click", function () {
        categoryFilter.value = "all";
        itemFilter.value = "all";
        setActiveQuickButton("all");
        filterCards();
    });

    setActiveQuickButton(categoryFilter.value || "all");
    filterCards();
});