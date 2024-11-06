export interface TrainerPayload {
  id: number;
  name: string;
  introduction: string;
  qualifications: string[];
  careerDetails: string[];
  profileImageUrl: string | null;
  studentsCount: number;
}