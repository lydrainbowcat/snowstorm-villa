import React from "react";
import ReactDOM from "react-dom";

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onClick();
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

export default ListItem;
