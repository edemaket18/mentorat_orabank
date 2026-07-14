 import React from 'react';
//import { connect } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from '@components/layout/Card';


//import { useTranslation } from "react-i18next";

const MentorReports: React.FC = () => {
  //const { t } = useTranslation();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{('mentor.reports.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for future reports components */}
          <p className="text-center text-gray-500">{('mentor.reports.placeholder')}</p>
        </CardContent>
      </Card>
    </div>
  );
};



export default MentorReports;