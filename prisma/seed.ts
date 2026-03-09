import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";

  const existingAdmin = await db.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await db.user.create({
      data: {
        email: adminEmail,
        passwordHash: await hash(adminPassword, 12),
        role: "admin",
        subscriptionTier: "premium",
      },
    });
    console.log(`Created admin user: ${adminEmail}`);
  }

  try {
    await db.$executeRaw`UPDATE "User" SET "subscriptionTier" = 'free' WHERE "subscriptionTier" IS NULL OR "subscriptionTier" = ''`;
    console.log("Updated existing users to free tier");
  } catch (e) {
    console.log("Note: User tier update skipped (may already be set)");
  }

  const categories = [
    { slug: "history", name: "Canadian History", icon: "🏛️", description: "Explore Canada's rich history", color: "bg-primary/10 text-primary" },
    { slug: "rights", name: "Rights & Responsibilities", icon: "⚖️", description: "Learn about rights and duties", color: "bg-success/10 text-success" },
    { slug: "government", name: "Government & Democracy", icon: "🏛️", description: "Understand Canada's government", color: "bg-canada-red/10 text-canada-red" },
    { slug: "geography", name: "Geography & Regions", icon: "🗺️", description: "Know Canada's provinces", color: "bg-warning/10 text-warning" },
    { slug: "symbols", name: "Symbols & Anthem", icon: "🍁", description: "Canadian symbols", color: "bg-accent/10 text-accent" },
    { slug: "economy", name: "Canadian Economy & Industry", icon: "💼", description: "Canada's economy", color: "bg-primary/10 text-primary" },
    { slug: "culture", name: "Canadian Culture & Society", icon: "🎭", description: "Explore Canadian culture and multiculturalism", color: "bg-primary/10 text-primary" },
  ];

  for (const cat of categories) {
    await db.category.upsert({
      where: { slug: cat.slug },
      create: cat,
      update: { name: cat.name, description: cat.description, icon: cat.icon, color: cat.color },
    });
  }

  const historyCat = await db.category.findUniqueOrThrow({ where: { slug: "history" } });
  const rightsCat = await db.category.findUniqueOrThrow({ where: { slug: "rights" } });
  const govCat = await db.category.findUniqueOrThrow({ where: { slug: "government" } });
  const geoCat = await db.category.findUniqueOrThrow({ where: { slug: "geography" } });
  const symCat = await db.category.findUniqueOrThrow({ where: { slug: "symbols" } });

  const historyQuestions = [
    { type: "single" as const, question: "In what year did Canada become a country through Confederation?", options: ["1776", "1812", "1867", "1901"], correctAnswer: "1867", explanation: "Canada became a country on July 1, 1867.", topic: "Confederation", difficulty: "Easy" },
    { type: "boolean" as const, question: "Sir John A. Macdonald was Canada's first Prime Minister.", options: ["True", "False"], correctAnswer: "True", explanation: "Sir John A. Macdonald served as Canada's first Prime Minister.", topic: "Prime Ministers", difficulty: "Easy" },
    { type: "multiple" as const, question: "Which were original provinces at Confederation in 1867?", options: ["Ontario", "British Columbia", "Quebec", "Nova Scotia", "Alberta"], correctAnswer: ["Ontario", "Quebec", "Nova Scotia"], explanation: "Ontario, Quebec, Nova Scotia, and New Brunswick.", topic: "Confederation", difficulty: "Medium" },
    { type: "fill" as const, question: "The Canadian Charter of Rights and Freedoms became part of the Constitution in the year ____.", correctAnswer: "1982", explanation: "Enacted as part of the Constitution Act, 1982.", topic: "Constitution", difficulty: "Medium" },
    { type: "single" as const, question: "Which war is often considered a defining moment for Canadian national identity?", options: ["War of 1812", "World War I", "World War II", "Korean War"], correctAnswer: "World War I", explanation: "World War I, particularly Vimy Ridge.", topic: "Military History", difficulty: "Medium" },
    { type: "single" as const, question: "What is the significance of the Battle of Vimy Ridge?", options: ["Canada's first military defeat", "Defining moment of Canadian national identity", "Ended World War II", "Fought on Canadian soil"], correctAnswer: "Defining moment of Canadian national identity", explanation: "First time all four Canadian divisions fought together.", topic: "Military History", difficulty: "Medium" },
    { type: "boolean" as const, question: "The Hudson's Bay Company played an important role in Canada's early history.", options: ["True", "False"], correctAnswer: "True", explanation: "Founded in 1670, instrumental in fur trade.", topic: "Early History", difficulty: "Easy" },
    { type: "single" as const, question: "Who are the Métis people?", options: ["French settlers", "A distinct people of mixed Indigenous and European ancestry", "Original inhabitants of Newfoundland", "British loyalists"], correctAnswer: "A distinct people of mixed Indigenous and European ancestry", explanation: "Distinct Indigenous people with mixed ancestry.", topic: "Indigenous Peoples", difficulty: "Easy" },
    { type: "single" as const, question: "When did women in Canada first gain the right to vote in federal elections?", options: ["1867", "1900", "1918", "1960"], correctAnswer: "1918", explanation: "Most Canadian women gained the right in 1918.", topic: "Rights History", difficulty: "Hard" },
    { type: "fill" as const, question: "Canada's national day, celebrated on July 1, is called ______ Day.", correctAnswer: "Canada", explanation: "Canada Day marks the anniversary of Confederation.", topic: "National Identity", difficulty: "Easy" },
    { type: "single" as const, question: "Which document did the British Parliament pass in 1982 that patriated the Canadian Constitution?", options: ["British North America Act", "Constitution Act, 1982", "Statute of Westminster", "Charter of Rights"], correctAnswer: "Constitution Act, 1982", explanation: "The Constitution Act, 1982 patriated the Constitution and included the Charter.", topic: "Constitution", difficulty: "Hard" },
    { type: "single" as const, question: "In which year did Indigenous people in Canada gain the right to vote in federal elections without losing status?", options: ["1948", "1960", "1982", "1996"], correctAnswer: "1960", explanation: "Indigenous people gained the right to vote federally in 1960.", topic: "Rights History", difficulty: "Hard" },
    { type: "multiple" as const, question: "Which of the following are responsibilities of Canadian citizenship?", options: ["Obeying the law", "Serving in the military", "Voting in elections", "Helping others in the community"], correctAnswer: ["Obeying the law", "Voting in elections", "Helping others in the community"], explanation: "Serving in the military is voluntary, not a citizenship responsibility.", topic: "Responsibilities", difficulty: "Hard" },
  ];

  const rightsQuestions = [
    { type: "single" as const, question: "What document protects the rights and freedoms of Canadians?", options: ["Magna Carta", "Canadian Charter of Rights and Freedoms", "Bill of Rights", "Constitution Act of 1867"], correctAnswer: "Canadian Charter of Rights and Freedoms", explanation: "Part of the Constitution Act of 1982.", topic: "Charter", difficulty: "Easy" },
    { type: "multiple" as const, question: "Which are fundamental freedoms protected by the Charter?", options: ["Freedom of religion", "Freedom to own property", "Freedom of expression", "Freedom of peaceful assembly"], correctAnswer: ["Freedom of religion", "Freedom of expression", "Freedom of peaceful assembly"], explanation: "Property rights are not explicitly protected.", topic: "Charter", difficulty: "Medium" },
    { type: "boolean" as const, question: "Canadian citizens have the right to enter, remain in, and leave Canada.", options: ["True", "False"], correctAnswer: "True", explanation: "Section 6 guarantees mobility rights.", topic: "Mobility Rights", difficulty: "Easy" },
    { type: "single" as const, question: "What is one responsibility of Canadian citizenship?", options: ["Serving in the military", "Voting in elections", "Speaking both languages", "Owning property"], correctAnswer: "Voting in elections", explanation: "Voting is both a right and responsibility.", topic: "Responsibilities", difficulty: "Easy" },
    { type: "single" as const, question: "At what age can Canadian citizens vote in federal elections?", options: ["16", "18", "19", "21"], correctAnswer: "18", explanation: "Citizens 18 or older on election day.", topic: "Voting", difficulty: "Easy" },
    { type: "fill" as const, question: "In Canada, men and women are equal under the ____.", correctAnswer: "law", explanation: "Section 15 guarantees equality rights.", topic: "Equality", difficulty: "Easy" },
    { type: "boolean" as const, question: "Obeying Canadian laws is optional for permanent residents.", options: ["True", "False"], correctAnswer: "False", explanation: "All people in Canada must obey laws.", topic: "Responsibilities", difficulty: "Easy" },
    { type: "single" as const, question: "Which right allows Canadians to practice any religion or no religion?", options: ["Equality rights", "Freedom of conscience and religion", "Mobility rights", "Legal rights"], correctAnswer: "Freedom of conscience and religion", explanation: "Protected under Section 2 of the Charter.", topic: "Charter", difficulty: "Medium" },
    { type: "single" as const, question: "Under Section 33 of the Charter, what can Parliament or a legislature do?", options: ["Abolish the Charter", "Override certain Charter rights with the notwithstanding clause", "Appoint judges", "Change the Constitution unilaterally"], correctAnswer: "Override certain Charter rights with the notwithstanding clause", explanation: "The notwithstanding clause allows temporary override of some rights.", topic: "Charter", difficulty: "Hard" },
    { type: "fill" as const, question: "The right to life, liberty, and security of the person is protected under Section ___ of the Charter.", correctAnswer: "7", explanation: "Section 7 guarantees fundamental justice rights.", topic: "Legal Rights", difficulty: "Hard" },
  ];

  const governmentQuestions = [
    { type: "single" as const, question: "What type of government does Canada have?", options: ["Republic", "Constitutional monarchy", "Direct democracy", "Theocracy"], correctAnswer: "Constitutional monarchy", explanation: "Canada is a constitutional monarchy.", topic: "System of Government", difficulty: "Easy" },
    { type: "single" as const, question: "Who is the head of state in Canada?", options: ["Prime Minister", "Governor General", "The Sovereign (King/Queen)", "Chief Justice"], correctAnswer: "The Sovereign (King/Queen)", explanation: "The King or Queen is head of state.", topic: "Head of State", difficulty: "Easy" },
    { type: "single" as const, question: "How many provinces and territories does Canada have?", options: ["10 provinces and 2 territories", "13 provinces", "10 provinces and 3 territories", "12 provinces and 1 territory"], correctAnswer: "10 provinces and 3 territories", explanation: "Yukon, NWT, and Nunavut.", topic: "Geography & Government", difficulty: "Easy" },
    { type: "boolean" as const, question: "The Senate is elected by the people of Canada.", options: ["True", "False"], correctAnswer: "False", explanation: "Senators are appointed.", topic: "Parliament", difficulty: "Medium" },
    { type: "fill" as const, question: "The three branches of government are the Executive, the Legislative, and the ______.", correctAnswer: "Judicial", explanation: "Executive, Legislative, Judicial.", topic: "System of Government", difficulty: "Medium" },
    { type: "single" as const, question: "What are the three parts of Parliament?", options: ["PM, Cabinet, Courts", "Sovereign, Senate, House of Commons", "GG, Premier, Senate", "Commons, Supreme Court, Senate"], correctAnswer: "Sovereign, Senate, House of Commons", explanation: "Sovereign, Senate, House of Commons.", topic: "Parliament", difficulty: "Medium" },
    { type: "single" as const, question: "How are Members of Parliament chosen?", options: ["Appointed by PM", "Elected by voters in their riding", "Appointed by GG", "Chosen by parties"], correctAnswer: "Elected by voters in their riding", explanation: "Elected in their electoral district.", topic: "Elections", difficulty: "Easy" },
    { type: "single" as const, question: "What is the maximum term length for the House of Commons before an election must be called?", options: ["3 years", "4 years", "5 years", "6 years"], correctAnswer: "5 years", explanation: "The Constitution sets a maximum of 5 years.", topic: "Parliament", difficulty: "Hard" },
    { type: "single" as const, question: "Who has the power to dissolve Parliament and call an election?", options: ["The Prime Minister", "The Chief Electoral Officer", "The Governor General", "The Speaker of the House"], correctAnswer: "The Governor General", explanation: "The GG acts on the PM's advice to dissolve Parliament.", topic: "Parliament", difficulty: "Hard" },
    { type: "fill" as const, question: "A bill must receive _____ in both the House of Commons and Senate before becoming law.", correctAnswer: "Royal Assent", explanation: "Royal Assent is the final step before a bill becomes law.", topic: "Parliament", difficulty: "Hard" },
  ];

  const geographyQuestions = [
    { type: "single" as const, question: "What is the capital of Canada?", options: ["Toronto", "Montreal", "Ottawa", "Vancouver"], correctAnswer: "Ottawa", explanation: "Ottawa is the national capital.", topic: "Provinces", difficulty: "Easy" },
    { type: "single" as const, question: "Which province is the largest by area?", options: ["Ontario", "Quebec", "British Columbia", "Alberta"], correctAnswer: "Quebec", explanation: "Quebec is the largest province by land area.", topic: "Provinces", difficulty: "Medium" },
    { type: "single" as const, question: "Which territory was created in 1999?", options: ["Yukon", "Northwest Territories", "Nunavut", "Labrador"], correctAnswer: "Nunavut", explanation: "Nunavut became a territory on April 1, 1999.", topic: "Territories", difficulty: "Hard" },
    { type: "fill" as const, question: "The _____ Ocean borders Canada to the west.", correctAnswer: "Pacific", explanation: "British Columbia borders the Pacific Ocean.", topic: "Geography", difficulty: "Easy" },
  ];

  const economyQuestions = [
    { type: "single" as const, question: "What is Canada's largest trading partner?", options: ["China", "United Kingdom", "United States", "Mexico"], correctAnswer: "United States", explanation: "The US is Canada's largest trading partner.", topic: "Trade", difficulty: "Easy" },
    { type: "single" as const, question: "Which sector employs the most Canadians?", options: ["Manufacturing", "Natural resources", "Services", "Agriculture"], correctAnswer: "Services", explanation: "The service sector employs about 75% of Canadians.", topic: "Economy", difficulty: "Medium" },
    { type: "fill" as const, question: "Canada is a member of the _____ free trade agreement with the US and Mexico.", correctAnswer: "USMCA", explanation: "USMCA (United States-Mexico-Canada Agreement) replaced NAFTA.", topic: "Trade", difficulty: "Hard" },
    { type: "single" as const, question: "Which natural resource is Canada a major global exporter of?", options: ["Diamonds", "Oil and gas", "Timber", "All of the above"], correctAnswer: "All of the above", explanation: "Canada exports oil, gas, timber, minerals, and other natural resources.", topic: "Natural Resources", difficulty: "Easy" },
    { type: "boolean" as const, question: "NAFTA was replaced by the USMCA in 2020.", options: ["True", "False"], correctAnswer: "True", explanation: "USMCA came into force on July 1, 2020.", topic: "Trade", difficulty: "Medium" },
    { type: "single" as const, question: "What is one of Canada's key manufacturing industries?", options: ["Automotive", "Aerospace", "Pharmaceuticals", "All of the above"], correctAnswer: "All of the above", explanation: "Canada has strong automotive, aerospace, and pharmaceutical sectors.", topic: "Industry", difficulty: "Medium" },
    { type: "single" as const, question: "Which province is known for its oil sands industry?", options: ["Ontario", "Quebec", "Alberta", "British Columbia"], correctAnswer: "Alberta", explanation: "Alberta's oil sands are among the world's largest reserves.", topic: "Natural Resources", difficulty: "Easy" },
    { type: "fill" as const, question: "The _____ is Canada's central bank, responsible for monetary policy.", correctAnswer: "Bank of Canada", explanation: "The Bank of Canada manages inflation and the currency.", topic: "Economy", difficulty: "Medium" },
    { type: "single" as const, question: "What currency does Canada use?", options: ["US Dollar", "Canadian Dollar", "British Pound", "Euro"], correctAnswer: "Canadian Dollar", explanation: "The Canadian dollar (CAD) is the national currency.", topic: "Economy", difficulty: "Easy" },
    { type: "multiple" as const, question: "Which are major Canadian exports?", options: ["Automobiles", "Lumber", "Wheat", "Diamonds"], correctAnswer: ["Automobiles", "Lumber", "Wheat"], explanation: "Canada exports vehicles, lumber, wheat, and many other goods.", topic: "Trade", difficulty: "Medium" },
    { type: "single" as const, question: "Which organization helps protect workers' rights in Canada?", options: ["Labour unions", "Chambers of Commerce", "Stock exchanges", "Banks"], correctAnswer: "Labour unions", explanation: "Unions negotiate wages and working conditions.", topic: "Economy", difficulty: "Easy" },
    { type: "boolean" as const, question: "Canada has a mixed economy with both private and public sectors.", options: ["True", "False"], correctAnswer: "True", explanation: "Canada combines free-market enterprise with government services.", topic: "Economy", difficulty: "Easy" },
    { type: "single" as const, question: "Which province is a major hub for the film and television industry?", options: ["Alberta", "Ontario", "British Columbia", "Both Ontario and British Columbia"], correctAnswer: "Both Ontario and British Columbia", explanation: "Toronto and Vancouver are major production centres.", topic: "Industry", difficulty: "Hard" },
  ];

  const cultureQuestions = [
    { type: "single" as const, question: "What are the two official languages of Canada?", options: ["English and Spanish", "English and French", "French and German", "English and Indigenous"], correctAnswer: "English and French", explanation: "English and French are Canada's official languages.", topic: "Languages", difficulty: "Easy" },
    { type: "boolean" as const, question: "Canada is known for its policy of multiculturalism.", options: ["True", "False"], correctAnswer: "True", explanation: "Multiculturalism is a fundamental Canadian value.", topic: "Multiculturalism", difficulty: "Easy" },
    { type: "single" as const, question: "Which group of people are recognized as one of Canada's founding peoples?", options: ["French only", "British only", "Indigenous peoples, French, and British", "Americans"], correctAnswer: "Indigenous peoples, French, and British", explanation: "Canada recognizes three founding peoples.", topic: "Society", difficulty: "Medium" },
    { type: "single" as const, question: "In which province is French the only official language?", options: ["Ontario", "New Brunswick", "Quebec", "Manitoba"], correctAnswer: "Quebec", explanation: "Quebec's only official language is French.", topic: "Languages", difficulty: "Easy" },
    { type: "boolean" as const, question: "New Brunswick is the only officially bilingual province.", options: ["True", "False"], correctAnswer: "True", explanation: "New Brunswick has equal status for English and French.", topic: "Languages", difficulty: "Medium" },
    { type: "single" as const, question: "What does the Canadian Multiculturalism Act affirm?", options: ["English only", "Preservation of heritage languages and cultures", "Assimilation", "One culture for all"], correctAnswer: "Preservation of heritage languages and cultures", explanation: "The Act promotes diversity and cultural preservation.", topic: "Multiculturalism", difficulty: "Medium" },
    { type: "fill" as const, question: "The _____ peoples were the first to live in Canada.", correctAnswer: "Indigenous", explanation: "Indigenous peoples have lived in Canada for thousands of years.", topic: "Society", difficulty: "Easy" },
    { type: "single" as const, question: "Which Canadian city is known for its diverse cultural festivals?", options: ["Only Toronto", "Only Vancouver", "Many cities across Canada", "Only Montreal"], correctAnswer: "Many cities across Canada", explanation: "Cities across Canada celebrate diverse cultural festivals.", topic: "Multiculturalism", difficulty: "Easy" },
    { type: "multiple" as const, question: "Which are values shared by Canadians?", options: ["Equality", "Respect for cultural differences", "Hard work", "Helping others"], correctAnswer: ["Equality", "Respect for cultural differences", "Hard work", "Helping others"], explanation: "These are core Canadian values.", topic: "Society", difficulty: "Medium" },
    { type: "single" as const, question: "What is the significance of the potlatch in Indigenous culture?", options: ["A type of food", "A ceremonial feast and gift-giving", "A dance", "A language"], correctAnswer: "A ceremonial feast and gift-giving", explanation: "Potlatch is a traditional ceremony of many West Coast Indigenous peoples.", topic: "Society", difficulty: "Hard" },
    { type: "boolean" as const, question: "Canadian law requires employers to accommodate religious practices where possible.", options: ["True", "False"], correctAnswer: "True", explanation: "Human rights law protects religious freedom in the workplace.", topic: "Multiculturalism", difficulty: "Medium" },
    { type: "single" as const, question: "Which symbol represents Canada's bilingual nature?", options: ["The beaver", "The maple leaf", "The flag", "All official documents in both languages"], correctAnswer: "All official documents in both languages", explanation: "Federal services and documents are available in English and French.", topic: "Languages", difficulty: "Easy" },
    { type: "single" as const, question: "What does 'mosaic' often describe in Canadian society?", options: ["A type of art", "Different cultures coexisting while keeping their identity", "Assimilation", "A single culture"], correctAnswer: "Different cultures coexisting while keeping their identity", explanation: "Canada is often described as a cultural mosaic.", topic: "Multiculturalism", difficulty: "Medium" },
  ];

  const economyCat = await db.category.findUniqueOrThrow({ where: { slug: "economy" } });
  const cultureCat = await db.category.findUniqueOrThrow({ where: { slug: "culture" } });

  const quizData = [
    { slug: "canadian-history-basics", title: "Canadian History Basics", description: "Test your knowledge of Canada's history.", categoryId: historyCat.id, categoryIcon: "🏛️", difficulty: "Easy", timeLimit: 15, passRate: 78, avgScore: 72, featured: true, topics: ["Confederation", "Prime Ministers", "Military History"], questions: historyQuestions },
    { slug: "rights-and-freedoms", title: "Rights & Freedoms", description: "Explore the Canadian Charter.", categoryId: rightsCat.id, categoryIcon: "⚖️", difficulty: "Medium", timeLimit: 12, passRate: 72, avgScore: 68, featured: true, topics: ["Charter", "Mobility Rights", "Voting"], questions: rightsQuestions },
    { slug: "government-and-democracy", title: "Government & Democracy", description: "Learn how Canada's government works.", categoryId: govCat.id, categoryIcon: "🏛️", difficulty: "Medium", timeLimit: 10, passRate: 70, avgScore: 65, featured: true, topics: ["System of Government", "Parliament", "Elections"], questions: governmentQuestions },
    { slug: "geography-of-canada", title: "Geography of Canada", description: "Discover Canada's geography.", categoryId: geoCat.id, categoryIcon: "🗺️", difficulty: "Easy", timeLimit: 15, passRate: 80, avgScore: 75, featured: false, topics: ["Provinces", "Territories"], questions: geographyQuestions },
    { slug: "canadian-symbols", title: "Canadian Symbols & Anthem", description: "How well do you know Canada's symbols?", categoryId: symCat.id, categoryIcon: "🍁", difficulty: "Easy", timeLimit: 10, passRate: 85, avgScore: 80, featured: false, topics: ["Flag", "National Anthem"], questions: rightsQuestions.map((q, i) => ({ ...q, topic: "Symbols" })) },
    { slug: "canadian-economy-industry", title: "Canadian Economy & Industry", description: "Learn about Canada's economy and trade.", categoryId: economyCat.id, categoryIcon: "💼", difficulty: "Medium", timeLimit: 10, passRate: 70, avgScore: 65, featured: false, topics: ["Trade", "Economy"], questions: economyQuestions },
    { slug: "canadian-culture-society", title: "Canadian Culture & Society", description: "Discover Canadian culture and multiculturalism.", categoryId: cultureCat.id, categoryIcon: "🎭", difficulty: "Easy", timeLimit: 10, passRate: 85, avgScore: 80, featured: false, topics: ["Languages", "Multiculturalism", "Society"], questions: cultureQuestions },
    { slug: "advanced-citizenship", title: "Advanced Citizenship Prep", description: "Comprehensive quiz for the real exam.", categoryId: historyCat.id, categoryIcon: "🏛️", difficulty: "Hard", timeLimit: 30, passRate: 55, avgScore: 58, featured: true, topics: ["Canadian History", "Culture and Society", "Economy and Industry", "Geography and Regions", "Government and Democracy", "Rights and Responsibilities", "Symbols and Anthems"], questions: [...historyQuestions, ...rightsQuestions, ...governmentQuestions, ...geographyQuestions, ...economyQuestions, ...cultureQuestions].slice(0, 20) },
  ];

  for (const q of quizData) {
    const { questions, ...quizMeta } = q;
    const quiz = await db.quiz.upsert({
      where: { slug: quizMeta.slug },
      create: quizMeta,
      update: {},
    });
    const existingCount = await db.question.count({ where: { quizId: quiz.id } });
    const shouldAddMissing =
      (quizMeta.slug === "canadian-economy-industry" || quizMeta.slug === "canadian-culture-society") &&
      existingCount > 0 &&
      existingCount < questions.length;
    if (existingCount === 0 || shouldAddMissing) {
      const toCreate = shouldAddMissing ? questions.slice(existingCount) : questions;
      for (const qu of toCreate) {
        await db.question.create({
          data: {
            quizId: quiz.id,
            type: qu.type,
            question: qu.question,
            options: qu.options ?? undefined,
            correctAnswer: qu.correctAnswer as object,
            explanation: qu.explanation,
            topic: qu.topic,
            difficulty: qu.difficulty,
          },
        });
      }
    }
  }

  await db.quiz.updateMany({
    where: { slug: "advanced-citizenship" },
    data: {
      topics: ["Canadian History", "Culture and Society", "Economy and Industry", "Geography and Regions", "Government and Democracy", "Rights and Responsibilities", "Symbols and Anthems"],
    },
  });

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
