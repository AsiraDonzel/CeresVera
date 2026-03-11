# Plant Disease Information Database
# Contains detailed information for all 38 plant disease classes

DISEASE_DATABASE = {
    # ==================== APPLE ====================
    "Apple___Apple_scab": {
        "name": "Apple Scab",
        "plant": "Apple",
        "symptoms": "Dark, olive-green to brown lesions on leaves, fruits, and stems. Lesions appear as velvety brown spots that later turn black. Infected leaves may curl and drop prematurely.",
        "causes": "Caused by the fungus Venturia inaequalis. Spreads through airborne spores in cool, wet conditions (50-75°F). Overwinters in fallen leaves.",
        "treatment_organic": "Apply neem oil spray every 7-14 days. Use baking soda spray (1 tbsp baking soda + 1 tbsp vegetable oil + 1 gallon water). Remove and destroy infected plant parts. Improve air circulation.",
        "treatment_chemical": "Apply copper-based fungicides (Copper sulfate, Copper hydroxide) at bud break. Use systemic fungicides like myclobutanil or captan. Follow label instructions carefully.",
        "prevention": "Plant resistant apple varieties. Prune trees for good air circulation. Remove fallen leaves in autumn. Avoid overhead watering. Apply preventive fungicides in early spring.",
        "severity": "High"
    },
    "Apple___Black_rot": {
        "name": "Black Rot",
        "plant": "Apple",
        "symptoms": "Purple to red spots on leaves that turn brown with concentric rings (frog-eye pattern). Brown, rotting fruit with black pycnidia. Canker formation on branches.",
        "causes": "Caused by fungus Botryosphaeria obtusa. Spreads through rain splash, wind, and insects. Favors warm, humid conditions.",
        "treatment_organic": "Remove and destroy infected plant parts. Apply copper fungicide. Use resistant varieties. Sanitize pruning tools.",
        "treatment_chemical": "Apply captan, myclobutanil, or copper-based fungicides. Use thiophanate-methyl for severe cases. Spray at petal fall and cover sprays.",
        "prevention": "Remove mummified fruits and cankered branches. Prune to improve air circulation. Avoid wounding trees. Monitor with disease forecasting.",
        "severity": "Medium"
    },
    "Apple___Cedar_apple_rust": {
        "name": "Cedar Apple Rust",
        "plant": "Apple",
        "symptoms": "Bright orange-yellow spots on leaves with concentric rings. Raised orange galls on fruits. Elongated lesions on twigs.",
        "causes": "Caused by fungus Gymnosporangium juniperi-virginianae. Requires alternate hosts (juniper/cedar) to complete life cycle. Spores spread by wind in spring.",
        "treatment_organic": "Remove galls from juniper hosts. Apply sulfur sprays. Use resistant apple varieties. Remove nearby cedar trees if possible.",
        "treatment_chemical": "Apply myclobutanil, propiconazole, or copper fungicides. Use systemic fungicides for better control. Timing is critical - spray at pink stage.",
        "prevention": "Plant resistant varieties. Remove alternate hosts within 1 mile. Apply preventive fungicides. Monitor nearby cedar trees.",
        "severity": "Medium"
    },
    "Apple___healthy": {
        "name": "Healthy Apple",
        "plant": "Apple",
        "symptoms": "Leaves are green, firm, and free of spots or discoloration. Normal growth pattern. No visible lesions, wilting, or abnormalities.",
        "causes": "No disease - plant is healthy and properly maintained.",
        "treatment_organic": "Continue good care practices. Maintain proper watering and nutrition. Monitor regularly for early disease detection.",
        "treatment_chemical": "None needed - plant is healthy. Continue preventive care.",
        "prevention": "Regular watering and fertilization. Proper pruning. Monitor for pests and diseases. Good orchard sanitation.",
        "severity": "None"
    },

    # ==================== BLUEBERRY ====================
    "Blueberry___healthy": {
        "name": "Healthy Blueberry",
        "plant": "Blueberry",
        "symptoms": "Leaves are green with good color. Normal growth. No spots, wilting, or deformities. Healthy fruit production.",
        "causes": "No disease - plant is healthy.",
        "treatment_organic": "Maintain acidic soil (pH 4.5-5.5). Regular watering. Apply mulch for moisture retention.",
        "treatment_chemical": "None needed.",
        "prevention": "Soil testing. Proper fertilization. Adequate drainage.",
        "severity": "None"
    },

    # ==================== CHERRY ====================
    "Cherry___Powdery_mildew": {
        "name": "Powdery Mildew",
        "plant": "Cherry",
        "symptoms": "White to gray powdery coating on leaves, shoots, and fruits. Leaves may curl and distort. Infected fruits may have raised lenticels.",
        "causes": "Caused by fungus Podosphaera clandestina. Thrives in warm, dry days and cool, humid nights. Poor air circulation promotes spread.",
        "treatment_organic": "Apply neem oil or sulfur-based sprays. Improve air circulation. Remove severely infected leaves. Water at soil level.",
        "treatment_chemical": "Apply triforine, myclobutanil, or copper-based fungicides. Use potassium bicarbonate for organic options. Rotate fungicides to prevent resistance.",
        "prevention": "Plant resistant varieties. Prune for good air flow. Avoid overhead irrigation. Monitor early in season.",
        "severity": "Medium"
    },
    "Cherry___healthy": {
        "name": "Healthy Cherry",
        "plant": "Cherry",
        "symptoms": "Leaves are green and glossy. Normal development. No white powder, spots, or wilting observed.",
        "causes": "No disease - plant is healthy.",
        "treatment_organic": "Maintain good cultural practices. Proper watering and nutrition.",
        "treatment_chemical": "None needed.",
        "prevention": "Regular monitoring. Good sanitation. Proper pruning.",
        "severity": "None"
    },

    # ==================== CORN ====================
    "Corn___Cercospora_leaf_spot": {
        "name": "Cercospora Leaf Spot (Gray Leaf Spot)",
        "plant": "Corn",
        "symptoms": "Small, rectangular, tan to gray lesions bounded by leaf veins. Lesions may coalesce causing extensive leaf blighting. Most common on lower leaves.",
        "causes": "Caused by fungus Cercospora zeae-maydis. Overwinters in crop residue. Spreads by wind and rain. Favored by warm (77-86°F), humid conditions.",
        "treatment_organic": "Rotate crops with non-grass plants. Remove and destroy infected debris. Apply compost to promote soil health.",
        "treatment_chemical": "Apply triazoles (propiconazole, azoxystrobin). Use strobilurin fungicides. Seed treatment with fungicides. Foliar sprays at tasseling.",
        "prevention": "Plant resistant hybrids. Crop rotation (2-3 years). Tillage to bury residue. Avoid irrigation late in day.",
        "severity": "Medium"
    },
    "Corn___Common_rust": {
        "name": "Common Rust",
        "plant": "Corn",
        "symptoms": "Small, circular to elongate, reddish-brown to cinnamon-brown pustules on both leaf surfaces. Pustules rupture releasing brown powder (spores). Severe infections cause leaf death.",
        "causes": "Caused by fungus Puccinia sorghi. Requires living corn tissue to survive. Spores overwinter in southern regions and spread north on wind.",
        "treatment_organic": "Remove infected leaves. Improve air circulation. Apply baking soda spray (1 tbsp/gallon). Use resistant varieties.",
        "treatment_chemical": "Apply triazoles (propiconazole, tebuconazole). Use strobilurins. Early detection critical. fungicides most effective when applied before pustules form.",
        "prevention": "Plant resistant hybrids. Early planting. Monitor weather forecasts. Scout fields regularly.",
        "severity": "Medium"
    },
    "Corn___Northern_Leaf_Blight": {
        "name": "Northern Leaf Blight",
        "plant": "Corn",
        "symptoms": "Elliptical, grayish-green to tan lesions (1-6 inches long). Lesions begin on lower leaves and progress upward. Severe infection causes extensive blighting.",
        "causes": "Caused by fungus Exserohilum turcicum. Overwinters in crop residue. Spreads by wind and rain. Favored by moderate temperatures (64-81°F) and high humidity.",
        "treatment_organic": "Crop rotation. Remove infected debris. Apply compost. Use resistant varieties.",
        "treatment_chemical": "Apply triazoles or strobilurin fungicides. Foliar application at tassel/silk stage. Use seed treatments.",
        "prevention": "Plant resistant hybrids. Crop rotation. Tillage. Balanced fertilization. Avoid stress conditions.",
        "severity": "Medium"
    },
    "Corn___healthy": {
        "name": "Healthy Corn",
        "plant": "Corn",
        "symptoms": "Leaves are green and upright. Normal tasseling and silking. No lesions, spots, or discoloration observed.",
        "causes": "No disease - plant is healthy.",
        "treatment_organic": "Maintain proper nitrogen levels. Adequate watering. Good field management.",
        "treatment_chemical": "None needed.",
        "prevention": "Balanced fertilization. Crop rotation. Regular monitoring.",
        "severity": "None"
    },

    # ==================== GRAPE ====================
    "Grape___Black_rot": {
        "name": "Black Rot",
        "plant": "Grape",
        "symptoms": "Brown, circular lesions on leaves with dark borders. Infected berries turn brown, shrivel, and become mummified. Can destroy entire cluster.",
        "causes": "Caused by fungus Guignardia bidwellii. Overwinters in mummified berries and canes. Spreads by rain splash and wind.",
        "treatment_organic": "Remove and destroy infected plant parts. Apply copper-based fungicides. Improve air circulation. Remove nearby wild grapes.",
        "treatment_chemical": "Apply captan, myclobutanil, or copper fungicides. Use protectant and systemic fungicides. Spray schedule from bud break through veraison.",
        "prevention": "Plant resistant varieties. Prune properly. Remove mummified fruit. Monitor early season.",
        "severity": "High"
    },
    "Grape___Esca": {
        "name": "Esca (Black Measles)",
        "plant": "Grape",
        "symptoms": "Interveinal brown streaks on leaves that dry and fall leaving shot-hole appearance. Dark streaks in woody tissue. Infected vines may wilt and die.",
        "causes": "Caused by multiple fungi (Phaeomariella, Fomitiporia). Enters through pruning wounds. Chronic disease that builds up over years.",
        "treatment_organic": "Remove and destroy infected vines. Avoid pruning in wet weather. Use protective wound sealants. Maintain vine health.",
        "treatment_chemical": "Apply fungicides to pruning wounds (captan, copper). Use thiophanate-methyl. No reliable chemical control - focus on prevention.",
        "prevention": "Avoid pruning in rain. Use wound protectants. Remove severely infected vines. Sanitize tools.",
        "severity": "High"
    },
    "Grape___Leaf_blight": {
        "name": "Leaf Blight (Isariopsis Leaf Spot)",
        "plant": "Grape",
        "symptoms": "Large, angular, brown to purple spots on leaves. Spots may have concentric rings. Severe infection causes leaf blighting and defoliation.",
        "causes": "Caused by fungus Pseudocercospora vitis. Overwinters in infected leaves. Spreads by rain splash and wind.",
        "treatment_organic": "Remove infected leaves. Apply copper fungicides. Improve air circulation. Mulch to bury inoculum.",
        "treatment_chemical": "Apply copper-based fungicides. Use mancozeb or chlorothalonil. Follow spray schedule during growing season.",
        "prevention": "Remove leaf litter. Prune for airflow. Avoid overhead irrigation. Monitor early.",
        "severity": "Medium"
    },
    "Grape___healthy": {
        "name": "Healthy Grape",
        "plant": "Grape",
        "symptoms": "Leaves are green with good color and no spots. Normal vine growth. Healthy fruit clusters.",
        "causes": "No disease - plant is healthy.",
        "treatment_organic": "Maintain good vineyard practices. Proper pruning and training.",
        "treatment_chemical": "None needed.",
        "prevention": "Regular monitoring. Good sanitation. Proper fertilization.",
        "severity": "None"
    },

    # ==================== ORANGE ====================
    "Orange___Haunglongbing": {
        "name": "Huanglongbing (Citrus Greening)",
        "plant": "Orange",
        "symptoms": "Blotchy mottling of leaves (asymmetric yellowing). Lopsided, bitter fruit that remains green at stem end. Stunted growth. Leaf and fruit drop.",
        "causes": "Caused by bacteria Candidatus Liberibacter asiaticus. Transmitted by Asian citrus psyllid insect. Also spread through grafting infected material.",
        "treatment_organic": "No cure exists. Remove infected trees. Control psyllid population with neem oil. Use reflective mulch. Boost tree nutrition.",
        "treatment_chemical": "No effective cure. Control psyllids with insecticides (imidacloprid, thiamethoxam). Remove infected trees to prevent spread. Antibiotics (oxytetracycline) may provide temporary relief.",
        "prevention": "Plant certified disease-free trees. Control psyllid vectors aggressively. Scout regularly. Remove infected trees immediately. Use quarantine measures.",
        "severity": "Critical"
    },

    # ==================== PEACH ====================
    "Peach___Bacterial_spot": {
        "name": "Bacterial Spot",
        "plant": "Peach",
        "symptoms": "Small, dark, water-soaked lesions on leaves that turn brown and may drop out creating holes. Dark, raised lesions on fruits. Cankers on twigs.",
        "causes": "Caused by bacterium Xanthomonas arboricola pv. pruni. Spreads through rain splash and wind. Favored by warm, wet conditions during bloom.",
        "treatment_organic": "Apply copper-based bactericides. Remove infected plant parts. Use resistant varieties. Avoid overhead irrigation.",
        "treatment_chemical": "Apply copper fungicides (copper hydroxide, copper sulfate). Use streptomycin (some regions). Apply at petal fall and cover sprays.",
        "prevention": "Plant resistant varieties. Avoid planting in low, wet areas. Prune for air circulation. Monitor weather for infection periods.",
        "severity": "Medium"
    },
    "Peach___healthy": {
        "name": "Healthy Peach",
        "plant": "Peach",
        "symptoms": "Leaves are green and healthy looking. Normal fruit development. No spots, holes, or wilting.",
        "causes": "No disease - plant is healthy.",
        "treatment_organic": "Proper watering and fertilization. Good pruning practices.",
        "treatment_chemical": "None needed.",
        "prevention": "Regular monitoring. Proper orchard management.",
        "severity": "None"
    },

    # ==================== PEPPER ====================
    "Pepper___Bacterial_spot": {
        "name": "Bacterial Spot",
        "plant": "Pepper",
        "symptoms": "Water-soaked lesions on leaves that turn brown and may have yellow halos. Raised, scab-like lesions on fruits. Severe infection causes leaf drop.",
        "causes": "Caused by bacteria Xanthomonas campestris pv. vesicatoria. Spread by rain splash, wind, and contaminated seeds. Warm, wet conditions favor disease.",
        "treatment_organic": "Remove infected plants. Apply copper sprays. Use disease-free seeds. Improve air circulation.",
        "treatment_chemical": "Apply copper-based bactericides. Use streptomycin for transplant production. Seed treatment with hot water or chemicals.",
        "prevention": "Use certified disease-free seeds. Rotate crops (2-3 years). Avoid overhead irrigation. Remove crop debris.",
        "severity": "Medium"
    },
    "Pepper___healthy": {
        "name": "Healthy Pepper",
        "plant": "Pepper",
        "symptoms": "Leaves are green and glossy. Normal flowering and fruiting. No spots, wilting, or deformities.",
        "causes": "No disease - plant is healthy.",
        "treatment_organic": "Maintain proper watering. Good nutrition. Adequate sunlight.",
        "treatment_chemical": "None needed.",
        "prevention": "Regular monitoring. Proper cultural practices.",
        "severity": "None"
    },

    # ==================== POTATO ====================
    "Potato___Early_blight": {
        "name": "Early Blight",
        "plant": "Potato",
        "symptoms": "Dark, concentric lesions (target-spot pattern) on lower leaves. Lesions have dark borders with tan centers. Leaves yellow and die prematurely. Can affect tubers.",
        "causes": "Caused by fungus Alternaria solani. Overwinters in infected plant debris. Spreads by wind and rain. Favored by warm, humid conditions.",
        "treatment_organic": "Remove infected leaves. Apply copper fungicides. Use compost tea. Improve air circulation. Mulch around plants.",
        "treatment_chemical": "Apply chlorothalonil, mancozeb, or copper fungicides. Use azoxystrobin or other strobilurins. Begin spraying when plants are 6 inches tall.",
        "prevention": "Plant resistant varieties. Rotate crops (3-4 years). Remove plant debris. Avoid overhead irrigation. Hill up soil around plants.",
        "severity": "Medium"
    },
    "Potato___Late_blight": {
        "name": "Late Blight",
        "plant": "Potato",
        "symptoms": "Water-soaked, grayish-green lesions on leaves that rapidly turn brown. White fuzzy growth on leaf undersides in humid weather. Tuber rot with reddish-brown discoloration.",
        "causes": "Caused by oomycete Phytophthora infestans. Spreads rapidly in cool (50-60°F), wet conditions. Can devastate crops in days.",
        "treatment_organic": "Remove and destroy infected plants immediately. Apply copper-based fungicides preventively. Improve drainage. Use resistant varieties.",
        "treatment_chemical": "Apply protectant fungicides (mancozeb, chlorothalonil) before infection. Use systemic fungicides (metalaxyl, fluopicolide) after detection. Frequent applications needed in wet weather.",
        "prevention": "Plant certified seed potatoes. Use resistant varieties. Hill soil around plants. Destroy cull piles. Monitor weather (Blight forecasting).",
        "severity": "Critical"
    },
    "Potato___healthy": {
        "name": "Healthy Potato",
        "plant": "Potato",
        "symptoms": "Leaves are green and vigorous. Normal tuber development. No spots, wilting, or rot.",
        "causes": "No disease - plant is healthy.",
        "treatment_organic": "Proper hilling and watering. Good soil management.",
        "treatment_chemical": "None needed.",
        "prevention": "Use certified seed. Crop rotation. Regular monitoring.",
        "severity": "None"
    },

    # ==================== RASPBERRY ====================
    "Raspberry___healthy": {
        "name": "Healthy Raspberry",
        "plant": "Raspberry",
        "symptoms": "Leaves are green with good color. Normal cane growth. Healthy fruit production.",
        "causes": "No disease - plant is healthy.",
        "treatment_organic": "Proper pruning and training. Adequate watering. Good nutrition.",
        "treatment_chemical": "None needed.",
        "prevention": "Regular monitoring. Good sanitation. Proper spacing.",
        "severity": "None"
    },

    # ==================== SOYBEAN ====================
    "Soybean___healthy": {
        "name": "Healthy Soybean",
        "plant": "Soybean",
        "symptoms": "Leaves are green and healthy. Normal plant development. No spots, wilting, or discoloration.",
        "causes": "No disease - plant is healthy.",
        "treatment_organic": "Proper field management. Crop rotation. Balanced nutrition.",
        "treatment_chemical": "None needed.",
        "prevention": "Use quality seeds. Regular scouting. Proper fertilization.",
        "severity": "None"
    },

    # ==================== SQUASH ====================
    "Squash___Powdery_mildew": {
        "name": "Powdery Mildew",
        "plant": "Squash",
        "symptoms": "White to gray powdery spots on leaves and stems. Leaves may turn yellow and dry out. Severe infection reduces fruit quality and yield.",
        "causes": "Caused by fungi Erysiphe cichoracearum and Sphaerotheca fuliginea. Thrives in warm, dry conditions with high humidity on leaf surfaces.",
        "treatment_organic": "Apply neem oil or milk spray (1:9 milk:water). Apply baking soda solution (1 tbsp + 1 tbsp vegetable oil + 1 gallon water). Remove infected leaves.",
        "treatment_chemical": "Apply sulfur, potassium bicarbonate, or copper-based fungicides. Use triforine or myclobutanil. Apply at first sign of disease.",
        "prevention": "Plant resistant varieties. Space plants properly. Water at soil level. Remove plant debris. Improve air circulation.",
        "severity": "Medium"
    },

    # ==================== STRAWBERRY ====================
    "Strawberry___Leaf_scorch": {
        "name": "Leaf Scorch",
        "plant": "Strawberry",
        "symptoms": "Purple to dark brown spots on leaves that enlarge and merge. Leaves appear scorched but remain attached. Severe cases cause leaf death.",
        "causes": "Caused by fungus Diplocarpon earlianum. Spreads through rain splash and contaminated plants. Favored by warm, humid conditions.",
        "treatment_organic": "Remove infected leaves. Apply copper fungicides. Improve air circulation. Use resistant varieties.",
        "treatment_chemical": "Apply captan, myclobutanil, or copper-based fungicides. Use protectant fungicides regularly. Remove heavily infected plantings.",
        "prevention": "Use disease-free transplants. Rotate (2-3 years). Remove debris. Avoid overhead irrigation. Plant resistant varieties.",
        "severity": "Medium"
    },
    "Strawberry___healthy": {
        "name": "Healthy Strawberry",
        "plant": "Strawberry",
        "symptoms": "Leaves are green with good color. Normal fruit production. No spots, scorch, or wilting.",
        "causes": "No disease - plant is healthy.",
        "treatment_organic": "Proper watering and mulching. Good nutrition. Regular renovation.",
        "treatment_chemical": "None needed.",
        "prevention": "Use certified plants. Proper spacing. Regular monitoring.",
        "severity": "None"
    },

    # ==================== TOMATO ====================
    "Tomato___Bacterial_spot": {
        "name": "Bacterial Spot",
        "plant": "Tomato",
        "symptoms": "Small, dark, water-soaked spots on leaves that turn brown. Spots may have yellow halos. Raised spots on fruits. Severe leaf drop.",
        "causes": "Caused by bacteria Xanthomonas vesicatoria. Spread by rain splash, wind, and contaminated seeds. Warm, wet conditions favor disease.",
        "treatment_organic": "Remove infected plants. Apply copper bactericides. Use disease-free seeds. Improve air circulation.",
        "treatment_chemical": "Apply copper-based bactericides. Use streptomycin for transplant production. Seed treatment with hot water.",
        "prevention": "Use certified disease-free seeds. Rotate crops (3 years). Avoid overhead irrigation. Remove crop debris.",
        "severity": "Medium"
    },
    "Tomato___Early_blight": {
        "name": "Early Blight",
        "plant": "Tomato",
        "symptoms": "Dark lesions with concentric rings (target-spot pattern) on lower leaves. Leaves yellow and die from bottom up. Can affect stems and fruit.",
        "causes": "Caused by fungus Alternaria solani. Overwinters in plant debris and soil. Spreads by wind and rain. Favored by warm, humid conditions.",
        "treatment_organic": "Remove infected leaves. Apply copper fungicide. Use compost tea. Mulch around plants. Improve air circulation.",
        "treatment_chemical": "Apply chlorothalonil, mancozeb, or copper fungicides. Use azoxystrobin. Begin preventive sprays when plants are established.",
        "prevention": "Rotate crops (3 years). Mulch around plants. Remove plant debris. Avoid overhead irrigation. Support plants properly.",
        "severity": "Medium"
    },
    "Tomato___Late_blight": {
        "name": "Late Blight",
        "plant": "Tomato",
        "symptoms": "Water-soaked, grayish-green lesions on leaves that rapidly turn brown. White fuzzy growth in humid weather. Fruit develops greasy, brown spots.",
        "causes": "Caused by oomycete Phytophthora infestans. Spreads rapidly in cool (50-60°F), wet conditions. Can destroy crops in days.",
        "treatment_organic": "Remove and destroy infected plants immediately. Apply copper fungicides preventively. Improve air circulation. Avoid overhead watering.",
        "treatment_chemical": "Apply protectant fungicides (mancozeb, chlorothalonil) before infection. Use systemic fungicides after detection. Frequent applications needed.",
        "prevention": "Plant resistant varieties. Use certified plants. Destroy cull piles. Monitor weather. Remove volunteer plants.",
        "severity": "Critical"
    },
    "Tomato___Leaf_Mold": {
        "name": "Leaf Mold",
        "plant": "Tomato",
        "symptoms": "Yellow spots on upper leaf surface with olive-green to brown fuzzy growth on undersides. Leaves may curl and dry. Severe infection causes defoliation.",
        "causes": "Caused by fungus Passalora fulva. Thrives in high humidity (85%+) and moderate temperatures. Spores spread by air and water.",
        "treatment_organic": "Remove infected leaves. Improve air circulation. Reduce humidity. Apply sulfur fungicide. Use compost tea.",
        "treatment_chemical": "Apply copper fungicides, chlorothalonil, or mancozeb. Use systemic fungicides. Improve greenhouse ventilation.",
        "prevention": "Space plants properly. Stake plants. Avoid overhead irrigation. Maintain good air circulation. Monitor humidity.",
        "severity": "Medium"
    },
    "Tomato___Septoria_leaf_spot": {
        "name": "Septoria Leaf Spot",
        "plant": "Tomato",
        "symptoms": "Many small, dark spots with light centers on lower leaves. Spots have dark borders and may have tiny black dots (pycnidia) in center. Leaves yellow and die.",
        "causes": "Caused by fungus Septoria lycopersici. Overwinters in plant debris. Spreads by rain splash, wind, and contaminated tools.",
        "treatment_organic": "Remove infected leaves immediately. Apply copper fungicide. Use compost tea. Mulch around plants.",
        "treatment_chemical": "Apply chlorothalonil, mancozeb, copper fungicides, or azoxystrobin. Start spraying when first spots appear. Repeat every 7-14 days.",
        "prevention": "Rotate crops (1-2 years). Remove plant debris. Mulch around plants. Avoid overhead irrigation. Stake plants.",
        "severity": "Medium"
    },
    "Tomato___Spider_mites": {
        "name": "Spider Mites",
        "plant": "Tomato",
        "symptoms": "Tiny yellow or white speckles on leaves (stippling). Fine webbing on plants. Leaves may turn yellow and dry. Severe infestation causes bronzing.",
        "causes": "Caused by spider mite pests (Tetranychus urticae). Thrive in hot, dry conditions. Can reproduce rapidly.",
        "treatment_organic": "Spray with strong water jet to dislodge mites. Apply neem oil or insecticidal soap. Release predatory mites. Keep plants well-watered.",
        "treatment_chemical": "Apply abamectin, bifenazate, or spiromesifen. Use miticides specifically labeled for tomatoes. Rotate products to prevent resistance.",
        "prevention": "Monitor regularly especially in hot weather. Keep plants well-watered (drought stress increases susceptibility). Avoid broad-spectrum insecticides that kill beneficial insects.",
        "severity": "Medium"
    },
    "Tomato___Target_Spot": {
        "name": "Target Spot",
        "plant": "Tomato",
        "symptoms": "Circular lesions with concentric rings (target pattern) on leaves. Lesions may have yellow halos. Can cause stem lesions and fruit rot.",
        "causes": "Caused by fungus Corynespora cassiicola. Spreads through rain splash and wind. Favored by warm, wet conditions.",
        "treatment_organic": "Remove infected leaves. Apply copper fungicide. Improve air circulation. Mulch around plants.",
        "treatment_chemical": "Apply chlorothalonil, mancozeb, or copper fungicides. Use azoxystrobin or other strobilurins.",
        "prevention": "Rotate crops. Remove plant debris. Stake plants. Avoid overhead irrigation. Use resistant varieties.",
        "severity": "Medium"
    },
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "name": "Tomato Yellow Leaf Curl Virus (TYLCV)",
        "plant": "Tomato",
        "symptoms": "Upward curling of leaves. Yellowing of leaf margins. Stunted plant growth. Reduced fruit set. Leaves may be smaller than normal.",
        "causes": "Caused by begomovirus transmitted by whitefly (Bemisia tabaci). Also spreads through grafting. Not seed transmitted.",
        "treatment_organic": "Remove infected plants immediately. Control whitefly population with yellow sticky traps. Use reflective mulch. Plant resistant varieties.",
        "treatment_chemical": "Control whiteflies with imidacloprid, thiamethoxam, or pyriproxyfen. Apply insecticides at seedling stage. Remove infected plants immediately.",
        "prevention": "Use resistant/tolerant varieties. Control whitefly population aggressively. Use yellow sticky traps. Remove weed hosts. Use screen houses for seedlings.",
        "severity": "Critical"
    },
    "Tomato___Tomato_mosaic_virus": {
        "name": "Tomato Mosaic Virus (ToMV)",
        "plant": "Tomato",
        "symptoms": "Mottled light and dark green mosaic pattern on leaves. Leaves may be distorted, curled, or fern-like. Stunted growth. Fruit may have uneven ripening.",
        "causes": "Caused by Tobamovirus. Extremely stable virus. Spreads through contaminated tools, hands, and plant contact. Can survive in dried plant material for years.",
        "treatment_organic": "Remove and destroy infected plants. Disinfect all tools with 10% bleach solution. Control insect vectors. Use resistant varieties.",
        "treatment_chemical": "No cure exists. Remove infected plants. Control thrips (vectors). Disinfect greenhouse structures. Use certified clean seeds and transplants.",
        "prevention": "Use certified disease-free seeds and transplants. Disinfect tools (bleach, heat). Wash hands before handling plants. Control thrips. Remove weeds.",
        "severity": "High"
    },
    "Tomato___healthy": {
        "name": "Healthy Tomato",
        "plant": "Tomato",
        "symptoms": "Leaves are green and healthy. Normal growth pattern. No spots, wilting, mosaic, or curling observed. Good fruit development.",
        "causes": "No disease - plant is healthy and properly maintained.",
        "treatment_organic": "Continue good cultural practices. Proper staking and pruning. Balanced watering and nutrition.",
        "treatment_chemical": "None needed - plant is healthy.",
        "prevention": "Regular monitoring for pests and diseases. Proper spacing and air circulation. Consistent watering. Good sanitation practices.",
        "severity": "None"
    }
}

# Get all disease names (class labels)
def get_all_classes():
    return list(DISEASE_DATABASE.keys())

# Get disease info by class name
def get_disease_info(class_name):
    return DISEASE_DATABASE.get(class_name)

# Get all healthy classes
def get_healthy_classes():
    return [k for k in DISEASE_DATABASE.keys() if "healthy" in k.lower()]

# Get all disease classes (non-healthy)
def get_disease_classes():
    return [k for k in DISEASE_DATABASE.keys() if "healthy" not in k.lower()]

# Get classes by plant type
def get_classes_by_plant(plant):
    return [k for k in DISEASE_DATABASE.keys() if plant.lower() in k.lower()]
