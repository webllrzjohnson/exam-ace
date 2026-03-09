import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const facts = [
  {
    fact: "Canadian Confederation occurred on July 1, 1867, when three British North American provinces—the Province of Canada, Nova Scotia, and New Brunswick—united into the Dominion of Canada.",
    category: "History",
    source: "Government of Canada",
    sourceUrl: "https://www.canada.ca/en/canadian-heritage/services/history-canada.html",
  },
  {
    fact: "Canada's national flag was officially adopted on January 28, 1965, and first raised on February 15, 1965—a date now celebrated annually as National Flag of Canada Day.",
    category: "Symbols",
    source: "Government of Canada",
    sourceUrl: "https://www.canada.ca/en/services/culture/canadian-identity-society/anthems-symbols/national-flag.html",
  },
  {
    fact: "Sir Frederick Banting and Charles Best discovered insulin at the University of Toronto in 1921, revolutionizing diabetes treatment and saving millions of lives worldwide.",
    category: "Science",
    source: "The Canadian Encyclopedia",
    sourceUrl: "https://thecanadianencyclopedia.ca/en/article/sir-frederick-grant-banting",
  },
  {
    fact: "The Canadian Charter of Rights and Freedoms was proclaimed into force on April 17, 1982, as part of the Constitution Act, 1982, protecting fundamental rights and freedoms.",
    category: "Government",
    source: "Government of Canada",
    sourceUrl: "https://justice.canada.ca/eng/csj-sjc/rfc-dlc/ccrf-ccdl/learn-apprend.html",
  },
  {
    fact: "Canada is the second-largest country in the world by total area, measuring nearly 10 million square kilometers.",
    category: "Geography",
    source: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/Geography_of_Canada",
  },
  {
    fact: "Canada has the longest coastline in the world at 243,042 kilometres (151,019 miles).",
    category: "Geography",
    source: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/Geography_of_Canada",
  },
  {
    fact: "Canada consists of 10 provinces and 3 territories: Yukon, Northwest Territories, and Nunavut.",
    category: "Geography",
    source: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/Provinces_and_territories_of_Canada",
  },
  {
    fact: "The maple leaf has been a symbol of Canada since the 1700s when French colonists used it, and it appeared on military uniforms since the 1850s.",
    category: "Symbols",
    source: "Government of Canada",
    sourceUrl: "https://www.canada.ca/en/canadian-heritage/services/official-symbols-canada.html",
  },
  {
    fact: "Alexander Graham Bell, who lived in Canada, patented the first practical telephone on March 7, 1876.",
    category: "Science",
    source: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/Alexander_Graham_Bell",
  },
  {
    fact: "The House of Commons has 338 elected members representing electoral districts across Canada.",
    category: "Government",
    source: "Government of Canada",
    sourceUrl: "https://www.canada.ca/en/democratic-institutions/services/democracy-canada.html",
  },
  {
    fact: "The Senate has 105 appointed members who provide 'sober second thought' by reviewing bills before passage.",
    category: "Government",
    source: "Government of Canada",
    sourceUrl: "https://www.canada.ca/en/democratic-institutions/services/democracy-canada.html",
  },
  {
    fact: "Canada is a constitutional monarchy and parliamentary democracy founded on the rule of law and respect for rights and freedoms.",
    category: "Government",
    source: "Government of Canada",
    sourceUrl: "https://www.canada.ca/en/democratic-institutions/services/democracy-canada.html",
  },
  {
    fact: "2026 marks the 150th anniversary of the Indian Act, the primary document defining government interaction with First Nations.",
    category: "History",
    source: "Government of Canada",
    sourceUrl: "https://www.canada.ca/en/canadian-heritage/services/anniversaries-significance/2026.html",
  },
  {
    fact: "2026 marks the 150th anniversary of Treaty 6, signed by Crown representatives and Cree, Assiniboine, and Ojibwe leaders in Saskatchewan and Alberta.",
    category: "History",
    source: "Government of Canada",
    sourceUrl: "https://www.canada.ca/en/canadian-heritage/services/anniversaries-significance/2026.html",
  },
  {
    fact: "The Royal Canadian Legion was founded in 1926, celebrating its 100th anniversary in 2026.",
    category: "History",
    source: "Government of Canada",
    sourceUrl: "https://www.canada.ca/en/canadian-heritage/services/anniversaries-significance/2026.html",
  },
  {
    fact: "Montreal hosted Canada's first Olympics in 1976, celebrating its 50th anniversary in 2026.",
    category: "Sports",
    source: "Government of Canada",
    sourceUrl: "https://www.canada.ca/en/canadian-heritage/services/anniversaries-significance/2026.html",
  },
  {
    fact: "Before European contact, Canada had diverse Indigenous societies with populations estimated between 200,000 and 500,000 people speaking 300-450 languages.",
    category: "History",
    source: "The Canadian Encyclopedia",
    sourceUrl: "https://thecanadianencyclopedia.ca/en/timeline/100-great-events-in-canadian-history",
  },
  {
    fact: "The beaver is an official national symbol of Canada, representing Canadian heritage.",
    category: "Symbols",
    source: "Government of Canada",
    sourceUrl: "https://www.canada.ca/en/canadian-heritage/services/official-symbols-canada.html",
  },
  {
    fact: "Ice hockey and lacrosse are Canada's official national sports.",
    category: "Sports",
    source: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/National_symbols_of_Canada",
  },
  {
    fact: "Canada's Coat of Arms was adopted by proclamation of King George V in 1921, featuring the motto 'A Mari Usque Ad Mare' ('From Sea to Sea').",
    category: "Symbols",
    source: "Government of Canada",
    sourceUrl: "https://www.canada.ca/en/canadian-heritage/services/official-symbols-canada.html",
  },
  {
    fact: "Frederick Banting became Canada's first Nobel Prize winner in medicine in 1923 at age 32, making him the youngest Nobel laureate in that category at the time.",
    category: "Science",
    source: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/Frederick_Banting",
  },
  {
    fact: "Only two Canadian provinces are landlocked: Alberta and Saskatchewan. The other eleven border one of three oceans.",
    category: "Geography",
    source: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/Geography_of_Canada",
  },
  {
    fact: "Canada shares the longest land border in the world with the United States at 8,891 kilometres (5,525 miles).",
    category: "Geography",
    source: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/Geography_of_Canada",
  },
  {
    fact: "The Maple Leaf Tartan is Canada's official tartan, displaying four colors reflecting the maple leaf's seasonal changes: green (spring), gold (early autumn), red (first frost), and brown (after falling).",
    category: "Symbols",
    source: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/National_symbols_of_Canada",
  },
  {
    fact: "The Canadian Charter of Rights and Freedoms guarantees seven categories of rights: fundamental freedoms, democratic rights, mobility rights, legal rights, equality rights, official language rights, and minority language educational rights.",
    category: "Government",
    source: "Government of Canada",
    sourceUrl: "https://justice.canada.ca/eng/csj-sjc/rfc-dlc/ccrf-ccdl/learn-apprend.html",
  },
  {
    fact: "Parliament consists of three parts: the Crown (represented by the Governor General), the Senate, and the House of Commons.",
    category: "Government",
    source: "Government of Canada",
    sourceUrl: "https://www.ourcommons.ca/procedure/our-procedure/ParliamentaryFramework/c_g_parliamentaryframework-e.html",
  },
  {
    fact: "Since 2016, an independent merit-based application process has been used for Senate appointments in Canada.",
    category: "Government",
    source: "Government of Canada",
    sourceUrl: "https://www.canada.ca/en/democratic-institutions/services/democracy-canada.html",
  },
  {
    fact: "The Prime Minister and Cabinet must maintain the confidence (support of a majority) of the House of Commons to stay in power.",
    category: "Government",
    source: "Government of Canada",
    sourceUrl: "https://www.canada.ca/en/democratic-institutions/services/democracy-canada.html",
  },
  {
    fact: "Upon Confederation in 1867, Canada had four provinces: Ontario, Quebec, Nova Scotia, and New Brunswick. Prince Edward Island joined in 1873.",
    category: "History",
    source: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/Canadian_Confederation",
  },
  {
    fact: "Canada is often divided into five regions: Atlantic Provinces, Central Canada (Quebec and Ontario), Prairie Provinces, West Coast (British Columbia), and the North.",
    category: "Geography",
    source: "Britannica",
    sourceUrl: "https://www.britannica.com/topic/List-of-Provinces-and-Territories-of-Canada",
  },
  {
    fact: "The name 'Canada' comes from the St. Lawrence Iroquoian word 'kanata,' meaning 'village' or 'settlement.'",
    category: "History",
    source: "The Canadian Encyclopedia",
    sourceUrl: "https://thecanadianencyclopedia.ca/en/article/name-of-canada",
  },
  {
    fact: "Sir Sandford Fleming, a Canadian engineer, invented the worldwide system of standard time zones in the 1870s.",
    category: "Science",
    source: "The Canadian Encyclopedia",
    sourceUrl: "https://thecanadianencyclopedia.ca/en/article/sir-sandford-fleming",
  },
  {
    fact: "The Métis are a distinct people of mixed Aboriginal and European ancestry, with the majority living in the Prairie provinces.",
    category: "Culture",
    source: "Government of Canada",
    sourceUrl: "https://www.rcaanc-cirnac.gc.ca/eng/1100100013785/1529102490303",
  },
  {
    fact: "Victoria Day is celebrated on the Monday preceding May 25th each year, marking the unofficial beginning of summer in Canada.",
    category: "Culture",
    source: "Government of Canada",
    sourceUrl: "https://www.canada.ca/en/canadian-heritage/services/important-commemorative-days/victoria-day.html",
  },
  {
    fact: "Halifax, Nova Scotia, is home to Canada's largest east coast port and the country's largest naval base.",
    category: "Geography",
    source: "Government of Canada",
    sourceUrl: "https://www.canada.ca/en/services/culture/canadian-identity-society/maritime-history.html",
  },
  {
    fact: "The Supreme Court of Canada consists of nine judges appointed by the Governor General on the advice of the Prime Minister.",
    category: "Government",
    source: "Supreme Court of Canada",
    sourceUrl: "https://www.scc-csc.ca/about-apropos/index-eng.aspx",
  },
  {
    fact: "Magna Carta, signed in 1215 in England, is the foundation of Canadian parliamentary democracy and established that the king was subject to the law.",
    category: "History",
    source: "Government of Canada",
    sourceUrl: "https://www.canada.ca/en/canadian-heritage/services/magna-carta.html",
  },
  {
    fact: "In 1840, Upper and Lower Canada were united as the Province of Canada, following recommendations from Lord Durham's report.",
    category: "History",
    source: "The Canadian Encyclopedia",
    sourceUrl: "https://thecanadianencyclopedia.ca/en/article/act-of-union",
  },
  {
    fact: "The House of Commons recognized in 2006 that the Quebecois form a nation within a united Canada.",
    category: "History",
    source: "Government of Canada",
    sourceUrl: "https://www.parl.ca/DocumentViewer/en/39-1/house/sitting-87/hansard",
  },
  {
    fact: "Sir John A. Macdonald was Canada's first Prime Minister and a Father of Confederation. Parliament has recognized January 11 as Sir John A. Macdonald Day.",
    category: "History",
    source: "Government of Canada",
    sourceUrl: "https://www.canada.ca/en/canadian-heritage/services/important-commemorative-days/sir-john-macdonald-day.html",
  },
  {
    fact: "The Royal Canadian Mounted Police (RCMP) enforce federal laws throughout Canada and serve as the provincial police in all provinces except Ontario and Quebec.",
    category: "Government",
    source: "RCMP",
    sourceUrl: "https://www.rcmp-grc.gc.ca/en/about-the-rcmp",
  },
  {
    fact: "Canadian law is derived from laws passed by Parliament and provincial legislatures, English common law, the French civil code, and the unwritten constitution inherited from the United Kingdom.",
    category: "Government",
    source: "Department of Justice Canada",
    sourceUrl: "https://www.justice.gc.ca/eng/csj-sjc/just/index.html",
  },
  {
    fact: "The Peace and Friendship Treaties began in 1725, marking their 300th anniversary in 2026, and ended Dummer's War.",
    category: "History",
    source: "Government of Canada",
    sourceUrl: "https://www.canada.ca/en/canadian-heritage/services/anniversaries-significance/2026.html",
  },
  {
    fact: "The Red River Métis Self-Government Treaty, introduced in 2026, is the first self-government treaty with a Métis government in Canada.",
    category: "History",
    source: "Government of Canada",
    sourceUrl: "https://www.canada.ca/en/crown-indigenous-relations-northern-affairs/news/2026/02/canada-introduces-bill-for-self-government-treaty-with-the-manitoba-metis-federation.html",
  },
  {
    fact: "The Haudenosaunee (Iroquois) Confederacy was one of the most advanced Indigenous political organizations in North America before European contact.",
    category: "History",
    source: "The Canadian Encyclopedia",
    sourceUrl: "https://thecanadianencyclopedia.ca/en/article/iroquois",
  },
  {
    fact: "O Canada serves as Canada's national anthem and is recognized as a distinct sound associated with Canadian identity.",
    category: "Symbols",
    source: "Government of Canada",
    sourceUrl: "https://www.canada.ca/en/services/culture/canadian-identity-society/anthems-symbols.html",
  },
  {
    fact: "The Canada goose and common loon are official symbols of Canada, representing the country's natural heritage.",
    category: "Symbols",
    source: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/National_symbols_of_Canada",
  },
  {
    fact: "The Canadian Horse is an official symbol of Canada, representing the country's agricultural heritage.",
    category: "Symbols",
    source: "Government of Canada",
    sourceUrl: "https://www.canada.ca/en/canadian-heritage/services/official-symbols-canada.html",
  },
  {
    fact: "Frederick Banting was also an accomplished amateur painter with connections to the Group of Seven artists.",
    category: "Culture",
    source: "The Canadian Encyclopedia",
    sourceUrl: "https://thecanadianencyclopedia.ca/en/article/sir-frederick-grant-banting",
  },
  {
    fact: "Alexander Graham Bell co-founded AT&T in 1885 and served as the second president of the National Geographic Society from 1898 to 1903.",
    category: "Science",
    source: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/Alexander_Graham_Bell",
  },
  {
    fact: "The Port of Halifax is renowned for its deep, ice-free harbor, which allows it to accommodate some of the largest container ships in the world.",
    category: "Geography",
    source: "Port of Halifax",
    sourceUrl: "https://www.portofhalifax.ca/",
  },
  {
    fact: "The Canadian Museum of Immigration at Pier 21 in Halifax was the gateway for over one million immigrants arriving in Canada between 1928 and 1971.",
    category: "History",
    source: "Canadian Museum of Immigration",
    sourceUrl: "https://pier21.ca/",
  },
  {
    fact: "The Métis speak their own dialect called Michif, which combines elements of French and Indigenous languages.",
    category: "Culture",
    source: "Government of Canada",
    sourceUrl: "https://www.rcaanc-cirnac.gc.ca/eng/1100100013785/1529102490303",
  },
  {
    fact: "Jacques Cartier, a French explorer, first used the word 'Canada' in 1535 when he heard local Indigenous people near Quebec City use the word 'kanata.'",
    category: "History",
    source: "The Canadian Encyclopedia",
    sourceUrl: "https://thecanadianencyclopedia.ca/en/article/jacques-cartier",
  },
  {
    fact: "The Canadian flag's design was created by George Stanley, a historian at Mount Allison University, based on the Royal Military College of Canada's flag.",
    category: "Symbols",
    source: "Wikipedia",
    sourceUrl: "https://en.wikipedia.org/wiki/Flag_of_Canada",
  },
]

async function main() {
  console.log("Seeding Canada facts...")

  for (const fact of facts) {
    await prisma.fact.create({
      data: fact,
    })
  }

  console.log(`Seeded ${facts.length} Canada facts successfully!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
