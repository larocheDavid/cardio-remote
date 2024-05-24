import React, {useState} from 'react';
import { SafeAreaView, Text } from 'react-native';
import "./fonts/CooperHewitt-Light.otf"
import PatientScreen from './PatientScreen';
import LoginScreen from './LoginScreen';
import styles from './styles';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (username: string) => {
    setUsername(username);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <SafeAreaView style={styles.mainPage}>
      {!loggedIn && (
      <Text style={styles.title}>CardioRemote</Text>)}
      {loggedIn ? (
        <PatientScreen userId={username} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </SafeAreaView>
  );
};

export default App;