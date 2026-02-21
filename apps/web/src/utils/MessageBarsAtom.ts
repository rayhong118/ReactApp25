import { atom, useAtomValue, useSetAtom } from "jotai";
import type { IMessageBarProps } from "../components/MessageBar";

export const MessageBarsAtom = atom<IMessageBarProps[]>([]);

export const useGetMessageBars = () => useAtomValue(MessageBarsAtom);
export const useAddMessageBars = () => {
  const addMessageBars = useSetAtom(MessageBarsAtom);
  return (newMessageBars: IMessageBarProps[]) => {
    addMessageBars((prev) => [...prev, ...newMessageBars]);
  };
};
export const useClearMessageBars = () => useSetAtom(MessageBarsAtom)([]);

export const useDismissMessageBar = () => {
  const dismissMessageBar = useSetAtom(MessageBarsAtom);
  return (id: string) =>
    dismissMessageBar((prev) => prev.filter((bar) => bar.id !== id));
};
