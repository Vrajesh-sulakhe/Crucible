import fitz  # PyMuPDF
from pathlib import Path

pdf_dir = Path("/Users/vrajeshsulakhe/Documents/GitHub/Crucible/data/pdfs")
pdf_dir.mkdir(parents=True, exist_ok=True)

# 1. Generate SKF_6205_Datasheet.pdf
doc1 = fitz.open()
page1 = doc1.new_page()

text1 = """SKF Explorer Deep Groove Ball Bearings
Product Datasheet: SKF 6205-2RSH

1. Product Designation & Category
Designation: 6205-2RSH
Category: Deep Groove Ball Bearings
Sealing Type: 2RSH Contact Rubber Seal on both sides
Material: AISI 52100 high carbon chromium vacuum-degassed bearing steel
Boundary Dimensions: Conforms to ISO 15:2017 and DIN 625-1

2. Principal Dimensions
Bore diameter (d): 25 mm
Outer diameter (D): 52 mm
Width / Thickness (B): 15 mm
Mass / Net Weight: 0.13 kg

3. Calculation Data & Load Ratings
Basic dynamic load rating (C): 14.8 kN
Basic static load rating (C0): 7.8 kN
Fatigue load limit (Pu): 0.335 kN
Limiting speed with contact seals: 8500 r/min (rpm)
Reference speed (thermal): 14000 rpm

4. Applications & Operating Conditions
Suitable for electric motors, centrifugal pumps, industrial gearboxes, and automotive transmissions.
Operating temperature range: -40 °C to +100 °C.
"""

page1.insert_text((50, 60), text1, fontsize=11)
doc1.save(str(pdf_dir / "SKF_Rolling_Bearings_6205.pdf"))
doc1.close()
print("Generated SKF_Rolling_Bearings_6205.pdf")

# 2. Generate NSK_6000_Datasheet.pdf
doc2 = fitz.open()
page2 = doc2.new_page()

text2 = """NSK Miniature & Small Deep Groove Ball Bearings
Technical Catalog: NSK 6000-ZZ

1. Specifications & Identification
Part Number: 6000-ZZ
Category: Bearings (Deep Groove Ball Bearings)
Enclosure: Double metal shield (ZZ non-contact)
Material: High Carbon Chromium Bearing Steel (JIS SUJ2)

2. Dimensions & Weight
Inner Bore Diameter (d): 10 mm
Outside Diameter (D): 26 mm
Width (B): 8 mm
Approximate Weight: 19 g (0.019 kg)

3. Ratings & Speed Limits
Basic Dynamic Load Rating (Cr): 4750 N (4.75 kN)
Basic Static Load Rating (Cor): 1960 N (1.96 kN)
Limiting Speed (Grease Lubrication): 22000 rpm
Limiting Speed (Oil Lubrication): 26000 rpm

4. Standards & Applications
Standards: ISO 15 and JIS B 1512
Applications: Fractional horsepower motors, dental tools, cooling fans, and precision instruments.
"""

page2.insert_text((50, 60), text2, fontsize=11)
doc2.save(str(pdf_dir / "NSK_Miniature_and_Small_Bearings.pdf"))
doc2.close()
print("Generated NSK_Miniature_and_Small_Bearings.pdf")
