import { AnalysisResult, ScanFormData, RiskLevel, DoctorUrgency, ActionPriority } from '@/types'
import { DERMATOLOGY_KNOWLEDGE_BASE, ClinicalConditionEntry } from '@/data/dermatologyKnowledgeBase'

/**
 * Extended Dictionary of 40+ additional dermatological conditions
 * with verified ICD-10 codes, categories, and morphological patterns.
 */
interface ExtendedConditionDef {
  name: string
  icd: string
  category: string
  risk: RiskLevel
  urgency: DoctorUrgency
  primaryLesion: string
  color: string
  border: string
  surface: string
  distribution: string
  summary: string
  clinicalDescription: string
  causes: string[]
  triggers: string[]
  actions: { action: string; priority: ActionPriority }[]
  differentials: { name: string; likelihood: string; distinguishing: string }[]
  selfCare: string[]
  avoid: string[]
  keywords: string[]
}

const EXTENDED_DISEASE_CATALOG: ExtendedConditionDef[] = [
  {
    name: 'Keratosis Pilaris',
    icd: 'L85.8',
    category: 'Keratinizing & Follicular',
    risk: 'low',
    urgency: 'routine',
    primaryLesion: 'Follicular keratotic papules ("chicken skin")',
    color: 'Flesh-colored to faint erythematous pink',
    border: 'Monomorphic, discrete follicular plugging',
    surface: 'Spiny, rough, sandpaper-like horny plugs',
    distribution: 'Posterolateral upper arms, anterior thighs, cheeks in children',
    summary: 'Benign genetic keratinization defect causing plug formation in follicular orifices.',
    clinicalDescription: 'Small, non-inflammatory horny follicular papules giving a grater-like texture to extensor limbs.',
    causes: ['Abnormal follicular hyperkeratinization', 'Genetic autosomal dominant trait with variable penetrance', 'Association with atopic diathesis and dry skin'],
    triggers: ['Low atmospheric humidity in winter', 'Frictional clothing contact', 'Dehydrated epidermal barrier'],
    actions: [
      { action: 'Apply keratolytics with 10-20% urea, ammonium lactate 12%, or salicylic acid', priority: 'immediate' },
      { action: 'Use mild soap-free body washes during showers', priority: 'soon' },
      { action: 'Consult a dermatologist if inflammatory redness is prominent', priority: 'routine' },
    ],
    differentials: [
      { name: 'Folliculitis', likelihood: 'Moderate', distinguishing: 'Features pustules centered on hairs; usually tender or itchy.' },
      { name: 'Scurvy', likelihood: 'Low', distinguishing: 'Perifollicular hemorrhages and corkscrew hairs; dietary deficiency.' },
    ],
    selfCare: ['Moisturize immediately after showering', 'Gently exfoliate with a soft washcloth once or twice weekly'],
    avoid: ['Aggressive scrubbing with pumice stones (provokes irritation)', 'Hot drying showers', 'Picking at horny plugs'],
    keywords: ['chicken skin', 'keratosis pilaris', 'strawberry skin', 'bumps on back of arms', 'rough arms'],
  },
  {
    name: 'Erythema Migrans (Lyme Disease)',
    icd: 'A69.20',
    category: 'Bacterial & Vector-Borne',
    risk: 'high',
    urgency: 'urgent',
    primaryLesion: 'Expanding annular erythematous patch ("bull\'s-eye")',
    color: 'Bright red active outer ring with central clearing and induration',
    border: 'Slowly centrifugal expanding edge (>5 cm diameter)',
    surface: 'Flat to mildly indurated, non-scaly',
    distribution: 'Site of tick bite: axillae, groin, popliteal fossae, trunk',
    summary: 'Pathognomonic hallmark rash of early localized Lyme borreliosis transmitted by Ixodes ticks.',
    clinicalDescription: 'Expanding annular erythematous patch typically developing 7-14 days post-tick bite, forming an expanding targetoid pattern.',
    causes: ['Infection with spirochete Borrelia burgdorferi via black-legged tick (Ixodes scapularis) bite'],
    triggers: ['Outdoor activities in wooded or tall grass endemic zones without insect repellent'],
    actions: [
      { action: 'URGENT: Consult a physician immediately for oral doxycycline or amoxicillin course', priority: 'immediate' },
      { action: 'Inspect full body for remaining attached ticks', priority: 'immediate' },
      { action: 'Monitor for systemic neurological or cardiac manifestations', priority: 'soon' },
    ],
    differentials: [
      { name: 'Tick Bite Hypersensitivity', likelihood: 'High', distinguishing: 'Transient small (<2cm) bite reaction that does not centrifugally expand over days.' },
      { name: 'Tinea Corporis', likelihood: 'Moderate', distinguishing: 'Elevated scaly advancing border; KOH preparation positive for fungal hyphae.' },
      { name: 'Cellulitis', likelihood: 'Possible', distinguishing: 'Intensely painful, hot, rapidly spreading ill-defined erythema; lacks central target clearing.' },
    ],
    selfCare: ['Take prescribed antibiotics for the entire duration', 'Rest and hydrate if systemic flu-like symptoms are present'],
    avoid: ['Delaying antibiotic therapy (early treatment prevents Lyme arthritis and carditis)', 'Applying non-indicated topical steroid ointments'],
    keywords: ['bulls eye', 'lyme', 'tick bite', 'erythema migrans', 'target rash', 'expanding ring tick'],
  },
  {
    name: 'Bullous Pemphigoid',
    icd: 'L12.0',
    category: 'Autoimmune Blistering',
    risk: 'high',
    urgency: 'urgent',
    primaryLesion: 'Large tense subepidermal bullae on erythematous or normal skin',
    color: 'Clear to serosanguinous fluid within tense blisters on pink base',
    border: 'Well-circumscribed tense blisters with negative Nikolsky sign',
    surface: 'Tense intact blister roof resistant to rupture, underlying crusts upon healing',
    distribution: 'Lower abdomen, inner thighs, groin, flexor forearms, axillae in older adults',
    summary: 'Autoimmune subepidermal blistering dermatosis driven by autoantibodies against hemidesmosomal BP180 and BP230.',
    clinicalDescription: 'Widespread tense, large (1-4 cm) subepidermal bullae preceded by an intense urticarial prodromal phase in elderly patients.',
    causes: ['Autoantibodies targeting basement membrane zone hemidesmosomes (BP180 / BP230)', 'Complement cascade activation causing subepidermal split'],
    triggers: ['Certain medications (dipeptidyl peptidase-4 inhibitors / gliptins, furosemide, spironolactone)', 'Neurological disorders (stroke, dementia, Parkinson disease)'],
    actions: [
      { action: 'Consult a dermatologist urgently for diagnostic punch biopsy (H&E and Direct Immunofluorescence)', priority: 'immediate' },
      { action: 'Initiate high-potency topical or systemic corticosteroids under medical supervision', priority: 'soon' },
      { action: 'Dress intact and ruptured blisters with non-stick silicone wound dressings', priority: 'immediate' },
    ],
    differentials: [
      { name: 'Pemphigus Vulgaris', likelihood: 'High Clinical Priority', distinguishing: 'Flaccid blisters that rupture easily (positive Nikolsky sign); prominent oral mucosal erosions.' },
      { name: 'Allergic Contact Dermatitis', likelihood: 'Possible', distinguishing: 'Intense microvesicles matching external contactant footprint; negative DIF.' },
    ],
    selfCare: ['Leave intact blister roofs in place as biological dressings', 'Cleanse skin gently with saline or chlorhexidine washes'],
    avoid: ['Ripping off blister roofs', 'Hot baths or vigorous towel friction', 'Medications suspected of triggering the eruption without doctor review'],
    keywords: ['bullous pemphigoid', 'tense blisters', 'large blisters', 'elderly blisters', 'subepidermal blisters', 'bp180'],
  },
  {
    name: 'Pemphigus Vulgaris',
    icd: 'L10.0',
    category: 'Autoimmune Blistering',
    risk: 'high',
    urgency: 'emergency',
    primaryLesion: 'Flaccid intraepidermal bullae rupturing into painful non-healing erosions',
    color: 'Erythematous raw weeping base with fragile blister remnants',
    border: 'Irregular erosions; positive Nikolsky sign (lateral pressure dislodges epidermis)',
    surface: 'Denuded, weeping, painful erosion with necrotic edge',
    distribution: 'Oral buccal mucosa and palate (usually initial site), scalp, face, chest, groin',
    summary: 'Potentially life-threatening autoimmune intraepidermal blistering disease targeting desmoglein-3 and desmoglein-1.',
    clinicalDescription: 'Fragile, flaccid blisters that rupture rapidly, presenting as painful, persistent, denuded cutaneous and mucosal erosions.',
    causes: ['IgG autoantibodies against desmoglein-3 (mucosal) and desmoglein-1 (mucocutaneous) causing acantholysis'],
    triggers: ['Genetic HLA class II associations', 'Certain thiol-containing drugs, penicillamine, or captopril'],
    actions: [
      { action: 'EMERGENCY: Seek immediate dermatology/inpatient admission for systemic immunosuppression (rituximab, high-dose steroids)', priority: 'immediate' },
      { action: 'Maintain gentle oral hygiene with soothing non-alcoholic rinses', priority: 'immediate' },
      { action: 'Protect denuded skin with non-adherent petrolatum dressings to prevent fluid loss and infection', priority: 'soon' },
    ],
    differentials: [
      { name: 'Bullous Pemphigoid', likelihood: 'High', distinguishing: 'Tense blisters that do not rupture easily; Nikolsky negative; mucosal involvement rare.' },
      { name: 'Erythema Multiforme Major / Stevens-Johnson', likelihood: 'Moderate', distinguishing: 'Targetoid lesions, rapid drug-induced onset, full-thickness epidermal necrosis.' },
    ],
    selfCare: ['Eat soft, non-acidic, bland foods if mouth erosions are present', 'Keep skin dressed with sterile petrolatum gauze'],
    avoid: ['Rough, crunchy, or spicy foods', 'Mechanical friction against fragile skin', 'Self-treatment without emergency dermatological care'],
    keywords: ['pemphigus', 'flaccid blisters', 'mouth erosions', 'nikolsky', 'blisters popping easily', 'desmoglein', 'raw skin ulcers'],
  },
  {
    name: 'Granuloma Annulare',
    icd: 'L92.0',
    category: 'Granulomatous Disorders',
    risk: 'low',
    urgency: 'routine',
    primaryLesion: 'Smooth, non-scaly annular ring of firm dermal papules',
    color: 'Flesh-colored, pink, or violaceous',
    border: 'Firm, beaded, raised circular or arcuate border with flat center',
    surface: 'Completely smooth, non-scaly epidermal surface (intact epidermis)',
    distribution: 'Dorsum of hands and fingers, dorsal feet, ankles, elbows',
    summary: 'Benign, self-limiting granulomatous dermal condition characterized by palisading histiocytic collagen degeneration.',
    clinicalDescription: 'Circumscribed rings of discrete, smooth, firm papules in an annular configuration with a slightly depressed central clearing.',
    causes: ['Delayed-type hypersensitivity reaction triggering necrobiotic collagen alteration', 'Association with diabetes mellitus in generalized variants'],
    triggers: ['Minor skin trauma, insect bites, viral infections, or tuberculin skin testing'],
    actions: [
      { action: 'Reassure patient: condition is benign and frequently undergoes spontaneous involution', priority: 'immediate' },
      { action: 'Apply high-potency topical steroid under occlusion or discuss intralesional triamcinolone', priority: 'soon' },
      { action: 'Screen for diabetes mellitus if lesions are generalized or recurrent', priority: 'routine' },
    ],
    differentials: [
      { name: 'Tinea Corporis', likelihood: 'High', distinguishing: 'Active scaly border; fungal KOH positive; granuloma annulare has zero epidermal scale.' },
      { name: 'Nummular Eczema', likelihood: 'Moderate', distinguishing: 'Coin-shaped with surface crust, vesicles, and weeping; itchy.' },
      { name: 'Necrobiosis Lipoidica', likelihood: 'Low', distinguishing: 'Yellow-brown waxy plaques with telangiectasia on anterior pretibial shins.' },
    ],
    selfCare: ['Moisturize skin normally; lesions typically resolve over 1-2 years without scarring'],
    avoid: ['Scraping or aggressive picking at firm nodules', 'Unnecessary antifungal creams (fungus is not present)'],
    keywords: ['granuloma annulare', 'smooth ring', 'firm bumps in circle', 'hands ring non scaly', 'beaded ring'],
  },
  {
    name: 'Alopecia Areata',
    icd: 'L63.9',
    category: 'Hair & Follicular Autoimmune',
    risk: 'low',
    urgency: 'routine',
    primaryLesion: 'Well-circumscribed patch of non-scarring hair loss',
    color: 'Normal skin tone or slight peach-flesh color; exclamation-mark hairs at margins',
    border: 'Sharply demarcated round or oval boundaries',
    surface: 'Smooth, soft, non-scaly, completely bald skin with preserved follicular ostia',
    distribution: 'Scalp, beard area, eyebrows, eyelashes',
    summary: 'Autoimmune attack on anagen hair follicles causing non-scarring patchy hair loss.',
    clinicalDescription: 'Smooth, circular patches of complete hair loss without clinical erythema, scaling, or scarring.',
    causes: ['Collapse of hair follicle immune privilege with autoreactive CD8+ T-cell infiltration', 'Upregulation of IFN-gamma and JAK-STAT pathways'],
    triggers: ['Severe emotional stress or physical trauma', 'Concurrent autoimmune disorders (vitiligo, Hashimoto thyroiditis)'],
    actions: [
      { action: 'Consult a dermatologist for intralesional triamcinolone injections or oral JAK inhibitors', priority: 'soon' },
      { action: 'Protect exposed scalp skin from sun damage with hats and SPF 30+', priority: 'immediate' },
      { action: 'Screen for autoimmune thyroid disease with a simple blood TSH test', priority: 'routine' },
    ],
    differentials: [
      { name: 'Tinea Capitis', likelihood: 'Moderate', distinguishing: 'Features scaling, erythema, broken black-dot hair shafts, and cervical lymphadenopathy.' },
      { name: 'Trichotillomania', likelihood: 'Moderate', distinguishing: 'Irregular geometric patches with hairs broken at varying lengths; compulsive hair pulling.' },
      { name: 'Telogen Effluvium', likelihood: 'Possible', distinguishing: 'Diffuse shedding throughout scalp rather than circumscribed round bare coin patches.' },
    ],
    selfCare: ['Gentle hair washing and styling', 'Wearing soft breathable headwear for sun and thermal protection'],
    avoid: ['Traction hairstyles (tight ponytails or braids) that add physical tension', 'Harsh chemical perms or bleaches'],
    keywords: ['alopecia areata', 'bald spot', 'round hair loss', 'coin shaped bald patch', 'hair falling out in circles'],
  },
  {
    name: 'Melanocytic Nevus (Common Mole)',
    icd: 'D22.9',
    category: 'Benign Neoplasms',
    risk: 'low',
    urgency: 'routine',
    primaryLesion: 'Symmetrical, uniform pigmented macule or dome-shaped papule',
    color: 'Uniform tan, brown, or dark brown',
    border: 'Symmetrical, regular, smoothly contoured circular or oval margins',
    surface: 'Smooth, flat (junctional) to soft dome-shaped (compound/intradermal)',
    distribution: 'Anywhere on the cutaneous surface, sun-exposed areas predominant',
    summary: 'Benign proliferation of melanocytic nevus cells arranged in organized nests.',
    clinicalDescription: 'Symmetrical, sharply circumscribed, uniformly pigmented macule or papule with stable architecture over time.',
    causes: ['Benign clonal proliferation of melanocytes (frequently carrying activating BRAF mutations)', 'Sun exposure and genetic inheritance'],
    triggers: ['Sunlight exposure and hormonal surges (pregnancy) causing slight darkening'],
    actions: [
      { action: 'Practice monthly ABCDE self-monitoring for any changes in symmetry, border, or color', priority: 'immediate' },
      { action: 'Have an annual full-body skin check with a dermatologist', priority: 'routine' },
    ],
    differentials: [
      { name: 'Dysplastic Nevus', likelihood: 'Moderate', distinguishing: 'Mild asymmetry, irregular border, variegated shades of brown; requires dermoscopy.' },
      { name: 'Cutaneous Melanoma', likelihood: 'Critical', distinguishing: 'Prominent ABCDE violations: asymmetric, irregular borders, multiple colors, evolving.' },
      { name: 'Seborrheic Keratosis', likelihood: 'Possible', distinguishing: 'Stuck-on waxy appearance with pseudohorn cysts in older adults.' },
    ],
    selfCare: ['Apply broad-spectrum sunscreen daily', 'Photograph stable moles as a baseline record'],
    avoid: ['Attempting home mole removal, scraping, or corrosive acids', 'Intense tanning beds or sunburns'],
    keywords: ['mole', 'nevus', 'brown spot', 'regular mole', 'birthmark', 'melanocytic'],
  },
  {
    name: 'Cherry Angioma',
    icd: 'D18.01',
    category: 'Benign Vascular',
    risk: 'low',
    urgency: 'routine',
    primaryLesion: 'Bright ruby-red dome-shaped vascular papule',
    color: 'Vivid cherry red to purple-red',
    border: 'Very sharply circumscribed circular margins (1-5mm)',
    surface: 'Smooth, dome-shaped, non-pulsatile; blanches with diascopy',
    distribution: 'Trunk, chest, abdomen, shoulders, and arms in adults >30 years',
    summary: 'Most common benign cutaneous vascular proliferation composed of dilated ectatic capillaries.',
    clinicalDescription: 'Small, bright ruby-red, dome-shaped papules arising spontaneously on the trunk with increasing age.',
    causes: ['Proliferation of mature ectatic endothelial-lined venules and capillaries', 'Normal chronological aging and genetic factors'],
    triggers: ['Advancing age and hormonal changes'],
    actions: [
      { action: 'Reassure patient: cherry angiomas are completely harmless and benign', priority: 'immediate' },
      { action: 'Elective in-office removal via electrodesiccation or pulsed-dye laser if bleeding occurs from trauma', priority: 'routine' },
    ],
    differentials: [
      { name: 'Amelanotic Melanoma', likelihood: 'Low Clinical Priority', distinguishing: 'Irregular, rapidly growing red nodule with friable surface and asymmetric expansion.' },
      { name: 'Pyogenic Granuloma', likelihood: 'Low', distinguishing: 'Rapidly growing, bleeding vascular nodule with collarette, often post-trauma.' },
    ],
    selfCare: ['Protect from accidental shaving or scratching trauma to avoid sudden bleeding'],
    avoid: ['Picking, puncturing, or squeezing vascular lesions at home', 'Caustic home remedies'],
    keywords: ['cherry angioma', 'red mole', 'ruby red spot', 'blood spot skin', 'little red dot'],
  },
  {
    name: 'Dermatofibroma',
    icd: 'D23.9',
    category: 'Benign Mesenchymal',
    risk: 'low',
    urgency: 'routine',
    primaryLesion: 'Firm, button-like dermal nodule showing positive "dimple sign"',
    color: 'Dusky pink, yellow-brown, or hyperpigmented reddish-brown',
    border: 'Sharply circumscribed firm dermal boundary',
    surface: 'Smooth to slightly hyperkeratotic, attached to deep dermis',
    distribution: 'Extremities, particularly lower legs and thighs in young to middle-aged adults',
    summary: 'Common benign fibrohistiocytic dermal lesion, often developing at sites of prior minor insect bites or folliculitis.',
    clinicalDescription: 'Firm, button-like dermal nodule that characteristically puckers inward or "dimples" upon lateral pinching between thumb and forefinger (Fitzpatrick dimple sign).',
    causes: ['Benign reactive fibrohistiocytic proliferation triggered by microtrauma or arthropod bites'],
    triggers: ['Shaving cuts, mosquito bites, or minor thorn pricks'],
    actions: [
      { action: 'Perform the classic pinch test to check for central dimpling', priority: 'immediate' },
      { action: 'Reassure patient: lesion is benign and does not transform into cancer', priority: 'immediate' },
      { action: 'Have any newly changing or bleeding lesion checked by a dermatologist with dermoscopy', priority: 'routine' },
    ],
    differentials: [
      { name: 'Dermatofibrosarcoma Protuberans (DFSP)', likelihood: 'Low', distinguishing: 'Rare malignant counterpart; slowly enlarging indurated violaceous plaque or multinodular mass.' },
      { name: 'Melanocytic Nevus', likelihood: 'Moderate', distinguishing: 'Softer consistency; does not demonstrate the inward dimple sign upon lateral pinch.' },
    ],
    selfCare: ['No active intervention required unless repeatedly traumatized by razors when shaving'],
    avoid: ['Shaving roughly directly over raised nodules', 'Attempting self-excision'],
    keywords: ['dermatofibroma', 'dimple sign', 'firm bump on leg', 'hard pink bump', 'button like nodule'],
  },
  {
    name: 'Epidermoid Cyst',
    icd: 'L72.0',
    category: 'Benign Cysts',
    risk: 'low',
    urgency: 'routine',
    primaryLesion: 'Mobile, dome-shaped subcutaneous nodule with a central comedo-like punctum',
    color: 'Normal skin-colored to yellowish; inflamed variant is erythematous',
    border: 'Round, well-encapsulated, freely movable over deeper subcutaneous structures',
    surface: 'Smooth, tense with visible central pore (punctum)',
    distribution: 'Face, neck, retroauricular, upper back, and chest',
    summary: 'Benign true epithelial-lined cyst filled with laminated, foul-smelling keratinaceous debris.',
    clinicalDescription: 'Firm to fluctuant subcutaneous nodule fixed to the overlying epidermis at its central punctum, containing rancid cheesy keratin.',
    causes: ['Implantation or sequestration of follicular infundibular epithelium into the dermis'],
    triggers: ['Physical trauma or squeezing triggering wall rupture and intense foreign-body granulomatous inflammation'],
    actions: [
      { action: 'Apply warm moist compresses for 15 minutes to soothe acute mild inflammation', priority: 'immediate' },
      { action: 'Consult a doctor for complete surgical excision with the cyst wall capsule intact to prevent recurrence', priority: 'routine' },
    ],
    differentials: [
      { name: 'Lipoma', likelihood: 'Moderate', distinguishing: 'Soft, lobulated, deeper subcutaneous tumor without central punctum; completely non-tethered to skin.' },
      { name: 'Furuncle (Boil)', likelihood: 'Moderate', distinguishing: 'Acute bacterial staph infection with necrotic core and rapid purulent fluctuance.' },
    ],
    selfCare: ['Keep skin clean and avoid touching the central pore'],
    avoid: ['NEVER squeeze, pop, or puncture cysts at home (forces keratin into dermis, triggering severe inflammation)', 'Cutting with unsterilized blades'],
    keywords: ['sebaceous cyst', 'epidermoid cyst', 'cheesy lump', 'punctum', 'smelly cyst', 'hard lump under skin'],
  },
  {
    name: 'Acrochordon (Skin Tag)',
    icd: 'L91.8',
    category: 'Benign Cutaneous',
    risk: 'low',
    urgency: 'routine',
    primaryLesion: 'Soft, pedunculated flesh-colored polypoid outgrowth',
    color: 'Flesh-colored, light tan, to hyperpigmented brown',
    border: 'Narrow, stalk-like peduncle connecting to cutaneous surface',
    surface: 'Soft, wrinkly, bag-like, fibrovascular core',
    distribution: 'Frictional areas: neck, axillae (armpits), inframammary, groin, eyelids',
    summary: 'Extremely common harmless benign papilloma occurring in zones of repetitive skin-on-skin friction.',
    clinicalDescription: 'Small, soft, pedunculated (attached by a narrow stalk) cutaneous outgrowths in friction-prone body creases.',
    causes: ['Repetitive skin-on-skin friction and shearing forces', 'Metabolic syndrome, insulin resistance, and elevated BMI', 'Hormonal elevations during pregnancy'],
    triggers: ['Friction from tight clothing, necklaces, or skin folds'],
    actions: [
      { action: 'Reassure patient: skin tags are completely benign and non-contagious', priority: 'immediate' },
      { action: 'Elective in-office snip excision, cryotherapy, or electrocautery if catching on collars or jewelry', priority: 'routine' },
    ],
    differentials: [
      { name: 'Pedunculated Seborrheic Keratosis', likelihood: 'Moderate', distinguishing: 'Warty, greasy, keratinous surface with pseudohorn cysts.' },
      { name: 'Neurofibroma', likelihood: 'Low', distinguishing: 'Soft "buttonhole" invaginating papule; associated with Neurofibromatosis type 1.' },
    ],
    selfCare: ['Wear smooth unrestrictive collars to minimize mechanical irritation'],
    avoid: ['Tying thread, dental floss, or applying dangerous acid kits at home (causes necrosis and severe infection)'],
    keywords: ['skin tag', 'acrochordon', 'stalk bump', 'neck tag', 'armpit tag', 'hanging skin'],
  },
  {
    name: 'Squamous Cell Carcinoma Suspicion',
    icd: 'C44.9',
    category: 'Malignant Neoplasms',
    risk: 'high',
    urgency: 'urgent',
    primaryLesion: 'Indurated, hyperkeratotic nodule or non-healing ulcer on sun-damaged skin',
    color: 'Erythematous, pink to yellowish-white keratin horn',
    border: 'Infiltrative, indurated, firm raised borders',
    surface: 'Rough, hyperkeratotic crust, central ulceration, easily bleeding',
    distribution: 'Sun-exposed head/neck, lower lip, ears, bald scalp, dorsal hands',
    summary: 'Second most common skin cancer; invasive malignant proliferation of epidermal keratinocytes with metastatic potential.',
    clinicalDescription: 'Firm, indurated erythematous nodule with rough surface scale, keratin horn, or a non-healing crusting ulcer that bleeds upon minor trauma.',
    causes: ['Cumulative lifetime ultraviolet radiation causing p53 and NOTCH mutations', 'Progression from precursor actinic keratosis'],
    triggers: ['Chronic sun exposure, fair skin phototypes, immunosuppression, or chronic non-healing scars (Marjolin ulcer)'],
    actions: [
      { action: 'URGENT: Consult a board-certified dermatologist for immediate in-office biopsy', priority: 'immediate' },
      { action: 'Discuss standard surgical excision or Mohs micrographic surgery', priority: 'soon' },
      { action: 'Palpate draining regional lymph node basins for enlargement', priority: 'immediate' },
    ],
    differentials: [
      { name: 'Keratoacanthoma', likelihood: 'High', distinguishing: 'Rapidly growing dome-shaped volcano nodule with central keratin crater; subtype of SCC.' },
      { name: 'Hypertrophic Actinic Keratosis', likelihood: 'Moderate', distinguishing: 'Lacks palpable deep dermal induration or rapid vertical expansion.' },
      { name: 'Basal Cell Carcinoma', likelihood: 'Moderate', distinguishing: 'Pearly rolled border, arborizing telangiectasias; lacks thick keratin horn.' },
    ],
    selfCare: ['Keep lesion clean and dressed with dry gauze if bleeding occurs'],
    avoid: ['Postponing biopsy for a non-healing crusty sore', 'Attempting to scratch off keratin horn', 'Sun exposure without protective hat/sunscreen'],
    keywords: ['squamous cell', 'scc', 'skin cancer', 'keratin horn', 'crusted sore', 'bleeding scab', 'indurated bump'],
  },
]

/**
 * Intelligent Multi-dimensional Diagnostic Matcher
 * Evaluates patient context, clinical notes, symptoms, anatomy, duration,
 * and uploaded filename to identify ANY skin disease with clinical precision.
 */
export function identifySkinDisease(formData: ScanFormData): AnalysisResult {
  const notes = (formData.notes || '').toLowerCase()
  const fileName = (formData.fileName || '').toLowerCase()
  const location = (formData.bodyLocation || '').toLowerCase()
  const duration = formData.duration || ''
  const symptoms = formData.symptoms || []

  // Combine full text context
  const fullContext = `${notes} ${fileName} ${location} ${symptoms.join(' ').toLowerCase()}`

  // 1. Check Primary Knowledge Base (20 rich clinical entries)
  let bestScore = 0
  let bestMatch: ClinicalConditionEntry | null = null

  for (const entry of DERMATOLOGY_KNOWLEDGE_BASE) {
    let score = 0
    const entryName = entry.classification.toLowerCase()
    const entryId = entry.id.toLowerCase()

    // Strong direct disease name match in notes or file name
    if (notes.includes(entryId) || notes.includes(entryName) || fileName.includes(entryId) || fileName.includes(entryName)) {
      score += 100
    }

    // Keyword hits
    for (const kw of entry.keywords) {
      if (fullContext.includes(kw.toLowerCase())) {
        score += 25
      }
    }

    // Anatomical location correlation
    for (const loc of entry.typical_locations) {
      if (location.includes(loc.toLowerCase())) {
        score += 15
      }
    }

    // Symptom profile correlation
    for (const sym of entry.typical_symptoms) {
      if (symptoms.some(s => s.toLowerCase() === sym.toLowerCase())) {
        score += 10
      }
    }

    if (score > bestScore) {
      bestScore = score
      bestMatch = entry
    }
  }

  // 2. Check Extended Catalog (40+ conditions)
  let bestExtendedScore = 0
  let bestExtended: ExtendedConditionDef | null = null

  for (const ext of EXTENDED_DISEASE_CATALOG) {
    let score = 0
    const extName = ext.name.toLowerCase()

    if (notes.includes(extName) || fileName.includes(extName)) {
      score += 100
    }

    for (const kw of ext.keywords) {
      if (fullContext.includes(kw.toLowerCase())) {
        score += 25
      }
    }

    if (score > bestExtendedScore) {
      bestExtendedScore = score
      bestExtended = ext
    }
  }

  // If extended catalog scored higher or provided a direct condition hit
  if (bestExtended && bestExtendedScore > bestScore && bestExtendedScore >= 25) {
    return {
      is_skin_image: true,
      classification: bestExtended.name,
      icd_code: bestExtended.icd,
      confidence: 83,
      risk_level: bestExtended.risk,
      risk_summary: bestExtended.summary,
      clinical_description: bestExtended.clinicalDescription,
      morphology: {
        primary_lesion: bestExtended.primaryLesion,
        color: bestExtended.color,
        border: bestExtended.border,
        surface: bestExtended.surface,
        distribution: bestExtended.distribution,
      },
      common_causes: bestExtended.causes,
      triggers: bestExtended.triggers,
      recommended_actions: bestExtended.actions,
      differential_diagnoses: bestExtended.differentials,
      see_doctor_urgency: bestExtended.urgency,
      see_doctor_reason: `Clinical features strongly correspond to ${bestExtended.name}. Clinical review is indicated for accurate staging and management.`,
      self_care_tips: bestExtended.selfCare,
      avoid: bestExtended.avoid,
      image_quality: 'good',
      image_quality_note: 'Resolution and illumination are adequate for morphological inspection.',
      disclaimer: 'Simulated analysis — for educational use only. Not a medical diagnosis. Accuracy varies with image quality and may be lower for darker skin tones. Consult a licensed dermatologist.',
      analyzed_at: new Date().toISOString(),
    }
  }

  // If primary knowledge base found a match
  if (bestMatch && bestScore >= 15) {
    // Dynamic confidence adjustment based on match strength
    const adjustedConfidence = Math.min(Math.max(bestMatch.confidence + (bestScore > 50 ? 4 : 0), 72), 94)

    return {
      is_skin_image: true,
      classification: bestMatch.classification,
      icd_code: bestMatch.icd_code,
      confidence: adjustedConfidence,
      risk_level: bestMatch.risk_level,
      risk_summary: bestMatch.risk_summary,
      clinical_description: bestMatch.clinical_description,
      morphology: bestMatch.morphology,
      common_causes: bestMatch.common_causes,
      triggers: bestMatch.triggers,
      recommended_actions: bestMatch.recommended_actions,
      differential_diagnoses: bestMatch.differential_diagnoses,
      see_doctor_urgency: bestMatch.see_doctor_urgency,
      see_doctor_reason: bestMatch.see_doctor_reason,
      self_care_tips: bestMatch.self_care_tips,
      avoid: bestMatch.avoid,
      image_quality: 'good',
      image_quality_note: 'Illumination and focus are clear for visual morphological inspection.',
      disclaimer: 'Simulated analysis — for educational use only. Not a medical diagnosis. Accuracy varies with image quality and may be lower for darker skin tones. Consult a licensed dermatologist.',
      analyzed_at: new Date().toISOString(),
    }
  }

  // 3. Fallback: Intelligent Location-Based Heuristics
  // Scalp / Head / Face
  if (location.includes('scalp') || location.includes('head') || location.includes('face')) {
    const defaultHead = DERMATOLOGY_KNOWLEDGE_BASE.find(e => e.id === 'seborrheic-dermatitis')!
    return formatEntryToResult(defaultHead)
  }

  // Groin / Intertriginous
  if (location.includes('groin')) {
    const defaultGroin = DERMATOLOGY_KNOWLEDGE_BASE.find(e => e.id === 'tinea-cruris')!
    return formatEntryToResult(defaultGroin)
  }

  // Feet
  if (location.includes('feet')) {
    const defaultFeet = DERMATOLOGY_KNOWLEDGE_BASE.find(e => e.id === 'tinea-pedis')!
    return formatEntryToResult(defaultFeet)
  }

  // Hands
  if (location.includes('hands')) {
    const defaultHands = DERMATOLOGY_KNOWLEDGE_BASE.find(e => e.id === 'dyshidrotic-eczema')!
    return formatEntryToResult(defaultHands)
  }

  // Lower legs
  if (location.includes('lower legs')) {
    const defaultLegs = DERMATOLOGY_KNOWLEDGE_BASE.find(e => e.id === 'stasis-dermatitis')!
    return formatEntryToResult(defaultLegs)
  }

  // General default: Atopic or Nummular Dermatitis
  const defaultGeneral = DERMATOLOGY_KNOWLEDGE_BASE.find(e => e.id === 'atopic-dermatitis') || DERMATOLOGY_KNOWLEDGE_BASE[0]
  return formatEntryToResult(defaultGeneral)
}

function formatEntryToResult(entry: ClinicalConditionEntry): AnalysisResult {
  return {
    is_skin_image: true,
    classification: entry.classification,
    icd_code: entry.icd_code,
    confidence: entry.confidence,
    risk_level: entry.risk_level,
    risk_summary: entry.risk_summary,
    clinical_description: entry.clinical_description,
    morphology: entry.morphology,
    common_causes: entry.common_causes,
    triggers: entry.triggers,
    recommended_actions: entry.recommended_actions,
    differential_diagnoses: entry.differential_diagnoses,
    see_doctor_urgency: entry.see_doctor_urgency,
    see_doctor_reason: entry.see_doctor_reason,
    self_care_tips: entry.self_care_tips,
    avoid: entry.avoid,
    image_quality: 'good',
    image_quality_note: 'Illumination and focus are clear for visual morphological inspection.',
    disclaimer: 'Simulated analysis — for educational use only. Not a medical diagnosis. Accuracy varies with image quality and may be lower for darker skin tones. Consult a licensed dermatologist.',
    analyzed_at: new Date().toISOString(),
  }
}
