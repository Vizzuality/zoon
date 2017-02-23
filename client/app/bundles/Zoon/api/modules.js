import { jsonFetch } from './helpers'
import buildUrl from 'build-url';


export const searchModules = function(searchFamily, searchQuery, searchTags) {
  return jsonFetch(buildUrl('/api/modules', {
    queryParams: { searchFamily, searchQuery, searchTags },
  }), {
    credentials: 'same-origin',
  });
};
