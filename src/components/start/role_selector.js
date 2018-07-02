import React from "react";
import PropTypes from "prop-types";
import ListView from "./list_view";

class RoleSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: props.roles,
      choices: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.choices);
    }
  }

  handleSelect(item) {
    const {options, choices} = this.state;
    const newOptions = options.filter(val => val !== item);
    const newChoices = choices.slice();
    newChoices.push(item);
    this.setState({
      options: newOptions,
      choices: newChoices
    });
  }

  handleRemove(item) {
    const {options, choices} = this.state;
    const newOptions = options.slice();
    const newChoices = choices.filter(val => val !== item);
    newOptions.push(item);
    this.setState({
      options: newOptions,
      choices: newChoices
    });
  }

  render() {
    const {options, choices} = this.state;
    const canStart = choices.length >= 6;

    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <h5 className="text-center spacing-20">可选择的角色</h5>
            <ListView
              items={options}
              onItemClick={this.handleSelect}
            />
          </div>
          <div className="col">
            <h5 className="text-center spacing-20">已选择的角色</h5>
            <ListView
              items={choices}
              onItemClick={this.handleRemove}
            />
            <div className="row">
              <div className="col text-right">
                <button type="button" className="btn btn-outline-success spacing-20"
                        onClick={this.handleSubmit} disabled={!canStart}>
                  开局
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RoleSelector.propTypes = {
  roles: PropTypes.array.isRequired,
  onSubmit: PropTypes.func
};

export default RoleSelector;
