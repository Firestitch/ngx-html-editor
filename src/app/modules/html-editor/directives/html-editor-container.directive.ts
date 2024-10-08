import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[fsHtmlEditorContainer]' })
export class FsHtmlEditorContainerDirective {
  public static ngTemplateContextGuard(
    dir: FsHtmlEditorContainerDirective,
    ctx: unknown,
  ): ctx is {
    template: TemplateRef<any>;
  } {
    return true;
  }
}
