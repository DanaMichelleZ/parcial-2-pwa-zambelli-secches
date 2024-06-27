if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js').then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(error => {
            console.error('ServiceWorker registration failed:', error);
        });
    });
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
        .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(error => {
            console.error('ServiceWorker registration failed:', error);
        });

        window.addEventListener('offline', () => {
            mostrarNotificacionOffline();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const listaBebidas = document.querySelector('.lista-bebidas');
    const apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

    async function obtenerBebidas() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('No se pudo cargar la lista de bebidas. Verificá tu conexión a internet.');
            }
            const data = await response.json();
            if (data.drinks) {
                localStorage.setItem('bebidas', JSON.stringify(data.drinks));
                mostrarBebidas(data.drinks);
            } else {
                mostrarError('No se encontraron bebidas disponibles.');
            }
        } catch (error) {
            console.error('Error al obtener las bebidas:', error);
            mostrarError('Error al cargar las bebidas. Verificá tu conexión a internet.');
        }
    }

    function mostrarBebidas(bebidas) {
        listaBebidas.innerHTML = bebidas.map(bebida => `
            <div class="bebida">
                <a href="detalle.html?id=${bebida.idDrink}">
                    <h2>${bebida.strDrink}</h2>
                    <img src="${bebida.strDrinkThumb}" alt="${bebida.strDrink}">
                </a>
            </div>`
        ).join('');
    }

    function mostrarError(mensaje) {
        listaBebidas.innerHTML = `<p>${mensaje}</p>`;
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
                }
                botonInstalacion = null;
            });
        });
    });

    // Post-intalación
    window.addEventListener('appinstalled', () => {
        console.log('La aplicación se instaló exitosamente.');
        const btnInst = document.getElementById('btnInst');
        btnInst.style.display = 'none';
    });
});