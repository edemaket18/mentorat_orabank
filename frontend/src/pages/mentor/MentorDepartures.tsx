 import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';


const MentorDepartures: React.FC = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{ ('mentor.departures.title') }</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for future departures components */}
          <p className="text-center text-gray-500">{ ('mentor.departures.placeholder') }</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default MentorDepartures;