import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { Col, Grid } from 'react-native-easy-grid';
import Container from '../components/Container';
import Button from '../components/Button';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from 'react-native-underline-tabbar';
import SoapScreen from '../screens/SoapScreen';


const Page = ({label, page}) => (
    <View style={styles.container}>
    </View>
);

class PatientHomeScreen extends Component<{}> {
  /*
   * Expects:
   *  {
   *    name: string, patient's name (for convenience)
   *    patientKey: string
   *    todayDateString: optional, (new Date().toDateString()), helpful for
   *    tests
   *  }
   */
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.state = {
      /*
       * Hardcoded now, needs to be changed later (pass values in through props) 
       *
       */
      nameText: "Billy Bob",
      birthDateText: '10/03/1989',
      genderText: 'Male',
    };
       
  }



  goToTriage = () => {
    this.props.navigator.push({
      screen: 'Ihc.TriageScreen',
      title: 'Back to patient',
      passProps: { name: this.props.name }
    });
  }

  goToSoap = () => {
    this.props.navigator.push({
      screen: 'Ihc.SoapScreen',
      title: 'Back to patient',
      passProps: { name: this.props.name }
    });
  }

  goToMedicationList = () => {
    this.props.navigator.push({
      screen: 'Ihc.MedicationScreen',
      title: 'Back to patient',
      passProps: { name: this.props.name }
    });
  }

  goToHistory = () => {
    this.props.navigator.push({
      screen: 'Ihc.PatientHistoryScreen',
      title: 'Back to patient',
      passProps: { name: this.props.name }
    });
  }

  goToGrowthChart = () => {
    // Growth chart takes time to load
    this.props.setLoading(true);
    this.props.navigator.push({
      screen: 'Ihc.GrowthChartScreen',
      title: 'Back to patient',
    });
  }

  onNavigatorEvent(event) {
    if (event.id === 'willAppear') {
      this.props.clearMessages();
    }
  } 

  render() {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
      }}>

      <View style ={{
        flexDirection: 'row',
        alignItems: 'stretch',
        paddingTop: 20
      }}>


     <Text style={styles.name}>
            {this.state.nameText}{'\n'}
              {this.state.genderText}{' | '}
              {this.state.birthDateText}
         </Text>   
     </View>    

     <View style={[styles.container, {paddingTop: 10}]}>
          <ScrollableTabView
              tabBarActiveTextColor="#53ac49"        
              renderTabBar={() => <TabBar underlineColor="#53ac49" />}>    

            <Page tabLabel={{label: "Triage"}} label="Triage"/>
            <SoapScreen tabLabel={{label: "Soap"}}/>
            <Page tabLabel={{label: "Pharmacy/Lab"}} label="Pharmacy/Lab"/>
            <Page tabLabel={{label: "Growth Chart"}} label="Growth Chart"/>
          </ScrollableTabView>

        </View>
      </View>
    );
  }
};


const styles = StyleSheet.create({
    container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    fontSize: 28,
  },

  profText:
  {
    flex: 1,
  },
  name: 
  {
    margin: 20,
    fontSize: 30, 
    paddingTop: 30,
  },
   MainContainer: {
    flex: 1,
    flexDirection:'row',
    margin: 20,
  },
  gridContainer: {
    flex: 1,
    maxWidth: '80%',
    alignItems: 'center',
  },
  col: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 5,
  },
  button: {
    width: '80%'
  }
});

// Redux
import { setLoading, clearMessages } from '../reduxActions/containerActions';
import { connect } from 'react-redux';

const mapDispatchToProps = dispatch => ({
  setLoading: (val) => dispatch(setLoading(val)),
  clearMessages: () => dispatch(clearMessages())
});

export default connect(null, mapDispatchToProps)(PatientHomeScreen);
