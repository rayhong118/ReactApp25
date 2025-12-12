import { MessageBar } from "@/components/MessageBar";
import { useGetMessageBars } from "@/utils/MessageBarsAtom";


export function MessageBarsContainer() {
  const messageBars = useGetMessageBars();

  return (
    <div id='message-bars' className="fixed bottom-0 left-0 right-0 w-full h-full z-50 pointer-events-none flex flex-col gap-2 pt-10 overflow-y-hidden" >
      {messageBars.length > 0 && (
        messageBars.map((messageBar) => (
          <MessageBar key={messageBar.id} {...messageBar} />
        ))
      )}
    </div >
  );
}