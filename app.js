// URLs de los archivos JSON
const technicalDataURL = "./technical_data.json";
const compatibilitiesURL = "./compatibilities.json";
const assetsURL = "./MAssets.json";



const attributeMapping = {
    "A/C Compressor": ["Tipo de Refrigerante", "Ranuras de Polea", "Diametro de Polea", "Voltaje de bobina"],
    "Radiator": ["Alto cm", "Ancho cm", "Espesor mm", "Alto in", "Ancho in", "Espesor in"],
    // Agrega más productos según sea necesario
};


// Función para cargar JSON
async function loadJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error loading ${url}:`, error);
        return null;
    }
}

async function testJSONLoad() {
    try {
        const technicalData = await fetch('./technical_data.json').then(res => res.json());
        const compatibilities = await fetch('./compatibilities.json').then(res => res.json());
        const assets = await fetch('./MAssets.json').then(res => res.json());

        console.log("Technical Data:", technicalData);
        console.log("Compatibilities:", compatibilities);
        console.log("Assets:", assets);
    } catch (error) {
        console.error("Error loading JSON files:", error);
    }
}

async function renderCatalog() {
    try {
        // Cargar los datos
        const technicalData = await loadJSON(technicalDataURL);
        const compatibilities = await loadJSON(compatibilitiesURL);
        const assets = await loadJSON(assetsURL);

        // Contenedor del catálogo
        const catalogContainer = document.getElementById("catalog");
        catalogContainer.innerHTML = ""; // Limpia contenido previo

        // Renderizar cada producto
        technicalData.forEach(product => {
            const partNumber = product.PartNumber;

            // Encontrar compatibilidades y assets relacionados
            const productCompatibilities = compatibilities.filter(c => c.PartNumber === partNumber);
            const productAsset = assets.find(a => a.SKU === partNumber);

            // Determinar atributos dinámicos para el producto
            const productType = product.Product;
            const attributes = attributeMapping[productType] || ["C1", "C2", "C3", "C4", "C5", "C6"];

            // Construir especificaciones dinámicas
            let specifications = "<ul>";
            attributes.forEach((attr, index) => {
                const value = product[`C${index + 1}`];
                if (value) {
                    specifications += `<li><strong>${attr}:</strong> ${value}</li>`;
                }
            });
            specifications += "</ul>";

            // Construir compatibilidades
            let compatibilityList = "<ul>";
            if (productCompatibilities.length > 0) {
                compatibilityList += productCompatibilities.map(c => `<li>${c.Make} ${c.Model} ${c.Year}</li>`).join('');
            } else {
                compatibilityList += "<li>No disponible</li>";
            }
            compatibilityList += "</ul>";

            // Construir HTML del producto
            const productHTML = `
                <div class="product-card">
                    <!-- <img src="https://${productAsset ? productAsset.URL : 'placeholder.jpg'}" alt="${product.Product}" /> -->
                    <h3>${product.Product} (${product.PartNumber})</h3>
                    <p><strong>Fabricante:</strong> ${product.MfrLabel}</p>
                    <h4>Especificaciones:</h4>
                    ${specifications}
                    <h4>Compatibilidades:</h4>
                    ${compatibilityList}
                </div>
            `;

            // Agregar al contenedor
            catalogContainer.innerHTML += productHTML;
        });
    } catch (error) {
        console.error("Error rendering catalog:", error);
    }
}

// Llama a la función cuando la página se cargue
document.addEventListener("DOMContentLoaded", renderCatalog);

document.addEventListener("DOMContentLoaded", testJSONLoad);


// Llamar a la función al cargar la página


