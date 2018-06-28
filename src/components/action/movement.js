import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { Combobox } from "react-widgets";
import placeStore from "../../lib/store/place_store";

@observer
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
    if (this.props.onMove) this.props.onMove(this.state.location);
  }

  render() {
    const {location} = this.state;
    const {disabled} = this.props;
    const places = placeStore.places;

    return (
      <div className="row align-items-center">
        <div className="col-10">
          <Combobox
            data={places}
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
  originLocation: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  onMove: PropTypes.func
};

export default Movement;
