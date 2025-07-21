export interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  type: "generation" | "critique" | "planner";
}

export interface SupplementalInfo {
  id: string;
  title: string;
  content: string;
  tags: string[];
} 