import Image from 'next/image';

export default function JournalEntry({ journal_entry }) {
    console.log(journal_entry);
    const { date, debit, credit, account, apartment_id, description } = journal_entry;

    return (
        <div
            className="max-w-[250px] rounded overflow-hidden shadow-lg"
            key={journal_entry.id}
        >
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{date}</div>
                <p className="text-gray-900 text-xl">-€{debit}</p>
                <p className="text-gray-900 text-xl">€{credit}</p>
            </div>
            <div className="px-6 pt-4 pb-2">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {account?.nome}
                </span>
            </div>
        </div>
    );
}