const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Update monthly payments for apartment_id 
const updateFirstUnbooked = async (apartment_id: number | null) => {
    try {
        let { monthly_dues_str, valid_from } = await prisma.configuration.findFirst({
            select: { monthly_dues: true, valid_from: true },
            orderBy: { valid_from: "desc" }
        });
        const monthly_dues = parseFloat(monthly_dues_str);

        // Not-booked-yet dues payments of apartment `apartment_id`
        let { id, credit_str } = await prisma.journalEntry.findFirst({
            orderBy: { date: "asc" },
            where: {
                AND: [
                    { apartment_id: apartment_id },
                    { booked: false }]
            },
            select: { id: true, credit: true }
        });
        let credit = parseFloat(credit_str);


        console.log("Booking dues payment id: ", id, ", for apartment_id: ", apartment_id, ", credit: €", credit);

        const lastMonthlyPayment = await prisma.monthlyPayment.findFirst({
            orderBy: [{ year: "desc" }, { month: "desc" }],
            where: { apartment_id: apartment_id }
        });

        let lastMonth = (valid_from.getMonth() + 11) % 12;
        let lastYear = (lastMonth === 11) ? valid_from.getFullYear() - 1 : valid_from.getFullYear();

        if (lastMonthlyPayment) {
            const toPayOff = lastMonthlyPayment ? monthly_dues - lastMonthlyPayment.amount : 0;
            if (toPayOff > 0) {
                credit -= toPayOff;
                await prisma.monthlyPayment.update({
                    where: { id: lastMonthlyPayment.id },
                    data: { amount: monthly_dues }
                });
                console.log("Pay off for monthly payment id: ", lastMonthlyPayment.id);
            }

            lastMonth = lastMonthlyPayment.month;
            lastYear = lastMonthlyPayment.year;
        }

        while (credit > 0) {
            if (lastMonth === 11) {
                lastMonth = 0;
                lastYear++;
            } else {
                lastMonth++
            }
            const amount = (credit >= monthly_dues) ? monthly_dues : credit;
            await prisma.monthlyPayment.create({
                data: { month: lastMonth, year: lastYear, amount: amount, apartment_id: apartment_id }
            });
            credit -= amount;
        }
        // If the remaining credit is 0, duesPayment is booked
        await prisma.journalEntry.update({
            where: { id: id },
            data: { booked: true }
        });
        console.log("Monthly dues payment booked.");
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}

updateFirstUnbooked(process.argv[2] ? Number(process.argv[2]) : null);