import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  Modal,
  View
} from 'react-native';
import Button from './Button';

/*
 * Modal to add a new Medication
 */
export default class NewMedicationModal extends Component<{}> {
  /*
   * Expects in props:
   *  {
   *    showModal: boolean
   *    closeModal: function
   *    addMedication: function
   *    saveModal: function
   *  }
   */
  constructor(props) {
    super(props);
    this.medication = {
      name: 'Medication',
      properties: {
        medicationKey: 'string',
        drugName: '',
        quantity: 0,
        dosage: 0,
        units: '',
        comments: '' //Consider keeping track of multiple comments (array of strings)
      }
    };
  }

  updateName(drugName) {
    this.medication.properties.drugName = drugName;
    this.props.addMedication(this.medication);
  }

  updateQuantity(quantity) {
    this.medication.properties.quantity = quantity;
    this.props.addMedication(this.medication);
  }

  updateDosage(dosage) {
    this.medication.properties.dosage = dosage;
    this.props.addMedication(this.medication);
  }

  updateUnits(units) {
    this.medication.properties.units = units;
    this.props.addMedication(this.medication);
  }

  updateComments(comments) {
    this.medication.properties.comments = comments;
    this.props.addMedication(this.medication);
  }

  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.showModal}
        onRequestClose={this.props.closeModal} >
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={styles.title}>Add Medication</Text>
            <Text>Medication Name:</Text>
            <TextInput style={styles.notesInput}
              multiline={false}
              numberOfLines={1}
              onChangeText={this.updateName} />
            <Text>Quantity:</Text>
            <TextInput style={styles.notesInput}
              multiline={false}
              numberOfLines={1}
              onChangeText={this.updateQuantity} />
            <Text>Dosage</Text>
            <TextInput style={styles.notesInput}
              multiline={false}
              numberOfLines={1}
              onChangeText={this.updateDosage} />
            <Text>Units:</Text>
            <TextInput style={styles.notesInput}
              multiline={false}
              numberOfLines={1}
              onChangeText={this.updateUnits} />
            <Text>Comments:</Text>
            <TextInput style={styles.notesInput}
              multiline={false}
              numberOfLines={1}
              onChangeText={this.updateComments} />
            <View style={styles.modalFooter}>
              <Button style={styles.buttonContainer} onPress={this.props.closeModal}
                text='Cancel' />

              <Button style={styles.buttonContainer}
                onPress={this.props.saveModal}
                text='Add Medication' />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 24
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    width: '80%',
    height: '60%',
    backgroundColor: '#f6fdff',
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalFooter: {
    height: 60,
    flex: 1,
    flexDirection: 'row',
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    width: 150,
    height: 40,
  },
  notesInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '90%',
    margin: 8,
    borderWidth: 1
  }
});
