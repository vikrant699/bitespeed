/* eslint-disable react/prop-types */
import { useState } from "react";
import { MdArrowBack, MdMessage } from "react-icons/md";
import "./Sidebar.css"; // Import the CSS file

const Sidebar = ({
  selectedNodes,
  getHeaderValue,
  getTextValue,
  onBackClick,
}) => {
  const [headerValue, setHeaderValue] = useState("");
  const [textValue, setTextValue] = useState("");

  const handleChangeHeader = (event) => {
    setHeaderValue(event.target.value);
  };

  const handleChangeText = (event) => {
    setTextValue(event.target.value);
  };

  const onSubmit = (header, text) => {
    getHeaderValue(header);
    getTextValue(text);
  };

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="sidebar-container">
      {selectedNodes && selectedNodes.length === 1 ? (
        <div className="sidebar-content">
          <div className="back-btn" onClick={onBackClick}>
            <MdArrowBack />
            <p>Messages</p>
          </div>
          <p>Header</p>
          <input
            id="header"
            type="text"
            value={headerValue}
            onChange={handleChangeHeader}
            placeholder="Enter header ..."
          />
          <p>Text</p>
          <input
            id="text"
            type="text"
            value={textValue}
            onChange={handleChangeText}
            placeholder="Enter text ..."
          />
          <button
            className="submit"
            onClick={() => onSubmit(headerValue, textValue)}
          >
            Submit
          </button>
        </div>
      ) : (
        <div
          className="message-container"
          onDragStart={(event) => onDragStart(event, "default")}
          draggable
        >
          <MdMessage />
          <p>Message</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
