export type UserRole = "admin" | "customer";

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  promotedBy?: string | null;
};
