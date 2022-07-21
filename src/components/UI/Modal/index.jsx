import "./modal.scss";

const Modal = ({ visibleRef, isShow, children, contentClassName = "", contentStyle = {} }) => {
  return (
    <>
      {isShow && <modal-backdrop></modal-backdrop>}
      {isShow && (
        <modal-window data-show="show" className="show">
          <div className="modal-block modal-block_medium" style={{ width: "440px" }} ref={visibleRef}>
            <div className="modal-block__title">{children[0]}</div>
            <div className="modal-block__content" style={{ padding: "0 24px" }}>
              <div className={contentClassName} style={contentStyle}>
                {children[1]}
              </div>
            </div>
            <div className="modal-block__footer">{children[2]}</div>
          </div>
        </modal-window>
      )}
    </>
  );
};

export default Modal;
