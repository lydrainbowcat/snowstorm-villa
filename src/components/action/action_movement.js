import React from "react";
import PropTypes from "prop-types";
import { Combobox } from 'react-widgets'

class ActionMovement extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      location: this.props.originLocation
    };
  }

  handleClick(e){
    e.preventDefault();
    if (this.props.onMoveDone) this.props.onMoveDone(this.state.location);
  }

  render() {
    const {location} = this.state;
    const {places} = this.props;
    console.log(places);

    return (
      <div className="row">
        <div className="col-10">
          <Combobox
            data={Object.values(places)}
            value={location}
            valueField='name'
            textField='title'
            onChange={value => this.setState({ location: value })}
          />
        </div>
        <div className="col-2">
          <a href="#"
             className="btn"
             onClick={this.handleClick}
          >
            移动
          </a>
        </div>
      </div>
    );
  }
}

ActionMovement.propTypes = {
  originLocation: PropTypes.string.isRequired,
  places: PropTypes.object.isRequired,
  onMoveDone: PropTypes.func
};

export default ActionMovement;
