
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
  // Makes the button a dropdown of these choices (value → label); click
  // receives the chosen value.
  options?: Record<string, string>;
  click?: (editor, value?: string) => void;
  refresh?: (editor, button) => void;
}
