// ============================
// Navbar: menú móvil
// ============================
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const navEl = document.getElementById("mainNav");
const navBackdrop = document.getElementById("navBackdrop");
const links = navLinks ? navLinks.querySelectorAll("a") : [];

function openMenu() {
    navLinks.classList.add("active");
    menuBtn.setAttribute("aria-expanded", "true");
    if (navBackdrop) navBackdrop.classList.add("active");
    document.body.classList.add("menu-open");
}

function closeMenu() {
    navLinks.classList.remove("active");
    menuBtn.setAttribute("aria-expanded", "false");
    if (navBackdrop) navBackdrop.classList.remove("active");
    document.body.classList.remove("menu-open");
    closeAllMegaMenus();
}

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
        const isOpen = navLinks.classList.contains("active");
        isOpen ? closeMenu() : openMenu();
    });

    // Cerrar al tocar un link
    links.forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    // Cerrar al tocar el backdrop (fuera del menú)
    if (navBackdrop) {
        navBackdrop.addEventListener("click", closeMenu);
    }

    // Cerrar con la tecla Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navLinks.classList.contains("active")) {
            closeMenu();
            menuBtn.focus();
        }
    });

    // Si la ventana vuelve a tamaño de escritorio con el menú abierto, resetear
    window.addEventListener("resize", () => {
        if (window.innerWidth > 860 && navLinks.classList.contains("active")) {
            closeMenu();
        }
    });
}

// ============================
// Navbar: sombra/opacidad al hacer scroll
// ============================
if (navEl) {
    const toggleScrolled = () => {
        navEl.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    toggleScrolled();
    window.addEventListener("scroll", toggleScrolled, { passive: true });
}

// ============================
// Marca el link activo según la página actual
// ============================
(() => {
    const current = window.location.pathname.split("/").pop() || "home.html";
    document.querySelectorAll(".nav-links a").forEach(a => {
        const href = a.getAttribute("href");
        if (href === current) a.classList.add("active");
    });
})();

// ============================
// Reveal on scroll (tarjetas de producto, etc.)
// ============================
const revealTargets = document.querySelectorAll(".product-card, .charm-card, .reveal");

if (revealTargets.length && "IntersectionObserver" in window) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
        revealTargets.forEach(el => el.classList.add("is-visible"));
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add("is-visible"), i * 70);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealTargets.forEach(el => observer.observe(el));
    }
} else {
    revealTargets.forEach(el => el.classList.add("is-visible"));
}

// ============================
// Mega-menú: "Productos" con categorías desplegables
// ============================
const dropdownItems = document.querySelectorAll(".nav-item.has-dropdown");
const megaCats = document.querySelectorAll(".mega-cat");

function closeAllMegaMenus() {
    dropdownItems.forEach(item => {
        item.classList.remove("is-open");
        const btn = item.querySelector(":scope > .dropdown-toggle");
        if (btn) btn.setAttribute("aria-expanded", "false");
    });
    megaCats.forEach(cat => {
        cat.classList.remove("is-open");
        const btn = cat.querySelector(":scope > .mega-cat__toggle");
        if (btn) btn.setAttribute("aria-expanded", "false");
    });
}

dropdownItems.forEach(item => {
    const toggleBtn = item.querySelector(":scope > .dropdown-toggle");
    if (!toggleBtn) return;

    let closeTimer;

    const openDropdown = () => {
        clearTimeout(closeTimer);
        dropdownItems.forEach(other => {
            if (other !== item) other.classList.remove("is-open");
        });
        item.classList.add("is-open");
        toggleBtn.setAttribute("aria-expanded", "true");
    };

    const closeDropdown = () => {
        item.classList.remove("is-open");
        toggleBtn.setAttribute("aria-expanded", "false");
        item.querySelectorAll(".mega-cat.is-open").forEach(cat => {
            cat.classList.remove("is-open");
            const btn = cat.querySelector(":scope > .mega-cat__toggle");
            if (btn) btn.setAttribute("aria-expanded", "false");
        });
    };

    toggleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        item.classList.contains("is-open") ? closeDropdown() : openDropdown();
    });

    // Hover suave en desktop (con pequeño delay para no cerrar de golpe)
    item.addEventListener("mouseenter", () => {
        if (window.innerWidth > 860) openDropdown();
    });
    item.addEventListener("mouseleave", () => {
        if (window.innerWidth > 860) {
            closeTimer = setTimeout(closeDropdown, 180);
        }
    });
});

// Sub-categoría anidada ("Para Amantes del Mate")
megaCats.forEach(cat => {
    const btn = cat.querySelector(":scope > .mega-cat__toggle");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = cat.classList.contains("is-open");
        cat.parentElement.querySelectorAll(":scope > .mega-cat").forEach(sibling => {
            if (sibling !== cat) {
                sibling.classList.remove("is-open");
                const sBtn = sibling.querySelector(":scope > .mega-cat__toggle");
                if (sBtn) sBtn.setAttribute("aria-expanded", "false");
            }
        });
        cat.classList.toggle("is-open", !isOpen);
        btn.setAttribute("aria-expanded", String(!isOpen));
    });
});

// Cerrar todo al tocar afuera o con Escape
document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-item.has-dropdown")) closeAllMegaMenus();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllMegaMenus();
});

// ============================
// Detalle de bolsos y variantes de color
// ============================
const productDetailDialog = document.getElementById("productDetailDialog");

if (productDetailDialog) {
    const productDetailTitle = document.getElementById("productDetailTitle");
    const productDetailDescription = document.getElementById("productDetailDescription");
    const productDetailPrice = document.getElementById("productDetailPrice");
    const productDetailVisual = productDetailDialog.querySelector(".product-detail__visual");
    const productDetailImage = productDetailDialog.querySelector(".product-detail__image");
    const productDetailColorButtons = productDetailDialog.querySelectorAll(".product-color");
    const productDetailPatternButtons = productDetailDialog.querySelectorAll(".product-pattern");
    const productPhotoVariants = {
        "grande:terracota:rayas": "imagen/bolsos/bolso_grande_naranja.jpeg",
        "grande:terracota:floreado": "imagen/bolsos/bolso_grande_naranja_flores.jpeg",
        "grande:verde-herbal:rayas": "imagen/bolsos/bolso_grande_verdemusgo.jpeg",
        "grande:verde-herbal:floreado": "imagen/bolsos/bolso_grande_verdemusgo_flores.jpeg",
        "grande:rosa:rayas": "imagen/bolsos/bolso_grande_rosa.jpeg",
        "grande:rosa:floreado": "imagen/bolsos/bolso_grande_rosa_flores.jpeg",
        "grande:cielo-tierra:rayas": "imagen/bolsos/bolso_grande_marron_celeste.jpeg",
        "grande:cielo-tierra:floreado": "imagen/bolsos/bolso_grande_marron_celeste_flores.jpeg",
        "grande:marino:rayas": "imagen/bolsos/bolso_grande.jpeg",
        "mediano:terracota:rayas": "imagen/bolsos/bolso_mediano_naranja_rayas.jpeg",
        "mediano:terracota:floreado": "imagen/bolsos/bolso_mediano_naranja_flores.jpeg",
        "mediano:verde-herbal:rayas": "imagen/bolsos/bolso_mediano_verdemusgo.jpeg",
        "mediano:verde-herbal:floreado": "imagen/bolsos/bolso_mediano_verdemusgo_flores.jpeg",
        "mediano:cielo-tierra:rayas": "imagen/bolsos/bolso_mediano_marron_celeste.jpeg",
        "mediano:cielo-tierra:floreado": "imagen/bolsos/bolso_mediano_marron_celeste_flores.jpeg",
        "mediano:marino:rayas": "imagen/bolsos/bolso_mediano.jpeg",
        "chico:terracota:floreado": "imagen/bolsos/bolso_chico_naranja_flores.jpeg",
        "chico:verde-herbal:floreado": "imagen/bolsos/bolso_chico_verdemusgo_flores.jpeg",
        "chico:cielo-tierra:rayas": "imagen/bolsos/bolso_chico_marron_celeste.jpeg",
        "chico:marino:rayas": "imagen/bolsos/bolso_chico_o_cartuchera.jpeg"
    };
    const productColorNames = {
        terracota: "Terracota",
        "verde-herbal": "Verde Herbal",
        rosa: "Rosa",
        marino: "Marino",
        "cielo-tierra": "Cielo y Tierra"
    };
    const productPatternNames = {
        rayas: "Rayas",
        floreado: "Floreado"
    };
    const productDetails = {
        grande: {
            title: "Bolso Grande",
            description: "Tote grande de lino con doble manija de cuero curtido natural. Tela y cuero ecológico. Impermeables por dentro. Con bolsillos en ambos laterales.",
            price: "$ 24.500"
        },
        mediano: {
            title: "Bolso Mediano",
            description: "Tote estructurado de algodón grueso, con base reforzada. Tela y cuero ecológico. Impermeables por dentro. Con bolsillos en ambos laterales.",
            price: "$ 25.800"
        },
        chico: {
            title: "Bolso Chico",
            description: "Bolso chico y liviano, práctico para llevar lo esencial a mano. Tela y cuero ecológico. Impermeables por dentro. Con bolsillos en ambos laterales.",
            price: "$ 20.100"
        }
    };

    const hasProductPhoto = (model, color, pattern) => Boolean(productPhotoVariants[`${model}:${color}:${pattern}`]);

    const syncProductOptions = () => {
        const model = productDetailVisual.dataset.model;
        const color = productDetailVisual.dataset.color;
        const pattern = productDetailVisual.dataset.pattern;

        productDetailColorButtons.forEach(button => {
            const available = Array.from(productDetailPatternButtons).some(option => hasProductPhoto(model, button.dataset.color, option.dataset.pattern));
            button.hidden = !available;
            const selected = button.dataset.color === color;
            button.classList.toggle("is-selected", selected);
            button.setAttribute("aria-pressed", String(selected));
        });

        productDetailPatternButtons.forEach(button => {
            const available = hasProductPhoto(model, color, button.dataset.pattern);
            button.hidden = !available;
            const selected = button.dataset.pattern === pattern;
            button.classList.toggle("is-selected", selected);
            button.setAttribute("aria-pressed", String(selected));
        });
    };

    const updateProductPreview = () => {
        const model = productDetailVisual.dataset.model;
        const color = productDetailVisual.dataset.color;
        const pattern = productDetailVisual.dataset.pattern;
        const imageSource = productPhotoVariants[`${model}:${color}:${pattern}`];

        if (imageSource) {
            productDetailImage.src = imageSource;
            productDetailImage.alt = `${productDetailTitle.textContent}, ${productColorNames[color]}, ${productPatternNames[pattern]}`;
            productDetailImage.hidden = false;
            productDetailVisual.classList.add("has-photo");
            productDetailVisual.setAttribute("aria-label", productDetailImage.alt);
            return;
        }

        productDetailImage.removeAttribute("src");
        productDetailImage.alt = "";
        productDetailImage.hidden = true;
        productDetailVisual.classList.remove("has-photo");
        productDetailVisual.setAttribute("aria-label", `Vista temporal de ${productDetailTitle.textContent}; imagen próximamente`);
    };

    document.querySelectorAll(".product-card--select[data-product]").forEach(card => {
        card.addEventListener("click", (event) => {
            event.preventDefault();
            const product = productDetails[card.dataset.product];
            if (!product) return;

            productDetailTitle.textContent = product.title;
            productDetailDescription.textContent = product.description;
            productDetailPrice.textContent = product.price;
            productDetailVisual.dataset.model = card.dataset.product;
            const firstAvailable = Object.keys(productPhotoVariants).find(key => key.startsWith(`${card.dataset.product}:`));
            const [model, color, pattern] = firstAvailable.split(":");
            productDetailVisual.dataset.model = model;
            productDetailVisual.dataset.color = color;
            productDetailVisual.dataset.pattern = pattern;
            syncProductOptions();
            updateProductPreview();
            productDetailDialog.showModal();
        });
    });

    productDetailColorButtons.forEach(button => {
        button.addEventListener("click", () => {
            productDetailVisual.dataset.color = button.dataset.color;
            const model = productDetailVisual.dataset.model;
            const pattern = productDetailVisual.dataset.pattern;
            if (!hasProductPhoto(model, button.dataset.color, pattern)) {
                productDetailVisual.dataset.pattern = Array.from(productDetailPatternButtons)
                    .map(option => option.dataset.pattern)
                    .find(option => hasProductPhoto(model, button.dataset.color, option));
            }
            syncProductOptions();
            updateProductPreview();
        });
    });

    productDetailPatternButtons.forEach(button => {
        button.addEventListener("click", () => {
            productDetailVisual.dataset.pattern = button.dataset.pattern;
            syncProductOptions();
            updateProductPreview();
        });
    });

    const closeProductDetail = productDetailDialog.querySelector(".product-detail__close");
    closeProductDetail.addEventListener("click", () => productDetailDialog.close());

    productDetailDialog.addEventListener("click", (event) => {
        if (event.target === productDetailDialog) productDetailDialog.close();
    });
}
