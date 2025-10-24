import React from 'react';

const LegacyTab = ({ character }) => {
    const { legacy } = character;

    if (!legacy || legacy.playthroughs === 0) {
        return (
            <div>
                <h3 className="text-xl font-bold mb-2">Legacy</h3>
                <p>You have no legacy yet. Complete a game to start your legacy!</p>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-xl font-bold mb-2">Legacy</h3>
            <p className="mb-4">Playthroughs: {legacy.playthroughs}</p>
            <h4 className="font-semibold mb-2">Unlocked Achievements (All Time)</h4>
            <ul className="list-disc list-inside">
                {legacy.unlockedAchievements.map((ach, index) => (
                    <li key={index}>{ach}</li>
                ))}
            </ul>
        </div>
    );
};

export default LegacyTab;
