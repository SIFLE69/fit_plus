import React from 'react';
import ProgressChart from '../components/ProgressChart';
import BadgeList from '../components/BadgeList';
import { logDailyEntry } from '../services/api';

export default function ProgressPage({ profile, logs = [], badges = [], onRefreshData }) {
    const handleAddLog = async (logData) => {
        if (!profile?._id) return;
        await logDailyEntry(profile._id, logData);
        onRefreshData();
    };

    return (
        <div className="space-y-6 pb-12">
            <BadgeList badges={badges} logs={logs} />
            <ProgressChart logs={logs} onAddLog={handleAddLog} />
        </div>
    );
}
