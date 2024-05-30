
export interface ToolbarButton {
  name: string;
  title?: string;
  svgPath?: string;
  svgKey?: string;
  html?: string;
  undo?: boolean;
  tooltip?: string;
  focus?: boolean;
  showOnMobile?: boolean;
  refreshAfterCallback?: boolean;
  click?: (editor) => void;
  refresh?: (editor, button) => void;
}
