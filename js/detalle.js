document.addEventListener('DOMContentLoaded', () => {
    const detalleBebida = document.querySelector('.detalle-bebida');

    async function obtenerDetalleBebida(id) {
        const apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('No se pudo cargar la bebida.');
            }
            const data = await response.json();
            if (data.drinks && data.drinks.length > 0) {
                const bebida = data.drinks[0];
                localStorage.setItem(`bebida_${id}`, JSON.stringify(bebida));
                mostrarDetalleBebida(bebida);
            } else {
                mostrarError('No se encontraron detalles de la bebida.');
            }
        } catch (error) {
            console.error('Error al obtener los detalles de la bebida:', error);
            const bebidaGuardada = localStorage.getItem(`bebida_${id}`);
            if (bebidaGuardada) {
                mostrarDetalleBebida(JSON.parse(bebidaGuardada));
            } else {
                mostrarError('No se pudo cargar los detalles de la bebida. Verifica tu conexión a internet.');
            }
        }
    }

    function mostrarDetalleBebida(bebida) {
        detalleBebida.innerHTML = `
            <div class="detalle">
                <h2>${bebida.strDrink}</h2>
                <img src="${bebida.strDrinkThumb}" alt="${bebida.strDrink}">
                <p>Ingredientes:</p>
                <ul>
                    ${mostrarIngredientes(bebida)}
                </ul>
                <p>Instrucciones de preparación:</p>
                <p>${bebida.strInstructions}</p>
            </div>
        `;
    }

    function mostrarIngredientes(bebida) {
        let ingredientes = '';
        for (let i = 1; i <= 15; i++) {
            const ingrediente = bebida[`strIngredient${i}`];
            const medida = bebida[`strMeasure${i}`];
            if (ingrediente) {
                ingredientes += `<li>${ingrediente} - ${medida ? medida : ''}</li>`;
            }
        }
        return ingredientes;
    }

    function mostrarError(mensaje) {
        detalleBebida.innerHTML = `<p>${mensaje}</p>`;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const idBebida = urlParams.get('id');

    if (idBebida) {
        obtenerDetalleBebida(idBebida);
    } else {
        mostrarError('No se especificó una bebida válida.');
    }
});