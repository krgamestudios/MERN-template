import React from 'react';

const AchievementsTab = ({ character }) => {
    const { achievements } = character;

    return (
        <div>
            <h3 className="text-xl font-bold mb-2">Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((ach, index) => (
                    <div key={index} className={`p-4 border rounded-lg ${ach.locked ? 'bg-gray-100' : 'bg-green-100'}`}>
                        <div className="flex items-center">
                            <span className="text-2xl mr-4">{ach.icon}</span>
                            <div>
                                <p className="font-semibold">{ach.name}</p>
                                <p className="text-sm text-gray-600">{ach.description}</p>
                                {!ach.locked && ach.dateUnlocked && (
                                    <p className="text-xs text-gray-500">Unlocked: {new Date(ach.dateUnlocked).toLocaleDateString()}</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AchievementsTab;
