import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import NewMedicationModal from './NewMedicationModal';
import UpdateMedicationModal from './UpdateMedicationModal';
import Button from './Button';
import Medication from '../models/Medication';

export default class MedicationInventory extends Component<{}> {
  /*
   * Expects in props:
   *  {
   *    rows: [Medication],
   *    saveEditModal: function
   *    saveNewModal: function
   *  }
   */
  constructor(props) {
    super(props);
    this.tableHeaders = ['Drug Name', 'Quantity', 'Dosage', 'Units', 'Notes'];
    this.rowNum = 0;
    // showNewModal is the modal for new medication
    // showEditModal is the modal to edit medication
    // name is the name of the medication
    // medicationKey is the key of the medication we are editing in the Modal
    // medicationProperties is an array of the medication properties
    this.state = {showNewModal: false, showEditModal: false, name: null, medicationKey: null, medicationProperties: null, newMedication:null};
  }


  // Modal to add new medication
  openNewModal = () => {
    this.setState({showNewModal: true});
  }
  closeNewModal = () => {
    this.setState({showNewModal: false, newMedication: null});
  }

  addMedication = (newMedication) => {
    this.setState({newMedication: newMedication});
  }


  // Modal to edit existing medication
  openEditModal = (name, medicationKey, medicationProperties) => {
    this.setState({showEditModal: true, name: name, medicationKey: medicationKey, medicationProperties: medicationProperties});
  }
  closeEditModal = () => {
    this.setState({showEditModal: false, name: null, medicationKey: null, medicationProperties: null});
  }

  updateMedication = (newmedicationProperties) => {
    this.setState({medicationProperties: newmedicationProperties});
  }

  // Renders each column in a row
  renderCol = (element, keyFn, index) => {
    return (
      <Col style={styles.otherCol} size={5} key={keyFn(index)}>
        <Text style={styles.text}>{element}</Text>
      </Col>
    );
  }

  renderRow = (data, keyFn) => {
    //puts the properties of medication into an array
    let medData = Object.keys(data.properties).map(i => data.properties[i]);
    //pops the medicationKey from array
    let medicationKey = medData.shift();    
    
    // Renders each property
    let cols = medData.map((e,i) => {
      return this.renderCol(e,keyFn,i);
    });
    
    // Puts the medicationKey back into array
    medData.push(medicationKey);

    return (

      // Entire row is clickable to open a modal to edit
      <Row key={`row${this.rowNum++}`} style={styles.rowContainer}
      onPress={() => this.openEditModal(medData[0], medicationKey, medData)}>
        {cols}
      </Row>
    );
  }

  renderHeader(data, keyFn) {
    const cols = data.map( (e,i) => (
      <Col size={2} style={styles.otherCol} key={keyFn(i)}>
        <Text style={styles.text}>{e}</Text>
      </Col>
    ));

    return (
      <Row style={styles.headerRow}>
        {cols}
      </Row>
    );
  }

  render() {

    // Render row for header, then render all the rows
    return (

      <View style={styles.container}>

        <NewMedicationModal
          showModal={this.state.showNewModal}
          closeModal={this.closeNewModal}
          addMedication={this.addMedication}
          saveModal={() => this.props.saveModal1(newMedication)}
        />

        <UpdateMedicationModal
          showModal={this.state.showEditModal}
          closeModal={this.closeEditModal}
          saveModal={() => this.props.saveModal2(this.state.medicationKey, this.state.medicationProperties)}
          updateMedication={this.updateMedication}
          medicationProperties={this.state.medicationProperties}
        />


        <Button style={styles.buttonContainer}
          onPress={this.openNewModal}
          text='Add Medication' />

        <Text style={styles.title}>Medication Inventory{"\n"}</Text>


        <Grid>
          {this.renderHeader(this.tableHeaders, (i) => `header${i}`)}
          {this.props.rows.map( row => this.renderRow(row, (i) => `row${i}`) )}
        </Grid>

        
      </View>
    );
  }
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
   headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    textAlign: 'center',
},
  rowContainer: {
    borderWidth: 1,
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  otherCol: {
    borderWidth: 1,
    minWidth: 150,
    minHeight: 25
  },

  headerRow: {
    backgroundColor: '#dbdbdb',
    borderWidth: 1,
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  text: {
    textAlign: 'center',
    width: 130,
  },
  buttonContainer: {
    position: 'relative', 
    top: 38, 
    left: 550, 
    width: 200,
    height: 30,
  },
});
