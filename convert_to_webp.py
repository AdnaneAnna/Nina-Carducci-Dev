import os
from PIL import Image

# Chemin vers le dossier contenant les images source
source_folder = "/Users/adnaneanna/Nina-Carducci-Dev/assets/images"
# Chemin vers le dossier où enregistrer les images optimisées
dest_folder = "/Users/adnaneanna/Nina-Carducci-Dev/assets/optimized_images"

# Créer le dossier de destination s'il n'existe pas
os.makedirs(dest_folder, exist_ok=True)

# Parcours des images dans le dossier source et ses sous-dossiers
for root, dirs, files in os.walk(source_folder):
    for filename in files:
        if filename.endswith(('.jpg', '.jpeg', '.png')):
            # Création des chemins source et destination
            source_file = os.path.join(root, filename)
            relative_path = os.path.relpath(root, source_folder)
            destination_dir = os.path.join(dest_folder, relative_path)
            os.makedirs(destination_dir, exist_ok=True)

            # Nom du fichier en .webp
            new_filename = os.path.splitext(filename)[0] + ".webp"
            destination_file = os.path.join(destination_dir, new_filename)

            # Conversion de l'image en format WebP
            try:
                with Image.open(source_file) as img:
                    img.save(destination_file, "webp", quality=80)
                    print(f"Image convertie : {filename} -> {new_filename}")
            except Exception as e:
                print(f"Erreur lors de la conversion de {filename} : {e}")

print("Toutes les images ont été converties avec succès.")
