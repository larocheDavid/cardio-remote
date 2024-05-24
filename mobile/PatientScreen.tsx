import { useState, useEffect } from 'react';

import {
  View,
  Text,
  NativeModules,
  NativeEventEmitter,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

import BleManager, {
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
} from 'react-native-ble-manager';

import styles from './styles';
import PatientData from './PatientData';
import {
  parseDeviceBpBytes,
  bpMeasurementsToObservation,
  handleAndroidPermissions,
  BpMeasurements, 
  sleep
} from './utils';

import {
  HOSTNAME,
  PORT,
  BP_MEASUREMENTS_CHARACTERISTICS,
  BLOOD_PRESSURE_UUID,
  DEVICE_NAME
} from './config';

declare module 'react-native-ble-manager' {
  // enrich local contract with custom state properties needed by PatientScreen.tsx
  interface Peripheral {
    connected?: boolean;
    connecting?: boolean;
  }
}

type PatientScreenProps = {
  subjectId: string;
  onLogout: () => void;
};

const SECONDS_TO_SCAN_FOR = 7;

const PatientScreen: React.FC<PatientScreenProps> = ({ subjectId, onLogout }) => {
  
  const [isProgressInfo, setProgressInfo] = useState('');
  const [peripheral, setPeripheral] = useState<Peripheral | null>(null);
  const [isUserConnected, setIsUserConnected] = useState(true);

  const handleLogout = async () => {
    console.debug('[handleLogout] Logging out')
    if (peripheral && peripheral.connected) {
      try {
          await BleManager.disconnect(peripheral.id);
          setIsUserConnected(false);
      } catch (error) {
          console.error(`[handleLogout] Error disconnecting from '${peripheral.name}'`, error);
      }
    }
    console.debug('[handleLogout] Removing listeners')
    bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
    bleManagerEmitter.removeAllListeners('BleManagerStopScan');
    bleManagerEmitter.removeAllListeners('BleManagerDisconnectPeripheral');
    bleManagerEmitter.removeAllListeners('BleManagerDidUpdateValueForCharacteristic');

    setDataArray([]);
    onLogout();
  };

  const handleStartScan = async () => {
    setProgressInfo('Scanning...');
    try {
      console.debug('[handleStartBleScan] starting scan...');
      await BleManager.scan(
        [BLOOD_PRESSURE_UUID],
        SECONDS_TO_SCAN_FOR,
        false,
        {
          matchMode: BleScanMatchMode.Sticky,
          scanMode: BleScanMode.LowLatency,
          callbackType: BleScanCallbackType.AllMatches,
        },
      );
      console.debug('[handleStartBleScan] scan promise returned successfully.');
    } catch (error) {
      console.error('[handleStartBleScan] ble scan error thrown', error);
    }
  };

  const handleStopScan = () => {
      setProgressInfo('');
      console.debug('[handleStopScan] scan is stopped.');
  };

  const handleDiscoverPeripheral = async (peripheral: Peripheral) => {
    if (peripheral.name === DEVICE_NAME && !peripheral.connecting && !peripheral.connected) {
      
      console.debug(`[handleDiscoverPeripheral] '${peripheral.name}' found`);
      try {
        await BleManager.stopScan();
        setProgressInfo('Connecting...');
        await connectPeripheral(peripheral);
        peripheral.connected = true;
        
      } catch (error) {
        console.error(`[handleDiscoverPeripheral] init peripheral connection error to '${peripheral.name}'`,);
      }
    }
  };


  const handleDisconnectedPeripheral = (
    event: BleDisconnectPeripheralEvent,
  ) => {
    if(peripheral)
      console.log("[handleDisconnectedPeripheral] peripheral.id", peripheral.id)
    if (peripheral && event.peripheral == peripheral.id) {
      console.log("peripheral.id", peripheral.id)
      peripheral.connected = false;
      console.debug(
        `[handleDisconnectedPeripheral] Device '${event.peripheral}' disconnected.`,
      );
    }
  };

  const connectPeripheral = async (peripheral: Peripheral) => {
    try {
      await BleManager.connect(peripheral.id);
      peripheral.connected = true;
      peripheral.connecting = false;
      await sleep(500);
      await startNotifications(peripheral);
      console.debug(`[connectPeripheral] notified on '${peripheral.name}'`);
    } catch (error) {
      peripheral.connecting = false;
      console.error(`[connectPeripheral][${peripheral.name}] process peripheral connection error`, error);
    }
  };

  const startNotifications = async (peripheral: Peripheral) => {
    try {
      await BleManager.startNotification(
        peripheral.id,
        BLOOD_PRESSURE_UUID,
        BP_MEASUREMENTS_CHARACTERISTICS,
      );
      console.debug(
        'Notification started for characteristic:',
        BP_MEASUREMENTS_CHARACTERISTICS,
      );
    } catch (error) {
      console.error('[startNotifications] Error starting notification:', error);
    }
  };

  const [dataArray, setDataArray] = useState<number[][]>([]);
 
  const handleUpdateValueForCharacteristic = async (
    data: BleManagerDidUpdateValueForCharacteristicEvent,
  ) => { 
    let dataAlreadyExists = false;
    
    setDataArray(prevDataArray => {
      for (let value of prevDataArray) {
        if (JSON.stringify(value) === JSON.stringify(data.value)) {
          console.debug(`[handleUpdateValueForCharacteristic] Value='${data.value} already exists.'`);
          dataAlreadyExists = true;
          return prevDataArray;
        }
      }
      console.debug(`[handleUpdateValueForCharacteristic] Value='${data.value}' added.`);
      return [...prevDataArray, data.value];
    });
  
    if (dataAlreadyExists) {
      // Si les données existent déjà, arrêtez les notifications pour cette caractéristique
      try {
        await BleManager.stopNotification(
          data.peripheral,
          BLOOD_PRESSURE_UUID,
          BP_MEASUREMENTS_CHARACTERISTICS,
        );
        console.debug('Notifications stopped for characteristic:', BP_MEASUREMENTS_CHARACTERISTICS);
      } catch (error) {
        console.error('Error stopping notification:', error);
      }
    }
  };
  
  useEffect(() => {
    async function postObservation() {
      let bpMeasurements: BpMeasurements = parseDeviceBpBytes(dataArray[dataArray.length - 1]);
      let observation = bpMeasurementsToObservation(bpMeasurements);
      observation.subject = { reference: `Patient/${subjectId}` };

      try {
        setProgressInfo('Sending data...');
        const response = await fetch(
          `http://${HOSTNAME}:${PORT}/fhir/Observation?_format=json&_pretty=true`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(observation),
          },
        );
        console.debug(
          `[postObservation] response received: ${response.status} ${response.statusText}`,
        );
        if (response.ok) {
          setProgressInfo('Data sent success');
          await sleep(4000);
          setProgressInfo('');
        } else {
          throw new Error('Error sending data');
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('An error occurred:', error.message);
        } else {
          console.error('An unexpected error occurred:', error);
        }
      }
    }
    if (dataArray[dataArray.length - 1]) {
      postObservation();
    }
  }, [dataArray]);

  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
  
  useEffect(() => {
    const startBleManager = async () => {
      try {
        await BleManager.start({ showAlert: false });
        console.debug('BleManager started.');
      } catch (error) {
        console.error('BeManager could not be started.', error);
      }
    };

    const handleEvents = async () => {
      if (Platform.OS === 'android') {
        await handleAndroidPermissions();
      }
      await startBleManager();

      const listeners = [
        bleManagerEmitter.addListener(
          'BleManagerDiscoverPeripheral',
          handleDiscoverPeripheral,
        ),
        bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
        bleManagerEmitter.addListener(
          'BleManagerDisconnectPeripheral',
          handleDisconnectedPeripheral,
        ),
        bleManagerEmitter.addListener(
          'BleManagerDidUpdateValueForCharacteristic',
          handleUpdateValueForCharacteristic,
        ),
      ];
      return () => {

        console.debug('[handleEvents] main component unmounting. Removing listeners...');
        for (const listener of listeners) {
          listener.remove();
        }

        console.debug('[handleEvents] main component unmounting. Disconnecting from peripheral...');
        if (peripheral && peripheral.connected) {
          BleManager.disconnect(peripheral.id);
        }
      };
    };
    handleEvents();
  }, [isUserConnected]);

  const [showData, setShowData] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [lastButton, setLastButton] = useState('');

  const handleShowPatientData = () => {
    if (lastButton === 'data') {
      setIsButtonPressed(!isButtonPressed);
    } else {
      setShowData(true);
      setIsButtonPressed(true);
    }
    setLastButton('data');
  };

  const handleShowPatientChart = () => {
    if (lastButton === 'chart') {
      setIsButtonPressed(!isButtonPressed);
    } else {
      setShowData(false);
      setIsButtonPressed(true);
    }
    setLastButton('chart');
  };

  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get('window').width,
  );
  // Function to handle orientation change
  const handleOrientationChange = () => {
    const { width } = Dimensions.get('window');
    setScreenWidth(width);
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      handleOrientationChange,
    );
    return () => { // Remove the event listener when the component is unmounted
      subscription.remove();
    };
  }, []);

  const isPortrait = screenWidth < Dimensions.get('window').height;

  return (
    <View style={styles.container}>
      {isButtonPressed && (
        <PatientData
          subjectId={subjectId}
          showData={showData}
          showChart={!showData}
        />
      )}
      {isProgressInfo && (
        <>
          <Text style={styles.dataProgress}> {isProgressInfo}
          </Text>
        </>
      )}
      {isPortrait && (
        <>
        <TouchableOpacity
            style={styles.button}
            onPress={handleStartScan}>
            <Text style={styles.buttonText}>
              {isProgressInfo == '' ||
                isProgressInfo == "Data sent success" ? (
                  'Transférer Mes Données'
              ) : (
                <ActivityIndicator color="#fff" />
              )}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#93cfa9'}]}
            onPress={handleShowPatientData}>
            <Text style={styles.buttonText}>Mes Données</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#93cfa9' }]}
            onPress={handleShowPatientChart}>
            <Text style={styles.buttonText }>Mon Graphique</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogout}>
            <Text style={styles.buttonText}>Déconnexion</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default PatientScreen;
