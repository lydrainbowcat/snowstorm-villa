import React from "react";
import ReactDOM from "react-dom";
import ListItem from "./list_item"

class ListView extends React.Component {
  constructor(props) {
    super(props);
  }

  handleItemClick(item) {
    this.props.onItemClick(item);
  }

  render() {
    const { items } = this.props;

    return (
      <div className="list-group">
        {items.map(item => {
          <ListItem
            key={item.name}
            text={item.title}
            onClick={this.handleItemClick.bind(this, item)}
          />
        })}
      </div>
    );
  }
}
