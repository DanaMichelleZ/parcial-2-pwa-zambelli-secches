// script.js xd

document.addEventListener('DOMContentLoaded', () => {
    const listaBebidas = document.querySelector('.lista-bebidas');

// Pego el link asi no lo pierdo :v
const apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

async function obtenerBebidas() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        mostrarBebidas(data.drinks);
    } catch (error) {
        console.error('Error, no estas lo suficientemente ebrio', error);
        listaBebidas.innerHTML = '<p>Error al cargar las bebidas. Toma un shot mas e intenta nuevamente más tarde.</p>';
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
    </div>
        `).join('');        
    } else {
        listaBebidas.innerHTML = '<p>No se encontraron bebidas que te pongan mas ebrio.</p>';
    }
}

obtenerBebidas();

});