import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

export function resourceLoaderFactory(document: Document) {
  let resourceBase = '/assets/js/froala/';
  let stylesBase = '/assets/css/';

  const head = document.getElementsByTagName('head')[0];
  const files = new Map<string, Observable<unknown>>();
  const window = document.defaultView;

  const resourcePaths = {
    froala: 'froala_editor.min.js',
    align: 'plugins/align.min.js',
    colors: 'plugins/colors.min.js',
    image: 'plugins/image.min.js',
    link: 'plugins/link.min.js',
    lists: 'plugins/lists.min.js',
    paragraph_format: 'plugins/paragraph_format.min.js',
    table: 'plugins/table.min.js',
    url: 'plugins/url.min.js',
    video: 'plugins/video.min.js',
    quote: 'plugins/quote.min.js',
    draggable: 'plugins/draggable.min.js',
    font_size: 'plugins/font_size.min.js',
    quick_insert: 'plugins/quick_insert.min.js',
    line_height: 'plugins/line_height.min.js'
  }

  const stylesPaths = {
    froala: 'froala_editor.pkgd.min.css',
  }

  const loadResource = function (scriptPath: string): Observable<unknown> {
    if (!files.has(scriptPath)) {
      const obs$ = new Observable((obs) => {

        const script = document.createElement('script');
        script.src = scriptPath;

        head.appendChild(script);

        script.onload = () => {
          obs.next();
          obs.complete();
        };

        script.onerror = (err) => {
          obs.error(err);
        }
      })
        .pipe(
          shareReplay(1),
        );

      files.set(scriptPath, obs$);
    }

    return files.get(scriptPath);
  };

  const loadStyles = function (stylePath: string): Observable<unknown> {
    if (!files.has(stylePath)) {
      const obs$ = new Observable((obs) => {
        const style = document.createElement('link');
        style.id = stylePath;
        style.rel = 'stylesheet';
        style.href = `${stylePath}`;

        head.appendChild(style);

        style.onload = () => {
          obs.next();
          obs.complete();
        };

        style.onerror = (err) => {
          obs.error(err);
        }
      });

      files.set(stylePath, obs$);
    }

    return files.get(stylePath);
  };

  return {
    setResourceBase: (path: string) => {
      resourceBase = path;
    },
    setStylesBase: (path: string) => {
      stylesBase = path;
    },
    loadResource: (resourceName: string) => {
      /*
       this line must be here for cases when html-editor loaded together with text-editor
       monaco-editor has it's own loader and it declares "define" variable, so froala tryes to load itself in wrong way
      */
      (window as any).define = null;

      const path = resourcePaths[resourceName] || resourceName;

      return loadResource(resourceBase + path);
    },
    loadStyles: (resourceName: string) => {
      const path = stylesPaths[resourceName] || resourceName;

      return loadStyles(stylesBase + path);
    }
  }
}
