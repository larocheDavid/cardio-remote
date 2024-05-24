import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import "./fonts/CooperHewitt-Light.otf"
import PatientScreen from './PatientScreen';
import styles from './styles';

const LoginScreen = ({onLogin}) => {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    console.debug('username:', username);
    console.debug('Password:', password);
    if (username.trim() !== '' && password.trim() !== '') {
        setLoggedIn(true);
        onLogin(username);
      }
  };

  const handleLogout = async () => {
    console.debug('Logout');
    setusername('');
    setPassword('');
    setLoggedIn(false);
  }

  if (loggedIn) {
    // Render the HomeScreen component if the user is logged in
    return <PatientScreen username={username} onLogout={handleLogout}/>;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Identifiant"
        onChangeText={text => setusername(text)}
        value={username}
        autoCapitalize="none"
        placeholderTextColor="gray"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        onChangeText={text => setPassword(text)}
        value={password}
        placeholderTextColor="gray"
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>OK</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
