import { getMockRankingUsers } from '../../utils/mockData';

export default defineEventHandler(async (event) => {
  const type = event.context.params.type;
  
  // TODO: Replace with actual database query
  return getMockRankingUsers(5);
});
