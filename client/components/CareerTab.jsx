import React from 'react';

const CareerTab = ({ character, setCharacter, stats }) => {
    const { job, salaryHistory } = character;

    return (
        <div>
            <h3 className="text-xl font-bold mb-2">Career</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p><span className="font-semibold">Job:</span> {job.title}</p>
                    <p><span className="font-semibold">Salary:</span> ${job.salary.toLocaleString()}</p>
                </div>
                <div>
                    <h4 className="font-semibold">Salary History</h4>
                    <ul className="list-disc list-inside">
                        {salaryHistory.map((entry, index) => (
                            <li key={index}>Age {entry.age}: ${entry.salary.toLocaleString()}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CareerTab;
