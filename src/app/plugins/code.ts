//import FroalaEditor from '../froala/js/froala_editor.pkgd.js';
import FroalaEditor from 'froala-editor';

FroalaEditor.DefineIcon('code', {
  NAME: 'code',
  PATH: `M8.9,7.3L4.2,12l4.7,4.7l1.1-1.1L6.4,12L10,8.4L8.9,7.3z M15.1,7.3L14,8.4l3.6,3.6L14,15.6l1.1,1.1l4.7-4.7L15.1,7.3z`,
});

FroalaEditor.RegisterCommand('code', {
  title: 'Code',
  icon: 'code',
  undo: true,
  focus: true,
  showOnMobile: true,
  refreshAfterCallback: true,
  callback: function () {
    const node = this.selection.get();
    this.html.insert('<p class="code">' + this.selection.get().toString() + '</p>');
  },

  refresh: function ($btn) {
  }
})


FroalaEditor.PLUGINS.code = function (editor) {
  return {
    _init: () => {
      editor.events.on('keydown', (e) => {

        const isCode = (el) => {

          if (el) {
            if (el.classList && el.classList.contains('code')) {
              return true;
            }

            if (el.parentElement) {
              return isCode(el.parentElement);
            }
          }

          return false;
        }

        if (e.keyCode === 13) {
          const selection = editor.selection.get();

          if (selection && isCode(selection.baseNode)) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            let br = '<br>';
            const base = selection.baseNode;
            if (base.nodeName === '#text' && selection.baseOffset === base.length) {

              if (!(base.nextSibling && base.nextSibling.nodeName === 'BR')) {
                br += '<br>';
              }
            } else {
              const el: any = Array.from(base.childNodes).splice(selection.baseOffset - 1, 1).pop();
              if (el && el.nodeName !== 'BR') {
                br += '<br>';
              }
            }

            editor.html.insert(br);
            return false;
          }
        }
      }, true);
    },
  }
};
