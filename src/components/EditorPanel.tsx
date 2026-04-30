import type { ReactNode } from "react";
import type { TextStats as TextStatsType } from "../types/formatter";
import { TextStats } from "./TextStats";

type EditorPanelProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  readOnly?: boolean;
  stats: TextStatsType;
  headerLeftSlot?: ReactNode;
  headerRightSlot?: ReactNode;
  children?: ReactNode;
  onChange?: (value: string) => void;
};

export function EditorPanel({
  id,
  label,
  value,
  placeholder,
  readOnly = false,
  stats,
  headerLeftSlot,
  headerRightSlot,
  children,
  onChange,
}: EditorPanelProps) {
  return (
    <section className="editor-panel">
      <div className="editor-header">
        <div className="editor-header-left">
          <label htmlFor={id}>{label}</label>
          {headerLeftSlot}
        </div>
        {headerRightSlot ? (
          <div className="editor-header-actions">{headerRightSlot}</div>
        ) : null}
      </div>

      <div className="editor-body">
        {children ?? (
          <textarea
            id={id}
            className="editor"
            value={value}
            placeholder={placeholder}
            readOnly={readOnly}
            spellCheck={false}
            onChange={(event) => onChange?.(event.target.value)}
          />
        )}
      </div>

      <div className="editor-footer">
        <TextStats label={label} stats={stats} />
      </div>
    </section>
  );
}
