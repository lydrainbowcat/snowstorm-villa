import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

@observer
class NightAction extends React.Component {
  render() {
    const {role} = this.props;

    return (
      <div className="row align-items-center spacing-10">
        <div className="col-2 text-right">
          {role.title}
        </div>
        <div className="col-8">
          {"无行动可用"}
        </div>
      </div>
    );
  }
}

NightAction.propTypes = {
  role: PropTypes.object.isRequired
};

export default NightAction;
