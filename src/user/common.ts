export interface ICommonProps {
  sendMessage(id: number, message: string): void;
  recallMessage(id: number): void;
}
