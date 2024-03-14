/* eslint-disable react/prop-types */
import { Handle } from "reactflow";
import "./CustomNode.css";

const CustomNode = ({ data, selected }) => {
  return (
    <div
      className="custom-node"
      style={{ border: selected && "solid 2px red" }}
    >
      <div className="custom-node-header">{data.header}</div>
      <div className="custom-node-content">
        <p className="custom-node-text">{data.text}</p>
      </div>
      {data.type !== "source" && (
        <Handle
          type="target"
          position="left"
          style={{ background: "#555", borderRadius: "50%" }}
          id="a"
        />
      )}
      <Handle
        type="source"
        position="right"
        style={{ background: "#555", borderRadius: "50%" }}
        id="b"
      />
    </div>
  );
};

export default CustomNode;
