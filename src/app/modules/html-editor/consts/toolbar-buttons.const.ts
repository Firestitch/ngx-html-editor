import { ParagraphButtons } from './paragraph-buttons.const';
import { RichButtons } from './rich-buttons.const';
import { TextButtons } from './text-buttons.const';
export const ToolbarButtons = {
  moreText: {
    buttons: TextButtons,
    buttonsVisible: 3,
  },
  moreParagraph: {
    buttons: ParagraphButtons,
    buttonsVisible: 5,
  },
  moreRich: {
    buttons: RichButtons,
    buttonsVisible: 3,
  },
};
