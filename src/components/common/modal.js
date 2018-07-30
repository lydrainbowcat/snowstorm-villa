import React from "react";
import PropTypes from "prop-types";

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    if (this.props.onSubmit) this.props.onSubmit();
  }

  render() {
    const {id, className, buttonText, title, innerElement, summary, hideFooter} = this.props;

    return (
      <span className={className || ""}>
        <button type="button" className="btn btn-sm btn-outline-primary" data-toggle="modal" data-target={`#${id}`}>
          {buttonText}
        </button>
        {summary && <small className="spacing-inline-5">{summary}</small>}        
        <div className="modal fade" id={id} tabIndex="-1" role="dialog" aria-labelledby={`${id}Title`} aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id={`${id}Title`}>
                  {title}
                </h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {innerElement}
              </div>
              {hideFooter || <div className="modal-footer">
                <button type="button" className="btn btn-outline-primary" data-dismiss="modal" onClick={this.handleSubmit}>确定</button>
              </div>}
            </div>
          </div>
        </div>
      </span>
    );
  }
}

Modal.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  buttonText: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  innerElement: PropTypes.object.isRequired,
  summary: PropTypes.string,
  onSubmit: PropTypes.func,
  hideFooter: PropTypes.bool
};

export default Modal;
