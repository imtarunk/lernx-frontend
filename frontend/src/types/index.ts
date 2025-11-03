export interface Course {
  id: string;
  label: string;
  description?: string;
  created_at: string;
}

export interface Question {
  id: string;
  course_id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
  created_at: string;
}

export interface Answer {
  id: string;
  user_id: string;
  question_id: string;
  selected_answer: string;
  is_correct: boolean;
  created_at: string;
}

export interface Video {
  id: string;
  user_id: string;
  question_id: string;
  video_url: string;
  prompt?: string;
  share_token: string;
  created_at: string;
  is_public?: boolean;
}
