import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';
//import { useTranslation } from "react-i18next";


const MentorContracts: React.FC = () => {
  //const { t } = useTranslation();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{ ('mentor.contracts.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for future contracts components */}
          <p className="text-center text-gray-500">{ ('mentor.contracts.placeholder')}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorContracts;
