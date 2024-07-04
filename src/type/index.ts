interface Register {
  fullname: string;
  email: string;
  password: string;
}

interface Login {
  email: string;
  password: string;
}

interface UserProfileType {
  id: string;
  username: string;
  fullname: string;
  email: string;
  password: null;
  photo_profile: string;
  bio: string;
  created_at: string;
  updated_at: string;
  follower: FollowType[];
  followwing: FollowType[];
}

interface FollowType {
  id: string;
  follower: FillFollower;
  followwing: FillFollower;
}

interface FillFollower {
  id: string;
  username: string;
  fullname: string;
  photo_profile: string;
}

interface SearchUserType {
  id: string;
  username: string;
  fullname: string;
  email: string;
  password: null;
  photo_profile: string;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

interface Suggested {
  id: string;
  username: string;
  fullname: string;
  photo_profile: string;
}

interface EditProfileType {
  fullname?: string;
  password?: string;
  bio?: string;
  photo_profile?: string;
}

interface ThreadPostType {
  content: string;
  images?: File[];
}

interface ReplyPostType {
  content: string;
  image?: File;
  threadId?: string;
}

interface ThreadHomeType {
  id: string;
  content: string;
  images: string[];
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    username: string;
    fullname: string;
    photo_profile: string;
  };
  like: ThreadLikeType[];
  replies: {
    length: number;
  };
  isLiked: boolean;
}

interface ThreadLikeType {
  id: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    username: string;
    fullname: string;
    photo_profile: string;
  };
}

interface ThreadReplyType {
  id: string;
  content: string;
  image: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    username: string;
    fullname: string;
    photo_profile: string;
  };
}
