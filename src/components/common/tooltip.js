import React from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import TIPS from "../../lib/constants/tip";

class Tooltip extends React.Component {
  render() {
    const {text} = this.props;
    const tip = TIPS[text];
    let element = text;

    if (tip) {
      element = <span className="text-left">
        <a data-tip={tip}>{text}</a>
        <ReactTooltip place="right" type="dark" effect="solid"/>
      </span>
    }

    return element;
  }
}

Tooltip.propTypes = {
  text: PropTypes.string.isRequired
};

export default Tooltip;
