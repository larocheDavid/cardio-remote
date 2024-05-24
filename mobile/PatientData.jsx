import { useState, useEffect } from 'react';
import { getTimeZone } from "react-native-localize";
import {
  View,
  FlatList,
  ScrollView,
  Text
} from 'react-native';

import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryGroup,
  VictoryLegend,
} from 'victory-native';

import styles from './styles';
import { PORT, HOSTNAME } from './config';

const extractValues = (observationData, code) => {
  return observationData.map(item => {
    const component = item.resource.component.find(
      component => component.code?.coding?.[0]?.code === code,
    );
    return component?.valueQuantity?.value;
  });
};

const PatientData = ({subjectId, showData, showChart}) => {
  const [observationData, setObservationData] = useState([]);
  const [systolicValues, setSystolicValues] = useState([]);
  const [diastolicValues, setDiastolicValues] = useState([]);
  const [heartRateValues, setHeartRateValues] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const getObservation = async () => {
      try {
        const response = await fetch(
          `http://${HOSTNAME}:${PORT}/fhir/Observation?subject=Patient/${subjectId}`,
        );
        const json = await response.json();
        // Extract the entry data from the response and set it in the state
        const entries = json.entry || [];
        setObservationData(entries);
      } catch (error) {
        console.error('Error fetching data:', error);
        setObservationData([]); // Set an empty array in case of an error
      }
    };
    getObservation();

  },[subjectId]);


  useEffect(() => {
    const systolic  = extractValues(observationData, '8480-6');
    const diastolic = extractValues(observationData, '8462-4');
    const heartRate = extractValues(observationData, '8867-4');
    const dateStrings = observationData.map(item => new Date(
              item.resource.effectiveDateTime).toLocaleString('fr-CH'));

    setSystolicValues(systolic);
    setDiastolicValues(diastolic);
    setHeartRateValues(heartRate);
    setDates(dateStrings);

  },[observationData]);

  const TableItem = ({date, systolic, diastolic, heartRate}) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{systolic}</Text>
      <Text style={styles.cell}>{diastolic}</Text>
      <Text style={styles.cell}>{heartRate}</Text>
      <Text style={styles.cell}>{date}</Text>
    </View>
  );

   return (
    <>
     {showData && (
      <>
    <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Systolic</Text>
        <Text style={styles.headerCell}>Diastolic</Text>
        <Text style={styles.headerCell}>Heart Rate</Text>
        <Text style={styles.headerCell}>Date</Text>
      </View>
      <FlatList
        data={dates.map((date, index) => ({
          date,
          systolic: systolicValues[index],
          diastolic: diastolicValues[index],
          heartRate: heartRateValues[index],
        }))}
        keyExtractor={(item) => item.date}
        renderItem={({item}) => (
          <View style={styles.row}>
          <TableItem 
            systolic={item.systolic}
            diastolic={item.diastolic}
            heartRate={item.heartRate}
            date={item.date}
          />
          </View>
        )}
      />
      </>
     )}
{showChart && (

<View style={{ flex: 1 }}>
<ScrollView horizontal={true} sytle={{flex: 1}}>
      <VictoryChart
         theme={VictoryTheme.material}
         domainPadding={{ x: 20 }}
         width={800} // Adjust the width as needed
         //height={300} // Adjust the height as needed
      >
        <VictoryAxis
          dependentAxis
          style={{
            tickLabels: {
              fontSize: 10,
              padding: 5,
            },
          }}
        />
          <VictoryAxis
          // Using `tickValues` to explicitly set the x-axis labels
          tickValues={dates}
          style={{
            tickLabels: {
              angle: -45,
              fontSize: 8,
              padding: 5,
            },
          }}
        />
        <VictoryGroup offset={10} colorScale={['blue', 'green', 'red']}>
        <VictoryBar
          data={dates.map((dates, index) => ({
            x: dates,
            y: systolicValues[index],
          }))}
          barWidth={8}
        />
        <VictoryBar
          data={dates.map((dates, index) => ({
            x: dates,
            y: diastolicValues[index],
          }))}
          barWidth={8}
        />
        <VictoryBar
          data={dates.map((dates, index) => ({
            x: dates,
            y: heartRateValues[index],
          }))}
          barWidth={8}
        />
        </VictoryGroup>
        <VictoryLegend
                x={300}
                y={10}
                orientation='horizontal' // "vertical" for vertical legend
                gutter={10} // Adjust the spacing between legend items
                style={{
                  title: { fontSize: 12, fontWeight: 'bold' },
                  labels: { fontSize: 10 },
                }}
                data={[
                  { name: 'Systolic', symbol: { fill: 'blue' } },
                  { name: 'Diastolic', symbol: { fill: 'green' } },
                  { name: 'Heart Rate', symbol: { fill: 'red' } },
                ]}
              />
      </VictoryChart>
      </ScrollView>
      </View>
      )}
    </>
  );
};

export default PatientData;