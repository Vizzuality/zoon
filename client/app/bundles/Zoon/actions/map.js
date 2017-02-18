import { MAP_TYPE_PICK } from '../action_types';

export const pickMapGranularity = (granularity) => ({
  type: MAP_TYPE_PICK,
  granularity,
});
