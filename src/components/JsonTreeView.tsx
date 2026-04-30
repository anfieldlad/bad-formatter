import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

type JsonTreeViewProps = {
  value: unknown;
};

type JsonNodeProps = {
  name?: string;
  value: unknown;
  depth?: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getNodeSummary(value: unknown) {
  if (Array.isArray(value)) {
    return `Array(${value.length})`;
  }

  if (isRecord(value)) {
    const count = Object.keys(value).length;
    return `Object(${count})`;
  }

  return "";
}

function renderPrimitive(value: unknown) {
  if (typeof value === "string") {
    return <span className="tree-string">"{value}"</span>;
  }

  if (typeof value === "number") {
    return <span className="tree-number">{value}</span>;
  }

  if (typeof value === "boolean") {
    return <span className="tree-boolean">{String(value)}</span>;
  }

  if (value === null) {
    return <span className="tree-null">null</span>;
  }

  return <span className="tree-null">{String(value)}</span>;
}

function JsonNode({ name, value, depth = 0 }: JsonNodeProps) {
  const isExpandable = Array.isArray(value) || isRecord(value);
  const [expanded, setExpanded] = useState(depth < 1);
  const entries = Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as const)
    : isRecord(value)
      ? Object.entries(value)
      : [];

  if (!isExpandable) {
    return (
      <div className="tree-row primitive" style={{ paddingLeft: depth * 18 }}>
        {name !== undefined && <span className="tree-key">"{name}": </span>}
        {renderPrimitive(value)}
      </div>
    );
  }

  return (
    <div className="tree-node">
      <button
        type="button"
        className="tree-toggle"
        style={{ paddingLeft: depth * 18 }}
        aria-expanded={expanded}
        onClick={() => setExpanded((current) => !current)}
      >
        {expanded ? (
          <ChevronDown aria-hidden="true" size={16} />
        ) : (
          <ChevronRight aria-hidden="true" size={16} />
        )}
        {name !== undefined && <span className="tree-key">"{name}": </span>}
        <span className="tree-summary">{getNodeSummary(value)}</span>
      </button>

      {expanded && (
        <div className="tree-children">
          {entries.map(([childName, childValue]) => (
            <JsonNode
              key={`${depth}-${childName}`}
              name={childName}
              value={childValue}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function JsonTreeView({ value }: JsonTreeViewProps) {
  return (
    <div className="tree-view" aria-label="Output JSON tree">
      <JsonNode value={value} />
    </div>
  );
}
