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
