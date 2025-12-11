'use client';

import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
// Import the specific type for the Pie label props
import { PieLabelRenderProps } from 'recharts';
import { Footer } from '@/components/ui/footer';
import Link from 'next/link';

// Define a type for our chart data
interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

// Define a type for a single row of the CSV data.
interface SurveyData {
  EDAD: string;
  GENERO: string;
  GRUPO_ETNICO: string;
  UBICACION: string;
  NIVEL_EDUCATIVO: string;
  OCUPACION: string;
  TIEMPO_RESIDENCIA: string;
}

// Colors for the Pie Charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560', '#8884d8'];

export default function ResultsPage() {
  const [ageData, setAgeData] = useState<ChartData[]>([]);
  const [genderData, setGenderData] = useState<ChartData[]>([]);
  const [ethnicGroupData, setEthnicGroupData] = useState<ChartData[]>([]);
  const [educationData, setEducationData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const CSV_FILE_PATH = '/Resultados.csv';

    const transformHeader = (header: string) => {
        let cleanedHeader = header.trim().toUpperCase().replace(/:/g, '');
        cleanedHeader = cleanedHeader.replace(/\s+/g, ' '); // Normalize whitespace

        if (cleanedHeader === 'POBLACION') return 'GRUPO_ETNICO';
        if (cleanedHeader.includes('PERTENECE') && (cleanedHeader.includes('GRUPO ÉTNICO') || cleanedHeader.includes('GRUPO ETNICO'))) return 'GRUPO_ETNICO';
        if (cleanedHeader.includes('TIEMPO DE RESIDENCIA')) return 'TIEMPO_RESIDENCIA';
        if (cleanedHeader.includes('EDAD')) return 'EDAD';
        if (cleanedHeader.includes('GÉNERO') || cleanedHeader.includes('GENERO')) return 'GENERO';
        if (cleanedHeader.includes('UBICACIÓN GEOGRÁFICA') || cleanedHeader.includes('UBICACION GEOGRAFICA')) return 'UBICACION';
        if (cleanedHeader.includes('NIVEL DE EDUCATIVO')) return 'NIVEL_EDUCATIVO';
        if (cleanedHeader.includes('OCUPACIÓN PRINCIPAL') || cleanedHeader.includes('OCUPACION PRINCIPAL')) return 'OCUPACION';
        return cleanedHeader;
    };

    const fetchData = async () => {
      try {
        const response = await fetch(CSV_FILE_PATH);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const text = await response.text();

        Papa.parse<SurveyData>(text, {
          complete: (results) => {
            if (results.errors.length) {
              setError('Error parsing CSV file. Check console for details.');
              console.error('CSV Parsing errors:', results.errors);
              setLoading(false);
              return;
            }
            
            const data = results.data;

            // --- Age Data ---
            const ageGroups: { [key: string]: number } = { 'Menor de 18': 0, '18-24': 0, '25-34': 0, '35-44': 0, '45-54': 0, '55-64': 0, '65 o más': 0, 'No especificado': 0 };
            data.forEach(row => {
                const age = parseInt(row.EDAD, 10);
                 if (isNaN(age)) ageGroups['No especificado']++;
                 else if (age < 18) ageGroups['Menor de 18']++;
                 else if (age >= 18 && age <= 24) ageGroups['18-24']++;
                 else if (age >= 25 && age <= 34) ageGroups['25-34']++;
                 else if (age >= 35 && age <= 44) ageGroups['35-44']++;
                 else if (age >= 45 && age <= 54) ageGroups['45-54']++;
                 else if (age >= 55 && age <= 64) ageGroups['55-64']++;
                 else if (age >= 65) ageGroups['65 o más']++;
                 else ageGroups['No especificado']++;
            });
            setAgeData(Object.keys(ageGroups).map(key => ({ name: key, value: ageGroups[key] })).filter(item => item.value > 0));

            // --- Gender Data ---
            const genderCounts: { [key: string]: number } = { 'Hombre': 0, 'Mujer': 0, 'Otro': 0 };
            data.forEach(row => {
                const gender = (row.GENERO || '').trim().toLowerCase();
                if (gender === 'hombre') genderCounts['Hombre']++;
                else if (gender === 'mujer') genderCounts['Mujer']++;
                else if(gender) genderCounts['Otro']++;
            });
            setGenderData(Object.keys(genderCounts).map(key => ({ name: key, value: genderCounts[key] })).filter(item => item.value > 0));
            
            // --- Ethnic Group Data ---
            const ethnicGroupCounts: { [key: string]: number } = { 'Comunidad Rrom (Gitana)': 0, 'Comunidad negra o afrocolombiana': 0, 'Comunidad Indigena': 0, 'Comunidad Palenquera': 0, 'No Pertenezco': 0, 'Otro/No especificado': 0 };
            data.forEach(row => {
                const ethnicGroup = (row.GRUPO_ETNICO || '').trim().toLowerCase();
                if (ethnicGroup.includes('rrom') || ethnicGroup.includes('gitana')) ethnicGroupCounts['Comunidad Rrom (Gitana)']++;
                else if (ethnicGroup.includes('negra') || ethnicGroup.includes('afrocolombiana')) ethnicGroupCounts['Comunidad negra o afrocolombiana']++;
                else if (ethnicGroup.includes('indigena')) ethnicGroupCounts['Comunidad Indigena']++;
                else if (ethnicGroup.includes('palenquera')) ethnicGroupCounts['Comunidad Palenquera']++;
                else if (ethnicGroup.includes('no pertenezco')) ethnicGroupCounts['No Pertenezco']++;
                else if (ethnicGroup) ethnicGroupCounts['Otro/No especificado']++;
            });
            setEthnicGroupData(Object.keys(ethnicGroupCounts).map(key => ({ name: key, value: ethnicGroupCounts[key] })).filter(item => item.value > 0));

            // --- Education Level Data ---
            const educationCounts: { [key: string]: number } = { 'Sin escolaridad': 0, 'Primaria': 0, 'Secundaria': 0, 'Técnica/Tecnológica': 0, 'Universitaria': 0, 'Posgrado': 0, 'Otro/No especificado': 0 };
            data.forEach(row => {
                const level = (row.NIVEL_EDUCATIVO || '').trim().toLowerCase();
                if (level === 'sin escolaridad') educationCounts['Sin escolaridad']++;
                else if (level === 'primaria') educationCounts['Primaria']++;
                else if (level === 'secundaria') educationCounts['Secundaria']++;
                else if (level === 'técnica/tecnológica') educationCounts['Técnica/Tecnológica']++;
                else if (level === 'universitaria') educationCounts['Universitaria']++;
                else if (level === 'posgrado') educationCounts['Posgrado']++;
                else if (level) educationCounts['Otro/No especificado']++;
            });
            setEducationData(Object.keys(educationCounts).map(key => ({ name: key, value: educationCounts[key] })).filter(item => item.value > 0));

            setLoading(false);
          },
          error: (err: Error) => {
            setError('Error parsing CSV file.');
            console.error(err);
            setLoading(false);
          },
          header: true,
          skipEmptyLines: true,
          transformHeader: transformHeader,
        });
      } catch (e) {
        if (e instanceof Error) setError(`Failed to fetch or process survey data: ${e.message}. Please ensure the file exists at ${CSV_FILE_PATH} and is accessible.`);
        else setError('An unknown error occurred.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderCustomizedLabel = (props: PieLabelRenderProps) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    // Guard to prevent rendering if essential props are missing
    if (percent === undefined || cx === undefined || cy === undefined || midAngle === undefined || innerRadius === undefined || outerRadius === undefined) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (<text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">{`${(percent * 100).toFixed(0)}%`}</text>);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-100 text-slate-800">
      <div className="container mx-auto w-full grow p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 sm:mb-0">Resultados de la Encuesta</h1>
            <Link 
              href="/" 
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              &larr; Volver al inicio
            </Link>
        </div>

        {loading && <div className="text-center py-20"><p className="text-lg text-gray-500">Cargando resultados...</p></div>}
        {error && <div className="text-center py-20"><p className="text-lg text-red-600 bg-red-100 p-4 rounded-lg">{error}</p></div>}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Card for Age Distribution */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-700 text-center mb-4">Distribución de Edades</h2>
              {ageData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      cx="50%"
                      cy="50%"
                      data={ageData}
                      dataKey="value"
                      fill="#8884d8" // This fill is a fallback, COLORS array takes precedence
                      label={renderCustomizedLabel}
                      labelLine={false}
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={140}
                    >
                      {ageData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="text-center text-gray-500 pt-16">No hay datos de edad para mostrar.</p>}
            </div>

            {/* Card for Gender Distribution */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-700 text-center mb-4">Distribución de Género</h2>
              {genderData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      cx="50%"
                      cy="50%"
                      data={genderData}
                      dataKey="value"
                      fill="#8884d8"
                      label
                      nameKey="name"
                      outerRadius={150}
                    >
                      {genderData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="text-center text-gray-500 pt-16">No hay datos de género para mostrar.</p>}
            </div>

            {/* Card for Ethnic Group */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-700 text-center mb-4">Grupos Étnicos</h2>
              {ethnicGroupData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      cx="50%"
                      cy="50%"
                      data={ethnicGroupData}
                      dataKey="value"
                      fill="#8884d8"
                      label
                      nameKey="name"
                      outerRadius={150}
                    >
                      {ethnicGroupData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="text-center text-gray-500 pt-16">No hay datos de grupos étnicos para mostrar.</p>}
            </div>

            {/* Card for Education Level */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-700 text-center mb-4">Nivel Educativo</h2>
              {educationData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={educationData}
                    layout="vertical"
                    margin={{
                      bottom: 5,
                      left: 100,
                      right: 30,
                      top: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Nº de Encuestados">
                      {educationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="text-center text-gray-500 pt-16">No hay datos de nivel educativo para mostrar.</p>}
            </div>

          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
