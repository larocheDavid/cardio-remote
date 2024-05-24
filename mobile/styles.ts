import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  dataProgress: {
    width: '100%',
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
  },
    mainPage: {
        flex: 1,
        backgroundColor: 'white',
    },
    title: {
      textAlign: 'center',
      color: 'white',
      backgroundColor: '#65c6c1',
      fontFamily: "Cooper Hewitt",
      paddingHorizontal: 40,
      fontSize: 32,
    },
    container: {
      flex: 1, 
      fontFamily: "Cooper Hewitt",
      alignItems: 'center',
      //justifyContent: 'center',
      justifyContent: 'flex-end',
      marginBottom: 30
    },
    input: {
      width: '70%',
      height: 50,
      marginBottom: 10,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 30,
      color: 'black',
    },
    button: {
      width: '70%',
      height: 50,
      marginBottom: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#65c6c1',
      borderRadius:30,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    tableContainer: {
      borderWidth: 1,
      borderColor: '#000',
      margin: 10,
    },
    headerRow: {
      flexDirection: 'row',
      backgroundColor: '#65c6c1',
      padding: 10,
    },
    headerCell: {
      flex: 1,
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'white',
    },
    row: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderColor: '#ccc',
      marginVertical: 5,
    },
    cell: {
      flex: 1,
      color: 'black',
      textAlign: 'center',
    },
  });

  export default styles;