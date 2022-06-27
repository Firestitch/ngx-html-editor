import { Inject, Injectable, Optional } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { concatMap, map, shareReplay, tap } from 'rxjs/operators';

import { FS_HTML_EDITOR_CONFIG } from '../injects/config.inject';
import { FsHtmlEditorConfig } from '../interfaces/html-editor-config';

import { resourceLoaderFactory } from '../utils/loader';


@Injectable({
  providedIn: 'root',
})
export class FsFroalaLoaderService {

  private _FroalaEditor: unknown;

  private _froalaLoaded = new BehaviorSubject(false);
  private _froalaPluginsLoaded = new BehaviorSubject(false);
  private _resourceLoader = resourceLoaderFactory(this._document);

  private _loaded$ = combineLatest([this._froalaLoaded, this._froalaPluginsLoaded])
    .pipe(
      map(([FroalaReady, pluginsRead]) => {
        return pluginsRead && FroalaReady;
      }),
      shareReplay(1),
    );

  constructor(
    @Optional() @Inject(FS_HTML_EDITOR_CONFIG)
    private _defaultConfig: FsHtmlEditorConfig,
    @Inject(DOCUMENT)
    private _document: Document,
  ) {
    if (this._defaultConfig) {
      if (this._defaultConfig.assetsJSPath) {
        this._resourceLoader.setResourceBase(this._defaultConfig.assetsJSPath)
      }

      if (this._defaultConfig.assetsCSSPath) {
        this._resourceLoader.setStylesBase(this._defaultConfig.assetsCSSPath)
      }
    }

    this._load();
  }

  public get loaded$(): Observable<boolean> {
    return this._loaded$;
  }

  public get ready(): boolean {
    return this._froalaLoaded.getValue() && this._froalaPluginsLoaded.getValue();
  }

  public get FroalaEditor(): any {
    return this._FroalaEditor;
  }

  private _load() {
    combineLatest([
      this._resourceLoader.loadResource('froala'),
      this._resourceLoader.loadStyles('froala')
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
          this._froalaPluginsDone();
        }),
      )
      .subscribe();
  }

  private _loadPlugins(): Observable<unknown> {
    const imports = this._defaultConfig
      .froalaPlugins
      .reduce((acc, pluginName) => {
        const import$ = this._resourceLoader.loadResource(pluginName);

        acc.push(import$);

        return acc;
      }, []);

    return combineLatest(imports);
  }

  private _froalaDone() {
    this._froalaLoaded.next(true);
  }

  private _froalaPluginsDone() {
    this._froalaPluginsLoaded.next(true);
  }
}
