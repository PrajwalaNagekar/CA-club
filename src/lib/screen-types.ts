export type ScreenKey =
  | "splash"
  | "login"
  | "otp"
  | "kyc"
  | "home"
  | "tasks"
  | "calendar"
  | "upload"
  | "documents"
  | "ack"
  | "notifications"
  | "chatList"
  | "chat"
  | "profile"
  | "itr";

export type NavigateFn = (screen: ScreenKey) => void;

export interface ScreenProps {
  onNext?: () => void;
  onNavigate?: NavigateFn;
}
