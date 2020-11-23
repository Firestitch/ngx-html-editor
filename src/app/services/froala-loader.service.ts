import { Inject, Injectable, Optional } from '@angular/core';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { concatMap, map, shareReplay, tap } from 'rxjs/operators';

import { FS_HTML_EDITOR_CONFIG } from '../injects/config.inject';
import { FsHtmlEditorConfig } from '../interfaces/html-editor-config';
import { loadScriptChunks } from '../utils/load-script-chunks';
import { loadStyles } from '../utils/load-styles';


@Injectable({
  providedIn: 'root',
})
export class FsFroalaLoaderService {

  private _FroalaEditor: unknown;

  private _froalaLoaded = new BehaviorSubject(false);
  private _defaultPluginsLoaded = new BehaviorSubject(false);

  private _ready$ = combineLatest([this._froalaLoaded, this._defaultPluginsLoaded])
    .pipe(
      map(([FroalaReady, pluginsRead]) => {
        return pluginsRead && FroalaReady;
      }),
      shareReplay(1),
    );

  constructor(
    @Optional() @Inject(FS_HTML_EDITOR_CONFIG) private _defaultConfig: FsHtmlEditorConfig,
  ) {
    this._load();
    // this._loadPlugins();
  }

  public get ready$(): Observable<boolean> {
    return this._ready$;
  }

  public get ready(): boolean {
    return this._froalaLoaded.getValue() && this._defaultPluginsLoaded.getValue();
  }

  public get FroalaEditor(): any {
    return this._FroalaEditor;
  }

  private _load() {
    combineLatest([
      loadScriptChunks(
        import(/* webpackChunkName: "froala-editor" */ '@firestitch/froala')
      ),
      loadStyles('/assets/css/froala_editor.pkgd.min.css')
    ])
      .pipe(
        tap(([editor]) => {
          this._FroalaEditor = editor;
          this._froalaDone();
        }),
        concatMap(() => {
          return this._loadPlugins();
        }),
        tap(() => {
          this._defaultPluginsDone();
        }),
      )
      .subscribe();
  }

  private _loadPlugins(): Observable<unknown> {
    const imports = this._defaultConfig
      .defaultPlugins
      .reduce((acc, pluginName) => {
        const import$ = loadScriptChunks(
          import(/* webpackChunkName: "froala-plugins" */ '@firestitch/froala/js/plugins/' + pluginName + '.min.js'),
        );

        acc.push(import$);

        return acc;
      }, []);

    return combineLatest(imports);
  }

  private _froalaDone() {
    this._froalaLoaded.next(true);
  }

  private _defaultPluginsDone() {
    this._defaultPluginsLoaded.next(true);
  }
}
