import React from "react";
import PropTypes from "prop-types";
import Tooltip from "../common/tooltip";

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    if (this.props.onClick) this.props.onClick();
  }

  render() {
    const {text} = this.props;

    return (
      /* eslint-disable jsx-a11y/href-no-hash */
      <a href="#"
         className="list-group-item list-group-item-action"
         onClick={this.handleClick}
      >
        <Tooltip text={text}/>
      </a>
      /* eslint-enable jsx-a11y/href-no-hash */
    );
  }
}

ListItem.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

export default ListItem;
