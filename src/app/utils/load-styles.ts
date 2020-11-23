import { Observable } from 'rxjs';

export function loadStyles(styleName: string): Observable<void> {
  return new Observable((obs) => {
    const head = document.getElementsByTagName('head')[0];

    const style = document.createElement('link');
    style.id = styleName;
    style.rel = 'stylesheet';
    style.href = `${styleName}`;

    head.appendChild(style);

    style.onload = () => {
      obs.next();
      obs.complete();
    };

    style.onerror = (err) => {
      obs.error(err);
    }
  });
}
