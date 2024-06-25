document.addEventListener('DOMContentLoaded', () => {
    const detalleBebida = document.querySelector('.detalle-bebida');

async function obtenerDetalleBebida(id) {
    const apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
            localStorage.setItem(`bebida_${id}`, JSON.stringify(data.drinks[0]));
            mostrarDetalleBebida(data.drinks[0]);
    } catch (error) {
        console.error('Error, muy en pedo', error);
            detalleBebida.innerHTML = '<p>Error al cargar los detalles de la bebida. Te vendieron agua en vez de vodka.</p>';
    }
}

function mostrarDetalleBebida(bebida) {
    if (bebida) {
        detalleBebida.innerHTML =
        `
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
    } else {
        detalleBebida.innerHTML = '<p>No se encontraron detalles de la bebida.</p>';
    }
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

// Capturar el ID de la bebida desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idBebida = urlParams.get('id');

    if (idBebida) {
        const bebidaGuardada = localStorage.getItem(`bebida_${idBebida}`);
        if (bebidaGuardada) {
            mostrarDetalleBebida(JSON.parse(bebidaGuardada));
        } else {
            obtenerDetalleBebida(idBebida);
        }
    } else {
        detalleBebida.innerHTML = '<p>No se especificó una bebida, te tomaste un jugo tang.</p>';
    }
});
