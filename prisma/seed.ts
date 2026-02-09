import { PrismaClient, QuestionCategory } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const questions = [
        {
            questionText: "What is the most important lesson your parents taught you?",
            category: QuestionCategory.VALUES,
            difficulty: 3,
        },
        {
            questionText: "How did you feel when you first held your child?",
            category: QuestionCategory.RELATIONSHIPS,
            difficulty: 5,
        },
        {
            questionText: "What was your favorite place to visit as a child and why?",
            category: QuestionCategory.TIME_MEMORY,
            difficulty: 2,
        },
        {
            questionText: "What advice would you give to someone experiencing their first major heartbreak?",
            category: QuestionCategory.LIFE_LESSONS,
            difficulty: 7,
        },
        {
            questionText: "What do you want to be remembered for most?",
            category: QuestionCategory.LEGACY,
            difficulty: 8,
        }
    ]

    for (const q of questions) {
        await prisma.question.create({
            data: q,
        })
    }

    console.log('Seed completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
