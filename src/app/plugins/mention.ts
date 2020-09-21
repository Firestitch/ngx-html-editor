import FroalaEditor from 'froala-editor';

export function registerPluginMention(mention, tribute, tributes: any = {}) {
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
        closeAll(tributes);
        tribute.showMenuForCollection(this.el);
      },

      refresh: function ($btn) {
      }
    });
  }
}

function closeAll(tributes) {
  for (let key in tributes) {
    if (tributes[key].menu) {
      tributes[key].hideMenu();
    }
  }
}
