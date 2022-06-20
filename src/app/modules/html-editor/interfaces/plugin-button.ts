
export interface PluginButton {
  name: string;
  title?: string;
  svgPath?: string;
  undo?: boolean;
  tooltip?: string;
  focus?: boolean;
  showOnMobile?: boolean;
  refreshAfterCallback?: boolean;
  click?: (editor) => void;
  refresh?: (editor, button) => void;
}
