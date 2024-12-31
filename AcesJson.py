import pandas as pd
import json

# Leer el archivo Excel
file_path = r"C:\Users\Deyac\OneDrive - DEYAC COOLING SYSTEMS\Documentos\Documentos de PartCat\Actualizaciones Precios y existencias\20241228\ACES.xlsx"

# Cargar hojas
compatibilities = pd.read_excel(file_path, sheet_name="Compatibilidades")
technical_data = pd.read_excel(file_path, sheet_name="Partes")
assets = pd.read_excel(file_path, sheet_name="MasterAsset")

# Convertir a JSON
compatibilities_json = compatibilities.to_json(orient="records", indent=4)
technical_data_json = technical_data.to_json(orient="records", indent=4)
assets_json = assets.to_json(orient="records", indent=4)

# Guardar como archivos JSON
with open("compatibilities.json", "w") as f:
    f.write(compatibilities_json)

with open("technical_data.json", "w") as f:
    f.write(technical_data_json)

with open("MAssets.json", "w") as f:
    f.write(assets_json)

print("Conversión completada. Archivos JSON generados.")
