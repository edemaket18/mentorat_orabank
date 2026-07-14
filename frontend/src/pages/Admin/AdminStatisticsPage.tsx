 
 import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@components/layout/Card';
import StatsChart from '@features/chat/StatsChart';
import { getStats } from '@api/admin.api';
//import  ChartDataPoint from '@features/chat/StatsChart';

interface ChartData {
  monthlyRegistrations: ChartDataPoint[];
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[]; 
}
interface ChartDataPoint {
  id: string;
  name: string;
  value: number;
  month: string;
  count: number;
}

const AdminStatisticsPage: React.FC = () => {
  const [chartData, setChartData ] = React.useState<ChartData | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStats();
        setChartData(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Statistiques globales</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold">Statistiques d'inscription</h2>
            <p className="text-gray-500">Nombre d'inscriptions par mois</p>
          </div>

          <div className="flex justify-center mb-6">
            {chartData ? (
              <StatsChart data={chartData.monthlyRegistrations} />
            ) : (
              <div className="text-center text-gray-500">Chargement des données...</div>
            )}
          </div>

          {/* Autres sections informatives sans chartes */}
          {[
            ['Statistiques d’utilisation', "Nombre de messages envoyés par mois"],
            ['Statistiques de performance', "Temps de réponse moyen par mois"],
            ['Statistiques de satisfaction', "Taux de satisfaction des utilisateurs"],
            ['Statistiques de croissance', "Croissance du nombre d'utilisateurs"],
            ['Statistiques de rétention', "Taux de rétention des utilisateurs"],
            ['Statistiques de conversion', "Taux de conversion des utilisateurs"],
            ['Statistiques de trafic', "Trafic mensuel du site web"],
            ['Statistiques de support', "Nombre de tickets de support par mois"],
            ['Statistiques de revenus', "Revenus mensuels générés"],
            ['Statistiques de dépenses', "Dépenses mensuelles totales"],
            ['Statistiques de feedback', "Feedback des utilisateurs sur les fonctionnalités"],
          ].map(([title, desc]) => (
            <div className="text-center mb-4" key={title}>
              <h2 className="text-lg font-bold">{title}</h2>
              <p className="text-gray-500">{desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStatisticsPage;
