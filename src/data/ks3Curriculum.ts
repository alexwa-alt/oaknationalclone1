import { OakSubject, OakUnit, OakLesson, OakResource } from '../types';
import { SCIENCE_41_UNITS } from './scienceUnits';

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
      type: 'slidedeck',
      title: `Oak Slide Deck: ${lessonTitle}`,
      fileExtension: 'pdf',
      fileSizeBytes: 2450000 + Math.floor(Math.random() * 800000),
      downloadUrl: `/api/oak/download-proxy?type=slidedeck&title=${cleanTitle}_Slides`,
      mimeType: 'application/pdf',
      contentPreview: `Slide 1: Key Stage 3 Learning Objectives. Slide 2: Core Vocabulary (${keyWords.slice(0, 3).join(', ')}). Slide 3: Teacher Explanation & Worked Examples. Slide 4: Student Practice Task.`
    },
    {
      id: `${subjectSlug}-${unitSlug}-${lessonSlug}-worksheet`,
      type: 'worksheet',
      title: `Printable Student Worksheet: ${lessonTitle}`,
      fileExtension: 'pdf',
      fileSizeBytes: 920000 + Math.floor(Math.random() * 300000),
      downloadUrl: `/api/oak/download-proxy?type=worksheet&title=${cleanTitle}_Worksheet`,
      mimeType: 'application/pdf',
      contentPreview: `Section A: Recall Warm-up. Section B: Guided Exercises on ${keyWords[0] || 'concepts'}. Section C: Challenge Application Problem.`
    },
    {
      id: `${subjectSlug}-${unitSlug}-${lessonSlug}-quiz`,
      type: 'quiz',
      title: `Exit Ticket Assessment Quiz: ${lessonTitle}`,
      fileExtension: 'json',
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
          explanation: `In Key Stage 3, ${keyWords[0] || 'this concept'} is fundamental to achieving learning benchmarks.`
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
      type: 'transcript',
      title: `Teacher Video Script & Transcript: ${lessonTitle}`,
      fileExtension: 'txt',
      fileSizeBytes: 18000,
      downloadUrl: `/api/oak/download-proxy?type=transcript&title=${cleanTitle}_Transcript`,
      mimeType: 'text/plain',
      contentPreview: `00:00 Welcome to Key Stage 3. In this lesson on ${lessonTitle}, we will explore ${keyWords.join(', ')}...`
    }
  ];
}

// Helper builder to create full unit objects directly from clean lesson data
function createUnit(
  subjectSlug: string,
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
  const unitSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const lessons: OakLesson[] = lessonsData.map((lData, idx) => {
    const lessonNumber = idx + 1;
    const lessonSlug = `${unitSlug}-l${lessonNumber}-${lData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

    return {
      slug: lessonSlug,
      title: lData.title,
      unitSlug: unitSlug,
      subjectSlug: subjectSlug,
      keyStageSlug: 'ks3',
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
    keyStageSlug: 'ks3',
    unitNumber,
    yearGroup,
    tier,
    description,
    lessons
  };
}

export const KS3_KEY_STAGE_INFO = {
  slug: 'ks3',
  title: 'Key Stage 3',
  shortCode: 'KS3',
  years: ['Year 7', 'Year 8', 'Year 9'],
  description: 'National Curriculum for pupils aged 11 to 14 in England'
};

export const MOCK_KS3_CURRICULUM: OakSubject[] = [
  // 1. MATHEMATICS
  {
    slug: 'maths',
    title: 'Mathematics',
    keyStageSlug: 'ks3',
    description: '100% KS3 National Curriculum in Mathematics (Algebra, Number, Geometry, Ratio, Probability, Statistics)',
    iconName: 'Calculator',
    colourClass: 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:text-emerald-400',
    units: [
      createUnit(
        'maths', 1, 'Algebraic Expressions, Notation and Linear Equations', 'Year 7',
        'Master algebraic notation, expanding brackets, factorising, and solving 1 and 2-step equations.',
        [
          {
            title: 'Algebraic notation and variables',
            learningObjectives: ['Understand variables, expressions, and terms', 'Write algebraic expressions from word scenarios'],
            pupilOutcome: 'Pupils construct algebraic expressions using correct mathematical notation.',
            keyWords: ['algebra', 'variable', 'expression', 'term', 'coefficient']
          },
          {
            title: 'Collecting like terms',
            learningObjectives: ['Identify like and unlike algebraic terms', 'Simplify multi-term linear expressions'],
            pupilOutcome: 'Pupils simplify algebraic expressions by combining like terms.',
            keyWords: ['like terms', 'simplify', 'coefficient', 'expression', 'algebra']
          },
          {
            title: 'Expanding single brackets',
            learningObjectives: ['Apply the distributive law to single brackets', 'Multiply terms inside brackets by an outside factor'],
            pupilOutcome: 'Pupils expand single brackets containing positive and negative terms.',
            keyWords: ['expand', 'bracket', 'distributive law', 'factor', 'multiplier']
          },
          {
            title: 'Factorising linear expressions',
            learningObjectives: ['Identify the highest common factor (HCF) of numerical and algebraic terms', 'Factorise linear expressions into single brackets'],
            pupilOutcome: 'Pupils extract HCFs to factorise linear expressions.',
            keyWords: ['factorise', 'HCF', 'common factor', 'bracket', 'linear']
          },
          {
            title: 'Solving one-step and two-step linear equations',
            learningObjectives: ['Apply inverse operations systematically to solve equations', 'Keep equations balanced during step-by-step solving'],
            pupilOutcome: 'Pupils solve 2-step linear equations and check solutions by substitution.',
            keyWords: ['solve', 'equation', 'inverse operation', 'balance', 'substitution']
          },
          {
            title: 'Formulating equations from word problems',
            learningObjectives: ['Translate real-world problems into linear equations', 'Solve formulated equations to answer contextual questions'],
            pupilOutcome: 'Pupils construct and solve linear equations for geometric and word problems.',
            keyWords: ['formulate', 'word problem', 'equation', 'unknown', 'context']
          }
        ]
      ),
      createUnit(
        'maths', 2, 'Perimeter, Area, Volume and Angle Properties', 'Year 7',
        'Calculate perimeter and area of 2D shapes, surface area/volume of prisms, and angle facts on parallel lines.',
        [
          {
            title: 'Perimeter and area of rectangles and parallelograms',
            learningObjectives: ['Apply formulas for perimeter and area of rectangles and parallelograms', 'Identify perpendicular heights'],
            pupilOutcome: 'Pupils calculate perimeter and area for 2D quadrilaterals.',
            keyWords: ['perimeter', 'area', 'rectangle', 'parallelogram', 'perpendicular height']
          },
          {
            title: 'Area of triangles and trapeziums',
            learningObjectives: ['Apply Area = 0.5 x base x height for triangles', 'Apply Area = 0.5 x (a + b) x h for trapeziums'],
            pupilOutcome: 'Pupils calculate areas of triangles and trapeziums accurately.',
            keyWords: ['triangle', 'trapezium', 'area', 'parallel sides', 'formula']
          },
          {
            title: 'Area and perimeter of composite shapes',
            learningObjectives: ['Decompose complex 2D shapes into rectangles and triangles', 'Calculate total composite area and outer perimeter'],
            pupilOutcome: 'Pupils split composite shapes to calculate total surface area.',
            keyWords: ['composite shape', 'compound area', 'decomposition', 'perimeter']
          },
          {
            title: 'Surface area and volume of cuboids and prisms',
            learningObjectives: ['Calculate volume of cuboids and triangular prisms using V = cross-sectional area x length', 'Find total surface area'],
            pupilOutcome: 'Pupils calculate volume and surface area for 3D prisms.',
            keyWords: ['volume', 'surface area', 'cuboid', 'prism', 'cross-section']
          },
          {
            title: 'Angle facts on straight lines and around a point',
            learningObjectives: ['Apply rules: angles on a straight line sum to 180°, around a point sum to 360°', 'Use vertically opposite angles'],
            pupilOutcome: 'Pupils calculate missing angles giving geometric reasons.',
            keyWords: ['angle', 'straight line', 'vertically opposite', 'degrees', 'reason']
          },
          {
            title: 'Angle relationships on parallel lines',
            learningObjectives: ['Identify alternate (Z), corresponding (F), and co-interior (C) angles on parallel lines', 'Solve multi-step angle problems'],
            pupilOutcome: 'Pupils prove parallel line angle facts with clear geometric justifications.',
            keyWords: ['parallel lines', 'alternate angles', 'corresponding angles', 'co-interior']
          },
          {
            title: 'Interior and exterior angles of polygons',
            learningObjectives: ['Calculate interior angle sum of n-sided polygons using (n - 2) x 180°', 'State exterior angles sum to 360°'],
            pupilOutcome: 'Pupils determine interior and exterior angles of regular polygons.',
            keyWords: ['polygon', 'interior angle', 'exterior angle', 'regular polygon']
          }
        ]
      ),
      createUnit(
        'maths', 3, 'Ratio, Proportion and Rates of Change', 'Year 8',
        'Understand ratio notation, dividing amounts in given ratios, direct/inverse proportion, and unit conversions.',
        [
          {
            title: 'Writing and simplifying ratios',
            learningObjectives: ['Express comparisons as simplified ratios in simplest integer form', 'Convert ratios with different units'],
            pupilOutcome: 'Pupils simplify 2-part and 3-part ratios accurately.',
            keyWords: ['ratio', 'simplify', 'simplest form', 'equivalent ratio', 'unit']
          },
          {
            title: 'Dividing quantities in a given ratio',
            learningObjectives: ['Divide amounts into given ratios using the unitary method', 'Calculate total parts and value per part'],
            pupilOutcome: 'Pupils divide currency and measurements into given ratio shares.',
            keyWords: ['divide', 'ratio', 'unitary method', 'share', 'parts']
          },
          {
            title: 'Ratio problems with differences and totals',
            learningObjectives: ['Solve ratio problems when given the difference between shares or one share value', 'Apply algebra to ratio problems'],
            pupilOutcome: 'Pupils solve advanced non-standard ratio word problems.',
            keyWords: ['difference', 'total', 'ratio', 'share', 'problem solving']
          },
          {
            title: 'Direct proportion and unitary method',
            learningObjectives: ['Solve direct proportion problems using unitary method and multiplier tables', 'Graph direct proportion relationships'],
            pupilOutcome: 'Pupils calculate costs and quantities under direct proportion.',
            keyWords: ['direct proportion', 'unitary method', 'multiplier', 'constant']
          },
          {
            title: 'Inverse proportion models',
            learningObjectives: ['Recognise inverse proportion scenarios (e.g. workers and time)', 'Solve inverse proportion calculations'],
            pupilOutcome: 'Pupils calculate time taken when work rate or worker numbers change.',
            keyWords: ['inverse proportion', 'rate', 'work rate', 'constant product']
          },
          {
            title: 'Converting compound units and speed calculations',
            learningObjectives: ['Apply Speed = Distance / Time formula', 'Convert between metric units of speed (m/s and km/h)'],
            pupilOutcome: 'Pupils calculate speed, distance, time, and density using compound measure formulas.',
            keyWords: ['speed', 'distance', 'time', 'compound measure', 'density']
          }
        ]
      ),
      createUnit(
        'maths', 4, 'Linear Graphs, Sequences and Functions', 'Year 8',
        'Plot straight-line graphs y = mx + c, identify gradient and y-intercept, and find nth term of arithmetic sequences.',
        [
          {
            title: 'Term-to-term rules and arithmetic sequences',
            learningObjectives: ['Identify common differences in arithmetic linear sequences', 'Generate sequence terms from term-to-term rules'],
            pupilOutcome: 'Pupils continue linear numerical and pictorial sequences.',
            keyWords: ['sequence', 'arithmetic', 'common difference', 'term-to-term']
          },
          {
            title: 'Finding the nth term of a linear sequence',
            learningObjectives: ['Determine algebraic expression for the nth term (an + b)', 'Test whether a number belongs to a sequence'],
            pupilOutcome: 'Pupils derive nth term formulas for linear sequences.',
            keyWords: ['nth term', 'linear sequence', 'position-to-term', 'algebraic rule']
          },
          {
            title: 'Plotting linear graphs from tables of values',
            learningObjectives: ['Complete tables of values for linear functions y = mx + c', 'Plot coordinates accurately on Cartesian axes'],
            pupilOutcome: 'Pupils plot straight line graphs across positive and negative axes.',
            keyWords: ['linear graph', 'table of values', 'coordinates', 'Cartesian plane']
          },
          {
            title: 'Gradient of a straight line (m = rise/run)',
            learningObjectives: ['Calculate gradient m using vertical change divided by horizontal change', 'Identify positive, negative, and zero gradients'],
            pupilOutcome: 'Pupils determine gradients of lines drawn on coordinate grids.',
            keyWords: ['gradient', 'rise over run', 'slope', 'steepness', 'rate of change']
          },
          {
            title: 'Equation of a straight line (y = mx + c)',
            learningObjectives: ['Identify gradient m and y-intercept c from equations', 'Write equation of a line given gradient and a point'],
            pupilOutcome: 'Pupils state equations of linear graphs directly from key features.',
            keyWords: ['y = mx + c', 'gradient', 'y-intercept', 'linear equation']
          },
          {
            title: 'Parallel lines and real-life conversion graphs',
            learningObjectives: ['Identify parallel lines from equal gradients', 'Interpret real-world conversion and distance-time graphs'],
            pupilOutcome: 'Pupils extract rates and conversion factors from real-life linear graphs.',
            keyWords: ['parallel lines', 'conversion graph', 'distance-time', 'gradient']
          }
        ]
      ),
      createUnit(
        'maths', 5, 'Pythagoras Theorem and Trigonometry', 'Year 9',
        'Calculate missing side lengths and angles in right-angled triangles using Pythagoras and SOH CAH TOA.',
        [
          {
            title: 'Identifying hypotenuse and right-angled triangles',
            learningObjectives: ['Identify the hypotenuse as the longest side opposite the right angle', 'Verify right-angled triangles using side lengths'],
            pupilOutcome: 'Pupils identify hypotenuse sides on rotated 2D triangles.',
            keyWords: ['hypotenuse', 'right angle', 'triangle', 'orientation']
          },
          {
            title: 'Calculating the hypotenuse using Pythagoras\' theorem',
            learningObjectives: ['State Pythagoras\' theorem: a² + b² = c²', 'Calculate hypotenuse length given two shorter sides'],
            pupilOutcome: 'Pupils apply a² + b² = c² to find missing hypotenuse lengths.',
            keyWords: ['Pythagoras', 'hypotenuse', 'square root', 'theorem']
          },
          {
            title: 'Calculating shorter side lengths using Pythagoras\' theorem',
            learningObjectives: ['Rearrange Pythagoras\' formula: a² = c² - b²', 'Calculate missing shorter side lengths'],
            pupilOutcome: 'Pupils find shorter triangle legs by subtracting squared values.',
            keyWords: ['Pythagoras', 'shorter side', 'rearrange', 'square root']
          },
          {
            title: 'Applying Pythagoras\' theorem to 2D problem solving',
            learningObjectives: ['Solve multi-step problems involving isosceles triangles and ladders against walls', 'Calculate distances on coordinate grids'],
            pupilOutcome: 'Pupils apply Pythagoras\' theorem in real-world contextual problems.',
            keyWords: ['Pythagoras', 'problem solving', 'coordinate distance', 'context']
          },
          {
            title: 'Introduction to sine, cosine and tangent ratios',
            learningObjectives: ['Label Opposite, Adjacent, and Hypotenuse relative to a given angle', 'Define Sine, Cosine, and Tangent ratios'],
            pupilOutcome: 'Pupils label right-angled triangles correctly for trigonometric calculations.',
            keyWords: ['sine', 'cosine', 'tangent', 'opposite', 'adjacent', 'hypotenuse']
          },
          {
            title: 'Using SOH CAH TOA to find missing side lengths',
            learningObjectives: ['Select appropriate trigonometric ratio for given information', 'Calculate missing side lengths using scientific calculators'],
            pupilOutcome: 'Pupils solve for unknown side lengths using trigonometric equations.',
            keyWords: ['SOH CAH TOA', 'trigonometry', 'ratio', 'side length', 'calculator']
          },
          {
            title: 'Calculating missing angles using inverse trigonometric functions',
            learningObjectives: ['Apply inverse trigonometric functions (sin⁻¹, cos⁻¹, tan⁻¹)', 'Calculate missing angles in right-angled triangles'],
            pupilOutcome: 'Pupils calculate unknown angles using inverse trigonometric keys on calculators.',
            keyWords: ['inverse trigonometry', 'sin⁻¹', 'cos⁻¹', 'tan⁻¹', 'angle']
          }
        ]
      ),
      createUnit(
        'maths', 6, 'Indices, Standard Form and Simultaneous Equations', 'Year 9',
        'Apply index laws, convert numbers to/from standard form, and solve linear simultaneous equations algebraically.',
        [
          {
            title: 'Index laws for multiplication and division',
            learningObjectives: ['Apply laws: aᵐ x aⁿ = aᵐ⁺ⁿ and aᵐ ÷ aⁿ = aᵐ⁻ⁿ', 'Simplify expressions involving powers of powers (aᵐ)ⁿ'],
            pupilOutcome: 'Pupils simplify numeric and algebraic index expressions.',
            keyWords: ['indices', 'index laws', 'power', 'multiplication law', 'division law']
          },
          {
            title: 'Zero and negative integer indices',
            learningObjectives: ['Explain why a⁰ = 1 for any non-zero number', 'Apply rule for negative indices: a⁻ⁿ = 1 / aⁿ'],
            pupilOutcome: 'Pupils evaluate expressions involving zero and negative powers.',
            keyWords: ['zero index', 'negative index', 'reciprocal', 'power']
          },
          {
            title: 'Writing numbers in standard form (A x 10^n)',
            learningObjectives: ['Understand standard form notation where 1 <= A < 10 and n is an integer', 'Convert large and small numbers to standard form'],
            pupilOutcome: 'Pupils convert ordinary numbers to standard form and vice versa.',
            keyWords: ['standard form', 'scientific notation', 'power of 10', 'exponent']
          },
          {
            title: 'Calculating with standard form numbers',
            learningObjectives: ['Multiply and divide numbers in standard form', 'Add and subtract numbers in standard form'],
            pupilOutcome: 'Pupils perform arithmetic operations on standard form numbers with and without calculators.',
            keyWords: ['standard form', 'arithmetic', 'multiplication', 'division', 'scientific calculator']
          },
          {
            title: 'Solving simultaneous equations by elimination',
            learningObjectives: ['Align coefficients by multiplying equations', 'Eliminate one variable by adding or subtracting equations'],
            pupilOutcome: 'Pupils solve pairs of linear simultaneous equations algebraically.',
            keyWords: ['simultaneous equations', 'elimination', 'coefficient', 'linear']
          },
          {
            title: 'Solving simultaneous equations by substitution',
            learningObjectives: ['Rearrange one equation to express one variable in terms of another', 'Substitute into second equation to solve'],
            pupilOutcome: 'Pupils solve simultaneous equations using substitution techniques.',
            keyWords: ['simultaneous equations', 'substitution', 'rearrange', 'algebraic method']
          }
        ]
      )
    ]
  },

  // 2. ENGLISH LANGUAGE & LITERATURE
  {
    slug: 'english',
    title: 'English Language & Literature',
    keyStageSlug: 'ks3',
    description: '100% KS3 English (Shakespeare, 19th-Century Literature, Poetry, Rhetoric, Creative Narrative & Drama)',
    iconName: 'BookOpen',
    colourClass: 'bg-blue-500/10 text-blue-600 border-blue-200 dark:text-blue-400',
    units: [
      createUnit(
        'english', 1, 'Myths, Legends and Literary Heritage', 'Year 7',
        'Explore classical mythology, folk tales, and foundational archetype structures in storytelling.',
        [
          {
            title: 'Creation myths and oral storytelling traditions',
            learningObjectives: ['Examine classical creation myths across cultures', 'Identify recurring themes of order, chaos, and origin'],
            pupilOutcome: 'Pupils compare creation myth narrative structures.',
            keyWords: ['myth', 'creation', 'oral tradition', 'culture', 'narrative']
          },
          {
            title: 'The Hero\'s Journey archetype structure',
            learningObjectives: ['Study Joseph Campbell\'s Monomyth steps', 'Map hero journey phases onto classical tales'],
            pupilOutcome: 'Pupils map hero journey stages onto narrative texts.',
            keyWords: ['hero journey', 'archetype', 'monomyth', 'call to adventure', 'return']
          },
          {
            title: 'Character archetypes in Greek and Norse mythology',
            learningObjectives: ['Identify trickster, mentor, shadow, and hero archetypes', 'Analyze character motivations in myth extracts'],
            pupilOutcome: 'Pupils analyze how mythological character archetypes shape plot.',
            keyWords: ['character archetype', 'trickster', 'mentor', 'shadow', 'mythology']
          },
          {
            title: 'Symbolism and allegory in classical tales',
            learningObjectives: ['Deconstruct motifs and symbolic objects in myths', 'Explain moral allegories conveyed through mythic narratives'],
            pupilOutcome: 'Pupils write an analytical paragraph explaining symbolism in a myth text.',
            keyWords: ['symbolism', 'allegory', 'motif', 'moral lesson', 'metaphor']
          },
          {
            title: 'Comparing heroic motivations across ancient cultures',
            learningObjectives: ['Compare Greek hubris vs Norse fate (Ragnarok)', 'Evaluate heroic codes of honor in ancient literature'],
            pupilOutcome: 'Pupils write a comparative paragraph comparing two ancient mythical heroes.',
            keyWords: ['comparative analysis', 'hubris', 'fate', 'heroic code', 'culture']
          }
        ]
      ),
      createUnit(
        'english', 2, 'Shakespearean Drama: The Tempest', 'Year 7',
        'Study power, illusion, colonialism, and redemption in Shakespeare last solo play.',
        [
          {
            title: 'Social and historical context of Jacobean theatre',
            learningObjectives: ['Examine Globe Theatre conventions and Jacobean audience expectations', 'Understand colonial exploration context in the 1600s'],
            pupilOutcome: 'Pupils explain how Jacobean context shapes themes in The Tempest.',
            keyWords: ['Shakespeare', 'Jacobean', 'Globe Theatre', 'context', 'colonialism']
          },
          {
            title: 'Prospero, magic and power in Act 1',
            learningObjectives: ['Analyze Prospero\'s use of imperative language and magic', 'Evaluate Prospero\'s control over Miranda and the tempest storm'],
            pupilOutcome: 'Pupils analyze Prospero\'s character using textual evidence.',
            keyWords: ['Prospero', 'power', 'magic', 'tempest', 'imperative']
          },
          {
            title: 'Caliban and Ariel: subversion and servitude',
            learningObjectives: ['Contrast Caliban\'s earthy poetic language with Ariel\'s ethereal songs', 'Examine colonial themes of servitude vs freedom'],
            pupilOutcome: 'Pupils compare Shakespeare\'s portrayal of Caliban and Ariel.',
            keyWords: ['Caliban', 'Ariel', 'servitude', 'poetic language', 'subversion']
          },
          {
            title: 'Analysing Shakespearean verse, prose and iambic pentameter',
            learningObjectives: ['Identify iambic pentameter rhythm (da-DUM x 5)', 'Explain why noble characters speak in verse while commoners speak in prose'],
            pupilOutcome: 'Pupils scan iambic pentameter lines and explain dramatic choices.',
            keyWords: ['iambic pentameter', 'blank verse', 'prose', 'rhythm', 'meter']
          },
          {
            title: 'Themes of betrayal, forgiveness and reconciliation',
            learningObjectives: ['Examine Prospero\'s final choice of mercy over vengeance in Act 5', 'Analyze the symbolism of Prospero drowning his magic book'],
            pupilOutcome: 'Pupils compose an analytical essay on forgiveness in The Tempest.',
            keyWords: ['forgiveness', 'reconciliation', 'redemption', 'mercy', 'epilogue']
          }
        ]
      ),
      createUnit(
        'english', 3, 'Gothic Literature and 19th-Century Short Stories', 'Year 8',
        'Examine atmospheric tension, the uncanny, and Victorian fears in Poe, Shelley, and Stevenson.',
        [
          {
            title: 'Conventions of Gothic literature and setting',
            learningObjectives: ['Identify core Gothic conventions (isolation, decay, supernatural, omens)', 'Analyze how settings reflect mood'],
            pupilOutcome: 'Pupils annotate Gothic extract settings highlighting sensory details.',
            keyWords: ['Gothic', 'conventions', 'isolation', 'decay', 'supernatural']
          },
          {
            title: 'Creating atmosphere through pathetic fallacy',
            learningObjectives: ['Define pathetic fallacy as mirroring human emotion in weather', 'Examine how weather builds tension in Gothic stories'],
            pupilOutcome: 'Pupils explain the dramatic impact of pathetic fallacy in 19th-century extracts.',
            keyWords: ['pathetic fallacy', 'atmosphere', 'tension', 'weather', 'foreshadowing']
          },
          {
            title: 'The uncanny and tension in Edgar Allan Poe',
            learningObjectives: ['Study Poe\'s Tell-Tale Heart for unreliable narrator technique', 'Analyze how sentence structures build heart-pounding suspense'],
            pupilOutcome: 'Pupils analyze Poe\'s use of short sentences and repetition to build panic.',
            keyWords: ['uncanny', 'unreliable narrator', 'suspense', 'Poe', 'syntax']
          },
          {
            title: 'Dual personality and Victorian anxieties in Jekyll and Hyde',
            learningObjectives: ['Examine the theme of the double (Doppelgänger)', 'Link duality to Victorian fears of moral degeneration and science'],
            pupilOutcome: 'Pupils write a analytical paragraph on duality in Jekyll and Hyde.',
            keyWords: ['duality', 'Doppelgänger', 'Victorian anxiety', 'degeneration', 'Jekyll and Hyde']
          },
          {
            title: 'Writing a descriptive Gothic narrative opening',
            learningObjectives: ['Apply sensory imagery, expanded noun phrases, and Gothic motifs', 'Draft a high-impact descriptive story opening'],
            pupilOutcome: 'Pupils compose an original 250-word Gothic story opening setting.',
            keyWords: ['creative writing', 'descriptive', 'sensory imagery', 'Gothic setting']
          }
        ]
      )
    ]
  },

  // 3. SCIENCE
  {
    slug: 'science',
    title: 'Science (Biology, Chemistry, Physics)',
    keyStageSlug: 'ks3',
    description: '100% KS3 Working Scientifically Curriculum across Biology, Chemistry, and Physics',
    iconName: 'Atom',
    colourClass: 'bg-purple-500/10 text-purple-600 border-purple-200 dark:text-purple-400',
    units: SCIENCE_41_UNITS
  },

  // 4. HISTORY
  {
    slug: 'history',
    title: 'History',
    keyStageSlug: 'ks3',
    description: '100% KS3 National Curriculum History (1066 to Modern Britain, World Wars, Empire & Civil Rights)',
    iconName: 'Landmark',
    colourClass: 'bg-amber-500/10 text-amber-600 border-amber-200 dark:text-amber-400',
    units: [
      createUnit(
        'history', 1, 'Norman Conquest & Medieval Britain (1066–1509)', 'Year 7',
        'Contenders for throne in 1066, Battle of Hastings, Feudal System, Domesday Book, and Motte and Bailey castles.',
        [
          {
            title: 'Contenders for the English throne in 1066',
            learningObjectives: ['Examine claims of Harold Godwinson, William of Normandy, and Harald Hardrada', 'Evaluate legitimacy of claims'],
            pupilOutcome: 'Pupils analyze rival claims to the throne following Edward the Confessor\'s death.',
            keyWords: ['1066', 'Harold Godwinson', 'William of Normandy', 'claimant', 'succession']
          },
          {
            title: 'The Battle of Hastings and Norman military tactics',
            learningObjectives: ['Reconstruct key events of October 14, 1066', 'Analyze William\'s use of cavalry, archers, and feigned retreat'],
            pupilOutcome: 'Pupils evaluate reasons for William\'s victory at Hastings.',
            keyWords: ['Battle of Hastings', 'feigned retreat', 'cavalry', 'shield wall', 'Bayeux Tapestry']
          },
          {
            title: 'How William I maintained control: Castles and Domesday Book',
            learningObjectives: ['Study design of Motte and Bailey castles', 'Explain purpose of the 1086 Domesday Book survey'],
            pupilOutcome: 'Pupils evaluate Norman methods of suppressing Anglo-Saxon rebellions.',
            keyWords: ['Motte and Bailey', 'Domesday Book', 'Harrying of the North', 'control', 'taxation']
          },
          {
            title: 'The Feudal System and medieval social hierarchy',
            learningObjectives: ['Understand land distribution: King -> Barons -> Knights -> Peasants', 'Explain obligations of homage and military service'],
            pupilOutcome: 'Pupils diagram the Feudal pyramid and describe peasant life.',
            keyWords: ['Feudal System', 'baron', 'knight', 'peasant', 'serf', 'homage']
          },
          {
            title: 'The Black Death and its impact on medieval society',
            learningObjectives: ['Trace arrival of Yersinia pestis bubonic plague in 1348', 'Analyze socio-economic consequences leading to Peasants\' Revolt'],
            pupilOutcome: 'Pupils assess how labor shortages transformed medieval feudal wages.',
            keyWords: ['Black Death', 'plague', '1348', 'Peasants\' Revolt', 'wages']
          }
        ]
      ),
      createUnit(
        'history', 2, 'Tudor England, Reformation and Empire', 'Year 7',
        'Henry VIII break with Rome, Spanish Armada, Elizabethan Golden Age, and early trade routes.',
        [
          {
            title: 'Henry VIII and the Break with Rome',
            learningObjectives: ['Understand dynastic need for male heir and Catherine of Aragon annulment', 'Explain Act of Supremacy 1534'],
            pupilOutcome: 'Pupils analyze Henry VIII\'s motivations for establishing Church of England.',
            keyWords: ['Henry VIII', 'Break with Rome', 'Act of Supremacy', 'Catholic', 'Protestant']
          },
          {
            title: 'Dissolution of the Monasteries and religious changes',
            learningObjectives: ['Examine Thomas Cromwell\'s monastic inspections', 'Analyze economic enrichment of Crown vs social loss'],
            pupilOutcome: 'Pupils evaluate primary source accounts of monastic land closures.',
            keyWords: ['Dissolution', 'monastery', 'Thomas Cromwell', 'wealth', 'monk']
          },
          {
            title: 'Edward VI, Mary I and religious turmoil',
            learningObjectives: ['Contrast Edward VI\'s Protestant reforms with Mary I\'s Catholic restoration', 'Study Marian executions in Foxe\'s Book of Martyrs'],
            pupilOutcome: 'Pupils timeline Tudor religious shifts between 1547 and 1558.',
            keyWords: ['Edward VI', 'Mary I', 'Marian persecutions', 'martyr', 'reformation']
          },
          {
            title: 'Elizabeth I, the Religious Settlement and Spanish Armada',
            learningObjectives: ['Examine 1559 Elizabethan Religious Settlement compromise', 'Analyze 1588 Spanish Armada defeat factors'],
            pupilOutcome: 'Pupils evaluate naval tactics and weather factors in Spanish Armada defeat.',
            keyWords: ['Elizabeth I', 'Religious Settlement', 'Spanish Armada', '1588', 'fireships']
          },
          {
            title: 'Early English exploration and global trade',
            learningObjectives: ['Study voyages of Francis Drake and Walter Raleigh', 'Examine foundation of East India Company and early colonies'],
            pupilOutcome: 'Pupils map 16th-century English trade routes and early colonial endeavors.',
            keyWords: ['exploration', 'Francis Drake', 'East India Company', 'circumnavigation', 'trade']
          }
        ]
      )
    ]
  },

  // 5. GEOGRAPHY
  {
    slug: 'geography',
    title: 'Geography',
    keyStageSlug: 'ks3',
    description: '100% KS3 Physical and Human Geography (Tectonics, Rivers, Coasts, Climate Change, Urbanisation)',
    iconName: 'Globe',
    colourClass: 'bg-teal-500/10 text-teal-600 border-teal-200 dark:text-teal-400',
    units: [
      createUnit(
        'geography', 1, 'Geographical Mapwork & Tectonic Hazards', 'Year 7',
        'Ordnance Survey 4/6-figure grid references, contour lines, plate boundary types, earthquakes, and tsunamis.',
        [
          {
            title: 'Using 4-figure and 6-figure grid references',
            learningObjectives: ['Master OS map reading rule: along the corridor, up the stairs', 'Locate physical features using 6-figure references'],
            pupilOutcome: 'Pupils locate features accurately on Ordnance Survey map extracts.',
            keyWords: ['grid reference', 'OS map', 'eastings', 'northings', '4-figure', '6-figure']
          },
          {
            title: 'Measuring distance and interpreting contour lines',
            learningObjectives: ['Calculate real-world ground distances using map scale bars', 'Interpret contour line patterns for steep vs gentle slopes'],
            pupilOutcome: 'Pupils draw cross-section elevation profiles from map contour lines.',
            keyWords: ['contour line', 'relief', 'elevation', 'scale bar', 'slope']
          },
          {
            title: 'Earth\'s internal structure and plate tectonics',
            learningObjectives: ['Identify inner core, outer core, mantle, and crust layers', 'Explain convection currents in the asthenosphere driving tectonic plates'],
            pupilOutcome: 'Pupils diagram Earth\'s internal layers and convection currents.',
            keyWords: ['crust', 'mantle', 'outer core', 'inner core', 'convection current']
          },
          {
            title: 'Constructive, destructive and conservative plate margins',
            learningObjectives: ['Compare subduction zones, sea-floor spreading, and transform faults', 'Match plate margins to landforms'],
            pupilOutcome: 'Pupils annotate plate boundary diagrams showing plate movements.',
            keyWords: ['constructive', 'destructive', 'conservative', 'subduction', 'margin']
          },
          {
            title: 'Causes, impacts and responses to earthquakes',
            learningObjectives: ['Explain epicentre and focus depth in seismic wave generation', 'Evaluate primary vs secondary earthquake impacts'],
            pupilOutcome: 'Pupils evaluate immediate emergency responses vs long-term rebuilding.',
            keyWords: ['earthquake', 'epicentre', 'focus', 'seismic wave', 'primary impact']
          },
          {
            title: 'Managing volcanic hazards and predicting eruptions',
            learningObjectives: ['Study volcanic hazard monitoring (seismometers, gas emissions, tiltmeters)', 'Evaluate hazard preparation'],
            pupilOutcome: 'Pupils evaluate volcanic prediction technologies and evacuation plans.',
            keyWords: ['volcano', 'monitoring', 'prediction', 'evacuation', 'hazard management']
          }
        ]
      )
    ]
  },

  // 6. COMPUTING
  {
    slug: 'computing',
    title: 'Computing & Computer Science',
    keyStageSlug: 'ks3',
    description: '100% KS3 Computing (Python, Binary Data, Computer Hardware, Networks, Cybersecurity & AI Ethics)',
    iconName: 'Cpu',
    colourClass: 'bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:text-indigo-400',
    units: [
      createUnit(
        'computing', 1, 'Computer Systems, Hardware & Storage', 'Year 7',
        'Von Neumann architecture, CPU fetch-decode-execute cycle, RAM vs ROM, and secondary storage devices.',
        [
          {
            title: 'Von Neumann architecture and CPU components',
            learningObjectives: ['Identify ALU, Control Unit, Registers (PC, MAR, MDR, ACC)', 'Explain Von Neumann architecture layout'],
            pupilOutcome: 'Pupils diagram CPU internal component connections.',
            keyWords: ['Von Neumann', 'CPU', 'ALU', 'Control Unit', 'registers']
          },
          {
            title: 'The Fetch-Decode-Execute cycle',
            learningObjectives: ['Trace data movement during the fetch-decode-execute cycle', 'Explain clock speed in GHz and cache memory impact'],
            pupilOutcome: 'Pupils step through CPU instruction processing cycles.',
            keyWords: ['fetch-decode-execute', 'clock speed', 'cache memory', 'instructions']
          },
          {
            title: 'Primary memory: RAM vs ROM',
            learningObjectives: ['Compare volatile RAM vs non-volatile ROM', 'Explain why bootup BIOS code is stored in ROM'],
            pupilOutcome: 'Pupils contrast primary memory types and volatility characteristics.',
            keyWords: ['RAM', 'ROM', 'volatile', 'non-volatile', 'BIOS']
          },
          {
            title: 'Secondary storage types: Magnetic, optical, solid state',
            learningObjectives: ['Evaluate HDD, DVD/Blu-ray, and SSD storage technologies', 'Compare speed, capacity, portability, durability, cost'],
            pupilOutcome: 'Pupils select appropriate secondary storage devices for specific user needs.',
            keyWords: ['secondary storage', 'magnetic', 'optical', 'solid state', 'SSD', 'HDD']
          },
          {
            title: 'Operating systems and utility software',
            learningObjectives: ['Identify OS roles: memory management, user interface, file management', 'Explain utility tools (encryption, defragmentation)'],
            pupilOutcome: 'Pupils explain operating system function in computer hardware management.',
            keyWords: ['operating system', 'utility software', 'file management', 'GUI']
          }
        ]
      )
    ]
  },

  // 7. FRENCH
  {
    slug: 'french',
    title: 'French',
    keyStageSlug: 'ks3',
    description: '100% KS3 French (Grammar, Vocabulary, Phonics, Speaking, Listening & Writing)',
    iconName: 'Languages',
    colourClass: 'bg-sky-500/10 text-sky-600 border-sky-200 dark:text-sky-400',
    units: [
      createUnit(
        'french', 1, 'C\'est Moi! (Identity, Family & School Life)', 'Year 7',
        'Greetings, numbers 1-100, age, family members, physical descriptions, and school subjects with avoir & être.',
        [
          {
            title: 'Greetings, age and numbers 1-31',
            learningObjectives: ['Ask and answer personal details (Comment t\'appelles-tu?, Quel âge as-tu?)', 'Master numbers 1-31 for dates'],
            pupilOutcome: 'Pupils conduct simple introductory conversations in French.',
            keyWords: ['greetings', 'age', 'numbers', 'French', 'conversation']
          },
          {
            title: 'Describing physical appearance and personality',
            learningObjectives: ['Apply adjective agreement rules for gender and plural nouns', 'Use hair and eye color phrases with avoir'],
            pupilOutcome: 'Pupils write descriptive paragraphs about friends in French.',
            keyWords: ['adjective agreement', 'description', 'hair', 'eyes', 'personality']
          },
          {
            title: 'Talking about family members and pets',
            learningObjectives: ['Use possessive adjectives (mon, ma, mes)', 'Identify family vocabulary and pet names'],
            pupilOutcome: 'Pupils introduce family members using possessive pronouns in French.',
            keyWords: ['family', 'pets', 'possessive adjective', 'mon', 'ma', 'mes']
          },
          {
            title: 'Using the present tense of avoir and être',
            learningObjectives: ['Conjugate present tense irregular verbs avoir (to have) and être (to be)', 'Apply correct subject pronouns'],
            pupilOutcome: 'Pupils substitute correct verb forms of avoir and être in sentences.',
            keyWords: ['avoir', 'être', 'conjugation', 'present tense', 'pronoun']
          },
          {
            title: 'Expressing opinions about school subjects',
            learningObjectives: ['Use opinion verbs J\'adore, J\'aime, Je déteste', 'Justify opinions using parce que c\'est + adjective'],
            pupilOutcome: 'Pupils write a short paragraph reviewing their school timetable in French.',
            keyWords: ['opinions', 'school subjects', 'j\'adore', 'parce que c\'est', 'justification']
          }
        ]
      )
    ]
  },

  // 8. SPANISH
  {
    slug: 'spanish',
    title: 'Spanish',
    keyStageSlug: 'ks3',
    description: '100% KS3 Spanish (Present, Preterite, Near Future Tenses, Culture & Conversation)',
    iconName: 'Sparkles',
    colourClass: 'bg-rose-500/10 text-rose-600 border-rose-200 dark:text-rose-400',
    units: [
      createUnit(
        'spanish', 1, 'Todo Sobre Mí y Mi Instituto', 'Year 7',
        'Introductions, age, family, pet descriptions, school subjects, opinion phrases, and present tense verbs.',
        [
          {
            title: 'Personal details, numbers and dates',
            learningObjectives: ['Ask and answer ¿Cómo te llamas?, ¿Cuántos años tienes?', 'Master Spanish numbers 1-31 and months'],
            pupilOutcome: 'Pupils state name, age, birthday, and nationality in Spanish.',
            keyWords: ['Spanish', 'personal details', 'numbers', 'dates', 'introductions']
          },
          {
            title: 'Family descriptions and physical traits',
            learningObjectives: ['Use verb tener (to have) for age, eye/hair color', 'Apply noun-adjective gender agreement rules'],
            pupilOutcome: 'Pupils write physical descriptions of family members in Spanish.',
            keyWords: ['tener', 'family', 'physical traits', 'adjective agreement', 'Spanish']
          },
          {
            title: 'School subjects and expressing preferences',
            learningObjectives: ['Use opinion verbs me gusta(n), no me gusta(n), me encanta(n)', 'Give reasons using porque es / son + adjective'],
            pupilOutcome: 'Pupils present opinions on school subjects with justifications in Spanish.',
            keyWords: ['me gusta', 'school subjects', 'opinions', 'porque es', 'Spanish']
          },
          {
            title: 'Present tense of regular -AR, -ER, -IR verbs',
            learningObjectives: ['Identify regular Spanish verb endings in the present tense', 'Conjugate verbs like hablar, comer, vivir'],
            pupilOutcome: 'Pupils conjugate regular present tense Spanish verbs in writing.',
            keyWords: ['present tense', 'conjugation', '-AR verbs', '-ER verbs', '-IR verbs']
          },
          {
            title: 'Describing your school day and routine',
            learningObjectives: ['Use time phrases (A las nueve, durante el recreo)', 'Combine opinions and verbs into a coherent text'],
            pupilOutcome: 'Pupils compose an 80-word paragraph describing their school day in Spanish.',
            keyWords: ['school day', 'routine', 'time phrases', 'paragraph writing', 'Spanish']
          }
        ]
      )
    ]
  },

  // 9. ART & DESIGN
  {
    slug: 'art',
    title: 'Art & Design',
    keyStageSlug: 'ks3',
    description: '100% KS3 Art Curriculum (Formal Elements, Printmaking, Architecture, Portraiture & Fine Art)',
    iconName: 'Palette',
    colourClass: 'bg-pink-500/10 text-pink-600 border-pink-200 dark:text-pink-400',
    units: [
      createUnit(
        'art', 1, 'Formal Elements of Art & Color Theory', 'Year 7',
        'Line, tone, texture, color wheel, complementary colors, and observational pencil drawing technique.',
        [
          {
            title: 'Line and mark-making techniques',
            learningObjectives: ['Explore varied pencil weights (HB, 2B, 4B, 6B)', 'Practice cross-hatching, stippling, and contour line drawing'],
            pupilOutcome: 'Pupils produce a mark-making sampler sheet illustrating varied textures.',
            keyWords: ['line', 'mark-making', 'cross-hatching', 'stippling', 'pencil weight']
          },
          {
            title: 'Tonal shading and creating 3D form',
            learningObjectives: ['Apply smooth tonal gradients from light to dark', 'Render 3D geometric shapes (sphere, cylinder, cube) with directional light source'],
            pupilOutcome: 'Pupils draw a 3D shaded sphere showing highlight, core shadow, and cast shadow.',
            keyWords: ['tone', 'shading', '3D form', 'highlight', 'cast shadow']
          },
          {
            title: 'The color wheel: Primary, secondary and tertiary colors',
            learningObjectives: ['Mix primary paints (red, yellow, blue) to produce secondary and tertiary colors', 'Understand color temperature'],
            pupilOutcome: 'Pupils paint an accurate 12-section color wheel.',
            keyWords: ['color wheel', 'primary colors', 'secondary colors', 'tertiary colors', 'mixing']
          },
          {
            title: 'Complementary and harmonious color schemes',
            learningObjectives: ['Identify complementary colors opposite on the color wheel (e.g. blue/orange)', 'Explore harmonious adjacent colors'],
            pupilOutcome: 'Pupils apply complementary color schemes in abstract artwork.',
            keyWords: ['complementary colors', 'harmonious colors', 'contrast', 'palette']
          },
          {
            title: 'Observational drawing techniques',
            learningObjectives: ['Apply grid method and proportion measuring for still life', 'Combine line, tone, and texture in observational drawing'],
            pupilOutcome: 'Pupils complete an accurate observational still life drawing.',
            keyWords: ['observational drawing', 'still life', 'proportion', 'grid method', 'form']
          }
        ]
      )
    ]
  },

  // 10. DESIGN & TECHNOLOGY
  {
    slug: 'design-tech',
    title: 'Design & Technology',
    keyStageSlug: 'ks3',
    description: '100% KS3 D&T Curriculum (Materials, CAD/CAM 3D Design, Electronics, Prototyping & Food Science)',
    iconName: 'Layers',
    colourClass: 'bg-orange-500/10 text-orange-600 border-orange-200 dark:text-orange-400',
    units: [
      createUnit(
        'design-tech', 1, 'Materials Science & CAD/CAM 3D Prototyping', 'Year 7',
        'Categories of timbers, polymers, and metals; 2D CAD vector drawing; 3D printing and laser cutting techniques.',
        [
          {
            title: 'Categories and properties of timbers',
            learningObjectives: ['Distinguish hardwoods (oak, mahogany), softwoods (pine, larch), manufactured boards (MDF, plywood)', 'Analyze grain and durability'],
            pupilOutcome: 'Pupils classify timber samples based on origin and structural properties.',
            keyWords: ['timber', 'hardwood', 'softwood', 'manufactured board', 'MDF', 'plywood']
          },
          {
            title: 'Categories and properties of polymers and metals',
            learningObjectives: ['Compare thermoforming vs thermosetting polymers', 'Distinguish ferrous metals (contain iron) vs non-ferrous metals and alloys'],
            pupilOutcome: 'Pupils categorize plastic and metal samples using physical testing.',
            keyWords: ['polymers', 'thermoforming', 'thermosetting', 'ferrous', 'non-ferrous', 'alloy']
          },
          {
            title: '2D vector drawing using CAD software',
            learningObjectives: ['Learn CAD vector tools (dimensioning, line weight, vector paths)', 'Create 2D vector designs for manufacturing'],
            pupilOutcome: 'Pupils design a precise 2D vector key fob outline in CAD software.',
            keyWords: ['CAD', '2D vector', 'dimensioning', 'vector path', 'computer aided design']
          },
          {
            title: '3D printing and rapid prototyping principles',
            learningObjectives: ['Understand additive manufacturing (Fused Deposition Modeling FDM)', 'Explain slicing software settings and infill density'],
            pupilOutcome: 'Pupils prepare 3D CAD models for 3D printing using slicing software.',
            keyWords: ['3D printing', 'rapid prototyping', 'FDM', 'slicing software', 'infill']
          },
          {
            title: 'Safe operation of laser cutters and workshop tools',
            learningObjectives: ['Understand CAM machine setup and vector red/black line speed settings', 'Follow workshop health and safety protocols'],
            pupilOutcome: 'Pupils safely operate laser cutting machinery to produce key fob prototypes.',
            keyWords: ['CAM', 'laser cutter', 'workshop safety', 'manufacturing', 'prototype']
          }
        ]
      )
    ]
  },

  // 11. MUSIC
  {
    slug: 'music',
    title: 'Music',
    keyStageSlug: 'ks3',
    description: '100% KS3 Music Curriculum (Notation, Rhythm, Blues, Film Scoring, Songwriting & DAWs)',
    iconName: 'Music',
    colourClass: 'bg-violet-500/10 text-violet-600 border-violet-200 dark:text-violet-400',
    units: [
      createUnit(
        'music', 1, 'Elements of Music & Treble Clef Notation', 'Year 7',
        'Pitch, rhythm, dynamics, tempo, timbre, texture, and reading staff notation on treble clef.',
        [
          {
            title: 'The 7 elements of music (MAD TSHIRT)',
            learningObjectives: ['Identify Melody, Articulation, Dynamics, Tempo, Structure, Harmony, Instruments/Timbre, Rhythm, Texture', 'Analyze musical extracts'],
            pupilOutcome: 'Pupils describe musical listening extracts using formal element terminology.',
            keyWords: ['elements of music', 'dynamics', 'tempo', 'timbre', 'texture', 'melody']
          },
          {
            title: 'Reading treble clef staff notation',
            learningObjectives: ['Read line notes (EGBDF) and space notes (FACE) on treble clef staff', 'Identify ledger lines and middle C'],
            pupilOutcome: 'Pupils transcribe pitch notes on treble clef stave paper.',
            keyWords: ['treble clef', 'staff notation', 'pitch', 'EGBDF', 'FACE', 'stave']
          },
          {
            title: 'Rhythm, note values and time signatures',
            learningObjectives: ['Identify semibreve (4), minim (2), crotchet (1), quaver (0.5)', 'Understand 4/4 and 3/4 time signatures'],
            pupilOutcome: 'Pupils perform rhythm patterns using correct time values.',
            keyWords: ['rhythm', 'crotchet', 'minim', 'quaver', 'time signature', '4/4']
          },
          {
            title: 'Keyboard geography and basic performance skills',
            learningObjectives: ['Locate C-D-E-F-G-A-B pitch keys using black key patterns', 'Use correct finger positioning for smooth playing'],
            pupilOutcome: 'Pupils play a 5-note melodic scale on electronic keyboards.',
            keyWords: ['keyboard', 'finger positioning', 'melody', 'scale', 'performance']
          },
          {
            title: 'Composing a short melody on staff paper',
            learningObjectives: ['Combine pitch notation and rhythmic duration into an 8-bar melody', 'Perform original composition'],
            pupilOutcome: 'Pupils compose and perform an original 8-bar musical melody.',
            keyWords: ['composition', 'melody', 'staff paper', '8-bar', 'performance']
          }
        ]
      )
    ]
  },

  // 12. PHYSICAL EDUCATION
  {
    slug: 'pe',
    title: 'Physical Education & Sports Science',
    keyStageSlug: 'ks3',
    description: '100% KS3 PE & Sports Physiology Curriculum (Anatomy, Fitness Testing, Biomechanics & Training)',
    iconName: 'Activity',
    colourClass: 'bg-green-500/10 text-green-600 border-green-200 dark:text-green-400',
    units: [
      createUnit(
        'pe', 1, 'Skeletal, Muscular Anatomy & Fitness Components', 'Year 7',
        'Major bones and muscles, aerobic vs anaerobic energy systems, and standardised fitness testing protocols.',
        [
          {
            title: 'Major bones of the skeletal system',
            learningObjectives: ['Locate cranium, clavicle, ribs, sternum, humerus, radius, ulna, spine, pelvis, femur, tibia, fibula', 'State skeletal functions'],
            pupilOutcome: 'Pupils identify major human bones during physical movement analysis.',
            keyWords: ['skeleton', 'bone', 'femur', 'humerus', 'cranium', 'pelvis']
          },
          {
            title: 'Synovial joint types and movement patterns',
            learningObjectives: ['Identify hinge joints (elbow/knee) and ball-and-socket joints (hip/shoulder)', 'Explain flexion, extension, abduction, adduction'],
            pupilOutcome: 'Pupils categorize joint movement patterns in sporting techniques.',
            keyWords: ['synovial joint', 'hinge joint', 'ball and socket', 'flexion', 'extension']
          },
          {
            title: 'Major muscle groups and antagonistic pairs',
            learningObjectives: ['Locate biceps, triceps, quadriceps, hamstrings, gastrocnemius, abdominals', 'Explain agonist vs antagonist muscles'],
            pupilOutcome: 'Pupils model muscle contractions during knee extension and arm curl.',
            keyWords: ['muscle', 'biceps', 'triceps', 'quadriceps', 'hamstrings', 'antagonistic pair']
          },
          {
            title: 'Aerobic vs anaerobic energy pathways',
            learningObjectives: ['Differentiate aerobic exercise (sustained with oxygen) vs anaerobic exercise (short bursts without oxygen)', 'Compare energy duration'],
            pupilOutcome: 'Pupils classify athletic events (100m sprint vs marathon) by energy system.',
            keyWords: ['aerobic', 'anaerobic', 'energy system', 'lactic acid', 'oxygen']
          },
          {
            title: 'Components of physical fitness and testing protocols',
            learningObjectives: ['Identify 10 fitness components (cardiovascular endurance, muscular strength, flexibility, agility, speed)', 'Conduct fitness tests'],
            pupilOutcome: 'Pupils perform and record data for Illinois agility test and bleep test.',
            keyWords: ['fitness component', 'cardiovascular endurance', 'agility', 'bleep test', 'flexibility']
          }
        ]
      )
    ]
  },

  // 13. RELIGIOUS EDUCATION & ETHICS
  {
    slug: 're',
    title: 'Religious Education & Ethics',
    keyStageSlug: 'ks3',
    description: '100% KS3 RE & Philosophical Ethics (World Faiths, Philosophy of Religion, Medical Ethics, Just War)',
    iconName: 'BookMarked',
    colourClass: 'bg-fuchsia-500/10 text-fuchsia-600 border-fuchsia-200 dark:text-fuchsia-400',
    units: [
      createUnit(
        're', 1, 'World Faiths & Philosophy of Religion', 'Year 7',
        'Core tenets of Christianity, Islam, Judaism, Hinduism, Buddhism, Sikhism, and philosophical arguments for God.',
        [
          {
            title: 'Introduction to world religions and belief systems',
            learningObjectives: ['Compare Abrahamic faiths (Judaism, Christianity, Islam) vs Dharmic traditions (Hinduism, Buddhism, Sikhism)', 'Understand worldview diversity'],
            pupilOutcome: 'Pupils categorize major world faiths and key founder figures.',
            keyWords: ['world faith', 'Abrahamic', 'Dharmic', 'monotheism', 'polytheism']
          },
          {
            title: 'Arguments for the existence of God',
            learningObjectives: ['Study Design Argument (Teleological) by William Paley', 'Examine First Cause Argument (Cosmological) by Thomas Aquinas'],
            pupilOutcome: 'Pupils evaluate philosophical arguments for and against God\'s existence.',
            keyWords: ['Teleological', 'Cosmological', 'William Paley', 'First Cause', 'God']
          },
          {
            title: 'The Problem of Evil and suffering',
            learningObjectives: ['Differentiate moral evil (human choices) vs natural evil (earthquakes, disease)', 'Examine theodicy explanations'],
            pupilOutcome: 'Pupils compose a philosophical response to the Problem of Evil.',
            keyWords: ['Problem of Evil', 'moral evil', 'natural evil', 'suffering', 'theodicy']
          },
          {
            title: 'Sacred texts and moral guidance',
            learningObjectives: ['Examine role of Bible, Qur\'an, Torah, and Bhagavad Gita in guiding moral decisions', 'Analyze scripture interpretations'],
            pupilOutcome: 'Pupils compare ethical guidance across sacred scripture extracts.',
            keyWords: ['sacred text', 'scripture', 'moral guidance', 'Bible', 'Qur\'an', 'Torah']
          },
          {
            title: 'Medical ethics and sanctity of life',
            learningObjectives: ['Understand Sanctity of Life vs Quality of Life arguments', 'Evaluate ethical stances on medical decisions'],
            pupilOutcome: 'Pupils debate ethical perspectives on bioethics and human life dignity.',
            keyWords: ['sanctity of life', 'quality of life', 'medical ethics', 'bioethics', 'dignity']
          }
        ]
      )
    ]
  },

  // 14. PSHE & CITIZENSHIP
  {
    slug: 'pshe',
    title: 'PSHE & Citizenship',
    keyStageSlug: 'ks3',
    description: '100% KS3 PSHE & UK Citizenship (Wellbeing, Online Safety, UK Legal System, Financial Literacy & Careers)',
    iconName: 'ShieldCheck',
    colourClass: 'bg-emerald-600/10 text-emerald-700 border-emerald-300 dark:text-emerald-400',
    units: [
      createUnit(
        'pshe', 1, 'UK Democracy, Parliament and The Legal System', 'Year 8',
        'House of Commons vs House of Lords, how laws are made, voting systems, civil liberties, and judiciary courts.',
        [
          {
            title: 'Structure of UK Parliament: Commons, Lords, Crown',
            learningObjectives: ['Explain roles of House of Commons (elected MPs), House of Lords, and Monarch', 'Understand parliamentary democracy'],
            pupilOutcome: 'Pupils diagram the three parts of the UK Parliament.',
            keyWords: ['Parliament', 'House of Commons', 'House of Lords', 'MP', 'democracy']
          },
          {
            title: 'How a bill becomes a law',
            learningObjectives: ['Trace legislation stages: First Reading, Second Reading, Committee, Report, Third Reading, Royal Assent', 'Role of debate'],
            pupilOutcome: 'Pupils map the step-by-step pathway of a bill becoming an Act of Parliament.',
            keyWords: ['bill', 'legislation', 'Act of Parliament', 'Royal Assent', 'debate']
          },
          {
            title: 'Role of MPs and representing constituents',
            learningObjectives: ['Explain how MPs represent constituency local interests in Westminster', 'Understand general elections and First-Past-The-Post voting'],
            pupilOutcome: 'Pupils simulate writing a letter to an MP advocating for community change.',
            keyWords: ['MP', 'constituency', 'general election', 'representation', 'voting']
          },
          {
            title: 'The UK legal system and judiciary courts',
            learningObjectives: ['Compare Criminal Law vs Civil Law', 'Differentiate Magistrates\' Court and Crown Court'],
            pupilOutcome: 'Pupils compare trial procedures in Magistrates\' and Crown Courts.',
            keyWords: ['legal system', 'criminal law', 'civil law', 'Crown Court', 'magistrate']
          },
          {
            title: 'Human rights, civil liberties and active citizenship',
            learningObjectives: ['Study Universal Declaration of Human Rights and UK Equality Act 2010', 'Explore ways to engage in active citizenship'],
            pupilOutcome: 'Pupils design an active citizenship campaign addressing local issues.',
            keyWords: ['human rights', 'Equality Act', 'civil liberties', 'active citizenship', 'campaign']
          }
        ]
      )
    ]
  }
];
