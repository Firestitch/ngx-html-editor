import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

import { fsSourceLoader } from '@firestitch/common';

import { Observable, defer, forkJoin } from 'rxjs';
import { concatMap, defaultIfEmpty, map, shareReplay, startWith, tap } from 'rxjs/operators';


import { FS_HTML_EDITOR_CONFIG } from '../injects/config.inject';
import { FsHtmlEditorConfig } from '../interfaces/html-editor-config';


// Where the app copies the package's assets/froala (README)
const FROALA_DIR = '/assets/froala/';


@Injectable({
  providedIn: 'root',
})
export class FsFroalaLoaderService {
  private _config = inject<FsHtmlEditorConfig>(FS_HTML_EDITOR_CONFIG, { optional: true });
  private _document = inject<Document>(DOCUMENT);
  private _froalaEditor: any;

  // Froala's stylesheet carries the content styles (.fr-view) as well as the editor's
  private _styles$ = defer(() => fsSourceLoader.loadStyles(`${FROALA_DIR}css/froala_editor.pkgd.min.css`))
    .pipe(
      shareReplay(1),
    );

  // Fetched once, when the first editor asks: nothing of the editor loads for the renderer
  private _loaded$ = defer(() => forkJoin([this._styles$, fsSourceLoader.loadJs(`${FROALA_DIR}js/froala_editor.min.js`)]))
    .pipe(
      tap(() => this._froalaEditor = (window as any).FroalaEditor),
      concatMap(() => this._plugins$()),
      map(() => true),
      startWith(false),
      shareReplay(1),
    );

  constructor() {
    this._init();
  }

  public get FroalaEditor() {
    return this._froalaEditor;
  }

  /** The editor: Froala's stylesheet, script and plugins */
  public get loaded$(): Observable<boolean> {
    return this._loaded$;
  }

  /** The renderer: the stylesheet only, as it shows Froala's HTML without editing it */
  public loadStyles(): Observable<unknown> {
    return this._styles$;
  }

  private _init(): void {
    fsSourceLoader.setDocument(this._document);
  }

  // Each plugin registers itself on the FroalaEditor already loaded, so they load side by side.
  // A plugin's FroalaPlugin value is its file's name
  private _plugins$(): Observable<unknown> {
    return forkJoin(this._config.froalaPlugins
      .map((plugin) => fsSourceLoader.loadJs(`${FROALA_DIR}js/plugins/${plugin}.min.js`)))
      .pipe(
        // No plugins configured: the editor is ready all the same
        defaultIfEmpty(null),
      );
  }
}
