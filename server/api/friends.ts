import { getMockFriends } from '../utils/mockData';

export default defineEventHandler(async (event) => {
  // TODO: Replace with actual database query
  return getMockFriends(5);
});
