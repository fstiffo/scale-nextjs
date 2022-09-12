const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const load = async () => {
    try {
        await prisma.monthlyPayment.deleteMany();
        console.log('Deleted records in MonthlyPayment table');

        const apartments = await prisma.apartment.findMany({ select: { id: true } });
        apartments.forEach(async ({ id }) => {
            // Not booked yet dues payments of apartment `id`
            const duesPayments = await prisma.journalEntry.findMany({
                orderBy: { date: "desc" },
                where: {
                    AND: [
                        { apartment_id: id },
                        { booked: false }]
                },
                select: { date: true, credit: true, }
            });
            console.log(duesPayments);
            const lastMonthlyPayment = await prisma.monthlyPayment.findFirst({
                orderBy: [{ year: "desc" }, { month: "desc" }],
                where: { apartment_id: id }
            });
            const { monthly_dues } = await prisma.configuration.findFirst({
                select: { monthly_dues: true },
                orderBy: { valid_from: "desc" }
            });


        })
    }
    catch (e) { }
    finally {
        await prisma.$disconnect();
    }
}

load()