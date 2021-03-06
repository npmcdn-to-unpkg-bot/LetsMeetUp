import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import { grey600, red500 } from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton'
import Chip from 'material-ui/Chip';

import InfiniteCalendar from 'react-infinite-calendar';

import { storeName, storePurpose, registerEvent, storeDateArray, storeDateArrayErrorLabel, popDateArray,
         storeNameErrorLabel, storePurposeErrorLabel } from './../actions/registerActions';

let styles = {
  formLabel: {
    text: 'bold',
    fontSize: '25px',
    color: grey600
  },
  errorLabel: {
    text: 'bold',
    fontSize: '22px',
    color: red500
  },
  chip: {
    margin: 4,
  }
};

let buttonStyle = {
  margin : 12
};

let mymap;

class RegisterComponent extends Component {
  constructor(props) {
    super(props);
    this.storeName = this.storeName.bind(this);
    this.storePurpose = this.storePurpose.bind(this);
    this.registerEvent = this.registerEvent.bind(this);
    this.storeDate = this.storeDate.bind(this);
    this.renderChip = this.renderChip.bind(this);
  }

  componentDidMount() {
  }

// method is invoked when you delete a selected date, it in turn deletes from the state object.
  handleRequestDelete(label) {
    this.props.dispatch(popDateArray(label))
    if (this.props.dateArray.length <= 5) {
      this.props.dispatch(storeDateArrayErrorLabel(''));
    }
  }

// stores the name of the event creator.
  storeName(e) {
    if (e.target.value.length >= '40') {
      this.props.dispatch(storeNameErrorLabel('Only 40 characters permitted!!!'))
    } else {
      this.props.dispatch(storeNameErrorLabel(''))
      this.props.dispatch(storeName(e.target.value));
    }
  }

// stores the purpose of the event and throws an error in case of any edge cases failed.
  storePurpose(e) {
    if (e.target.value.length >= '100') {
      this.props.dispatch(storePurposeErrorLabel('Only 100 characters permitted!!!'))
    } else {
      this.props.dispatch(storePurposeErrorLabel(''))
      this.props.dispatch(storePurpose(e.target.value));
    }
  }

// Stores the selected date in the state object.
  storeDate(date) {
    if (this.props.dateArray.length <= 5) {
      this.props.dispatch(storeDateArray(date.format('ddd, MMM Do YYYY')));
    } else {
      this.props.dispatch(storeDateArrayErrorLabel('Only 6 dates permitted'));
    }
  }

  registerEvent(e) {
    if (this.props.name.length === 0) {
      this.props.dispatch(storeNameErrorLabel('Name field is required!!'));
    } else if (this.props.purpose.length === 0) {
      this.props.dispatch(storePurposeErrorLabel('Purpose field is required!!'));
    } else {
      this.props.dispatch(registerEvent(this.props.name, this.props.purpose, this.props.dateArray));
    }
  }

  renderChip(data) {
    return (
      <div>
        <div className='row center-xs'>
          <Chip
            key={data}
            onRequestDelete={() => this.handleRequestDelete(data)}
            style={styles.chip}>
            {data}
          </Chip>
        </div>
        <br />
      </div>
    );
  }

  render() {
    let today = new Date();
    let minDate = Number(today); // One week before today
    let min = Number(new Date() - (24*60*60*1000) * 60); // One week before today

    let dateArray = this.props.dateArray.map(this.renderChip, this);

    return (
      <div>
        <br />
        <div className='row'>
          <div className='col-xs-offset-5 col-xs-1'>
            <label style={styles.formLabel}> Name </label>
          </div>
          <div className='col-xs'>
            <TextField id='name' hintText='Name' onChange={this.storeName} value={this.props.name} />
            <br />
            <label style={styles.errorLabel}> {this.props.nameErrorLabel} </label>
          </div>
        </div>
        <br />
        <div className='row'>
          <div className='col-xs-offset-5 col-xs-1'>
            <label style={styles.formLabel}> Purpose </label>
          </div>
          <div className='col-xs'>
            <TextField id='purpose' hintText='Purpose' onChange={this.storePurpose} value={this.props.purpose}
              multiLine={true}
              rows={2}
              rowsMax={4}
            />
            <br />
            <label style={styles.errorLabel}> {this.props.purposeErrorLabel} </label>
          </div>
        </div>
        <br />
        <div className='row center-xs'>
          <label style={styles.formLabel}> Select the Dates for the Event </label>
        </div>
        <br />
        <div className='row'>
          <div className='row'>
            <div className="col-xs-6">
                { dateArray }
              <div className='row center-xs'>
                <label style={styles.errorLabel}> {this.props.dateArrayErrorLabel} </label>
              </div>
            </div>
            <div className='col-xs-6'>
                <InfiniteCalendar
                    layout='landscape'
                    width={580}
                    height={275}
                    rowHeight={55}
                    onSelect={this.storeDate}
                    keyboardSupport={true}
                />
            </div>
          </div>
        </div>
        <div className='row center-xs'>
          <RaisedButton label="Register" primary={true} style={buttonStyle} disabled={false} onTouchTap={this.registerEvent} />
        </div>
      </div>
    );
  }
}

RegisterComponent.propTypes = {
  name: PropTypes.string.isRequired,
  purpose: PropTypes.string.isRequired,
  dateArray: PropTypes.array.isRequired,
  dateArrayErrorLabel: PropTypes.string.isRequired,
  nameErrorLabel: PropTypes.string.isRequired,
  purposeErrorLabel: PropTypes.string.isRequired
};

export default connect(state => ({
  name: state.name,
  purpose: state.purpose,
  dateArray: state.dateArray,
  dateArrayErrorLabel: state.dateArrayErrorLabel,
  nameErrorLabel: state.nameErrorLabel,
  purposeErrorLabel: state.purposeErrorLabel
}))(RegisterComponent);
