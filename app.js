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

async function renderCatalogAsTables() {
    try {
        const technicalData = await loadJSON(technicalDataURL);
        const compatibilities = await loadJSON(compatibilitiesURL);
        const catalogContainer = document.getElementById("catalog");
        catalogContainer.innerHTML = "";

        const groupedByProductType = technicalData.reduce((acc, product) => {
            if (!acc[product.Product]) {
                acc[product.Product] = [];
            }
            acc[product.Product].push(product);
            return acc;
        }, {});


        var i=0;
        var j=0;
        for (const [productType, products] of Object.entries(groupedByProductType)) {
            const attributes = attributeMapping[productType] || ["C1", "C2", "C3", "C4", "C5", "C6"];

            let sectionHTML = `
                <div class="product-section">
                    <h3>${productType}</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Part Number</th>
                                <th id="year" class="year">Año</th>
                                ${attributes.map(attr => `<th>${attr}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
            `;

            // Agrupar compatibilidades por marca y modelo
            const groupedCompatibilities = compatibilities.reduce((acc, compatibility) => {
                const { Make, Model, Year, PartNumber } = compatibility;
                if (!acc[Make]) {
                    acc[Make] = {};
                }
                if (!acc[Make][Model]) {
                    acc[Make][Model] = [];
                }
                acc[Make][Model].push({ Year, PartNumber });
                return acc;
            }, {});

            // Recorre cada marca
            for (const [make, models] of Object.entries(groupedCompatibilities)) {
                
                i=0;
                // Recorre cada modelo dentro de una marca
                for (const [model, compatibilitiesForModel] of Object.entries(models)) {
                    j=0;
                    // Agregar filas para cada compatibilidad de ese modelo
                    compatibilitiesForModel.forEach(({ Year, PartNumber }) => {
                        const product = products.find(p => p.PartNumber === PartNumber);
                        if (product) {
                            if(i==0){
                                sectionHTML += `
                                    <tr class="subheading">
                                        <td colspan="100%" id="Marca" class="Marca">${make}</td>
                                    </tr>
                                `;
                                i=1;
                            }

                            if(j==0){
                                sectionHTML += `
                                    <tr class="subheading">
                                        <td colspan="100%" id="Modelo" class="Modelo">${model}</td>
                                    </tr>
                                `;
                                j=1;
                            }

                            sectionHTML += `
                                <tr>
                                    <td>${PartNumber}</td>
                                    <td>${Year}</td>
                                    ${attributes.map((attr, index) => {
                                        const value = product[`C${index + 1}`];
                                        return `<td>${value || 'N/A'}</td>`;
                                    }).join('')}
                                </tr>
                            `;
                        }
                    });
                }
            }

            sectionHTML += `
                        </tbody>
                    </table>
                </div>
            `;

            catalogContainer.innerHTML += sectionHTML;
        }
    } catch (error) {
        console.error("Error rendering catalog as tables:", error);
    }
}

document.addEventListener("DOMContentLoaded", renderCatalogAsTables);

document.addEventListener("DOMContentLoaded", testJSONLoad);


// Llamar a la función al cargar la página


