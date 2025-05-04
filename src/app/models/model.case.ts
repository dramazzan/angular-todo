export interface Case {
  
    _id?: string;
    title: string;
    description: string;
    status?: 'pending' | 'in-progress' | 'completed';
    dueDate?: Date;
    priority?: 'low' | 'medium' | 'high';
    tags?: string[];
    favorite?: boolean;
    userId?: string;
    createdAt?: Date;
    updatedAt?: Date;

    deletedAt?:Date;
    isDeleted?: boolean
  }
  