export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  quantity: number;
  status: 'Available' | 'Reserved' | 'Out of Stock';
  coverImage?: string;
  branch?: string;
}

export type PortalType = 'Home' | 'Student' | 'Employee' | 'Admin' | 'Branch' | 'Blog' | 'Profile';
