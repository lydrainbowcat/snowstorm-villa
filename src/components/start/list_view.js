import React from "react";
import PropTypes from "prop-types";
import ListItem from "./list_item";

class ListView extends React.Component {
  constructor(props) {
    super(props);
  }

  handleItemClick(item) {
    if (this.props.onItemClick) this.props.onItemClick(item);
  }

  render() {
    const {items} = this.props;

    return (
      <div className="list-group">
        {items.map(item =>
          <ListItem
            key={item.name}
            text={item.title}
            onClick={this.handleItemClick.bind(this, item)}
          />
        )}
      </div>
    );
  }
}

ListView.propTypes = {
  items: PropTypes.array.isRequired,
  onItemClick: PropTypes.func
};

export default ListView;
