document.addEventListener('DOMContentLoaded', () => {
    const listaBebidas = document.querySelector('.lista-bebidas');

    const apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

    async function obtenerBebidas() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            localStorage.setItem('bebidas', JSON.stringify(data.drinks));
            mostrarBebidas(data.drinks);
        } catch (error) {
            console.error('Error, no estás lo suficientemente ebrio', error);
            listaBebidas.innerHTML = '<p>Error al cargar las bebidas. Toma un shot más e intenta nuevamente más tarde.</p>';
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
            listaBebidas.innerHTML = '<p>No se encontraron bebidas que te pongan más ebrio.</p>';
        }
    }

    const bebidasGuardadas = localStorage.getItem('bebidas');
    if (bebidasGuardadas) {
        console.log('Cargando bebidas desde localStorage:', JSON.parse(bebidasGuardadas));
        mostrarBebidas(JSON.parse(bebidasGuardadas));
    } else {
        obtenerBebidas();
    }
});