import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Adding hints to questions...")

  const questions = await prisma.question.findMany({
    select: {
      id: true,
      question: true,
      explanation: true,
      hints: true,
    },
  })

  console.log(`Found ${questions.length} questions`)

  for (const question of questions) {
    if (question.hints && question.hints.length > 0) {
      console.log(`Skipping question ${question.id} - already has hints`)
      continue
    }

    const explanationParts = question.explanation.split(". ")
    const hints: string[] = []

    if (explanationParts.length >= 3) {
      hints.push(explanationParts[0] + ".")
      hints.push(explanationParts.slice(0, 2).join(". ") + ".")
      hints.push(explanationParts.slice(0, 3).join(". ") + ".")
    } else if (explanationParts.length === 2) {
      hints.push(explanationParts[0] + ".")
      hints.push(question.explanation)
    } else {
      const words = question.explanation.split(" ")
      const third = Math.ceil(words.length / 3)
      hints.push(words.slice(0, third).join(" ") + "...")
      hints.push(words.slice(0, third * 2).join(" ") + "...")
      hints.push(question.explanation)
    }

    await prisma.question.update({
      where: { id: question.id },
      data: { hints },
    })

    console.log(`Updated question ${question.id} with ${hints.length} hints`)
  }

  console.log("Done!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
