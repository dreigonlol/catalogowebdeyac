// URLs de los archivos JSON
const technicalDataURL = "./technical_data.json";
const compatibilitiesURL = "./compatibilities.json";
const assetsURL = "./MAssets.json";



const attributeMapping = {
    "A/C Compressor": ["Tipo de Refrigerante", "Ranuras de Polea", "Diametro de Polea", "Voltaje de bobina"],
    "Radiator": ["Alto in", "Ancho in", "Espesor cm"],
    "A/C Condenser": ["Alto in", "Ancho in", "Espesor cm"],
    "A/C Condenser Fan": ["Ventiladores", "Aspas", "Pines"],
    "A/C Evaporator Core": ["Alto in", "Ancho in", "Espesor mm"],
    "Alternator": [],
    "Engine Coolant Reservoir": ["Ancho mm", "Fondo mm", "Largo mm", "C/Tapon", "C/Sensor"],
    "Engine Coolant Reservoir Cap": [],
    "Engine Cooling Fan": ["Ventiladores", "Aspas","Tipo de Conector"],
    "Engine Cooling Fan Blade": ["Ventiladores", "Aspas"],
    "Engine Cooling Fan Clutch": ["Tipo de embrague", "Rotación del embrague","Diametro del embrague"],
    "Engine Cooling Fan Shroud": [],
    "Engine Oil Cooler": ["Largo Pulgadas", "Alto Pulgadas", "Ancho Pulgadas"],
    "HVAC Blower Motor": [],
    "HVAC Heater Core": ["Alto in", "Ancho in", "Espesor mm"],
    "HVAC Heater Hose": [],
    "Intercooler": ["Alto in", "Ancho in", "Espesor mm"],
    "Power Steering Reservoir": [],
    "Transmission Oil Cooler": ["Alto in", "Largo in"],
    "Washer Fluid Reservoir": []
    // Agrega más productos según sea necesario
};

const selectedColumnsMapping = {
    "A/C Compressor": ["C1", "C2", "C3", "C4"],
    "Radiator": ["C5", "C6", "C3"],
    "A/C Condenser": ["C4", "C5", "C3"],
    "A/C Condenser Fan": ["C1", "C2","C8"],
    "A/C Evaporator Core": ["C1", "C2","C3"],
    "Alternator": [],
    "Engine Coolant Reservoir": ["C1", "C2", "C3", "C5", "C6"],
    "Engine Coolant Reservoir Cap": [],
    "Engine Cooling Fan": ["C1", "C2","C8"],
    "Engine Cooling Fan Blade": ["C1", "C2"],
    "Engine Cooling Fan Clutch": ["C1", "C2","C3"],
    "Engine Cooling Fan Shroud": [],
    "Engine Oil Cooler": ["C2", "C3", "C4"],
    "HVAC Blower Motor": [],
    "HVAC Heater Core": ["C4", "C5", "C3"],
    "HVAC Heater Hose": [],
    "Intercooler": ["C4", "C5", "C3"],
    "Power Steering Reservoir": [],
    "Transmission Oil Cooler": ["C2", "C3"],
    "Washer Fluid Reservoir": []
    // Agrega más configuraciones según sea necesario
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
            const selectedColumns = selectedColumnsMapping[productType] || ["C1", "C2", "C3", "C4", "C5", "C6"];

            let sectionHTML = `
                <div class="product-section">
                    <div id="Linea" class="Linea"><h3>${productType}</h3></div>
                    <table>
                        <thead>
                            <tr>
                                <th id="TColumnas" class="TColumnas">Part Number</th>
                                <th id="year" class="year">Año</th>
                                ${attributes.map(attr => `<th id="TColumnas" class="TColumnas">${attr}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
            `;

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

            
            for (const [make, models] of Object.entries(groupedCompatibilities)) {
                i=0;

                for (const [model, compatibilitiesForModel] of Object.entries(models)) {
                    j=0;
                    
                    compatibilitiesForModel.forEach(({ Year, PartNumber }) => {
                        const product = products.find(p => p.PartNumber === PartNumber);
                        
                        if (product) {
                            if(i==0){
                                sectionHTML += `<tr class="subheading"><td colspan="100%" id="Marca" class="Marca">${make}</td></tr>`;
                                i++;
                            }
                            if(j==0){
                                sectionHTML += `<tr class="subheading"><td colspan="100%" id="Modelo" class="Modelo">${model}</td></tr>`;
                                j++;
                            }
                            sectionHTML += `
                                <tr id="FT" class="FT">
                                    <td>${PartNumber}</td>
                                    <td>${Year}</td>
                                    ${selectedColumns.map(column => {
                                        const value = product[column];
                                        return `<td>${value || 'N/A'}</td>`;
                                    }).join('')}
                                </tr>
                            `;
                        }
                    });
                }
            }

            sectionHTML += `</tbody></table></div>`;
            catalogContainer.innerHTML += sectionHTML;
        }
    } catch (error) {
        console.error("Error rendering catalog as tables:", error);
    }
}

document.addEventListener("DOMContentLoaded", renderCatalogAsTables);

document.addEventListener("DOMContentLoaded", testJSONLoad);


// Llamar a la función al cargar la página


