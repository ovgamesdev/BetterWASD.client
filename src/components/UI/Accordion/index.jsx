import { useState } from "react";
import "./accordion.scss";

const Accordion = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion-wrap" style={{ margin: "10px 0" }}>
      <div className="accordion-header-wrap" onClick={() => setIsOpen(!isOpen)}>
        <span className="accordion-header">{isOpen ? props.title_close : props.title_open}</span>
        <div className={isOpen ? "accordion-header-arrow--top" : "accordion-header-arrow--down"}>
          <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" style={{ fill: "currentColor" }}>
            <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
          </svg>
        </div>
        {isOpen && <div className="accordion-marker"></div>}
      </div>
      <div className={`accordion-content-wrap${isOpen ? " accordion-content-wrap--is-opened" : ""}`}>
        <div className="accordion-content">{props.children}</div>
      </div>
    </div>
  );
};

export default Accordion;
