import { Inject, Injectable, Optional } from '@angular/core';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { concatMap, map, shareReplay, tap } from 'rxjs/operators';

import { FS_HTML_EDITOR_CONFIG } from '../injects/config.inject';
import { FsHtmlEditorConfig } from '../interfaces/html-editor-config';

import { ResourceLoader } from '../utils/loader';


@Injectable({
  providedIn: 'root',
})
export class FsFroalaLoaderService {

  private _FroalaEditor: unknown;

  private _froalaLoaded = new BehaviorSubject(false);
  private _defaultPluginsLoaded = new BehaviorSubject(false);

  private _loaded$ = combineLatest([this._froalaLoaded, this._defaultPluginsLoaded])
    .pipe(
      map(([FroalaReady, pluginsRead]) => {
        return pluginsRead && FroalaReady;
      }),
      shareReplay(1),
    );

  constructor(
    @Optional() @Inject(FS_HTML_EDITOR_CONFIG) private _defaultConfig: FsHtmlEditorConfig,
  ) {
    if (this._defaultConfig) {
      if (this._defaultConfig.assetsJSPath) {
        ResourceLoader.setResourceBase(this._defaultConfig.assetsJSPath)
      }

      if (this._defaultConfig.assetsCSSPath) {
        ResourceLoader.setStylesBase(this._defaultConfig.assetsCSSPath)
      }
    }

    this._load();
  }

  public get loaded$(): Observable<boolean> {
    return this._loaded$;
  }

  public get ready(): boolean {
    return this._froalaLoaded.getValue() && this._defaultPluginsLoaded.getValue();
  }

  public get FroalaEditor(): any {
    return this._FroalaEditor;
  }

  private _load() {
    combineLatest([
      ResourceLoader.loadResource('froala'),
      ResourceLoader.loadStyles('froala')
    ])
      .pipe(
        tap(() => {
          this._FroalaEditor = (window as any).FroalaEditor;
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
        const import$ = ResourceLoader.loadResource(pluginName);

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
