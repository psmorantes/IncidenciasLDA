// Funcionalidad para el menú móvil
const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');

// Verificamos que los elementos existan antes de agregar eventos
if (btn && menu) {
    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });

    // Cerrar el menú móvil al hacer clic en un enlace
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
        });
    });
}

// Cambiar el fondo del Navbar al hacer scroll
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('shadow-md');
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            navbar.classList.remove('shadow-md');
            navbar.style.background = 'rgba(255, 255, 255, 0.85)';
        }
    });
}

// Intersection Observer para las animaciones "Scroll Reveal"
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Dejamos de observar una vez que la animación ya ocurrió
            observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

// Aplicar el observador a todos los elementos con la clase .reveal
document.querySelectorAll('.reveal').forEach(element => {
    observer.observe(element);
});

// --- LÓGICA DEL MODO OSCURO (Automático / Manual) ---

const themeToggleBtn = document.getElementById('theme-toggle');
const moonIcon = document.getElementById('moon-icon');
const sunIcon = document.getElementById('sun-icon');
const body = document.body;

// 1. Detectar preferencia del sistema o lo que guardó el usuario previamente
const currentTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// 2. Función para aplicar el tema visualmente y cambiar el icono
function applyTheme(isDark) {
    // BUSCAMOS LOS LOGOS JUSTO AQUÍ (A prueba de fallos)
    const navLogo = document.getElementById('navbar-logo');
    const footLogo = document.getElementById('footer-logo');

    if (isDark) {
        body.classList.add('dark-theme');
        if (moonIcon) moonIcon.style.display = 'block';
        if (sunIcon) sunIcon.style.display = 'none';
        
        // Cambiar al logo blanco
        if (navLogo) navLogo.src = 'assets/img/logo/logo_blanco.png';
        if (footLogo) footLogo.src = 'assets/img/logo/logo_blanco.png';
    } else {
        body.classList.remove('dark-theme');
        if (moonIcon) moonIcon.style.display = 'none';
        if (sunIcon) sunIcon.style.display = 'block';
        
        // Volver al logo original a color
        if (navLogo) navLogo.src = 'assets/img/logo/logo.jpg';
        if (footLogo) footLogo.src = 'assets/img/logo/logo.jpg';
    }
}

// 3. Evaluar qué tema cargar al abrir la página
if (currentTheme === 'dark' || (!currentTheme && systemPrefersDark)) {
    applyTheme(true);
} else {
    applyTheme(false);
}

// 4. Cambiar el tema manualmente cuando el usuario haga clic en el botón
themeToggleBtn.addEventListener('click', () => {
    const isCurrentlyDark = body.classList.contains('dark-theme');
    
    if (isCurrentlyDark) {
        applyTheme(false);
        localStorage.setItem('theme', 'light'); // Guarda la decisión
    } else {
        applyTheme(true);
        localStorage.setItem('theme', 'dark'); // Guarda la decisión
    }
});

// ==========================================
// MOSTRAR MENSAJE DE ÉXITO TRAS ENVIAR PHP
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('estado') && urlParams.get('estado') === 'enviado') {
        const statusDiv = document.getElementById('form-status');
        const formElement = document.getElementById('rimo-contact-form');
        
        if (statusDiv) {
            // Mostramos el mensaje
            statusDiv.textContent = '¡Gracias por comunicarte! Nos comunicaremos contigo a la brevedad posible.';
            statusDiv.className = 'mt-4 text-sm font-medium text-center rounded-md p-3 bg-green-100 text-green-800 block';
            
            // Scroll suave hacia el formulario
            if (formElement) {
                setTimeout(() => {
                    formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
            
            // Limpiamos la URL
            window.history.replaceState({}, document.title, window.location.pathname);

            // NUEVO: Ocultamos el mensaje después de 5 segundos
            setTimeout(() => {
                statusDiv.className = 'hidden mt-4 text-sm font-medium text-center rounded-md p-3';
            }, 5000); 
        }
    }
});