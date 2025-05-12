import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';

import { fsSourceLoader } from '@firestitch/common';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { concatMap, map, shareReplay, tap } from 'rxjs/operators';


import { FS_HTML_EDITOR_CONFIG } from '../injects/config.inject';
import { FsHtmlEditorConfig } from '../interfaces/html-editor-config';


@Injectable({
  providedIn: 'root',
})
export class FsFroalaLoaderService {

  private _froalaLoaded = new BehaviorSubject(false);
  private _froalaPluginsLoaded = new BehaviorSubject(false);
  private _sourceLoader = fsSourceLoader;
  private _froalaEditor: any;

  public get FroalaEditor() {
    return this._froalaEditor;
  }
  
  private _loaded$ = combineLatest([this._froalaLoaded, this._froalaPluginsLoaded])
    .pipe(
      map(([FroalaReady, pluginsRead]) => {
        return pluginsRead && FroalaReady;
      }),
      shareReplay(1),
    );

  constructor(
    @Optional()
    @Inject(FS_HTML_EDITOR_CONFIG)
    private _defaultConfig: FsHtmlEditorConfig,
    @Inject(DOCUMENT)
    private _document: Document,
  ) {
    this._sourceLoader.setDocument(this._document);
    this._load();
  }

  public get loaded$(): Observable<boolean> {
    return this._loaded$;
  }

  private _load() {
    const baseDir = '/assets/froala/';
    this._sourceLoader.registerResources({
      froala: [
        `${baseDir}js/froala_editor.min.js`,
        `${baseDir}css/froala_editor.pkgd.min.css`,
      ],
      froala_align: `${baseDir}js/plugins/align.min.js`,
      froala_colors: `${baseDir}js/plugins/colors.min.js`,
      froala_image: `${baseDir}js/plugins/image.min.js`,
      froala_link: `${baseDir}js/plugins/link.min.js`,
      froala_lists: `${baseDir}js/plugins/lists.min.js`,
      froala_paragraph_format: `${baseDir}js/plugins/paragraph_format.min.js`,
      froala_table: `${baseDir}js/plugins/table.min.js`,
      froala_url: `${baseDir}js/plugins/url.min.js`,
      froala_video: `${baseDir}js/plugins/video.min.js`,
      froala_quote: `${baseDir}js/plugins/quote.min.js`,
      froala_draggable: `${baseDir}js/plugins/draggable.min.js`,
      froala_font_size: `${baseDir}js/plugins/font_size.min.js`,
      froala_quick_insert: `${baseDir}js/plugins/quick_insert.min.js`,
      froala_line_height: `${baseDir}js/plugins/line_height.min.js`,
    });

    this._sourceLoader.loadResource('froala')
      .pipe(
        tap(() => {
          this._froalaEditor = (window as any).FroalaEditor;
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
    const resources = this._defaultConfig
      .froalaPlugins
      .map((pluginName) => `froala_${pluginName}`);

    return this._sourceLoader.loadResources(resources);
  }

  private _froalaDone() {
    this._froalaLoaded.next(true);
  }

  private _froalaPluginsDone() {
    this._froalaPluginsLoaded.next(true);
  }
}
