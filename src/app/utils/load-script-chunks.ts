import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';


export function loadScriptChunks<T>(
  importPromise: Promise<T>,
): Observable<T> {
  return fromPromise(importPromise)
    .pipe(
      map((m: any) => (m.default || m) as T)
    );
}
