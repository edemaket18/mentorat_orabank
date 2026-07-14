import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';

const MentorSettingsPage: React.FC = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{ ('mentor.settings.title') }</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for future settings components */}
          <p className="text-center text-gray-500">{ ('mentor.settings.placeholder') }</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default MentorSettingsPage;
