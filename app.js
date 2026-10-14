const products = [
    {
        id: "urban-craft",
        name: "Urban Craft",
        image: "images/product-images/UrbanCraft.jpg",
        category: "Men",
        type: "Streetwear sneaker",
        price: 118,
        tag: "Bestseller",
        description: "A confident everyday sneaker with clean lines, a considered finish, and the kind of easy versatility that makes getting dressed feel effortless."
    },
    {
        id: "city-runner",
        name: "City Runner",
        image: "images/product-images/men2.jpg",
        category: "Men",
        type: "Everyday sneaker",
        price: 124,
        tag: "New season",
        description: "Built for long days and quick detours, this street-ready silhouette pairs a strong profile with all-day ease."
    },
    {
        id: "noble-step",
        name: "Noble Step",
        image: "images/product-images/men3.jpg",
        category: "Men",
        type: "Modern classic",
        price: 132,
        tag: "VELON edit",
        description: "A modern classic with a little edge. Clean proportions and thoughtful detailing take this pair from everyday plans to after-hours."
    },
    {
        id: "after-hours",
        name: "After Hours",
        image: "images/product-images/men4.jpg",
        category: "Men",
        type: "Statement sneaker",
        price: 138,
        tag: "Limited edit",
        description: "Make an entrance in a statement-making shape that feels as good on the move as it looks in the moment."
    },
    {
        id: "the-commute",
        name: "The Commute",
        image: "images/product-images/men5.jpg",
        category: "Men",
        type: "Everyday sneaker",
        price: 116,
        tag: "Everyday",
        description: "Your reliable daily pair, reimagined with VELON's sharp eye for proportion and a relaxed, versatile feel."
    },
    {
        id: "street-form",
        name: "Street Form",
        image: "images/product-images/men6.jpg",
        category: "Men",
        type: "Streetwear sneaker",
        price: 128,
        tag: "Bestseller",
        description: "A bolder profile and a crisp finish give this street staple its own point of view, without sacrificing everyday wearability."
    },
    {
        id: "soft-focus",
        name: "Soft Focus",
        image: "images/product-images/women1.jpg",
        category: "Women",
        type: "Everyday sneaker",
        price: 112,
        tag: "New season",
        description: "Easy to wear and hard to overlook: meet the pair that brings a fresh point of view to your day-to-day rotation."
    },
    {
        id: "golden-hour",
        name: "Golden Hour",
        image: "images/product-images/women2.jpg",
        category: "Women",
        type: "Statement sneaker",
        price: 126,
        tag: "VELON edit",
        description: "A little polish, a lot of personality. This versatile pair is ready to take you wherever the day goes."
    },
    {
        id: "off-script",
        name: "Off Script",
        image: "images/product-images/women3.jpg",
        category: "Women",
        type: "Streetwear sneaker",
        price: 134,
        tag: "Bestseller",
        description: "For making your own rules: a distinctive silhouette with the comfort and confidence to keep up."
    },
    {
        id: "the-long-way",
        name: "The Long Way",
        image: "images/product-images/women4.jpg",
        category: "Women",
        type: "Everyday sneaker",
        price: 118,
        tag: "Everyday",
        description: "Take the scenic route in a pair designed for all-day plans, spontaneous stops, and moving at your own pace."
    },
    {
        id: "gold-standard",
        name: "Gold Standard",
        image: "images/product-images/women5.jpg",
        category: "Women",
        type: "Modern classic",
        price: 142,
        tag: "Limited edit",
        description: "A confident take on a timeless shape, finished with the kind of details that make a look feel considered."
    },
    {
        id: "new-perspective",
        name: "New Perspective",
        image: "images/product-images/women6.jpg",
        category: "Women",
        type: "Streetwear sneaker",
        price: 130,
        tag: "New season",
        description: "Fresh proportions and a fearless point of view make this an easy favourite from first wear."
    }
];

const cartStorageKey = "velon-shopping-bag";
const sizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
let cart = [];
let toastTimeout;
let lastCartTrigger;

function formatPrice(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }).format(value);
}

function getProduct(productId) {
    return products.find((product) => product.id === productId);
}

function showToast(message) {
    const toast = document.querySelector("[data-toast]");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 3000);
}

function readCart() {
    try {
        const savedCart = JSON.parse(window.localStorage.getItem(cartStorageKey) || "[]");
        if (!Array.isArray(savedCart)) throw new TypeError("The saved shopping bag is not a list.");
        return savedCart.filter((item) =>
            item &&
            getProduct(item.productId) &&
            sizes.includes(Number(item.size)) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0
        );
    } catch (error) {
        console.error("Could not read the saved shopping bag.", error);
        showToast("Your saved bag could not be read. Starting a fresh bag.");
        return [];
    }
}

function saveCart() {
    try {
        window.localStorage.setItem(cartStorageKey, JSON.stringify(cart));
        return true;
    } catch (error) {
        console.error("Could not save the shopping bag.", error);
        return false;
    }
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll("[data-cart-count]").forEach((badge) => {
        badge.textContent = String(count);
    });
}

function renderCart() {
    const itemsContainer = document.querySelector("[data-bag-items]");
    const subtotalContainer = document.querySelector("[data-bag-subtotal]");
    if (!itemsContainer || !subtotalContainer) return;

    if (!cart.length) {
        itemsContainer.innerHTML = '<p class="empty-bag">Your bag is taking a little breather.<br><a href="shop.html">Explore the collection →</a></p>';
        subtotalContainer.textContent = formatPrice(0);
        updateCartCount();
        return;
    }

    itemsContainer.innerHTML = cart.map((item, index) => {
        const product = getProduct(item.productId);
        return `<article class="bag-item">
            <img src="${product.image}" alt="${product.name}">
            <div>
                <h3>${product.name}</h3>
                <p>Size ${item.size} · ${formatPrice(product.price)}</p>
                <div class="bag-quantity" aria-label="Quantity controls for ${product.name}, size ${item.size}">
                    <button type="button" data-quantity-change="-1" data-index="${index}" aria-label="Remove one ${product.name}">−</button>
                    <span>${item.quantity}</span>
                    <button type="button" data-quantity-change="1" data-index="${index}" aria-label="Add one ${product.name}">+</button>
                </div>
            </div>
            <button class="bag-remove" type="button" data-remove-item="${index}" aria-label="Remove ${product.name} from bag">Remove</button>
        </article>`;
    }).join("");

    const subtotal = cart.reduce((total, item) => total + getProduct(item.productId).price * item.quantity, 0);
    subtotalContainer.textContent = formatPrice(subtotal);
    updateCartCount();
}

function openCart() {
    const panel = document.querySelector("[data-bag-panel]");
    const backdrop = document.querySelector("[data-bag-backdrop]");
    if (!panel || !backdrop) return;
    renderCart();
    panel.classList.add("is-open");
    backdrop.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    backdrop.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    panel.querySelector("[data-close-cart]").focus();
}

function closeCart() {
    const panel = document.querySelector("[data-bag-panel]");
    const backdrop = document.querySelector("[data-bag-backdrop]");
    if (!panel || !backdrop) return;
    panel.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    backdrop.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (lastCartTrigger instanceof HTMLElement) lastCartTrigger.focus();
}

function createCartPanel() {
    document.body.insertAdjacentHTML("beforeend", `
        <div class="bag-backdrop" data-bag-backdrop aria-hidden="true"></div>
        <aside class="bag-panel" data-bag-panel role="dialog" aria-modal="true" aria-labelledby="bag-title" aria-hidden="true">
            <div class="bag-header">
                <h2 id="bag-title">Your bag</h2>
                <button class="bag-close" type="button" data-close-cart aria-label="Close shopping bag">×</button>
            </div>
            <div class="bag-items" data-bag-items></div>
            <div class="bag-footer">
                <div class="bag-subtotal"><span>Subtotal</span><span data-bag-subtotal>$0</span></div>
                <p class="detail-perks">Online payment is not available yet. Your bag is saved on this device.</p>
                <button class="button" type="button" data-checkout>Online checkout coming soon</button>
            </div>
        </aside>
        <div class="toast" data-toast role="status" aria-live="polite"></div>
    `);

    document.querySelectorAll("[data-open-cart]").forEach((button) => {
        button.addEventListener("click", () => {
            lastCartTrigger = button;
            openCart();
        });
    });
    document.querySelector("[data-close-cart]").addEventListener("click", closeCart);
    document.querySelector("[data-bag-backdrop]").addEventListener("click", closeCart);
    document.querySelector("[data-checkout]").addEventListener("click", () => {
        showToast("Online checkout isn't available yet. Your bag is saved on this device.");
    });

    document.querySelector("[data-bag-items]").addEventListener("click", (event) => {
        const removeButton = event.target.closest("[data-remove-item]");
        const quantityButton = event.target.closest("[data-quantity-change]");
        if (removeButton) {
            cart.splice(Number(removeButton.dataset.removeItem), 1);
        } else if (quantityButton) {
            const index = Number(quantityButton.dataset.index);
            cart[index].quantity += Number(quantityButton.dataset.quantityChange);
            if (cart[index].quantity <= 0) cart.splice(index, 1);
        } else {
            return;
        }
        const saved = saveCart();
        renderCart();
        if (!saved) showToast("Your change is only saved for this visit. Check your browser's storage settings.");
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && document.querySelector("[data-bag-panel].is-open")) closeCart();
    });
}

function productCard(product) {
    return `<article class="product-card">
        <a class="product-card-link" href="product.html?id=${encodeURIComponent(product.id)}" aria-label="View ${product.name}, ${formatPrice(product.price)}">
            <div class="product-card-image-wrap">
                <img class="product-card-image" src="${product.image}" alt="${product.name} ${product.type.toLowerCase()}" loading="lazy">
                <span class="product-tag">${product.tag}</span>
            </div>
            <div class="product-card-meta">
                <div><h3>${product.name}</h3><p>${product.category} · ${product.type}</p></div>
                <span class="product-card-price">${formatPrice(product.price)}</span>
            </div>
        </a>
    </article>`;
}

function renderProducts() {
    const catalog = document.querySelector("[data-product-grid]");
    const featured = document.querySelector("[data-featured-products]");
    if (featured) featured.innerHTML = products.slice(0, 4).map(productCard).join("");
    if (!catalog) return;

    const searchInput = document.querySelector("[data-product-search]");
    const categorySelect = document.querySelector("[data-product-filter]");
    const resultsCount = document.querySelector("[data-results-count]");
    const render = () => {
        const query = searchInput.value.trim().toLowerCase();
        const category = categorySelect.value;
        const filtered = products.filter((product) => {
            const matchesQuery = `${product.name} ${product.type} ${product.category} ${product.tag}`.toLowerCase().includes(query);
            return matchesQuery && (category === "all" || product.category === category);
        });

        catalog.innerHTML = filtered.length
            ? filtered.map(productCard).join("")
            : '<p class="empty-results">No pairs found. Try another search or category.</p>';
        resultsCount.textContent = `${filtered.length} ${filtered.length === 1 ? "pair" : "pairs"} to explore`;
    };
    searchInput.addEventListener("input", render);
    categorySelect.addEventListener("change", render);
    render();
}

function renderProductDetail() {
    const container = document.querySelector("[data-product-detail]");
    if (!container) return;

    const productId = new URLSearchParams(window.location.search).get("id");
    const product = getProduct(productId);
    if (!product) {
        container.innerHTML = `<div class="empty-results">
            <p class="eyebrow">Pair not found</p>
            <h1>Let's find you another.</h1>
            <p>That shoe may have walked away. Browse the collection to find a new favourite.</p>
            <a class="button" href="shop.html">Explore all shoes</a>
        </div>`;
        return;
    }

    document.title = `${product.name} — VELON Footwear`;
    container.innerHTML = `
        <div>
            <img class="product-detail-image" src="${product.image}" alt="${product.name} ${product.type.toLowerCase()}">
        </div>
        <div class="product-detail-copy">
            <div class="breadcrumbs"><a href="shop.html">Shop</a> / ${product.category} / ${product.name}</div>
            <p class="eyebrow">${product.tag} · ${product.category}</p>
            <h1>${product.name}</h1>
            <p class="detail-price">${formatPrice(product.price)}</p>
            <p class="detail-description">${product.description}</p>
            <span class="size-label" id="size-label">Choose your size (EU)</span>
            <div class="size-options" role="group" aria-labelledby="size-label">
                ${sizes.map((size) => `<button class="size-option" type="button" data-size="${size}" aria-pressed="false">${size}</button>`).join("")}
            </div>
            <p class="size-error" data-size-error aria-live="polite"></p>
            <div class="detail-actions">
                <button class="button" type="button" data-add-to-bag="${product.id}">Add to bag <span aria-hidden="true">→</span></button>
                <a class="button button-outline" href="contactUs.html">Need help with sizing?</a>
            </div>
            <div class="detail-perks">Thoughtful design. Easy everyday wear. Need a hand? <a href="contactUs.html">Talk to our team.</a></div>
        </div>
    `;

    let selectedSize = null;
    container.querySelectorAll("[data-size]").forEach((button) => {
        button.addEventListener("click", () => {
            selectedSize = Number(button.dataset.size);
            container.querySelectorAll("[data-size]").forEach((option) => option.setAttribute("aria-pressed", String(option === button)));
            container.querySelector("[data-size-error]").textContent = "";
        });
    });
    container.querySelector("[data-add-to-bag]").addEventListener("click", () => {
        if (!selectedSize) {
            container.querySelector("[data-size-error]").textContent = "Please choose a size before adding this pair to your bag.";
            container.querySelector("[data-size]").focus();
            return;
        }

        const existingItem = cart.find((item) => item.productId === product.id && item.size === selectedSize);
        if (existingItem) existingItem.quantity += 1;
        else cart.push({ productId: product.id, size: selectedSize, quantity: 1 });
        const saved = saveCart();
        updateCartCount();
        showToast(saved
            ? `${product.name}, size ${selectedSize}, added to your bag.`
            : `${product.name} was added for this visit, but your browser couldn't save the bag.`);
    });
}

function setupMobileNavigation() {
    const menuButton = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".nav-center");
    if (!menuButton || !menu) return;
    menuButton.addEventListener("click", () => {
        const isOpen = menu.classList.toggle("is-open");
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });
}

function setupContactForm() {
    const form = document.querySelector("[data-contact-form]");
    if (!form) return;
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const subject = `VELON Footwear — ${formData.get("topic")}`;
        const body = [
            `Name: ${formData.get("name")}`,
            `Email: ${formData.get("email")}`,
            "",
            String(formData.get("message"))
        ].join("\n");
        const mailto = `mailto:Peculiarfurniture@gmail.com?${new URLSearchParams({ subject, body })}`;
        document.querySelector("[data-contact-status]").textContent = "Your email app will open with your message ready. Please review and send it there.";
        window.location.href = mailto;
    });
}

function init() {
    createCartPanel();
    cart = readCart();
    updateCartCount();
    setupMobileNavigation();
    renderProducts();
    renderProductDetail();
    setupContactForm();
}

init();
