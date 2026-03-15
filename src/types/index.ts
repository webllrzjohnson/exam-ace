export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Partial<Record<string, string>> };

export type Review = {
  id: string;
  name: string;
  province: string;
  rating: number;
  text: string;
  avatarUrl: string | null;
  createdAt: string;
};
