const avatars = [
  'avatars/avatar1.jpeg',
  'avatars/avatar2.jpeg',
  'avatars/avatar3.jpeg',
  'avatars/avatar4.jpeg',
  'avatars/avatar5.jpeg',
  'avatars/avatar6.jpeg',
  'avatars/avatar7.jpeg',
  'avatars/avatar8.jpeg',
  'avatars/avatar9.jpeg',
  'avatars/avatar10.jpeg',
];

const mockUsers = [
  { id: '1', name: 'Alice Chen', avatar: avatars[0] },
  { id: '2', name: 'Bob Wang', avatar: avatars[1] },
  { id: '3', name: 'Charlie Liu', avatar: avatars[2] },
  { id: '4', name: 'David Zhang', avatar: avatars[3] },
  { id: '5', name: 'Eva Li', avatar: avatars[4] },
  { id: '6', name: 'Frank Wu', avatar: avatars[5] },
  { id: '7', name: 'Grace Lin', avatar: avatars[6] },
  { id: '8', name: 'Henry Xu', avatar: avatars[7] },
];

export const getMockStats = () => ({
  todaySentences: Math.floor(Math.random() * 10),
  weekSentences: Math.floor(Math.random() * 50),
  todayLikes: Math.floor(Math.random() * 15),
  weekLikes: Math.floor(Math.random() * 70),
});

export const getMockRankingUsers = (count: number) => {
  const runtimeConfig = useRuntimeConfig()
  const baseURL = runtimeConfig.app.baseURL
  
  return mockUsers
    .slice(0, count)
    .map(user => ({
      ...user,
      sentenceCount: Math.floor(Math.random() * 20),
      isFollowing: Math.random() > 0.5,
      avatar: baseURL + user.avatar
    }));
};

export const getMockFriends = () => {
  const runtimeConfig = useRuntimeConfig()
  const baseURL = runtimeConfig.app.baseURL
  return mockUsers.map(user => ({
    ...user,
    todayCount: Math.floor(Math.random() * 10),
    weekCount: Math.floor(Math.random() * 50),
    isFollowing: true,
    avatar: baseURL + user.avatar
  }));
};
