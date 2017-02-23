import { jsonFetch } from './helpers'
import buildUrl from 'build-url';


export const createWorkflow = function(workflow, csrf) {
  return jsonFetch('/api/workflows', {
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify({ workflow }),
    headers: new Headers({
      'X-CSRF-TOKEN': csrf,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }),
  });
}
