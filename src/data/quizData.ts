export interface Question {
  id: string;
  type: 'single' | 'multiple' | 'boolean' | 'fill' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  matchPairs?: { left: string; right: string }[];
  explanation: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryIcon: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionCount: number;
  timeLimit: number; // minutes
  passRate: number;
  avgScore: number;
  topics: string[];
  featured: boolean;
  questions: Question[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  quizCount: number;
  color: string;
}

export const categories: Category[] = [
  { id: 'history', name: 'Canadian History', icon: '🏛️', description: 'Explore Canada\'s rich history from Confederation to modern times', quizCount: 8, color: 'bg-primary/10 text-primary' },
  { id: 'rights', name: 'Rights & Responsibilities', icon: '⚖️', description: 'Learn about the rights and duties of Canadian citizens', quizCount: 6, color: 'bg-success/10 text-success' },
  { id: 'government', name: 'Government & Democracy', icon: '🏛️', description: 'Understand how Canada\'s government and democracy work', quizCount: 7, color: 'bg-canada-red/10 text-canada-red' },
  { id: 'geography', name: 'Geography & Regions', icon: '🗺️', description: 'Know Canada\'s provinces, territories, and natural features', quizCount: 5, color: 'bg-warning/10 text-warning' },
  { id: 'symbols', name: 'Symbols & Anthem', icon: '🍁', description: 'Canadian symbols, the flag, and national anthem', quizCount: 4, color: 'bg-accent/10 text-accent' },
  { id: 'economy', name: 'Economy & Industry', icon: '💼', description: 'Canada\'s economy, trade, and key industries', quizCount: 5, color: 'bg-primary/10 text-primary' },
];

const historyQuestions: Question[] = [
  {
    id: 'h1',
    type: 'single',
    question: 'In what year did Canada become a country through Confederation?',
    options: ['1776', '1812', '1867', '1901'],
    correctAnswer: '1867',
    explanation: 'Canada became a country on July 1, 1867, when the British North America Act united three colonies: Nova Scotia, New Brunswick, and the Province of Canada (Ontario and Quebec).',
    topic: 'Confederation',
    difficulty: 'Easy',
  },
  {
    id: 'h2',
    type: 'boolean',
    question: 'Sir John A. Macdonald was Canada\'s first Prime Minister.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'Sir John A. Macdonald served as Canada\'s first Prime Minister from 1867 to 1873, and again from 1878 to 1891.',
    topic: 'Prime Ministers',
    difficulty: 'Easy',
  },
  {
    id: 'h3',
    type: 'multiple',
    question: 'Which of the following were original provinces at Confederation in 1867? (Select all that apply)',
    options: ['Ontario', 'British Columbia', 'Quebec', 'Nova Scotia', 'Alberta'],
    correctAnswer: ['Ontario', 'Quebec', 'Nova Scotia'],
    explanation: 'The original four provinces were Ontario, Quebec, Nova Scotia, and New Brunswick. British Columbia joined in 1871 and Alberta in 1905.',
    topic: 'Confederation',
    difficulty: 'Medium',
  },
  {
    id: 'h4',
    type: 'fill',
    question: 'The Canadian Charter of Rights and Freedoms became part of the Constitution in the year ____.',
    correctAnswer: '1982',
    explanation: 'The Canadian Charter of Rights and Freedoms was enacted as part of the Constitution Act, 1982, under Prime Minister Pierre Elliott Trudeau.',
    topic: 'Constitution',
    difficulty: 'Medium',
  },
  {
    id: 'h5',
    type: 'single',
    question: 'Which war is often considered a defining moment for Canadian national identity?',
    options: ['War of 1812', 'World War I', 'World War II', 'Korean War'],
    correctAnswer: 'World War I',
    explanation: 'World War I, particularly the Battle of Vimy Ridge in 1917, is often cited as a key moment when Canada emerged with a stronger sense of national identity.',
    topic: 'Military History',
    difficulty: 'Medium',
  },
  {
    id: 'h6',
    type: 'single',
    question: 'What is the significance of the Battle of Vimy Ridge?',
    options: [
      'It was Canada\'s first military defeat',
      'It is considered a defining moment of Canadian national identity',
      'It ended World War II',
      'It was fought on Canadian soil'
    ],
    correctAnswer: 'It is considered a defining moment of Canadian national identity',
    explanation: 'The Battle of Vimy Ridge (April 1917) was the first time all four Canadian divisions fought together. The victory is seen as a defining moment for Canada as a nation.',
    topic: 'Military History',
    difficulty: 'Medium',
  },
  {
    id: 'h7',
    type: 'boolean',
    question: 'The Hudson\'s Bay Company played an important role in Canada\'s early history.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'Founded in 1670, the Hudson\'s Bay Company was instrumental in the fur trade and exploration of Canada. It controlled vast territories and played a key role in Canadian commerce and settlement.',
    topic: 'Early History',
    difficulty: 'Easy',
  },
  {
    id: 'h8',
    type: 'single',
    question: 'Who are the Métis people?',
    options: [
      'French settlers who came to Quebec',
      'A distinct people of mixed Indigenous and European ancestry',
      'The original inhabitants of Newfoundland',
      'British loyalists who fled the American Revolution'
    ],
    correctAnswer: 'A distinct people of mixed Indigenous and European ancestry',
    explanation: 'The Métis are a distinct Indigenous people with roots in both Indigenous and European (mainly French) cultures. They developed their own language, culture, and way of life.',
    topic: 'Indigenous Peoples',
    difficulty: 'Easy',
  },
  {
    id: 'h9',
    type: 'single',
    question: 'When did women in Canada first gain the right to vote in federal elections?',
    options: ['1867', '1900', '1918', '1960'],
    correctAnswer: '1918',
    explanation: 'Most Canadian women gained the right to vote in federal elections in 1918. However, it took longer for all women, including Indigenous women, to gain full voting rights.',
    topic: 'Rights History',
    difficulty: 'Hard',
  },
  {
    id: 'h10',
    type: 'fill',
    question: 'Canada\'s national day, celebrated on July 1, is called ______ Day.',
    correctAnswer: 'Canada',
    explanation: 'Canada Day is celebrated on July 1 each year. It marks the anniversary of Confederation in 1867 when Canada became a self-governing dominion.',
    topic: 'National Identity',
    difficulty: 'Easy',
  },
];

const rightsQuestions: Question[] = [
  {
    id: 'r1',
    type: 'single',
    question: 'What document protects the rights and freedoms of Canadians?',
    options: [
      'The Magna Carta',
      'The Canadian Charter of Rights and Freedoms',
      'The Bill of Rights',
      'The Constitution Act of 1867'
    ],
    correctAnswer: 'The Canadian Charter of Rights and Freedoms',
    explanation: 'The Canadian Charter of Rights and Freedoms, part of the Constitution Act of 1982, guarantees fundamental rights and freedoms to all people in Canada.',
    topic: 'Charter',
    difficulty: 'Easy',
  },
  {
    id: 'r2',
    type: 'multiple',
    question: 'Which of the following are fundamental freedoms protected by the Charter? (Select all that apply)',
    options: ['Freedom of religion', 'Freedom to own property', 'Freedom of expression', 'Freedom of peaceful assembly'],
    correctAnswer: ['Freedom of religion', 'Freedom of expression', 'Freedom of peaceful assembly'],
    explanation: 'The Charter protects fundamental freedoms including religion, thought, expression, press, peaceful assembly, and association. Property rights are not explicitly protected in the Charter.',
    topic: 'Charter',
    difficulty: 'Medium',
  },
  {
    id: 'r3',
    type: 'boolean',
    question: 'Canadian citizens have the right to enter, remain in, and leave Canada.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'Section 6 of the Charter guarantees mobility rights, including the right of every citizen to enter, remain in, and leave Canada.',
    topic: 'Mobility Rights',
    difficulty: 'Easy',
  },
  {
    id: 'r4',
    type: 'single',
    question: 'What is one responsibility of Canadian citizenship?',
    options: [
      'Serving in the military',
      'Voting in elections',
      'Speaking both English and French',
      'Owning property'
    ],
    correctAnswer: 'Voting in elections',
    explanation: 'Voting in elections is considered both a right and a responsibility of Canadian citizens. While not legally mandatory, it is strongly encouraged as a civic duty.',
    topic: 'Responsibilities',
    difficulty: 'Easy',
  },
  {
    id: 'r5',
    type: 'single',
    question: 'At what age can Canadian citizens vote in federal elections?',
    options: ['16', '18', '19', '21'],
    correctAnswer: '18',
    explanation: 'Canadian citizens who are 18 years of age or older on election day have the right to vote in federal elections.',
    topic: 'Voting',
    difficulty: 'Easy',
  },
  {
    id: 'r6',
    type: 'fill',
    question: 'In Canada, men and women are equal under the ____.',
    correctAnswer: 'law',
    explanation: 'Section 15 of the Charter guarantees equality rights. Every individual is equal before and under the law without discrimination.',
    topic: 'Equality',
    difficulty: 'Easy',
  },
  {
    id: 'r7',
    type: 'boolean',
    question: 'Obeying Canadian laws is optional for permanent residents.',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'All people in Canada, including citizens, permanent residents, and visitors, must obey Canadian laws. This is a fundamental responsibility.',
    topic: 'Responsibilities',
    difficulty: 'Easy',
  },
  {
    id: 'r8',
    type: 'single',
    question: 'Which right allows Canadians to practice any religion or no religion at all?',
    options: ['Equality rights', 'Freedom of conscience and religion', 'Mobility rights', 'Legal rights'],
    correctAnswer: 'Freedom of conscience and religion',
    explanation: 'Freedom of conscience and religion is one of the fundamental freedoms protected under Section 2 of the Charter. It allows Canadians to follow any religion or no religion.',
    topic: 'Charter',
    difficulty: 'Medium',
  },
];

const governmentQuestions: Question[] = [
  {
    id: 'g1',
    type: 'single',
    question: 'What type of government does Canada have?',
    options: [
      'Republic',
      'Constitutional monarchy',
      'Direct democracy',
      'Theocracy'
    ],
    correctAnswer: 'Constitutional monarchy',
    explanation: 'Canada is a constitutional monarchy, a parliamentary democracy, and a federation. The sovereign (King or Queen) is the head of state, represented by the Governor General.',
    topic: 'System of Government',
    difficulty: 'Easy',
  },
  {
    id: 'g2',
    type: 'single',
    question: 'Who is the head of state in Canada?',
    options: ['The Prime Minister', 'The Governor General', 'The Sovereign (King/Queen)', 'The Chief Justice'],
    correctAnswer: 'The Sovereign (King/Queen)',
    explanation: 'The King or Queen of Canada is the head of state. The Governor General represents the sovereign in Canada, and the Prime Minister is the head of government.',
    topic: 'Head of State',
    difficulty: 'Easy',
  },
  {
    id: 'g3',
    type: 'single',
    question: 'How many provinces and territories does Canada have?',
    options: ['10 provinces and 2 territories', '13 provinces', '10 provinces and 3 territories', '12 provinces and 1 territory'],
    correctAnswer: '10 provinces and 3 territories',
    explanation: 'Canada has 10 provinces and 3 territories. The territories are Yukon, Northwest Territories, and Nunavut.',
    topic: 'Geography & Government',
    difficulty: 'Easy',
  },
  {
    id: 'g4',
    type: 'boolean',
    question: 'The Senate is elected by the people of Canada.',
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'Senators are appointed by the Governor General on the advice of the Prime Minister. The House of Commons is the elected chamber of Parliament.',
    topic: 'Parliament',
    difficulty: 'Medium',
  },
  {
    id: 'g5',
    type: 'fill',
    question: 'The three branches of government are the Executive, the Legislative, and the ______.',
    correctAnswer: 'Judicial',
    explanation: 'Canada\'s government has three branches: the Executive (carries out laws), the Legislative (makes laws — Parliament), and the Judicial (interprets and applies laws — courts).',
    topic: 'System of Government',
    difficulty: 'Medium',
  },
  {
    id: 'g6',
    type: 'single',
    question: 'What are the three parts of Parliament?',
    options: [
      'The Prime Minister, the Cabinet, and the Courts',
      'The Sovereign, the Senate, and the House of Commons',
      'The Governor General, the Premier, and the Senate',
      'The House of Commons, the Supreme Court, and the Senate'
    ],
    correctAnswer: 'The Sovereign, the Senate, and the House of Commons',
    explanation: 'Parliament consists of the Sovereign (represented by the Governor General), the Senate (upper house), and the House of Commons (lower house).',
    topic: 'Parliament',
    difficulty: 'Medium',
  },
  {
    id: 'g7',
    type: 'single',
    question: 'How are Members of Parliament (MPs) chosen?',
    options: ['Appointed by the Prime Minister', 'Elected by voters in their riding', 'Appointed by the Governor General', 'Chosen by political parties'],
    correctAnswer: 'Elected by voters in their riding',
    explanation: 'Members of Parliament are elected by voters in their electoral district (riding) during federal elections. Each riding elects one MP to represent them in the House of Commons.',
    topic: 'Elections',
    difficulty: 'Easy',
  },
];

export const quizzes: Quiz[] = [
  {
    id: 'canadian-history-basics',
    title: 'Canadian History Basics',
    description: 'Test your knowledge of Canada\'s history from Confederation to modern times. This quiz covers key events, important figures, and defining moments that shaped the nation.',
    category: 'history',
    categoryIcon: '🏛️',
    difficulty: 'Easy',
    questionCount: 10,
    timeLimit: 15,
    passRate: 78,
    avgScore: 72,
    topics: ['Confederation', 'Prime Ministers', 'Military History', 'Indigenous Peoples', 'National Identity'],
    featured: true,
    questions: historyQuestions,
  },
  {
    id: 'rights-and-freedoms',
    title: 'Rights & Freedoms',
    description: 'Explore the Canadian Charter of Rights and Freedoms. This quiz tests your understanding of the fundamental rights, freedoms, and responsibilities of Canadian citizens.',
    category: 'rights',
    categoryIcon: '⚖️',
    difficulty: 'Medium',
    questionCount: 8,
    timeLimit: 12,
    passRate: 72,
    avgScore: 68,
    topics: ['Charter', 'Mobility Rights', 'Voting', 'Equality', 'Responsibilities'],
    featured: true,
    questions: rightsQuestions,
  },
  {
    id: 'government-and-democracy',
    title: 'Government & Democracy',
    description: 'Learn how Canada\'s federal government works, from Parliament to the courts. This quiz covers the structure of government, elections, and democratic processes.',
    category: 'government',
    categoryIcon: '🏛️',
    difficulty: 'Medium',
    questionCount: 7,
    timeLimit: 10,
    passRate: 70,
    avgScore: 65,
    topics: ['System of Government', 'Head of State', 'Parliament', 'Elections'],
    featured: true,
    questions: governmentQuestions,
  },
  {
    id: 'geography-of-canada',
    title: 'Geography of Canada',
    description: 'Discover Canada\'s diverse geography, provinces, territories, and natural landmarks. Test your knowledge of the second-largest country in the world.',
    category: 'geography',
    categoryIcon: '🗺️',
    difficulty: 'Easy',
    questionCount: 10,
    timeLimit: 15,
    passRate: 80,
    avgScore: 75,
    topics: ['Provinces', 'Territories', 'Capital Cities', 'Natural Features'],
    featured: false,
    questions: historyQuestions.map((q, i) => ({ ...q, id: `geo${i}`, topic: 'Geography' })),
  },
  {
    id: 'canadian-symbols',
    title: 'Canadian Symbols & Anthem',
    description: 'How well do you know Canada\'s national symbols? From the maple leaf to the national anthem, test your knowledge of what makes Canada unique.',
    category: 'symbols',
    categoryIcon: '🍁',
    difficulty: 'Easy',
    questionCount: 8,
    timeLimit: 10,
    passRate: 85,
    avgScore: 80,
    topics: ['Flag', 'National Anthem', 'Coat of Arms', 'National Symbols'],
    featured: false,
    questions: rightsQuestions.map((q, i) => ({ ...q, id: `sym${i}`, topic: 'Symbols' })),
  },
  {
    id: 'advanced-citizenship',
    title: 'Advanced Citizenship Prep',
    description: 'A comprehensive and challenging quiz covering all aspects of the Canadian citizenship test. Designed for those ready to take the real exam.',
    category: 'history',
    categoryIcon: '🏛️',
    difficulty: 'Hard',
    questionCount: 20,
    timeLimit: 30,
    passRate: 55,
    avgScore: 58,
    topics: ['History', 'Government', 'Rights', 'Geography', 'Symbols', 'Economy'],
    featured: true,
    questions: [...historyQuestions, ...rightsQuestions, ...governmentQuestions].slice(0, 20),
  },
];

export function getQuizById(id: string): Quiz | undefined {
  return quizzes.find(q => q.id === id);
}

export function getQuizzesByCategory(categoryId: string): Quiz[] {
  return quizzes.filter(q => q.category === categoryId);
}

export function getFeaturedQuizzes(): Quiz[] {
  return quizzes.filter(q => q.featured);
}
