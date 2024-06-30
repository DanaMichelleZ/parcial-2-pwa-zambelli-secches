if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registrado con éxito:', registration);
            })
            .catch(error => {
                console.log('Fallo al registrar el Service Worker:', error);
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
                mostrarError('No se encontraron bebidas.');
            }
        } catch (error) {
            console.error('Error al obtener las bebidas:', error);
            mostrarError('Error al cargar las bebidas. Verificá tu conexión a internet.');
        }
    }

    function mostrarBebidas(bebidas) {
        let bebidasHTML = '';
        bebidas.forEach(bebida => {
            bebidasHTML += `
                <div class="bebida">
                    <a href="detalle.html?id=${bebida.idDrink}">
                        <h2>${bebida.strDrink}</h2>
                        <img src="${bebida.strDrinkThumb}" alt="${bebida.strDrink}">
                    </a>
                </div>`;
        });
        listaBebidas.innerHTML = bebidasHTML;
    }

    function mostrarError(mensaje) {
        listaBebidas.innerHTML = `<p>${mensaje}</p>`;
    }

    // Verificar si hay bebidas guardadas en localStorage
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
            btnInst.style.display = 'none';
            botonInstalacion.prompt();
            botonInstalacion.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('Aplicación instalada...');
                } else {
                    console.log('Usuario rechazó la instalación');
                }
                botonInstalacion = null;
            });
        });
    });

    // Post-instalación
    window.addEventListener('appinstalled', (event) => {
        console.log('PWA ha sido instalada', event);
    });
});