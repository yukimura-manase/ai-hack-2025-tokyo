export interface Thread {
  threadId: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThreadRes {
  threadId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThreadReq {
  userId: string;
  title?: string;
}

export interface ThreadResList {
  threads: ThreadRes[];
}
