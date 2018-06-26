import React from "react";
import PropTypes from "prop-types";

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
    const { text } = this.props;

    return (
      <a href="#"
        className="list-group-item list-group-item-action"
        onClick={this.handleClick}
      >
        {text}
      </a>
    );
  }
}

ListItem.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

export default ListItem;
