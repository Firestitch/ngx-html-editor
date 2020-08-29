import FroalaEditor from 'froala-editor';

export function registerPluginMention(mention, tribute) {
  if (mention.iconPath) {
    FroalaEditor.DefineIcon(mention.name, {
      NAME: mention.name,
      PATH: mention.iconPath,
    });

    FroalaEditor.RegisterCommand(mention.name, {
      icon: mention.name,
      title: mention.tooltip,
      undo: true,
      focus: true,
      showOnMobile: true,
      refreshAfterCallback: true,
      callback: function () {
        tribute.showMenuForCollection(this.el);
      },

      refresh: function ($btn) {
      }
    });
  }
}
