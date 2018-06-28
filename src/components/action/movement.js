import React from "react";
import PropTypes from "prop-types";
import { Combobox } from 'react-widgets'

class Movement extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      location: this.props.originLocation
    };
  }

  handleClick(e) {
    e.preventDefault();
    if (this.props.onMoved) this.props.onMoved(this.state.location);
  }

  render() {
    const {location} = this.state;
    const {places, disabled} = this.props;

    return (
      <div className="row align-items-center">
        <div className="col-10">
          <Combobox
            data={Object.values(places)}
            value={location}
            valueField="name"
            textField="title"
            disabled={disabled}
            onChange={value => this.setState({ location: value })}
          />
        </div>
        <div className="col-2">
          {disabled ||
          <button className="btn btn-outline-primary" onClick={this.handleClick}>
            移动
          </button>}
        </div>
      </div>
    );
  }
}

Movement.propTypes = {
  originLocation: PropTypes.string.isRequired,
  places: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
  onMoved: PropTypes.func
};

export default Movement;
