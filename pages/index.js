import Head from 'next/head';
import JournalEntry from '../components/JournalEntry';
import prisma from '../lib/prisma';

export default function Home({ journal_entries }) {
  return (
    <div>
      <Head>
        <title>PlanetScale Next.js Quickstart</title>
        <meta name="description" content="PlanetScale Quickstart for Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-10 mx-auto max-w-4xl">
        <h1 className="text-6xl font-bold mb-4 text-center">Next.js Starter</h1>
        <p className="mb-20 text-xl text-center">
          🔥 Shop from the hottest items in the world 🔥
        </p>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-items-center  gap-4">
          {journal_entries.map((journal_entry) => (
            <JournalEntry journal_entry={journal_entry} key={journal_entry.id} />
          ))}
        </div>
      </main>

      <footer></footer>
    </div>
  );
}

export async function getStaticProps(context) {
  console.log("Prisma: ", prisma);
  const data = await prisma.journal_entries.findMany({
    include: {
      account: true,
    },
  });

  //convert decimal value to string to pass through as json
  const journal_entries = data.map((journal_entry) => ({
    ...journal_entry,
    debit: journal_entry.debit.toString(),
    credit: journal_entry.credit.toString(),
    date: journal_entry.date.toString()
  }));
  return {
    props: { journal_entries },
  };
}