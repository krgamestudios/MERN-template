import React, { useState } from 'react';
import CareerTab from '../components/CareerTab';
import RelationshipsTab from '../components/RelationshipsTab';
import AchievementsTab from '../components/AchievementsTab';
import LegacyTab from '../components/LegacyTab';

const Dashboard = ({ character, setCharacter, stats }) => {
    const [activeTab, setActiveTab] = useState('career');

    const renderTabButton = (tabName, label) => (
        <button
            className={`px-4 py-2 font-semibold rounded-t-lg ${
                activeTab === tabName
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveTab(tabName)}
        >
            {label}
        </button>
    );

    return (
        <div className='my-4'>
            <div className='flex border-b-2 border-blue-500'>
                {renderTabButton('career', 'Career')}
                {renderTabButton('relationships', 'Relationships')}
                {renderTabButton('achievements', 'Achievements')}
                {renderTabButton('legacy', 'Legacy')}
            </div>
            <div className='p-4 bg-white border-2 border-t-0 border-blue-500 rounded-b-lg'>
                {activeTab === 'career' && <CareerTab character={character} setCharacter={setCharacter} stats={stats} />}
                {activeTab === 'relationships' && <RelationshipsTab character={character} setCharacter={setCharacter} />}
                {activeTab === 'achievements' && <AchievementsTab character={character} />}
                {activeTab === 'legacy' && <LegacyTab character={character} />}
            </div>
        </div>
    );
};

export default Dashboard;
