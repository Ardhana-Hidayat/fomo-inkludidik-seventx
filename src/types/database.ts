export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'guru' | 'siswa';
export type SignPreference = 'SIBI' | 'BISINDO';
export type LearningMode = 'demonstrasi' | 'kosakata' | 'instruksi';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  rombel: string | null;
  sign_preference: SignPreference;
  created_at: string;
}

export interface LearningModule {
  id: string;
  teacher_id: string;
  title: string;
  rombel: string;
  mode: LearningMode;
  share_code: string;
  is_published: boolean;
  created_at: string;
}

export interface LearningCard {
  id: string;
  module_id: string;
  order_index: number;
  word_or_step: string;
  simple_explanation: string;
  image_url: string | null;
  sign_letters: string[];
  audio_text: string;
}

export interface StudentProgress {
  id: string;
  student_id: string | null;
  student_name_guest: string | null;
  module_id: string;
  score: number;
  total_questions: number;
  is_peer_tutor: boolean;
  completed_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          full_name: string;
          role: UserRole;
          rombel?: string | null;
          sign_preference?: SignPreference;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          role?: UserRole;
          rombel?: string | null;
          sign_preference?: SignPreference;
          created_at?: string;
        };
        Relationships: [];
      };
      modules: {
        Row: LearningModule;
        Insert: {
          id?: string;
          teacher_id: string;
          title: string;
          rombel: string;
          mode?: LearningMode;
          share_code: string;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          teacher_id?: string;
          title?: string;
          rombel?: string;
          mode?: LearningMode;
          share_code?: string;
          is_published?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      learning_cards: {
        Row: LearningCard;
        Insert: {
          id?: string;
          module_id: string;
          order_index: number;
          word_or_step: string;
          simple_explanation: string;
          image_url?: string | null;
          sign_letters: string[];
          audio_text: string;
        };
        Update: {
          id?: string;
          module_id?: string;
          order_index?: number;
          word_or_step?: string;
          simple_explanation?: string;
          image_url?: string | null;
          sign_letters?: string[];
          audio_text?: string;
        };
        Relationships: [];
      };
      student_progress: {
        Row: StudentProgress;
        Insert: {
          id?: string;
          student_id?: string | null;
          student_name_guest?: string | null;
          module_id: string;
          score: number;
          total_questions: number;
          is_peer_tutor?: boolean;
          completed_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string | null;
          student_name_guest?: string | null;
          module_id?: string;
          score?: number;
          total_questions?: number;
          is_peer_tutor?: boolean;
          completed_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      sign_preference: SignPreference;
      learning_mode: LearningMode;
    };
    CompositeTypes: Record<string, never>;
  };
}
