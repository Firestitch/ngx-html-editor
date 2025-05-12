import { ParagraphButtons } from './paragraph-buttons.const';
import { RichButtons } from './rich-buttons.const';
import { TextButtons } from './text-buttons.const';
export const ToolbarXsButtons = {
  moreText: {
    buttons: TextButtons,
    buttonsVisible: 2,
  },
  moreParagraph: {
    buttons: ParagraphButtons,
    buttonsVisible: 2,
  },
  moreRich: {
    buttons: RichButtons,
    buttonsVisible: 1,
  },
};
