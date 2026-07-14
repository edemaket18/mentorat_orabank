 import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';

export const MentorMatching: React.FC = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{ ('mentor.matching.title') }</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for future matching components */}
          <p className="text-center text-gray-500">{ ('mentor.matching.placeholder') }</p>
        </CardContent>
      </Card>
    </div>
  );
}



export default MentorMatching;