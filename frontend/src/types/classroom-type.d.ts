export interface ClassroomType {
  id: string;
  teacher_id: string;
  teacher_name: string;
  teacher_username: string;
  name: string;
  created_at: string;
}

export type ClassroomsType = ClassroomType[];
