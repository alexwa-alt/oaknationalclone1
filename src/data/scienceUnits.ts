import { OakUnit, OakLesson, OakResource } from '../types';

// Helper builder to generate consistent, realistic resources for any lesson
function buildLessonResources(
  subjectSlug: string,
  unitSlug: string,
  lessonSlug: string,
  lessonTitle: string,
  keyWords: string[]
): OakResource[] {
  const cleanTitle = lessonTitle.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');
  
  return [
    {
      id: `${subjectSlug}-${unitSlug}-${lessonSlug}-slide`,
      type: 'slidedeck' as const,
      title: `Oak Slide Deck: ${lessonTitle}`,
      fileExtension: 'pdf' as const,
      fileSizeBytes: 2450000 + Math.floor(Math.random() * 800000),
      downloadUrl: `/api/oak/download-proxy?type=slidedeck&title=${cleanTitle}_Slides`,
      mimeType: 'application/pdf',
      contentPreview: `Slide 1: Key Stage 3 Learning Objectives. Slide 2: Core Vocabulary (${keyWords.slice(0, 3).join(', ')}). Slide 3: Teacher Explanation & Worked Examples. Slide 4: Student Practice Task.`
    },
    {
      id: `${subjectSlug}-${unitSlug}-${lessonSlug}-worksheet`,
      type: 'worksheet' as const,
      title: `Printable Student Worksheet: ${lessonTitle}`,
      fileExtension: 'pdf' as const,
      fileSizeBytes: 920000 + Math.floor(Math.random() * 300000),
      downloadUrl: `/api/oak/download-proxy?type=worksheet&title=${cleanTitle}_Worksheet`,
      mimeType: 'application/pdf',
      contentPreview: `Section A: Recall Warm-up. Section B: Guided Exercises on ${keyWords[0] || 'concepts'}. Section C: Challenge Application Problem.`
    },
    {
      id: `${subjectSlug}-${unitSlug}-${lessonSlug}-quiz`,
      type: 'quiz' as const,
      title: `Exit Ticket Assessment Quiz: ${lessonTitle}`,
      fileExtension: 'json' as const,
      fileSizeBytes: 42000,
      downloadUrl: `/api/oak/download-proxy?type=quiz&title=${cleanTitle}_Quiz`,
      mimeType: 'application/json',
      quizQuestions: [
        {
          id: 'q1',
          question: `What is a primary concept when studying ${lessonTitle.toLowerCase()}?`,
          options: [
            `${keyWords[0] ? keyWords[0].toUpperCase() : 'Core Concept'} (Correct Answer)`,
            'Irrelevant Distractor A',
            'Secondary Distractor B',
            'Opposite Concept C'
          ],
          correctAnswerIndex: 0,
          explanation: `In KS3 SCIENCE, ${keyWords[0] || 'this concept'} is fundamental to achieving learning benchmarks.`
        },
        {
          id: 'q2',
          question: `How does ${keyWords[1] || 'this principle'} apply to problem solving?`,
          options: [
            'It provides a structured model for analytical reasoning (Correct)',
            'It is only used in primary school',
            'It replaces all experimental data',
            'It applies exclusively to Year 11 exams'
          ],
          correctAnswerIndex: 0,
          explanation: 'Key Stage 3 national curriculum frameworks require systematic application of core principles.'
        }
      ]
    },
    {
      id: `${subjectSlug}-${unitSlug}-${lessonSlug}-transcript`,
      type: 'transcript' as const,
      title: `Teacher Video Script & Transcript: ${lessonTitle}`,
      fileExtension: 'txt' as const,
      fileSizeBytes: 18000,
      downloadUrl: `/api/oak/download-proxy?type=transcript&title=${cleanTitle}_Transcript`,
      mimeType: 'text/plain',
      contentPreview: `00:00 Welcome to Key Stage 3. In this lesson on ${lessonTitle}, we will explore ${keyWords.join(', ')}...`
    }
  ];
}

function createScienceUnit(
  unitNumber: number,
  title: string,
  yearGroup: 'Year 7' | 'Year 8' | 'Year 9',
  description: string,
  lessonsData: Array<{
    title: string;
    durationMinutes?: number;
    learningObjectives: string[];
    pupilOutcome: string;
    keyWords: string[];
  }>,
  tier: 'Core' | 'Higher' | 'Foundation' | 'All Tiers' = 'Core'
): OakUnit {
  const subjectSlug = 'science';
  const unitSlug = `unit-${unitNumber}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

  const lessons: OakLesson[] = lessonsData.map((lData, idx) => {
    const lessonNumber = idx + 1;
    const lessonSlug = `${unitSlug}-l${lessonNumber}-${lData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

    return {
      slug: lessonSlug,
      title: lData.title,
      unitSlug: unitSlug,
      subjectSlug: subjectSlug,
      keyStageSlug: 'ks3' as const,
      lessonNumber: lessonNumber,
      yearGroup: yearGroup,
      durationMinutes: lData.durationMinutes || 45,
      learningObjectives: lData.learningObjectives,
      pupilOutcome: lData.pupilOutcome,
      keyWords: lData.keyWords,
      resources: buildLessonResources(subjectSlug, unitSlug, lessonSlug, lData.title, lData.keyWords)
    };
  });

  return {
    slug: unitSlug,
    title,
    subjectSlug,
    keyStageSlug: 'ks3' as const,
    unitNumber,
    yearGroup,
    tier,
    description,
    lessons
  };
}

export const SCIENCE_41_UNITS: OakUnit[] = [
  // --- BIOLOGY UNITS (1 - 13) ---
  createScienceUnit(
    1, 'Cells, Tissues, Organs and Microscope Skills', 'Year 7',
    'Cell structure of plants and animals, specialized cells, organ systems, and optical microscope usage.',
    [
      {
        title: 'What are cells?',
        learningObjectives: ['Define a cell as the fundamental unit of living organisms', 'Identify main cellular components'],
        pupilOutcome: 'Pupils describe the basic function of cells in living organisms.',
        keyWords: ['cell', 'organism', 'microscopic', 'membrane', 'cytoplasm']
      },
      {
        title: 'How do light microscopes work?',
        learningObjectives: ['Identify parts of a light microscope', 'Calculate total magnification (eyepiece x objective lens)'],
        pupilOutcome: 'Pupils calculate magnification and describe correct focusing technique.',
        keyWords: ['microscope', 'magnification', 'resolution', 'eyepiece', 'focus']
      },
      {
        title: 'Plant and animal cell structures',
        learningObjectives: ['Compare organelles in plant and animal cells', 'State functions of nucleus, cell wall, chloroplasts, vacuole, mitochondria'],
        pupilOutcome: 'Pupils draw and label plant and animal cells, highlighting structural differences.',
        keyWords: ['nucleus', 'chloroplast', 'vacuole', 'mitochondrion', 'cell wall']
      },
      {
        title: 'Specialised cells and adaptations',
        learningObjectives: ['Examine red blood cells, sperm, nerve, muscle, and root hair cells', 'Explain structural adaptations to function'],
        pupilOutcome: 'Pupils link specialized cell structures to their biological functions.',
        keyWords: ['specialised cell', 'adaptation', 'sperm', 'root hair', 'neuron']
      },
      {
        title: 'Unicellular organisms',
        learningObjectives: ['Identify unicellular organisms like Amoeba and Euglena', 'Describe how unicellular organisms feed, move, and reproduce'],
        pupilOutcome: 'Pupils compare unicellular vs multicellular life strategies.',
        keyWords: ['unicellular', 'Amoeba', 'Euglena', 'flagellum', 'pseudopod']
      },
      {
        title: 'Levels of organisation: cells, tissues, organs and systems',
        learningObjectives: ['Explain hierarchy: cell -> tissue -> organ -> organ system -> organism', 'Give examples in animals and plants'],
        pupilOutcome: 'Pupils classify biological structures into the correct level of organisation.',
        keyWords: ['tissue', 'organ', 'organ system', 'hierarchy', 'epithelial']
      }
    ]
  ),

  createScienceUnit(
    2, 'Structure and Function of Body Systems', 'Year 7',
    'Skeletal, muscular, and digestive systems including gas exchange in lungs and biomechanics.',
    [
      {
        title: 'The human skeleton and its functions',
        learningObjectives: ['Identify major bones in the human skeleton', 'State four main functions: support, protection, movement, blood cell production'],
        pupilOutcome: 'Pupils identify major bones and summarize the four functions of the skeletal system.',
        keyWords: ['skeleton', 'bone', 'cranium', 'femur', 'marrow']
      },
      {
        title: 'Joints and biomechanics',
        learningObjectives: ['Classify joint types: hinge, ball-and-socket, fixed', 'Describe function of cartilage, ligaments, and synovial fluid'],
        pupilOutcome: 'Pupils explain how cartilage and ligaments reduce friction and stabilize joints.',
        keyWords: ['joint', 'cartilage', 'ligament', 'synovial fluid', 'hinge']
      },
      {
        title: 'Antagonistic muscle pairs and movement',
        learningObjectives: ['Explain how muscles pull on bones via tendons', 'Describe biceps and triceps as an antagonistic pair'],
        pupilOutcome: 'Pupils model arm flexion and extension using antagonistic muscle contraction.',
        keyWords: ['muscle', 'tendon', 'antagonistic pair', 'biceps', 'triceps']
      },
      {
        title: 'Structure of the human gas exchange system',
        learningObjectives: ['Trace air pathway: trachea, bronchi, bronchioles, alveoli', 'Describe adaptations of alveoli for gas exchange'],
        pupilOutcome: 'Pupils explain how large surface area and thin walls optimize diffusion in lungs.',
        keyWords: ['gas exchange', 'trachea', 'bronchi', 'alveoli', 'diffusion']
      },
      {
        title: 'Mechanics of breathing and measuring lung volume',
        learningObjectives: ['Describe diaphragm and intercostal muscle movement during inhalation and exhalation', 'Measure lung volume'],
        pupilOutcome: 'Pupils explain pressure changes during ventilation and record peak flow data.',
        keyWords: ['inhalation', 'exhalation', 'diaphragm', 'intercostal', 'lung capacity']
      }
    ]
  ),

  createScienceUnit(
    3, 'Reproduction in Animals and Plants', 'Year 7',
    'Human reproductive systems, menstrual cycle, fertilisation, plant pollination, and seed dispersal.',
    [
      {
        title: 'Male and female human reproductive systems',
        learningObjectives: ['Identify organs of male and female reproductive systems', 'State functions of testes, ovaries, oviduct, uterus'],
        pupilOutcome: 'Pupils label reproductive diagrams and describe gamete production.',
        keyWords: ['gamete', 'testes', 'ovary', 'uterus', 'sperm']
      },
      {
        title: 'The menstrual cycle and ovulation',
        learningObjectives: ['Outline key phases of 28-day menstrual cycle', 'Explain role of hormones in ovulation and uterine lining build-up'],
        pupilOutcome: 'Pupils plot hormone and lining thickness changes over a 28-day cycle chart.',
        keyWords: ['menstrual cycle', 'ovulation', 'estrogen', 'progesterone', 'lining']
      },
      {
        title: 'Fertilisation, implantation and gestation',
        learningObjectives: ['Describe fertilisation in the oviduct', 'Explain implantation of the embryo into the uterus lining'],
        pupilOutcome: 'Pupils sequence key events from fertilisation to embryo implantation.',
        keyWords: ['fertilisation', 'zygote', 'embryo', 'implantation', 'gestation']
      },
      {
        title: 'Flower structure and pollination mechanisms',
        learningObjectives: ['Dissect a flower and identify male (stamen) and female (carpel) parts', 'Compare insect vs wind pollination'],
        pupilOutcome: 'Pupils contrast pollen shape, petal color, and nectar production across plant species.',
        keyWords: ['stamen', 'carpel', 'pollination', 'pollen tube', 'nectar']
      }
    ]
  ),

  createScienceUnit(
    4, 'Health, Lifestyle and Digestion', 'Year 8',
    'Balanced diet, nutrient testing, digestive enzymes, gut microbiome, and impacts of drugs/alcohol.',
    [
      {
        title: 'Nutrients and a balanced diet',
        learningObjectives: ['State functions of carbohydrates, lipids, proteins, vitamins, minerals, water, and fibre', 'Explain malnutrition'],
        pupilOutcome: 'Pupils evaluate daily food logs against national dietary guidelines.',
        keyWords: ['carbohydrate', 'protein', 'lipid', 'vitamin', 'balanced diet']
      },
      {
        title: 'Testing food samples for starch, lipids, proteins and sugars',
        learningObjectives: ['Perform iodine test for starch, Benedict\'s for sugar, Biuret for protein, ethanol for lipid', 'Observe color changes'],
        pupilOutcome: 'Pupils test unknown food samples and deduce nutrient composition.',
        keyWords: ['iodine', 'Benedict', 'Biuret', 'reagent', 'color change']
      },
      {
        title: 'The human digestive system and enzymes',
        learningObjectives: ['Trace food pathway through mouth, stomach, small intestine, large intestine', 'Explain amylase, protease, lipase'],
        pupilOutcome: 'Pupils explain mechanical and chemical digestion at each stage of the digestive tract.',
        keyWords: ['esophagus', 'stomach', 'small intestine', 'enzyme', 'amylase']
      },
      {
        title: 'Villi and nutrient absorption in the small intestine',
        learningObjectives: ['Describe structural adaptations of villi (microvilli, thin walls, rich blood supply)', 'Explain diffusion into capillaries'],
        pupilOutcome: 'Pupils explain how villi maximize surface area for rapid nutrient absorption.',
        keyWords: ['villi', 'microvilli', 'absorption', 'capillary', 'surface area']
      }
    ]
  ),

  createScienceUnit(
    5, 'Ecosystem Processes & Photosynthesis', 'Year 8',
    'Photosynthesis equations, leaf adaptations, food webs, bioaccumulation, and nutrient cycles.',
    [
      {
        title: 'Photosynthesis word and symbol equations',
        learningObjectives: ['State word equation: carbon dioxide + water -> glucose + oxygen', 'Identify chlorophyll and light energy role'],
        pupilOutcome: 'Pupils write balanced word and symbol equations for photosynthesis.',
        keyWords: ['photosynthesis', 'glucose', 'chlorophyll', 'carbon dioxide', 'light']
      },
      {
        title: 'Leaf adaptations for photosynthesis and gas exchange',
        learningObjectives: ['Identify palisade mesophyll, spongy mesophyll, stomata, guard cells', 'Explain gas exchange via stomata'],
        pupilOutcome: 'Pupils explain how leaf structure facilitates light absorption and gas diffusion.',
        keyWords: ['palisade', 'stomata', 'guard cell', 'chloroplast', 'mesophyll']
      },
      {
        title: 'Food chains, food webs and interdependence',
        learningObjectives: ['Identify producers, primary, secondary, tertiary consumers', 'Explain impacts of species removal from food webs'],
        pupilOutcome: 'Pupils predict population shifts when top predators or producers are affected.',
        keyWords: ['food web', 'producer', 'consumer', 'predator', 'interdependence']
      },
      {
        title: 'Pyramids of numbers and biomass',
        learningObjectives: ['Construct pyramids of numbers and pyramids of biomass from food chain data', 'Explain energy loss between trophic levels'],
        pupilOutcome: 'Pupils calculate percentage energy transfer between trophic levels.',
        keyWords: ['biomass', 'trophic level', 'energy transfer', 'pyramid', 'efficiency']
      }
    ]
  ),

  createScienceUnit(
    6, 'Adaptation, Variation and Inheritance', 'Year 8',
    'Continuous vs discontinuous variation, environmental vs genetic variation, natural selection, and extinction.',
    [
      {
        title: 'Continuous and discontinuous variation',
        learningObjectives: ['Differentiate continuous variation (height) vs discontinuous variation (blood group)', 'Plot histograms vs bar charts'],
        pupilOutcome: 'Pupils classify variation data and construct appropriate graphical plots.',
        keyWords: ['variation', 'continuous', 'discontinuous', 'histogram', 'bar chart']
      },
      {
        title: 'Genetic vs environmental variation',
        learningObjectives: ['Identify traits controlled by genes, environment, or both', 'Discuss identical twin studies'],
        pupilOutcome: 'Pupils distinguish between inherited genetic traits and acquired environmental traits.',
        keyWords: ['inherited', 'environmental', 'genes', 'phenotype', 'twins']
      },
      {
        title: 'Natural selection and the theory of evolution',
        learningObjectives: ['Outline Darwin\'s theory of natural selection: variation, competition, survival of fittest, reproduction, inheritance', 'Explain peppered moth case study'],
        pupilOutcome: 'Pupils write a structured account of natural selection in action.',
        keyWords: ['natural selection', 'evolution', 'Darwin', 'survival of fittest', 'competition']
      },
      {
        title: 'Antibiotic resistance in bacteria',
        learningObjectives: ['Explain how bacterial mutations lead to antibiotic resistance', 'Discuss MRSA and misuse of antibiotics'],
        pupilOutcome: 'Pupils explain how overuse of antibiotics drives natural selection in bacterial populations.',
        keyWords: ['antibiotic', 'resistance', 'MRSA', 'mutation', 'selection pressure']
      }
    ]
  ),

  createScienceUnit(
    7, 'Genetics, DNA and Inheritance Mechanisms', 'Year 9',
    'DNA double helix structure, chromosomes, genes, dominant/recessive alleles, and Punnett square genetic diagrams.',
    [
      {
        title: 'DNA double helix and chromosome structure',
        learningObjectives: ['Describe DNA as a double helix polymer containing genetic code', 'Explain relation between DNA, genes, and chromosomes'],
        pupilOutcome: 'Pupils diagram the nucleus, chromosome, gene, and DNA hierarchy.',
        keyWords: ['DNA', 'double helix', 'chromosome', 'gene', 'nucleus']
      },
      {
        title: 'Alleles, genotypes and phenotypes',
        learningObjectives: ['Define homozygous, heterozygous, dominant, and recessive alleles', 'Determine phenotype from genotype'],
        pupilOutcome: 'Pupils identify genotypes and predict physical phenotypes.',
        keyWords: ['allele', 'genotype', 'phenotype', 'dominant', 'recessive']
      },
      {
        title: 'Punnett squares and monohybrid crosses',
        learningObjectives: ['Construct 2x2 Punnett squares for monohybrid genetic inheritance', 'Calculate probability percentages for offspring traits'],
        pupilOutcome: 'Pupils determine inheritance probabilities for genetic crosses.',
        keyWords: ['Punnett square', 'monohybrid', 'probability', 'inheritance', 'cross']
      },
      {
        title: 'Inherited genetic disorders in humans',
        learningObjectives: ['Examine cystic fibrosis (recessive) and polydactyly (dominant)', 'Evaluate genetic screening ethic perspectives'],
        pupilOutcome: 'Pupils trace carrier probabilities across family pedigree trees.',
        keyWords: ['cystic fibrosis', 'polydactyly', 'pedigree chart', 'carrier', 'disorder']
      }
    ]
  ),

  createScienceUnit(
    8, 'Ecosystems, Biodiversity and Conservation', 'Year 9',
    'Sampling techniques using quadrats and transects, biodiversity indices, human impacts, and conservation efforts.',
    [
      {
        title: 'Field sampling techniques: Quadrats and transects',
        learningObjectives: ['Measure plant population density using random quadrat sampling', 'Use line transects to study zonation along gradients'],
        pupilOutcome: 'Pupils calculate mean species population size per square meter.',
        keyWords: ['quadrat', 'transect', 'sampling', 'population density', 'biodiversity']
      },
      {
        title: 'Importance of biodiversity and ecosystem stability',
        learningObjectives: ['Explain why high biodiversity increases ecosystem resilience to environmental change', 'Identify threats to habitats'],
        pupilOutcome: 'Pupils evaluate ecological impacts of rainforest deforestation.',
        keyWords: ['biodiversity', 'ecosystem', 'deforestation', 'resilience', 'habitat']
      },
      {
        title: 'The carbon cycle and global climate change',
        learningObjectives: ['Trace carbon transfer between atmosphere, oceans, biomass, and fossil fuels', 'Explain greenhouse effect'],
        pupilOutcome: 'Pupils diagram combustion, respiration, and photosynthesis in the carbon cycle.',
        keyWords: ['carbon cycle', 'combustion', 'respiration', 'greenhouse gas', 'atmosphere']
      },
      {
        title: 'Conservation strategies and rewilding',
        learningObjectives: ['Evaluate captive breeding, seed banks, habitat corridors, and protected nature reserves', 'Discuss rewilding projects'],
        pupilOutcome: 'Pupils compare ecological pros and cons of local species rewilding.',
        keyWords: ['conservation', 'rewilding', 'seed bank', 'protected reserve', 'species']
      }
    ]
  ),

  createScienceUnit(
    9, 'Plant Transport, Transpiration and Tropisms', 'Year 9',
    'Xylem and phloem tissue functions, transpiration stream rate factors, plant hormones, and phototropism.',
    [
      {
        title: 'Xylem and phloem vascular tissue structure',
        learningObjectives: ['Compare xylem (water/minerals transport upward) vs phloem (sucrose translocation bidirectionally)', 'Examine cell adaptations'],
        pupilOutcome: 'Pupils distinguish xylem vessel lignin rings from phloem sieve tube plates.',
        keyWords: ['xylem', 'phloem', 'translocation', 'lignin', 'sieve tube']
      },
      {
        title: 'Transpiration stream and potometer experiments',
        learningObjectives: ['Describe water evaporation from stomata pulling water up xylem', 'Measure transpiration rate using a potometer'],
        pupilOutcome: 'Pupils test how wind speed, temperature, and humidity alter transpiration rates.',
        keyWords: ['transpiration', 'potometer', 'stomata', 'evaporation', 'water loss']
      },
      {
        title: 'Plant tropisms and auxin hormone control',
        learningObjectives: ['Define phototropism (light) and gravitropism (gravity)', 'Explain auxin hormone accumulation on shaded plant stem sides'],
        pupilOutcome: 'Pupils explain how auxin cell elongation causes plant stems to bend toward light.',
        keyWords: ['tropism', 'phototropism', 'gravitropism', 'auxin', 'elongation']
      }
    ]
  ),

  createScienceUnit(
    10, 'Human Respiration and Gas Exchange Systems', 'Year 9',
    'Aerobic vs anaerobic respiration equations, ATP energy generation, oxygen debt, and physiological adaptations.',
    [
      {
        title: 'Aerobic respiration word and symbol equations',
        learningObjectives: ['State equation: glucose + oxygen -> carbon dioxide + water (+ ATP energy)', 'Identify mitochondria as site of respiration'],
        pupilOutcome: 'Pupils write balanced chemical equations for cellular aerobic respiration.',
        keyWords: ['aerobic respiration', 'glucose', 'oxygen', 'ATP', 'mitochondria']
      },
      {
        title: 'Anaerobic respiration in humans and yeast',
        learningObjectives: ['Write anaerobic equation in humans (glucose -> lactic acid) and yeast fermentation (glucose -> ethanol + CO2)', 'Explain ATP yields'],
        pupilOutcome: 'Pupils compare energy release efficiency of aerobic vs anaerobic breakdown.',
        keyWords: ['anaerobic', 'lactic acid', 'fermentation', 'yeast', 'oxygen debt']
      },
      {
        title: 'Oxygen debt and muscular fatigue during high-intensity exercise',
        learningObjectives: ['Explain oxygen debt as volume of oxygen needed to oxidize accumulated lactic acid in liver', 'Analyze heart/breathing recovery rates'],
        pupilOutcome: 'Pupils plot heart rate recovery curves following anaerobic sprint trials.',
        keyWords: ['oxygen debt', 'lactic acid', 'fatigue', 'recovery rate', 'heart rate']
      }
    ]
  ),

  createScienceUnit(
    11, 'Human Nervous System and Hormonal Control', 'Year 9',
    'Central nervous system architecture, sensory/motor neurons, reflex arcs, synapses, and endocrine hormones.',
    [
      {
        title: 'Architecture of the Central Nervous System (CNS)',
        learningObjectives: ['Identify brain and spinal cord as CNS', 'Trace pathway: Stimulus -> Receptor -> Sensory Neuron -> CNS -> Motor Neuron -> Effector -> Response'],
        pupilOutcome: 'Pupils flowchart nervous response pathways to environmental stimuli.',
        keyWords: ['CNS', 'brain', 'receptor', 'effector', 'neuron']
      },
      {
        title: 'Reflex arcs and rapid involuntary responses',
        learningObjectives: ['Explain survival value of involuntary reflex arcs bypassing conscious brain decisions', 'Role of relay neurons'],
        pupilOutcome: 'Pupils diagram knee-jerk or finger withdrawal reflex arc pathways.',
        keyWords: ['reflex arc', 'involuntary', 'relay neuron', 'synapse', 'stimulus']
      },
      {
        title: 'Synaptic transmission and chemical neurotransmitters',
        learningObjectives: ['Describe gap between neurons as a synapse', 'Explain diffusion of neurotransmitter chemicals across synaptic clefts'],
        pupilOutcome: 'Pupils sequence electrical-chemical-electrical impulse conversions across synapses.',
        keyWords: ['synapse', 'neurotransmitter', 'diffusion', 'synaptic cleft', 'impulse']
      },
      {
        title: 'The Endocrine System and hormonal homeostasis',
        learningObjectives: ['Identify pituitary, thyroid, pancreas, adrenal, and gonad glands', 'Compare nerve impulse speed vs hormone response duration'],
        pupilOutcome: 'Pupils contrast rapid electrical nerve signals with long-term hormonal control.',
        keyWords: ['endocrine', 'hormone', 'pituitary', 'pancreas', 'homeostasis']
      }
    ]
  ),

  createScienceUnit(
    12, 'Communicable Diseases, Pathogens and Immunity', 'Year 9',
    'Viruses, bacteria, fungi, protists, transmission vectors, body physical barriers, white blood cells, and vaccines.',
    [
      {
        title: 'Types of pathogens: Viruses, bacteria, fungi and protists',
        learningObjectives: ['Distinguish bacterial cell toxin damage vs viral host cell reproduction destruction', 'Give pathogen disease examples'],
        pupilOutcome: 'Pupils classify cholera, measles, athlete\'s foot, and malaria by pathogen category.',
        keyWords: ['pathogen', 'bacteria', 'virus', 'fungi', 'protist']
      },
      {
        title: 'Human non-specific defense barriers',
        learningObjectives: ['Examine skin barrier, stomach hydrochloric acid, airway ciliated mucous membranes, and tear lysozymes', 'Explain infection prevention'],
        pupilOutcome: 'Pupils summarize how primary physical/chemical body defenses stop pathogen entry.',
        keyWords: ['defense barrier', 'skin', 'mucus', 'cilia', 'stomach acid']
      },
      {
        title: 'White blood cells: Phagocytosis and antibody production',
        learningObjectives: ['Explain phagocyte engulfment of pathogens', 'Describe lymphocyte production of specific antibodies and antitoxins'],
        pupilOutcome: 'Pupils compare phagocyte vs lymphocyte defense mechanisms.',
        keyWords: ['phagocyte', 'lymphocyte', 'phagocytosis', 'antibody', 'antitoxin']
      },
      {
        title: 'Vaccinations, herd immunity and memory cells',
        learningObjectives: ['Explain how dead/weakened pathogen vaccines stimulate primary immune antibody response and memory cells', 'Define herd immunity'],
        pupilOutcome: 'Pupils plot secondary immune response antibody concentration increases following vaccination.',
        keyWords: ['vaccine', 'immunity', 'herd immunity', 'memory cells', 'antibodies']
      }
    ]
  ),

  createScienceUnit(
    13, 'Non-Communicable Diseases, Cancer and Lifestyle', 'Year 9',
    'Cardiovascular disease risk factors, benign vs malignant tumors, risk factor statistics, and epidemiological studies.',
    [
      {
        title: 'Cardiovascular disease and coronary artery blockages',
        learningObjectives: ['Explain fatty atheroma buildup in coronary arteries reducing blood flow to heart muscle', 'Evaluate statins and stent surgery'],
        pupilOutcome: 'Pupils explain how coronary artery restriction causes myocardial heart attacks.',
        keyWords: ['cardiovascular', 'coronary artery', 'atheroma', 'stent', 'statins']
      },
      {
        title: 'Cancer biology: Benign vs malignant tumors',
        learningObjectives: ['Define cancer as uncontrolled cell division resulting from DNA mutations', 'Distinguish benign (contained) vs malignant (metastasizing) tumors'],
        pupilOutcome: 'Pupils contrast benign tumor capsules with malignant invasive cancer cells.',
        keyWords: ['cancer', 'mutation', 'tumor', 'benign', 'malignant', 'metastasis']
      },
      {
        title: 'Lifestyle risk factors and epidemiological correlation',
        learningObjectives: ['Analyze statistical correlations between smoking, alcohol, obesity, UV exposure, and disease incidence', 'Differentiate correlation vs causation'],
        pupilOutcome: 'Pupils evaluate health dataset charts to distinguish causal links from indirect correlations.',
        keyWords: ['lifestyle', 'risk factor', 'epidemiology', 'correlation', 'causation']
      }
    ]
  ),

  // --- CHEMISTRY UNITS (14 - 26) ---
  createScienceUnit(
    14, 'Particles, States of Matter and Physical Changes', 'Year 7',
    'Particle model of solids, liquids, and gases, state changes, heating curves, and Brownian motion.',
    [
      {
        title: 'Particle arrangements in solids, liquids and gases',
        learningObjectives: ['Describe arrangement, movement, and energy of particles in 3 states of matter', 'Draw particle diagrams'],
        pupilOutcome: 'Pupils draw and explain particle arrangements in solids, liquids, and gases.',
        keyWords: ['particle', 'solid', 'liquid', 'gas', 'arrangement']
      },
      {
        title: 'Changes of state and heating curves',
        learningObjectives: ['Explain melting, freezing, boiling, condensing, sublimating', 'Interpret plateau regions on heating/cooling curves'],
        pupilOutcome: 'Pupils plot a heating curve and explain why temperature remains constant during state changes.',
        keyWords: ['melting', 'boiling', 'condensation', 'sublimation', 'heating curve']
      },
      {
        title: 'Diffusion in liquids and gases',
        learningObjectives: ['Explain diffusion as movement of particles from high to low concentration', 'Compare diffusion rates in gas vs liquid'],
        pupilOutcome: 'Pupils demonstrate diffusion of potassium manganate in water and ammonia/HCl in a glass tube.',
        keyWords: ['diffusion', 'concentration', 'kinetic energy', 'random movement', 'gas']
      },
      {
        title: 'Gas pressure and Brownian motion',
        learningObjectives: ['Explain gas pressure as particle collisions with container walls', 'Describe impact of temperature and volume on pressure'],
        pupilOutcome: 'Pupils explain why heating a sealed balloon increases internal pressure.',
        keyWords: ['gas pressure', 'collisions', 'temperature', 'volume', 'Brownian motion']
      }
    ]
  ),

  createScienceUnit(
    15, 'Elements, Compounds, Mixtures and Pure Substances', 'Year 7',
    'Pure substances vs mixtures, chemical symbols, separation techniques (filtration, distillation, chromatography).',
    [
      {
        title: 'Pure substances vs mixtures',
        learningObjectives: ['Define pure substance as containing single element/compound with sharp melting point', 'Compare with mixtures'],
        pupilOutcome: 'Pupils distinguish pure substances from mixtures using melting point data.',
        keyWords: ['pure substance', 'mixture', 'melting point', 'composition', 'impurity']
      },
      {
        title: 'Elements and chemical symbols',
        learningObjectives: ['Define an element as containing one type of atom', 'Use Periodic Table to find symbols for first 20 elements'],
        pupilOutcome: 'Pupils match element names to chemical symbols and identify metals vs non-metals.',
        keyWords: ['element', 'atom', 'chemical symbol', 'Periodic Table', 'metal']
      },
      {
        title: 'Compounds and chemical formulas',
        learningObjectives: ['Define a compound as two or more elements chemically bonded', 'Interpret chemical formulas like H2O, CO2, NaCl'],
        pupilOutcome: 'Pupils count atoms of each element present in chemical formula models.',
        keyWords: ['compound', 'chemical bond', 'formula', 'molecule', 'ratio']
      },
      {
        title: 'Separation by filtration, evaporation and chromatography',
        learningObjectives: ['Separate insoluble solids by filtration and soluble solids by evaporation', 'Calculate chromatography Rf values'],
        pupilOutcome: 'Pupils run paper chromatograms of food dyes and calculate Rf values.',
        keyWords: ['filtration', 'evaporation', 'chromatography', 'Rf value', 'solvent']
      }
    ]
  ),

  createScienceUnit(
    16, 'Acids, Alkalis, Indicators and pH Scale', 'Year 7',
    'The pH scale, universal indicator, neutralisation reactions (acid + alkali -> salt + water), and naming salts.',
    [
      {
        title: 'The pH scale and universal indicator',
        learningObjectives: ['Identify acids (pH 1-6), neutral (pH 7), alkalis (pH 8-14)', 'Use universal indicator color chart'],
        pupilOutcome: 'Pupils test household substances (lemon juice, soap, bleach) and assign pH values.',
        keyWords: ['acid', 'alkali', 'pH scale', 'universal indicator', 'neutral']
      },
      {
        title: 'Common lab acids and alkalis',
        learningObjectives: ['Name hydrochloric acid (HCl), sulfuric acid (H2SO4), nitric acid (HNO3)', 'Name sodium hydroxide (NaOH)'],
        pupilOutcome: 'Pupils identify safety hazards (corrosive, irritant) and handling precautions for acids/alkalis.',
        keyWords: ['hydrochloric acid', 'sulfuric acid', 'nitric acid', 'sodium hydroxide', 'corrosive']
      },
      {
        title: 'Neutralisation reactions and salt formation',
        learningObjectives: ['Define neutralisation as reaction between acid and alkali forming water and salt', 'Name salts generated'],
        pupilOutcome: 'Pupils perform neutralisation of acid with alkali using pH probe to reach pH 7.',
        keyWords: ['neutralisation', 'salt', 'water', 'reaction', 'hydrogen ion']
      }
    ]
  ),

  createScienceUnit(
    17, 'Chemical Reactions and Word Equations', 'Year 7',
    'Chemical vs physical changes, signs of chemical reaction, combustion, oxidation, and thermal decomposition.',
    [
      {
        title: 'Chemical vs physical changes',
        learningObjectives: ['Identify indicators of chemical reactions: color change, gas release, temperature shift, precipitate', 'Compare reversible physical state changes'],
        pupilOutcome: 'Pupils classify experimental observations as chemical or physical transformations.',
        keyWords: ['chemical change', 'physical change', 'precipitate', 'temperature', 'irreversible']
      },
      {
        title: 'Writing word equations for chemical reactions',
        learningObjectives: ['Identify reactants on left and products on right of arrow', 'Write word equations for combustion and synthesis'],
        pupilOutcome: 'Pupils write accurate chemical word equations from experiment descriptions.',
        keyWords: ['reactants', 'products', 'word equation', 'arrow', 'chemical reaction']
      },
      {
        title: 'Combustion and oxidation reactions',
        learningObjectives: ['Define combustion as rapid reaction with oxygen releasing light and thermal energy', 'Explain complete vs incomplete combustion'],
        pupilOutcome: 'Pupils test products of hydrocarbon combustion using limewater and cobalt chloride paper.',
        keyWords: ['combustion', 'oxidation', 'fuel', 'oxygen', 'soot']
      },
      {
        title: 'Thermal decomposition reactions',
        learningObjectives: ['Define thermal decomposition as breakdown of a compound using heat energy', 'Examine copper carbonate heating'],
        pupilOutcome: 'Pupils observe color change and test carbon dioxide gas released when heating metal carbonates.',
        keyWords: ['thermal decomposition', 'breakdown', 'heat energy', 'carbon dioxide', 'limewater']
      }
    ]
  ),

  createScienceUnit(
    18, 'Earth Structure, Rock Cycle and Weathering', 'Year 7',
    'Sedimentary, igneous, and metamorphic rocks, weathering types, erosion, transport, and the rock cycle transition stages.',
    [
      {
        title: 'Sedimentary rocks and fossil formation',
        learningObjectives: ['Explain sedimentation, compaction, and cementation over geological time', 'Describe fossil preservation in sedimentary strata'],
        pupilOutcome: 'Pupils examine sandstone and limestone samples identifying grain layers and fossils.',
        keyWords: ['sedimentary', 'compaction', 'cementation', 'fossil', 'strata']
      },
      {
        title: 'Igneous rocks: Intrusive vs extrusive crystal formation',
        learningObjectives: ['Explain cooling of molten magma underground (intrusive, large crystals) vs lava on surface (extrusive, small crystals)', 'Examine basalt and granite'],
        pupilOutcome: 'Pupils link crystal size in granite and basalt to magma cooling rates.',
        keyWords: ['igneous', 'magma', 'lava', 'crystal size', 'cooling rate']
      },
      {
        title: 'Metamorphic rocks and high pressure/temperature changes',
        learningObjectives: ['Explain transformation of rocks under extreme heat and pressure without melting', 'Examine marble and slate'],
        pupilOutcome: 'Pupils describe original parent rocks for marble (limestone) and slate (shale).',
        keyWords: ['metamorphic', 'heat', 'pressure', 'marble', 'slate']
      },
      {
        title: 'Physical, chemical and biological weathering',
        learningObjectives: ['Distinguish freeze-thaw physical weathering, acid rain chemical weathering, and root wedging biological weathering', 'Trace rock erosion'],
        pupilOutcome: 'Pupils classify rock weathering scenarios by physical, chemical, or biological agent.',
        keyWords: ['weathering', 'freeze-thaw', 'acid rain', 'erosion', 'transport']
      }
    ]
  ),

  createScienceUnit(
    19, 'The Periodic Table and Group Trends', 'Year 8',
    'Mendeleev development of Periodic Table, Group 1 alkali metals, Group 7 halogens, Group 0 noble gases reactivity trends.',
    [
      {
        title: 'History and organization of the Periodic Table',
        learningObjectives: ['Examine Mendeleev arrangement by atomic mass and leaving gaps for undiscovered elements', 'Understand modern atomic number ordering'],
        pupilOutcome: 'Pupils explain how Mendeleev successfully predicted properties of undiscovered elements.',
        keyWords: ['Periodic Table', 'Mendeleev', 'periods', 'groups', 'atomic number']
      },
      {
        title: 'Group 1: Alkali metals and water reactivity trends',
        learningObjectives: ['Observe Lithium, Sodium, Potassium reactions with water forming alkaline hydroxides and hydrogen gas', 'Explain increasing reactivity down group'],
        pupilOutcome: 'Pupils write word equations for Group 1 metal reactions with water.',
        keyWords: ['alkali metals', 'Group 1', 'reactivity', 'hydrogen', 'hydroxide']
      },
      {
        title: 'Group 7: Halogens and displacement reactions',
        learningObjectives: ['Examine Chlorine, Bromine, Iodine state and color trends', 'Explain halogen displacement reactions'],
        pupilOutcome: 'Pupils predict halogen displacement outcomes using Group 7 reactivity trends.',
        keyWords: ['halogens', 'Group 7', 'displacement', 'chlorine', 'bromine']
      },
      {
        title: 'Group 0: Noble gases and unreactive electron shells',
        learningObjectives: ['Explain inert nature of Helium, Neon, Argon due to full outer electron shells', 'Identify commercial uses'],
        pupilOutcome: 'Pupils explain why noble gases exist as monatomic unreactive gases.',
        keyWords: ['noble gases', 'Group 0', 'inert', 'full outer shell', 'monatomic']
      }
    ]
  ),

  createScienceUnit(
    20, 'Reactivity Series and Displacement Reactions', 'Year 8',
    'Metal reactivity series, reactions with acid/water/oxygen, displacement reactions, and carbon extraction of iron.',
    [
      {
        title: 'The metal reactivity series',
        learningObjectives: ['Order metals (K, Na, Ca, Mg, Al, C, Zn, Fe, Cu, Ag, Au) based on reaction vigor with water, acid, and oxygen', 'Construct reactivity hierarchy'],
        pupilOutcome: 'Pupils rank metals in order of reactivity based on laboratory observations.',
        keyWords: ['reactivity series', 'metal', 'vigor', 'effervescence', 'hierarchy']
      },
      {
        title: 'Displacement reactions between metals and salt solutions',
        learningObjectives: ['Explain rule: A more reactive metal displaces a less reactive metal from its salt solution', 'Write word and symbol equations'],
        pupilOutcome: 'Pupils perform iron nail immersion in copper sulfate solution and record temperature/color shifts.',
        keyWords: ['displacement', 'reactive', 'salt solution', 'copper sulfate', 'iron']
      },
      {
        title: 'Extracting metals using carbon in a blast furnace',
        learningObjectives: ['Explain reduction of metal oxides by heating with carbon for metals less reactive than carbon', 'Examine iron ore extraction'],
        pupilOutcome: 'Pupils explain why iron is extracted with carbon while aluminum requires electrolysis.',
        keyWords: ['metal extraction', 'reduction', 'blast furnace', 'iron ore', 'carbon']
      }
    ]
  ),

  createScienceUnit(
    21, 'Exothermic and Endothermic Chemical Reactions', 'Year 8',
    'Energy changes in chemical reactions, exothermic temperature rises, endothermic drops, and reaction profile diagrams.',
    [
      {
        title: 'Exothermic reactions and thermal energy release',
        learningObjectives: ['Define exothermic as transferring energy to surroundings resulting in temperature rise', 'Give examples: combustion, neutralisation'],
        pupilOutcome: 'Pupils measure temperature rises during exothermic acid-alkali neutralisations.',
        keyWords: ['exothermic', 'energy release', 'temperature rise', 'surroundings', 'combustion']
      },
      {
        title: 'Endothermic reactions and thermal energy absorption',
        learningObjectives: ['Define endothermic as absorbing energy from surroundings resulting in temperature drop', 'Examples: citric acid + sodium hydrogen carbonate'],
        pupilOutcome: 'Pupils measure temperature drops during endothermic dissolving reactions.',
        keyWords: ['endothermic', 'energy absorption', 'temperature drop', 'dissolving', 'thermal']
      },
      {
        title: 'Reaction profile energy level diagrams',
        learningObjectives: ['Draw reaction profiles showing reactant, product, and activation energy levels', 'Identify net enthalpy change delta H'],
        pupilOutcome: 'Pupils annotate activation energy barriers on exothermic vs endothermic energy profile graphs.',
        keyWords: ['reaction profile', 'activation energy', 'enthalpy', 'energy level', 'reactants']
      }
    ]
  ),

  createScienceUnit(
    22, 'Climate Science, Earth Atmosphere and Carbon Cycle', 'Year 8',
    'Evolution of Earth atmosphere, greenhouse gas emissions, enhanced greenhouse effect, climate change, and carbon footprints.',
    [
      {
        title: 'Evolution of the Earth\'s atmosphere over 4.6 billion years',
        learningObjectives: ['Trace early volcanic CO2/water vapor atmosphere to oxygenation by photosynthetic algae', 'Composition today (78% N2, 21% O2)'],
        pupilOutcome: 'Pupils timeline how photosynthetic oceans transformed atmospheric oxygen levels.',
        keyWords: ['atmosphere', 'evolution', 'nitrogen', 'oxygen', 'volcanoes', 'algae']
      },
      {
        title: 'Greenhouse gases and the enhanced greenhouse effect',
        learningObjectives: ['Explain shortwave solar radiation absorption and re-emission as longwave infrared trapped by CO2/methane', 'Human activities impact'],
        pupilOutcome: 'Pupils diagram the greenhouse effect mechanism trapping thermal energy.',
        keyWords: ['greenhouse effect', 'carbon dioxide', 'methane', 'infrared', 'radiation']
      },
      {
        title: 'Consequences of global climate change and carbon footprints',
        learningObjectives: ['Analyze melting polar ice, sea level rise, extreme weather, and ocean acidification', 'Evaluate personal carbon reduction steps'],
        pupilOutcome: 'Pupils calculate personal carbon footprints and propose mitigation actions.',
        keyWords: ['climate change', 'sea level rise', 'carbon footprint', 'mitigation', 'renewable']
      }
    ]
  ),

  createScienceUnit(
    23, 'Atomic Structure, Isotopes and Electron Configuration', 'Year 9',
    'Subatomic particles (protons, neutrons, electrons), atomic number, mass number, isotopes, and electron shell diagrams.',
    [
      {
        title: 'Subatomic particles: Protons, neutrons and electrons',
        learningObjectives: ['State relative mass (1, 1, 1/1836) and charge (+1, 0, -1) of protons, neutrons, electrons', 'Locate nucleus vs shells'],
        pupilOutcome: 'Pupils construct atomic models displaying central nucleus and orbiting electrons.',
        keyWords: ['proton', 'neutron', 'electron', 'subatomic', 'nucleus']
      },
      {
        title: 'Atomic number, mass number and isotopic variants',
        learningObjectives: ['Define Atomic Number (protons) and Mass Number (protons + neutrons)', 'Define isotopes as same element with different neutron counts'],
        pupilOutcome: 'Pupils calculate proton, neutron, and electron counts for Carbon-12 vs Carbon-14.',
        keyWords: ['atomic number', 'mass number', 'isotope', 'Carbon-12', 'Carbon-14']
      },
      {
        title: 'Electron configurations and shell filling rules (2, 8, 8)',
        learningObjectives: ['Apply energy level filling rules: max 2 in 1st shell, max 8 in 2nd and 3rd shells', 'Draw electron dot-and-cross diagrams'],
        pupilOutcome: 'Pupils draw full electron shell configurations for elements 1 to 20.',
        keyWords: ['electron configuration', 'energy level', 'shell', 'dot and cross', 'valence']
      }
    ]
  ),

  createScienceUnit(
    24, 'Chemical Bonding, Covalent and Ionic Structures', 'Year 9',
    'Ionic bonding electron transfer, giant ionic lattices, covalent bonding electron sharing, and simple molecular vs giant covalent structures.',
    [
      {
        title: 'Ionic bonding and electron transfer between metals and non-metals',
        learningObjectives: ['Explain metal atom electron loss forming cations and non-metal electron gain forming anions', 'Electrostatic attraction'],
        pupilOutcome: 'Pupils draw dot-and-cross diagrams showing electron transfer in NaCl and MgO.',
        keyWords: ['ionic bonding', 'cation', 'anion', 'electrostatic', 'electron transfer']
      },
      {
        title: 'Properties of giant ionic lattice structures',
        learningObjectives: ['Explain high melting points, brittleness, and electrical conductivity when molten or dissolved (free ions)', 'Sodium chloride lattice'],
        pupilOutcome: 'Pupils explain why solid salt does not conduct electricity but saltwater does.',
        keyWords: ['ionic lattice', 'melting point', 'conductivity', 'molten', 'dissolved']
      },
      {
        title: 'Covalent bonding and electron sharing in non-metal molecules',
        learningObjectives: ['Define covalent bond as shared pair of electrons between non-metal atoms', 'Draw H2, O2, H2O, CH4 molecules'],
        pupilOutcome: 'Pupils construct dot-and-cross diagrams showing shared electron pairs.',
        keyWords: ['covalent bond', 'shared pair', 'molecule', 'non-metal', 'electron']
      },
      {
        title: 'Simple molecular vs giant covalent structures (Diamond & Graphite)',
        learningObjectives: ['Compare weak intermolecular forces in simple molecules with strong covalent bonds in diamond/graphite', 'Explain graphite conductivity'],
        pupilOutcome: 'Pupils explain why graphite conducts electricity due to delocalised electrons while diamond does not.',
        keyWords: ['simple molecular', 'giant covalent', 'diamond', 'graphite', 'delocalised electron']
      }
    ]
  ),

  createScienceUnit(
    25, 'Quantitative Chemistry and Mass Conservation', 'Year 9',
    'Law of Conservation of Mass, balancing chemical equations, relative formula mass (Mr), and percentage mass calculations.',
    [
      {
        title: 'Conservation of mass in closed vs open chemical systems',
        learningObjectives: ['State Law of Conservation of Mass: Total mass of reactants = total mass of products', 'Explain apparent mass changes when gas escapes'],
        pupilOutcome: 'Pupils demonstrate mass conservation when mixing solutions in sealed flasks.',
        keyWords: ['conservation of mass', 'reactants', 'products', 'open system', 'closed system']
      },
      {
        title: 'Balancing chemical symbol equations',
        learningObjectives: ['Count atoms of each element on reactant vs product sides', 'Add stoichiometric coefficients to balance equations'],
        pupilOutcome: 'Pupils balance chemical symbol equations for combustion and synthesis.',
        keyWords: ['balancing', 'symbol equation', 'coefficient', 'stoichiometry', 'atoms']
      },
      {
        title: 'Calculating Relative Formula Mass (Mr)',
        learningObjectives: ['Sum relative atomic masses (Ar) of all atoms in a chemical formula', 'Calculate Mr for CaCO3, H2SO4, Mg(OH)2'],
        pupilOutcome: 'Pupils calculate Relative Formula Mass values using Periodic Table atomic masses.',
        keyWords: ['Relative Formula Mass', 'Mr', 'Ar', 'atomic mass', 'formula']
      }
    ]
  ),

  createScienceUnit(
    26, 'Chemical Analysis, Chromatography and Gas Testing', 'Year 9',
    'Testing for hydrogen, oxygen, carbon dioxide, and chlorine gases; flame tests for metal cations; and instrumental analysis.',
    [
      {
        title: 'Standard laboratory gas identification tests',
        learningObjectives: ['Test Hydrogen (squeaky pop with lit splint), Oxygen (relights glowing splint), Carbon Dioxide (turns limewater cloudy), Chlorine (bleaches litmus)'],
        pupilOutcome: 'Pupils perform gas identification tests on unknown test tube gas samples.',
        keyWords: ['gas test', 'hydrogen', 'squeaky pop', 'oxygen', 'limewater', 'chlorine']
      },
      {
        title: 'Flame testing for metal cation identification',
        learningObjectives: ['Identify Lithium (crimson), Sodium (yellow), Potassium (lilac), Calcium (orange-red), Copper (green) flame colors', 'Flame test wire protocol'],
        pupilOutcome: 'Pupils perform flame tests on unknown metal salt samples using Bunsen burners.',
        keyWords: ['flame test', 'cation', 'lithium', 'sodium', 'potassium', 'copper']
      },
      {
        title: 'Introduction to instrumental analysis and spectroscopy',
        learningObjectives: ['Understand advantages of automated instrumental testing (high speed, sensitivity, accuracy)', 'Flame emission spectroscopy'],
        pupilOutcome: 'Pupils compare human flame test observations with instrumental line spectra.',
        keyWords: ['instrumental analysis', 'spectroscopy', 'sensitivity', 'accuracy', 'spectrum']
      }
    ]
  ),

  // --- PHYSICS UNITS (27 - 39) ---
  createScienceUnit(
    27, 'Forces: Speed, Gravity and Friction', 'Year 7',
    'Contact and non-contact forces, speed formula (s = d/t), mass vs weight, gravity (W = mg), and friction.',
    [
      {
        title: 'Contact vs non-contact forces',
        learningObjectives: ['Classify contact forces (friction, tension) vs non-contact forces (gravity, magnetism, electrostatic)', 'Draw force arrows'],
        pupilOutcome: 'Pupils draw free-body diagrams showing magnitude and direction of forces.',
        keyWords: ['force', 'contact', 'non-contact', 'Newton', 'free-body diagram']
      },
      {
        title: 'Speed formula and calculations (s = d/t)',
        learningObjectives: ['Apply speed formula: Speed = Distance / Time in m/s and km/h', 'Rearrange formula to find distance or time'],
        pupilOutcome: 'Pupils calculate speeds of walking, running, and vehicles using timing equipment.',
        keyWords: ['speed', 'distance', 'time', 'meters per second', 'rearrange']
      },
      {
        title: 'Mass vs weight and gravitational field strength (W = mg)',
        learningObjectives: ['Differentiate mass in kg (amount of matter) from weight in N (force of gravity)', 'Apply Weight = Mass x g'],
        pupilOutcome: 'Pupils calculate weight on Earth (g = 10 N/kg), Moon (1.6 N/kg), and Mars (3.7 N/kg).',
        keyWords: ['mass', 'weight', 'gravity', 'gravitational field strength', 'Newtons']
      },
      {
        title: 'Friction and air resistance (drag)',
        learningObjectives: ['Explain friction as force opposing motion between surfaces', 'Describe air resistance and factors affecting drag'],
        pupilOutcome: 'Pupils investigate streamline shapes and parachute surface areas to measure terminal velocity.',
        keyWords: ['friction', 'air resistance', 'drag', 'streamline', 'terminal velocity']
      }
    ]
  ),

  createScienceUnit(
    28, 'Sound Waves, Vibration & Acoustics', 'Year 7',
    'Longitudinal sound waves, frequency/pitch (Hz), amplitude/volume (dB), ear structure, and echoes.',
    [
      {
        title: 'How sound is produced by vibrations',
        learningObjectives: ['Demonstrate that sound is caused by vibrating objects', 'Explain sound as a longitudinal mechanical wave requiring a medium'],
        pupilOutcome: 'Pupils observe vibrating tuning forks in water and explain why sound cannot travel in a vacuum.',
        keyWords: ['vibration', 'sound', 'longitudinal', 'medium', 'vacuum']
      },
      {
        title: 'Frequency, pitch and human hearing range',
        learningObjectives: ['Link wave frequency in Hertz (Hz) to sound pitch', 'State human hearing range (20 Hz to 20,000 Hz)'],
        pupilOutcome: 'Pupils test human hearing thresholds using a signal generator and loudspeaker.',
        keyWords: ['frequency', 'Hertz', 'pitch', 'hearing range', 'ultrasound']
      },
      {
        title: 'Amplitude, volume and oscilloscope traces',
        learningObjectives: ['Link wave amplitude to sound volume (decibels)', 'Interpret frequency and amplitude from oscilloscope traces'],
        pupilOutcome: 'Pupils match oscilloscope wave trace heights and frequencies to quiet/loud and low/high pitch sounds.',
        keyWords: ['amplitude', 'volume', 'decibel', 'oscilloscope', 'waveform']
      },
      {
        title: 'Reflection of sound: Echoes and sonar',
        learningObjectives: ['Explain echoes as reflected sound waves', 'Calculate distance using Speed = (2 x Distance) / Time for sonar'],
        pupilOutcome: 'Pupils calculate sea depth from sonar pulse reflection return times.',
        keyWords: ['echo', 'reflection', 'sonar', 'ultrasound', 'time delay']
      }
    ]
  ),

  createScienceUnit(
    29, 'Light, Optics & Refraction', 'Year 7',
    'Transverse light waves, reflection (i = r), refraction, lenses, white light dispersion, and primary color filters.',
    [
      {
        title: 'Light ray model and speed of light',
        learningObjectives: ['Explain light as a transverse electromagnetic wave', 'State speed of light (300,000,000 m/s) and compare to sound'],
        pupilOutcome: 'Pupils explain why we see thunder/lightning at different times due to wave speed differences.',
        keyWords: ['light', 'transverse', 'speed of light', 'ray diagram', 'luminous']
      },
      {
        title: 'Law of reflection and plane mirrors',
        learningObjectives: ['Draw normal line, incident ray, reflected ray', 'State Law of Reflection: Angle of Incidence (i) = Angle of Reflection (r)'],
        pupilOutcome: 'Pupils measure angles of incidence and reflection using ray boxes and protractors on plane mirrors.',
        keyWords: ['reflection', 'normal', 'incident ray', 'reflected ray', 'plane mirror']
      },
      {
        title: 'Refraction at transparent boundaries',
        learningObjectives: ['Explain refraction as bending of light due to speed change entering denser medium', 'Draw rays through glass block'],
        pupilOutcome: 'Pupils trace light rays entering glass blocks and show light bending towards the normal line.',
        keyWords: ['refraction', 'optical density', 'glass block', 'normal', 'bending']
      },
      {
        title: 'Dispersion of white light using a prism',
        learningObjectives: ['Explain dispersion of white light into 7 spectrum colors (ROYGBIV) through a triangular prism', 'Compare wave refraction rates'],
        pupilOutcome: 'Pupils split white light rays with glass prisms and explain why red bends least while violet bends most.',
        keyWords: ['dispersion', 'spectrum', 'prism', 'refraction', 'wavelength']
      }
    ]
  ),

  createScienceUnit(
    30, 'Electricity: Series/Parallel Circuits and Voltage', 'Year 8',
    'Circuit symbols, series vs parallel circuits, current (Amps), potential difference (Volts), and resistance (Ohms).',
    [
      {
        title: 'Circuit symbols and basic circuit diagrams',
        learningObjectives: ['Draw standard circuit symbols for cell, battery, switch, bulb, ammeter, voltmeter, resistor', 'Construct simple circuits'],
        pupilOutcome: 'Pupils convert physical circuit setups into clean schematic circuit diagrams.',
        keyWords: ['circuit symbol', 'cell', 'battery', 'switch', 'schematic']
      },
      {
        title: 'Current in series and parallel circuits',
        learningObjectives: ['Define electric current as flow of electron charge (Amperes)', 'State rules for current in series and parallel branches'],
        pupilOutcome: 'Pupils connect ammeters at multiple points in series and parallel circuits to verify rules.',
        keyWords: ['current', 'Ampere', 'ammeter', 'series circuit', 'parallel circuit']
      },
      {
        title: 'Potential difference (voltage) and energy transfer',
        learningObjectives: ['Define potential difference as energy transferred per unit charge (Volts)', 'Measure voltage across components using voltmeters'],
        pupilOutcome: 'Pupils verify that battery voltage equals the sum of voltages across series components.',
        keyWords: ['potential difference', 'voltage', 'Volt', 'voltmeter', 'energy transfer']
      },
      {
        title: 'Electrical resistance and Ohm\'s law (V = IR)',
        learningObjectives: ['Define resistance as opposition to current flow (Ohms)', 'Apply Ohm\'s law: Resistance = Voltage / Current (V = IR)'],
        pupilOutcome: 'Pupils calculate component resistance by measuring voltage and current values.',
        keyWords: ['resistance', 'Ohm', 'Ohm\'s law', 'resistor', 'voltage']
      }
    ]
  ),

  createScienceUnit(
    31, 'Energy Transfers, Work and Power', 'Year 8',
    'Energy stores (kinetic, gravitational, thermal, chemical), energy transfers, conservation of energy, work done, and power calculations.',
    [
      {
        title: 'Energy stores and pathway transfers',
        learningObjectives: ['Identify 8 energy stores (kinetic, thermal, chemical, gravitational, elastic, nuclear, electrostatic, magnetic)', 'Identify 4 transfer pathways'],
        pupilOutcome: 'Pupils trace energy store changes for a falling object or burning fuel.',
        keyWords: ['energy store', 'transfer pathway', 'kinetic', 'gravitational', 'thermal']
      },
      {
        title: 'Law of Conservation of Energy and efficiency',
        learningObjectives: ['State Law of Conservation of Energy: Energy cannot be created or destroyed', 'Calculate percentage Efficiency = (Useful Energy / Total Energy) x 100'],
        pupilOutcome: 'Pupils construct Sankey diagrams showing useful vs wasted energy outputs.',
        keyWords: ['conservation of energy', 'efficiency', 'Sankey diagram', 'wasted energy', 'dissipate']
      },
      {
        title: 'Work done and mechanical energy calculations',
        learningObjectives: ['Apply Work Done = Force x Distance (W = Fs) in Joules', 'Link work done to energy transferred'],
        pupilOutcome: 'Pupils calculate mechanical work done when lifting objects against gravity.',
        keyWords: ['work done', 'force', 'distance', 'Joule', 'energy transfer']
      },
      {
        title: 'Power calculations and electrical appliance ratings',
        learningObjectives: ['Apply Power = Energy / Time (P = E/t) in Watts', 'Compare power ratings of home electrical appliances'],
        pupilOutcome: 'Pupils calculate energy consumption in kilowatt-hours (kWh) for domestic electricity bills.',
        keyWords: ['power', 'Watt', 'energy', 'time', 'kilowatt-hour']
      }
    ]
  ),

  createScienceUnit(
    32, 'Thermal Energy, Heat Conduction and Insulation', 'Year 8',
    'Conduction in solids, convection in fluids, thermal radiation, thermal insulation, and payback time calculations.',
    [
      {
        title: 'Thermal conduction in solids and free electrons in metals',
        learningObjectives: ['Explain conduction as vibrating particle collision energy transfer', 'Explain why delocalised electrons make metals superior conductors'],
        pupilOutcome: 'Pupils compare heat conduction rates along copper, iron, glass, and plastic rods.',
        keyWords: ['conduction', 'thermal conductor', 'free electrons', 'metal', 'insulator']
      },
      {
        title: 'Convection currents in liquids and gases',
        learningObjectives: ['Explain thermal convection as fluid heating -> expansion -> lower density -> rising fluid', 'Convection current loops'],
        pupilOutcome: 'Pupils demonstrate convection currents using potassium manganate crystals in heated water.',
        keyWords: ['convection', 'density', 'expansion', 'fluid', 'convection current']
      },
      {
        title: 'Thermal radiation and surface emission/absorption',
        learningObjectives: ['Describe thermal radiation as infrared electromagnetic waves travelling through a vacuum', 'Compare dull black vs shiny silver surfaces'],
        pupilOutcome: 'Pupils measure cooling rates of water in matte black vs shiny silver Leslie cubes.',
        keyWords: ['thermal radiation', 'infrared', 'emission', 'absorption', 'Leslie cube']
      },
      {
        title: 'Home insulation and payback time calculations',
        learningObjectives: ['Evaluate loft insulation, double glazing, cavity wall insulation, and draft excluders', 'Calculate insulation payback time'],
        pupilOutcome: 'Pupils calculate payback time = installation cost / annual heating bill savings.',
        keyWords: ['insulation', 'double glazing', 'cavity wall', 'payback time', 'heat loss']
      }
    ]
  ),

  createScienceUnit(
    33, 'Pressure in Fluids, Density and Hydraulics', 'Year 8',
    'Fluid pressure formula (P = F/A), atmospheric pressure, liquid depth pressure, density formula (d = m/V), and hydraulic machines.',
    [
      {
        title: 'Solid surface pressure calculations (P = F/A)',
        learningObjectives: ['Apply Pressure = Force / Area in N/m² or Pascals (Pa)', 'Explain why sharp snow skis vs high heels exert different pressures'],
        pupilOutcome: 'Pupils calculate footprint pressure exerted on floor surfaces.',
        keyWords: ['pressure', 'force', 'area', 'Pascal', 'surface area']
      },
      {
        title: 'Density formula and measuring irregular solids (d = m/V)',
        learningObjectives: ['Apply Density = Mass / Volume in g/cm³ or kg/m³', 'Measure volume of irregular solids using displacement cans'],
        pupilOutcome: 'Pupils measure density of metal blocks using eureka cans and electronic balances.',
        keyWords: ['density', 'mass', 'volume', 'displacement can', 'eureka can']
      },
      {
        title: 'Liquid pressure with depth and hydraulic systems',
        learningObjectives: ['Explain liquid pressure increase with depth due to weight of fluid above', 'Explain incompressible fluids in hydraulic brakes'],
        pupilOutcome: 'Pupils calculate force multiplication across small and large hydraulic cylinders.',
        keyWords: ['liquid pressure', 'depth', 'hydraulics', 'incompressible', 'force multiplier']
      }
    ]
  ),

  createScienceUnit(
    34, 'Magnetism, Electromagnets and Magnetic Fields', 'Year 8',
    'Magnetic poles, field line patterns, Earth magnetic field, constructing electromagnets, and variables affecting field strength.',
    [
      {
        title: 'Magnetic poles, forces and field line plotting',
        learningObjectives: ['Identify attraction (opposite poles N-S) vs repulsion (like poles N-N / S-S)', 'Plot field lines using compasses'],
        pupilOutcome: 'Pupils map magnetic field line shapes around bar magnets using iron filings and plotting compasses.',
        keyWords: ['magnetic pole', 'attraction', 'repulsion', 'field line', 'compass']
      },
      {
        title: 'Earth\'s magnetic field and navigation compasses',
        learningObjectives: ['Explain Earth\'s liquid iron outer core generating a magnetic field', 'Describe how navigation compass needles align with magnetic North'],
        pupilOutcome: 'Pupils navigate orienteering courses using magnetic compass bearings.',
        keyWords: ['Earth', 'magnetic field', 'outer core', 'navigation', 'compass']
      },
      {
        title: 'Building electromagnets and investigating strength factors',
        learningObjectives: ['Construct an electromagnet using insulated copper wire, iron nail core, and DC power supply', 'Investigate factors affecting strength'],
        pupilOutcome: 'Pupils test how current, coil turn count, and core material alter paperclip pickup capacity.',
        keyWords: ['electromagnet', 'solenoid', 'iron core', 'coil turns', 'current']
      }
    ]
  ),

  createScienceUnit(
    35, 'Earth in Space, Astronomy and Solar System', 'Year 8',
    'Day/night rotation, seasonal axial tilt, lunar phases, solar/lunar eclipses, solar system planets, and gravity in orbits.',
    [
      {
        title: 'Day, night, year length and seasonal axial tilt',
        learningObjectives: ['Explain 24-hour Earth rotation causing day/night', 'Explain 23.5° axial tilt causing summer/winter seasonal sunlight intensity shifts'],
        pupilOutcome: 'Pupils model seasonal sunlight concentration differences using globe models and ray lamps.',
        keyWords: ['rotation', 'axial tilt', 'seasons', 'day and night', 'orbit']
      },
      {
        title: 'Moon phases and solar/lunar eclipses',
        learningObjectives: ['Explain 28-day lunar orbit causing Moon phases (New Moon to Full Moon)', 'Diagram alignment for solar and lunar eclipses'],
        pupilOutcome: 'Pupils diagram geometry responsible for partial and total solar eclipses.',
        keyWords: ['Moon phase', 'lunar orbit', 'solar eclipse', 'lunar eclipse', 'shadow']
      },
      {
        title: 'Solar System structure and gravitational orbital forces',
        learningObjectives: ['Order 8 planets (Mercury to Neptune)', 'Explain gravity as centripetal force keeping planets and comets in elliptical orbits'],
        pupilOutcome: 'Pupils compare planet orbital periods and surface temperatures with distance from Sun.',
        keyWords: ['Solar System', 'planet', 'gravity', 'orbital period', 'centripetal']
      }
    ]
  ),

  createScienceUnit(
    36, 'Advanced Wave Properties & Electromagnetic Spectrum', 'Year 9',
    'Transverse vs longitudinal waves, wave equation (v = f x lambda), reflection, refraction, diffraction, and 7 EM spectrum regions.',
    [
      {
        title: 'Transverse vs longitudinal wave features and formulas',
        learningObjectives: ['Define crest, trough, compression, rarefaction, amplitude, wavelength (lambda), frequency (f)', 'Apply v = f x lambda'],
        pupilOutcome: 'Pupils calculate wave speed using wave speed = frequency x wavelength.',
        keyWords: ['transverse', 'longitudinal', 'wavelength', 'frequency', 'wave equation']
      },
      {
        title: 'The Electromagnetic (EM) Spectrum: 7 continuous regions',
        learningObjectives: ['Order EM spectrum: Radio, Microwave, Infrared, Visible, Ultraviolet, X-ray, Gamma rays', 'Compare energy and frequency'],
        pupilOutcome: 'Pupils rank EM waves by frequency, wavelength, and photon energy level.',
        keyWords: ['electromagnetic spectrum', 'radio waves', 'microwaves', 'infrared', 'gamma rays']
      },
      {
        title: 'Applications and hazards of EM radiation',
        learningObjectives: ['Match EM regions to uses (telecoms, cooking, thermal imaging, radiography, radiotherapy)', 'Explain ionising radiation risks'],
        pupilOutcome: 'Pupils evaluate radiation safety precautions for medical X-ray operators.',
        keyWords: ['EM applications', 'ionising', 'X-ray', 'radiotherapy', 'radiation hazard']
      }
    ]
  ),

  createScienceUnit(
    37, 'Static Electricity, Charges and Electric Fields', 'Year 9',
    'Positive and negative electrostatic charges, electron transfer by friction, electric field lines, and static safety/applications.',
    [
      {
        title: 'Electrostatic charge generation via friction',
        learningObjectives: ['Explain positive charge (electron loss) vs negative charge (electron gain) via friction', 'Gold leaf electroscope'],
        pupilOutcome: 'Pupils demonstrate electrostatic attraction of polythene and acetate rods on paper dots.',
        keyWords: ['static electricity', 'electrostatic', 'electron transfer', 'friction', 'charge']
      },
      {
        title: 'Electric fields around point charges',
        learningObjectives: ['Draw electric field radial patterns around positive and negative point charges', 'Direction of force on positive test charge'],
        pupilOutcome: 'Pupils draw electric field lines showing attraction between opposite charges.',
        keyWords: ['electric field', 'radial field', 'point charge', 'field line', 'electrostatic force']
      },
      {
        title: 'Industrial uses and safety hazards of static electricity',
        learningObjectives: ['Examine electrostatic paint spraying and chimney precipitators', 'Explain grounding fuel tankers to prevent sparks'],
        pupilOutcome: 'Pupils explain why grounding cables are essential during aircraft refuelling.',
        keyWords: ['electrostatic spraying', 'precipitator', 'grounding', 'earthing', 'spark hazard']
      }
    ]
  ),

  createScienceUnit(
    38, 'Forces and Motion: Acceleration and Momentum', 'Year 9',
    'Distance-time vs velocity-time graphs, acceleration formula (a = v-u / t), Newton 3 Laws of Motion, and momentum (p = mv).',
    [
      {
        title: 'Interpreting distance-time and velocity-time motion graphs',
        learningObjectives: ['Determine speed from distance-time graph gradient', 'Determine acceleration from velocity-time gradient and distance from area under curve'],
        pupilOutcome: 'Pupils calculate total distance travelled by calculating area under velocity-time graphs.',
        keyWords: ['distance-time graph', 'velocity-time graph', 'gradient', 'area under curve', 'speed']
      },
      {
        title: 'Acceleration calculations and Newton\'s Second Law (F = ma)',
        learningObjectives: ['Apply Acceleration = (v - u) / t in m/s²', 'Apply Newton\'s 2nd Law: Resultant Force = mass x acceleration (F = ma)'],
        pupilOutcome: 'Pupils calculate acceleration and required resultant braking force for vehicles.',
        keyWords: ['acceleration', 'velocity', 'Newton second law', 'resultant force', 'F = ma']
      },
      {
        title: 'Newton\'s Third Law and conservation of momentum',
        learningObjectives: ['State Newton\'s 3rd Law: For every action force, there is an equal and opposite reaction force', 'Apply Momentum = mass x velocity (p = mv)'],
        pupilOutcome: 'Pupils explain rocket thrust and skater recoil using Newton\'s 3rd Law and momentum conservation.',
        keyWords: ['Newton third law', 'action reaction', 'momentum', 'conservation of momentum', 'recoil']
      }
    ]
  ),

  createScienceUnit(
    39, 'Nuclear Radiation, Radioactivity and Atomic Energy', 'Year 9',
    'Alpha, beta, and gamma radiation properties, radioactive decay half-life, nuclear fission vs fusion, and radiation safety.',
    [
      {
        title: 'Alpha, beta and gamma ionising radiation properties',
        learningObjectives: ['Compare Alpha (helium nucleus), Beta (fast electron), Gamma (EM wave) in penetration, range, and ionising power', 'Absorbers'],
        pupilOutcome: 'Pupils explain why alpha is stopped by paper while gamma requires thick lead shielding.',
        keyWords: ['alpha', 'beta', 'gamma', 'penetration', 'ionising power', 'shielding']
      },
      {
        title: 'Radioactive decay, half-life graphs and isotope dating',
        learningObjectives: ['Define half-life as time taken for half of radioactive nuclei to decay', 'Read half-life values from decay curves'],
        pupilOutcome: 'Pupils plot radioactive decay curves and determine isotope half-life periods.',
        keyWords: ['radioactive decay', 'half-life', 'decay curve', 'activity', 'Becquerel']
      },
      {
        title: 'Nuclear fission vs nuclear fusion energy generation',
        learningObjectives: ['Differentiate splitting heavy nuclei (fission of Uranium-235) vs joining light nuclei (fusion of Hydrogen in stars)', 'Chain reactions'],
        pupilOutcome: 'Pupils contrast nuclear power station fission chain reactions with solar fusion.',
        keyWords: ['nuclear fission', 'nuclear fusion', 'chain reaction', 'Uranium-235', 'power station']
      }
    ]
  ),

  // --- WORKING SCIENTIFICALLY SKILLS UNITS (40 - 41) ---
  createScienceUnit(
    40, 'Working Scientifically: Practical Enquiry & Variables', 'Year 7',
    'Independent, dependent, and control variables; hypothesis formulation; risk assessment; and equipment selection.',
    [
      {
        title: 'Formulating scientific questions and hypotheses',
        learningObjectives: ['Formulate testable scientific questions and hypotheses based on theoretical knowledge', 'Identify testable variables'],
        pupilOutcome: 'Pupils convert broad topics into testable scientific hypotheses.',
        keyWords: ['hypothesis', 'scientific method', 'question', 'prediction', 'testable']
      },
      {
        title: 'Identifying independent, dependent and control variables',
        learningObjectives: ['Define independent variable (changed), dependent variable (measured), control variables (kept same)', 'Plan fair tests'],
        pupilOutcome: 'Pupils identify all three variable types for a bouncing ball or chemical reaction experiment.',
        keyWords: ['independent variable', 'dependent variable', 'control variable', 'fair test', 'validity']
      },
      {
        title: 'Writing step-by-step risk assessments',
        learningObjectives: ['Identify lab hazards (Bunsen burner, glass, acids)', 'State associated risks and safety control measures'],
        pupilOutcome: 'Pupils compile hazard-risk-control tables prior to carrying out practical investigations.',
        keyWords: ['risk assessment', 'hazard', 'risk', 'control measure', 'safety goggles']
      },
      {
        title: 'Selecting appropriate laboratory equipment and precision',
        learningObjectives: ['Select equipment with appropriate resolution (measuring cylinder, balance, timer)', 'Discuss experimental precision'],
        pupilOutcome: 'Pupils select appropriate volumetric apparatus for precise liquid measurements.',
        keyWords: ['equipment', 'precision', 'resolution', 'measuring cylinder', 'balance']
      }
    ]
  ),

  createScienceUnit(
    41, 'Working Scientifically: Data Analysis & Scientific Uncertainty', 'Year 8',
    'Mean calculation, anomalous data identification, line of best fit, precision/accuracy, and evaluation.',
    [
      {
        title: 'Recording data in tables and calculating mean averages',
        learningObjectives: ['Construct structured raw data tables with headings and units', 'Calculate mean average across repeat trials'],
        pupilOutcome: 'Pupils record repeat timing data and calculate mean values correctly.',
        keyWords: ['data table', 'mean', 'repeats', 'units', 'average']
      },
      {
        title: 'Identifying anomalous data points and outliers',
        learningObjectives: ['Identify anomalous results in repeat datasets', 'Exclude anomalous outliers before calculating final mean values'],
        pupilOutcome: 'Pupils spot anomalous trial results and justify their exclusion from average calculations.',
        keyWords: ['anomalous', 'outlier', 'repeatability', 'error', 'mean']
      },
      {
        title: 'Plotting continuous line graphs with suitable scales',
        learningObjectives: ['Choose linear axis scales covering over 50% of graph paper', 'Plot points accurately using x markers'],
        pupilOutcome: 'Pupils construct scaled line graphs from continuous experimental data.',
        keyWords: ['graph', 'axis scale', 'independent variable', 'dependent variable', 'plotting']
      },
      {
        title: 'Drawing lines of best fit and identifying correlation',
        learningObjectives: ['Draw smooth curve or straight line of best fit passing through points', 'Identify positive, negative, or no correlation'],
        pupilOutcome: 'Pupils draw lines of best fit and describe mathematical correlations between variables.',
        keyWords: ['line of best fit', 'correlation', 'trend', 'linear', 'curve']
      },
      {
        title: 'Evaluating experimental accuracy, precision and uncertainty',
        learningObjectives: ['Differentiate accuracy (closeness to true value) vs precision (closeness of repeat measurements)', 'Identify sources of error'],
        pupilOutcome: 'Pupils evaluate random vs systematic errors in laboratory data.',
        keyWords: ['accuracy', 'precision', 'uncertainty', 'random error', 'systematic error']
      }
    ]
  )
];
