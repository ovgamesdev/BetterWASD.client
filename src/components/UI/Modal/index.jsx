import { CSSTransition } from "react-transition-group";

import "./modal.scss";

const Modal = ({ visibleRef, isShow, children, contentClassName = "", contentStyle = {} }) => {
  return (
    <>
      {/* <CSSTransition in={isShow} timeout={400} classNames="list-transition" unmountOnExit appear> */}
      {isShow && <modal-backdrop></modal-backdrop>}
      {/* </CSSTransition> */}

      <CSSTransition in={isShow} timeout={{ enter: 150, exit: 0 }} classNames="modal-transition" unmountOnExit appear>
        <modal-window>
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
      </CSSTransition>
    </>
  );
};

export default Modal;
