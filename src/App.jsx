/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState, useRef, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import CustomNode from "./components/CustomNode/CustomNode.jsx";
import "./App.css";

const nodeTypes = { custom: CustomNode };

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    type: "smoothstep",
    target: "2",
  },
];

const initialNodes = [
  {
    id: "source_0",
    type: "custom",
    data: { type: "source", header: "Send Message", text: "test message 1" },
    position: { x: 250, y: 5 },
  },
];

let id = 1;
const getId = () => `leaf_${id++}`;

export default function App() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [saveError, setSaveError] = useState(false);

  const onConnect = useCallback(
    (params) => {
      const { source, target } = params;
      console.log(source);

      if (source && target) {
        if (edges.some((edge) => edge.source === source)) {
          return;
        }
      }
      setEdges((eds) => addEdge(params, eds));
    },
    [edges, nodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type: "custom",
        position,
        data: {
          type: "leaf",
          header: "Send Message",
          text: `test message ${id}`,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const handleSelectionChange = useCallback((elements) => {
    setSelectedNodes(elements.nodes);
  }, []);

  const getSelectedHeader = (value) => {
    setSelectedNodes((prevState) => {
      const updatedState = [...prevState];
      updatedState[0] = {
        ...updatedState[0],
        data: { ...updatedState[0].data, header: value },
      };
      return updatedState;
    });
  };

  const getSelectedText = (value) => {
    setSelectedNodes((prevState) => {
      const updatedState = [...prevState];
      updatedState[0] = {
        ...updatedState[0],
        data: { ...updatedState[0].data, text: value },
      };
      return updatedState;
    });
  };

  useEffect(() => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (selectedNodes.length === 1 && selectedNodes[0].id === node.id) {
          return {
            ...node,
            data: {
              ...node.data,
              header: selectedNodes[0].data.header,
              text: selectedNodes[0].data.text,
            },
          };
        }
        return node;
      })
    );
  }, [selectedNodes]);

  const handleSaving = () => {
    const hasUnconnected = nodes.some((node) => {
      return !edges.some(
        (edge) => edge.source === node.id || edge.target === node.id
      );
    });

    console.log(hasUnconnected);

    if (nodes.length > 1 && hasUnconnected) {
      setSaveError(true);
      setTimeout(() => {
        setSaveError(false);
      }, 1500);
    }
  };

  const onSidebarBack = () => {
    setSelectedNodes([]);
    setNodes((prevNodes) =>
      prevNodes.map((node) => ({
        ...node,
        selected: false,
      }))
    );
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Chat Flow Builder</h1>
        {saveError && (
          <div className="error">
            <h1 className="error-text">Cannot save flow</h1>
          </div>
        )}
        <button className="save-button" onClick={handleSaving}>
          Save Changes
        </button>
      </header>
      <div className="dndflow">
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onSelectionChange={handleSelectionChange}
              fitView
            >
              <Controls />
            </ReactFlow>
          </div>
          <Sidebar
            selectedNodes={selectedNodes}
            getHeaderValue={getSelectedHeader}
            getTextValue={getSelectedText}
            onBackClick={onSidebarBack}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
