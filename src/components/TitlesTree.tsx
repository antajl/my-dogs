import React, { useState, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from '@xyflow/react';
import type { Node, Edge, NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { titleNodes, type TitleNode } from '../data/titles';

// Прогресс собак (заглушка)
const dogsProgress: Record<string, string[]> = {
  ten: [],
  tayga: [],
  tundra: [],
};

const dogs = [
  { id: 'ten', name: 'Тень', color: '#8fa3b1' },
  { id: 'tayga', name: 'Тайга', color: '#c9a84c' },
  { id: 'tundra', name: 'Тундра', color: '#7eb89a' },
];

// Кастомный компонент узла
const TitleNodeCard = ({ data }: { data: { nodeData: TitleNode; onNodeClick: (node: TitleNode) => void } }) => {
  const { nodeData, onNodeClick } = data;

  // Определяем статус узла
  const obtainedBy = dogs.filter(dog => (dogsProgress[dog.id as keyof typeof dogsProgress] as string[]).includes(nodeData.id));
  const obtainedByAll = obtainedBy.length === dogs.length;
  const obtainedBySome = obtainedBy.length > 0;

  let borderColor = '#2a2a2a';
  let backgroundColor = '#161616';

  if (obtainedByAll) {
    borderColor = '#c9a84c';
    backgroundColor = 'rgba(201, 168, 76, 0.08)';
  } else if (obtainedBySome) {
    borderColor = '#c9a84c';
  }

  const branchLabel = nodeData.branch === 'coursing' ? 'КУРСИНГ' : nodeData.branch === 'show' ? 'ШОУ' : 'РЕЙСИНГ';

  // Показывать иконки собак только если у хотя бы одной есть прогресс
  const showDogIcons = obtainedBySome || dogs.some(dog => (dogsProgress[dog.id as keyof typeof dogsProgress] as string[]).length > 0);

  return (
    <div
      onClick={() => onNodeClick(nodeData)}
      style={{
        width: '260px',
        padding: '16px',
        backgroundColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'border-color 0.2s',
        fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#c9a84c';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = borderColor;
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />

      <div
        style={{
          fontSize: '10px',
          letterSpacing: '2px',
          color: '#7a7570',
          marginBottom: '8px',
          textTransform: 'uppercase',
        }}
      >
        {branchLabel}
      </div>

      <div
        style={{
          fontSize: '15px',
          color: '#e8e2d9',
          fontFamily: "'Cormorant Garamond', serif",
          lineHeight: '1.3',
          marginBottom: showDogIcons ? '12px' : '0',
        }}
      >
        {nodeData.label}
      </div>

      {showDogIcons && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          {dogs.map((dog) => {
            const obtained = (dogsProgress[dog.id as keyof typeof dogsProgress] as string[]).includes(nodeData.id);
            return (
              <div
                key={dog.id}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: obtained ? dog.color : '#2a2a2a',
                }}
                title={`${dog.name}: ${obtained ? 'Получен' : 'Не получен'}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const nodeTypes: NodeTypes = {
  titleNode: TitleNodeCard,
};

export default function TitlesTree() {
  const [selectedNode, setSelectedNode] = useState<TitleNode | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Преобразуем данные в формат React Flow
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const branchXPositions = { coursing: 0, show: 320, racing: 640 };
    const levelYStep = 160;
    const startY = 100;

    const nodes: Node[] = titleNodes.map((node) => ({
      id: node.id,
      type: 'titleNode',
      position: {
        x: branchXPositions[node.branch],
        y: startY + node.level * levelYStep,
      },
      data: {
        nodeData: node,
        onNodeClick: setSelectedNode,
      },
    }));

    const edges: Edge[] = [];
    titleNodes.forEach((node) => {
      node.parentIds.forEach((parentId) => {
        edges.push({
          id: `${parentId}->${node.id}`,
          source: parentId,
          target: node.id,
          type: 'smoothstep',
          style: { stroke: '#2a2a2a', strokeWidth: 1.5 },
          animated: false,
        });
      });
    });

    return { nodes, edges };
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  if (isMobile) {
    return (
      <div
        style={{
          height: '80vh',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#7a7570',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <p style={{ fontSize: '1.1rem' }}>Дерево титулов лучше просматривать на десктопе</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height: '80vh', minHeight: '600px' }}>
      {/* Заголовки колонок */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '0',
          right: '0',
          display: 'flex',
          justifyContent: 'center',
          gap: '320px',
          zIndex: 1000,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '3px',
            color: '#c9a84c',
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
        >
          КУРСИНГ
        </div>
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '3px',
            color: '#c9a84c',
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
        >
          ШОУ
        </div>
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '3px',
            color: '#c9a84c',
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
        >
          РЕЙСИНГ
        </div>
      </div>

      {/* Легенда */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          zIndex: 1000,
          backgroundColor: 'rgba(22, 22, 22, 0.9)',
          padding: '16px',
          borderRadius: '4px',
          border: '1px solid #2a2a2a',
        }}
      >
        <div style={{ fontSize: '11px', color: '#7a7570', marginBottom: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Легенда
        </div>
        {dogs.map((dog) => (
          <div key={dog.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: dog.color,
              }}
            />
            <span style={{ fontSize: '13px', color: '#e8e2d9' }}>{dog.name}</span>
          </div>
        ))}
        <div style={{ fontSize: '11px', color: '#7a7570', marginTop: '12px', lineHeight: '1.4' }}>
          Нажми на узел чтобы увидеть условие
        </div>
      </div>

      {/* Sidebar для деталей узла */}
      {selectedNode && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            right: '0',
            width: '340px',
            height: '100vh',
            backgroundColor: '#111111',
            borderLeft: '1px solid #2a2a2a',
            padding: '40px 32px',
            zIndex: 1000,
            overflowY: 'auto',
            animation: 'slideIn 0.3s ease',
          }}
        >
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}</style>
          <button
            onClick={() => setSelectedNode(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: '#7a7570',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px',
              lineHeight: '1',
            }}
          >
            ×
          </button>

          <div
            style={{
              fontSize: '11px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#c9a84c',
              marginBottom: '16px',
            }}
          >
            {selectedNode.branch === 'coursing' && 'КУРСИНГ'}
            {selectedNode.branch === 'show' && 'ШОУ'}
            {selectedNode.branch === 'racing' && 'РЕЙСИНГ'}
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '28px',
              color: '#e8e2d9',
              marginBottom: '24px',
              lineHeight: '1.2',
              marginTop: '0',
            }}
          >
            {selectedNode.fullName}
          </h2>

          <div style={{ borderBottom: '1px solid #2a2a2a', marginBottom: '24px' }} />

          <div style={{ marginBottom: '32px' }}>
            <div
              style={{
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#7a7570',
                marginBottom: '12px',
              }}
            >
              Условие получения
            </div>
            <p style={{ fontSize: '15px', color: '#e8e2d9', lineHeight: '1.8', margin: '0' }}>
              {selectedNode.condition}
            </p>
          </div>

          <div style={{ borderBottom: '1px solid #2a2a2a', marginBottom: '24px' }} />

          <div>
            <div
              style={{
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#7a7570',
                marginBottom: '16px',
              }}
            >
              Прогресс
            </div>
            {dogs.map((dog) => {
              const obtained = (dogsProgress[dog.id as keyof typeof dogsProgress] as string[]).includes(selectedNode.id);
              return (
                <div
                  key={dog.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: dog.color,
                    }}
                  />
                  <span style={{ fontSize: '14px', color: '#e8e2d9', flex: 1 }}>{dog.name}</span>
                  <span style={{ fontSize: '14px', color: obtained ? '#c9a84c' : '#7a7570' }}>
                    {obtained ? '✓ Получен' : '○ Не получен'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        style={{ backgroundColor: 'transparent' }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#1a1a1a" />
        <Controls />
      </ReactFlow>
    </div>
  );
}
