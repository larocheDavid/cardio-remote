import {
    Platform,
    PermissionsAndroid,
  } from 'react-native';

import observationTemplate from './resource_templates/observation.json';

export const sleep = (ms: number) => {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
};

type TimeStamp = {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export type BpMeasurements = {
    flags1: number;
    systolic: number;
    diastolic: number;
    meanArterialPressure: number;
    timestamp: TimeStamp;
    pulseRate: number;
    userID: number;
    measurementStatus: number;
};

const parseTimestamp = (timestampBytes: number[]): TimeStamp => {

  return  {
    year: timestampBytes[0] + (timestampBytes[1] << 8),
    month: timestampBytes[2] -1, //months are 0 based in js
    day: timestampBytes[3],
    hours: timestampBytes[4],
    minutes: timestampBytes[5],
    seconds: timestampBytes[6]
  }
};

export const parseDeviceBpBytes = (dataValue: number[]): BpMeasurements => {
    return {
      flags1: dataValue[0],
      systolic: dataValue[1],
      diastolic: dataValue[3],
      meanArterialPressure: dataValue[5],
      timestamp: parseTimestamp(dataValue.slice(7, 14)),
      pulseRate: dataValue[14],
      userID: dataValue[16] + 1,
      measurementStatus: dataValue[17]
  }
};

const updateComponentValueByCode = (components: any, code: number, value: number) => {
  const component = components.find((c: { code: { coding?: any } }) =>
    c.code && 
    c.code.coding && 
    c.code.coding.some((coding: { system: string; code: number }) => coding.system === "http://loinc.org" && coding.code === code)
  );
  
  if (component) {
    component.valueQuantity.value = value;
  }
}

export const bpMeasurementsToObservation = (bpMeasurements: BpMeasurements) => {
      let observation = { ...observationTemplate as any };

      const { timestamp: { year, month, day, hours, minutes, seconds }, 
              systolic,
              diastolic,
              pulseRate
            } = bpMeasurements;

      observation.effectiveDateTime = new Date(year, month, day, hours, minutes, seconds).toISOString();

      /*const hemodynamicMappings = [
        { code: 8480-6, value: systolic },
        { code: 8462-4, value: diastolic },
        { code: 8867-4, value: pulseRate  },
      ];
      hemodynamicMappings.forEach(mapping => {
        updateComponentValueByCode(observation.component, mapping.code, mapping.value);
      });*/

      const hemodynamicValues = [systolic, diastolic, pulseRate];

      for (let i = 0; i < hemodynamicValues.length; i++) {
        observation.component[i].valueQuantity.value = hemodynamicValues[i];
      }
      return observation;
  }

  export const handleAndroidPermissions = async () => {
    if (Number(Platform.Version) >= 31) {
      try {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);
  
        if (result) {
          console.debug(
            '[handleAndroidPermissions] User accepts runtime permissions android 12+',
          );
        } else {
          console.error(
            '[handleAndroidPermissions] User refuses runtime permissions android 12+',
          );
        }
      } catch (error) {
        console.error(error);
      }
    } else if (Number(Platform.Version) >= 23) {
      try {
        const checkResult = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        )
        if (checkResult) {
          console.debug(
            '[handleAndroidPermissions] runtime permission Android <12 already OK',
          );
        } else {
          const requestResult = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          if (requestResult) {
            console.debug(
              '[handleAndroidPermissions] User accepts runtime permission android <12',
            );
          } else {
            console.error(
              '[handleAndroidPermissions] User refuses runtime permission android <12',
            );
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  