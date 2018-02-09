import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ScrollView
} from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import * as data from '../services/FakeDataService';
import MedicationTableColumn from './MedicationTableColumn';

export default class MedicationTable extends Component<{}> {
  /*
   * Expects in props:
   *  {
   *    refill, discontinue, change functions
   *  }
   */
  constructor(props) {
    super(props);
    this.state = {
      dateToUpdates: {},
      drugNames: new Set(),
      updates: []
    }
  }

  componentDidMount() {
    this.setup();
  }

  loadMedications = () => {
    this.setState({ loading: true });
    data.getMedicationUpdates()
      .then( updates => {
        const dateToUpdates = {};
        const drugNames = new Set();

        updates.forEach( (update) => {
          if(update.date in dateToUpdates) {
            dateToUpdates[update.date].push(update);
          } else{
            dateToUpdates[update.date] = [update];
          }

          drugNames.add(update.name);
        });

        this.setState({updates: updates, dateToUpdates: dateToUpdates,
          drugNames: drugNames, loading: false});
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  }

  componentDidMount() {
    this.loadMedications();
  }

  // Returns the update with that name, or null if not found
  // updates: Array of update objects
  // name: string
  updateWithName(updates, name) {
    return updates.find( (update) => {
      return update.name === name;
    });
  }

  renderRow(updates, name, columnIndex, rowIndex) {
    let update = this.updateWithName(updates, name);
    if(!update) {
      update = {
        dose: "",
        frequency: "",
        duration: "",
        notes: ""
      }
    }

    return (
      <Row style={styles.row} key={`col${columnIndex}row${rowIndex}`}>
        <Col style={styles.smallCol}><Text style={styles.text}>{update.dose}</Text></Col>
        <Col style={styles.smallCol}><Text style={styles.text}>{update.frequency}</Text></Col>
        <Col style={styles.smallCol}><Text style={styles.text}>{update.duration}</Text></Col>
        <Col style={styles.notesCol}><Text style={styles.text}>{update.notes}</Text></Col>
      </Row>
    )
  }

  // Row order should follow names array
  renderColumn(date, updates, names, i) {
    const rows = names.map( (name, rowIndex) => {
      return this.renderRow(updates, name, i, rowIndex);
    });

    return (
      <Col style={styles.fullCol} key={`col${i}`}>
        <Row style={styles.headerRow}><Text>{date}</Text></Row>
        {rows}  
      </Col>
    );
  }

  renderButtonColumn(updates, names) {
    const rows = names.map( (name, i) => {
      const update = this.updateWithName(updates, name);
      return (
        <Row style={styles.row} key={`buttonRow${i}`}>
          <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => this.props.refill(update)}
              disabled={Boolean(update)}>
            <Text style={styles.button}>R</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => this.props.change(update)}>
            <Text style={styles.button}>C</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => this.props.discontinue(update)}
              disabled={Boolean(update)}>
            <Text style={styles.button}>D</Text>
          </TouchableOpacity>
        </Row>
      )
    });

    return (
        <Col style={styles.nameColumn}>
          <Row style={styles.headerRow}><Text>Actions</Text></Row>
          {rows}
        </Col>
    )
  }

  render() {
    if (!this.state.drugNames || !this.state.dateToUpdates) {
      return (
        <View>
          <Text>No data to show</Text>
        </View>
      )
    }

    const names = Array.from(this.state.drugNames).sort();
    const nameColumn = names.map( (name,i) => {
        return (
          <Row style={styles.row} key={`name${i}`}><Text>{name}</Text></Row>
        )
      });

    const dates = Object.keys(this.state.dateToUpdates).sort().reverse();

    const updateColumns = dates.map( (date, i) => {
        return this.renderColumn(date, this.state.dateToUpdates[date], names, i);
      });

    const mostRecentDate = dates[0];
    const buttonColumn = this.renderButtonColumn(this.state.dateToUpdates[mostRecentDate],
        names);

    // Render row for header, then render all the rows
    return (
      <ScrollView contentContainerStyle={styles.verticalScroller}>
        <ScrollView horizontal contentContainerStyle={styles.horizontalScroller}>
          <Grid>
            <Col style={styles.nameColumn}>
              <Row style={styles.headerRow}><Text>Drug name</Text></Row>
              {nameColumn}
            </Col>
            {buttonColumn}
            {updateColumns}
          </Grid>
        </ScrollView>
      </ScrollView>
    );
  }
}

/*
 * Files that create a renderRow() function should use these styles for
 * consistency
 */
export const styles = StyleSheet.create({
  horizontalScroller: {
    minWidth: 700,
  },
  verticalScroller: {
    minHeight: '60%',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  headerRow: {
    maxHeight: 20,
    backgroundColor: '#dbdbdb',
    borderWidth: 1
  },
  row: {
    height: 60,
    backgroundColor: '#dddddd',
    borderWidth: 1
  },
  notesCol: {
    minWidth: 150,
    backgroundColor: '#adadad',
    borderWidth: 1
  },
  smallCol: {
    minWidth: 60,
    backgroundColor: '#adadad',
    borderWidth: 1
  },
  fullCol: {
    minWidth: 250,
    backgroundColor: '#adadad',
    borderWidth: 1
  },
  nameColumn: {
    minWidth: 100,
    maxWidth: 100,
    backgroundColor: '#adada0',
    borderWidth: 1
  },
  text: {
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    margin: 2,
    padding: 4,
    elevation: 4,
    borderRadius: 2,
    backgroundColor: '#2196F3',
  },
  button: {
    fontWeight: '500',
    color: '#fefefe',
    textAlign: 'center',
  }
});