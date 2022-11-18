import { Inject, Injectable, Optional } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { fsSourceLoader } from '@firestitch/common'

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { concatMap, map, shareReplay, tap } from 'rxjs/operators';

import { FS_HTML_EDITOR_CONFIG } from '../injects/config.inject';
import { FsHtmlEditorConfig } from '../interfaces/html-editor-config';


@Injectable({
  providedIn: 'root',
})
export class FsFroalaLoaderService {

  private _FroalaEditor: unknown;

  private _froalaLoaded = new BehaviorSubject(false);
  private _froalaPluginsLoaded = new BehaviorSubject(false);
  private _sourceLoader = fsSourceLoader;

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

  public get FroalaEditor(): any {
    return this._FroalaEditor;
  }

  private _load() {
    this._sourceLoader.registerResources({
      froala: [
        '/assets/js/froala/froala_editor.min.js',
        '/assets/css/froala_editor.pkgd.min.css',
      ],
      froala_align: '/assets/js/froala/plugins/align.min.js',
      froala_colors: '/assets/js/froala/plugins/colors.min.js',
      froala_image: '/assets/js/froala/plugins/image.min.js',
      froala_link: '/assets/js/froala/plugins/link.min.js',
      froala_lists: '/assets/js/froala/plugins/lists.min.js',
      froala_paragraph_format: '/assets/js/froala/plugins/paragraph_format.min.js',
      froala_table: '/assets/js/froala/plugins/table.min.js',
      froala_url: '/assets/js/froala/plugins/url.min.js',
      froala_video: '/assets/js/froala/plugins/video.min.js',
      froala_quote: '/assets/js/froala/plugins/quote.min.js',
      froala_draggable: '/assets/js/froala/plugins/draggable.min.js',
      froala_font_size: '/assets/js/froala/plugins/font_size.min.js',
      froala_quick_insert: '/assets/js/froala/plugins/quick_insert.min.js',
      froala_line_height: '/assets/js/froala/plugins/line_height.min.js'
    });

    this._sourceLoader.loadResource('froala')
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
