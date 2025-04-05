export interface UserStats {
  todaySentences: number;
  weekSentences: number;
  todayLikes: number;
  weekLikes: number;
}

export interface RankingUser {
  id: string;
  name: string;
  avatar: string;
  sentenceCount: number;
  isFollowing: boolean;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  todayCount: number;
  weekCount: number;
  isFollowing: boolean;
}
