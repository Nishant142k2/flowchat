import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';

import './App.css';

// TextNode Component - customizable and extensible node type
const TextNode = ({ data }) => {
  return (
    <div className="text-node">
      <Handle type="target" position={Position.Top} isConnectable={true} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} isConnectable={true} />
    </div>
  );
};

// Node Types Registry for extensibility
const nodeTypes = {
  text: TextNode
};

function FlowBuilder() {
  // Initial state setup using React Flow hooks
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // When a new edge is connected, ensure only one edge from source
  const onConnect = useCallback(
    (params) => {
      // Prevent multiple edges from same source handle
      const hasSourceEdge = edges.some(
        (edge) => edge.source === params.source && edge.sourceHandle === params.sourceHandle
      );
      if (hasSourceEdge) return;

      setEdges((eds) => addEdge(params, eds));
    },
    [edges]
  );

  // Handler to drop nodes from panel
  const onDrop = useCallback((event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;

    const position = { x: event.clientX - 200, y: event.clientY - 50 }; // adjust as needed
    const newNode = {
      id: `${+new Date()}`,
      type,
      position,
      data: { label: `${type} node` },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="flow-builder">
      <div className="nodes-panel">
        {/* Nodes Panel - currently supports only text node */}
        <div
          className="node-item"
          onDragStart={(e) => e.dataTransfer.setData('application/reactflow', 'text')}
          draggable
        >
          Text Message Node
        </div>
      </div>

      <div className="flow-canvas" onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default FlowBuilder;
