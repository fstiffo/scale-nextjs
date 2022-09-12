const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const load = async () => {
    try {
        await prisma.monthlyPayment.deleteMany();
        console.log('Deleted records in MonthlyPayment table');

        const apartments = await prisma.apartment.findMany({ select: { id: true } });
        apartments.forEach(async ({ id }) => {
            const monthlyDues = await prisma.journalEntry.findMany({
                orderBy: { date: "desc" },
                where: { apartment_id: id },
                select: { date: true, credit: true, }
            });
            console.log(monthlyDues);
            const lastMonthlyPayment = await prisma.monthlyPayment.findFirst({
                orderBy: [{ year: "desc" }, { month: "desc" }],
                where: { apartment_id: id }
            });


        })
    }
    catch (e) { }
    finally {
        await prisma.$disconnect();
    }
}

load()