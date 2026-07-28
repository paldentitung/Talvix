export interface CreateJobInput {
  title: string;
  description: string;
  salary?: number;
  location: string;
  employmentType: string;
  experience: string;
  skills: string[];
  deadline: Date;
  status: string;
}
export interface UpdateJobInput {
  title?: string;
  description?: string;
  salary?: number;
  location?: string;
  employmentType?: string;
  experience?: string;
  skills?: string[];
  deadline?: Date;
  status?: string;
}
export interface UpdateJobInput extends Partial<CreateJobInput> {}

export interface JobResponse {
  id: string;
  title: string;
  description: string;
  salary: number | null;
  location: string;
  employmentType: string;
  experience: string;
  skills: string[];
  deadline: Date;
  status: string;
  recruiterId: string;
  createdAt: Date;
  updatedAt: Date;
}
