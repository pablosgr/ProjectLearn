export interface TeacherData {
  id: string;
  name: string;
}

export interface StudentClassroom {
  id: string;
  name: string;
  description: string;
  teacher: TeacherData;
  created_at: string;
  enrollment_id: string;
}

export type StudentClassroomsResponse = StudentClassroom[];
