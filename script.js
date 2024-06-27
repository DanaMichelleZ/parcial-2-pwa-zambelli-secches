document.addEventListener('DOMContentLoaded', () => {
    const listaBebidas = document.querySelector('.lista-bebidas');
    const apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

    async function obtenerBebidas() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.drinks) {
                localStorage.setItem('bebidas', JSON.stringify(data.drinks));
                mostrarBebidas(data.drinks);
            } else {
                listaBebidas.innerHTML = '<p>No se encontraron bebidas disponibles.</p>';
            }
        } catch (error) {
            console.error('Error al obtener las bebidas:', error);
            listaBebidas.innerHTML = '<p>Error al cargar las bebidas. Por favor, verificá tu conexión a internet.</p>';
        }
    }

    function mostrarBebidas(bebidas) {
        if (bebidas) {
            listaBebidas.innerHTML = bebidas.map(bebida => `
                <div class="bebida">
                    <a href="detalle.html?id=${bebida.idDrink}">
                        <h2>${bebida.strDrink}</h2>
                        <img src="${bebida.strDrinkThumb}" alt="${bebida.strDrink}">
                    </a>
                </div>`
            ).join('');
        } else {
            listaBebidas.innerHTML = '<p>404 bebida not found.</p>';
        }
    }

const bebidasGuardadas = localStorage.getItem('bebidas');
    if (bebidasGuardadas) {
        mostrarBebidas(JSON.parse(bebidasGuardadas));
    } else {
        obtenerBebidas();
}

// Botón de instalación
let botonInstalacion;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        botonInstalacion = e;
        const btnInst = document.getElementById('btnInst');
        btnInst.style.display = 'block';

        btnInst.addEventListener('click', () => {
            botonInstalacion.prompt();
        btnInst.style.display = 'none';
            botonInstalacion.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('Instalando...');
                } botonInstalacion = null;
        });
    });
});

// Post-intalación
    window.addEventListener('appinstalled', () => {
        console.log('La aplicación se instaló exitosamente.');
        const btnInst = document.getElementById('btnInst');
        btnInst.style.display = 'none';
    });


// Registramos SWorker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js').then(registration => {
                console.log('Service Worker registrado exitosamente: ', registration.scope);
            }, error => {
                console.log('Service Worker registro fallido: ', error);
            });
        });
    }
});