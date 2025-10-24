import React from 'react';

const RelationshipsTab = ({ character, setCharacter }) => {
    const { relationships } = character;

    return (
        <div>
            <h3 className="text-xl font-bold mb-2">Relationships</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relationships.map((rel, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                        <p className="font-semibold text-lg">{rel.name}</p>
                        <p>Type: {rel.type}</p>
                        <p>Happiness: {rel.happiness}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelationshipsTab;
