 import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';
//import { useTranslation } from "react-i18next";


const MentorCandidates: React.FC = () => {
  //const { t } = useTranslation();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{ ('mentor.candidates.title') }</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for future candidates components */}
          <p className="text-center text-gray-500">{ ('mentor.candidates.placeholder') }</p>
        </CardContent>
      </Card>
    </div>
  );
}
export default MentorCandidates; 
