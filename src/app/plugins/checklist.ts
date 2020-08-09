import FroalaEditor from 'froala-editor';

FroalaEditor.DEFAULTS = Object.assign(FroalaEditor.DEFAULTS, {
  myOption: false
});

FroalaEditor.DefineIcon('checkbox', {
  NAME: 'checkbox',
  PATH: `M8.4,10.3l-1.2,1.2l4,4L20,6.7l-1.2-1.2l-7.6,7.6L8.4,10.3z M18.2,18.2H5.8V5.8h8.9V4H5.8C4.8,4,4,4.8,4,5.8v12.4c0,1,0.8,1.8,1.8,1.8h12.4c1,0,1.8-0.8,1.8-1.8v-7.1h-1.8V18.2z`,
});

FroalaEditor.RegisterCommand('checklist', {
  title: 'Checklist',
  icon: 'checkbox',

  undo: true,
  focus: true,
  showOnMobile: true,
  refreshAfterCallback: true,
  callback: function () {
    this.html.insert('<ul class="checklist"><li></li></ul>');
  },

  refresh: function ($btn) {
  }
})


FroalaEditor.PLUGINS.checklist = function (editor) {
  return {
    _init: () => {
      console.log(editor.opts.myOption);

      editor.events.on('click', (e) => {
        const li = e.target;
        if (li.nodeName === 'LI' && e.offsetX < 0) {

          const items = [li, ...li.querySelectorAll('li')];

          if (li.classList.contains('checked')) {
            items.forEach((item) => {
              item.classList.remove('checked');
            });
          } else {
            items.forEach((item) => {
              item.classList.add('checked');
            });
          }
        }

      }, false);
    },
  }
};
