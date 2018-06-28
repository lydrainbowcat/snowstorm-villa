import React from "react";
import { observer } from "mobx-react";
import PlaceTable from "../place/place_table";
import DayAction from "../action/day_action";
import roleStore from "../../lib/store/role_store";

@observer
class InitialPlaceSelector extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
  }

  render() {
    const roles = roleStore.roles;

    return (
      <div className="container">
        <PlaceTable/>
        <h5 className="text-center spacing-20">选择初始地点</h5>
        {roles.map(role=>
          <DayAction
            key={role.name}
            role={role}
          />
        )}
      </div>
    );
  }
}

export default InitialPlaceSelector;
