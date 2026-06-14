"use client";

import { ApChatWithMessages } from "@/lib/db/apChat/schema";
import { Button } from "@/components/ui/button";
import { Check, ChevronUp, Loader2, Send, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { addApChatMessage } from "@/lib/db/apChatMessage/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import DialogWrapper from "@/components/modal/modal-wrapper";

type Message = ApChatWithMessages["messages"][number] & {
  status: "pending" | "success" | "error";
};

export function Chat({
  chat,
  projectId,
}: {
  chat: ApChatWithMessages;
  projectId: number;
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(
    chat.messages.map((message) => ({
      ...message,
      status: "success",
    }))
  );
  const [clicked, setClicked] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    setMessages(
      chat.messages.map((message) => ({
        ...message,
        status: "success",
      }))
    );
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    if (messages.some((message) => message.status === "pending")) {
      toast.error("Пожалуйста, дождитесь ответа на предыдущее сообщение.");
      return;
    }

    setClicked(true);
    setMessage("");
    setMessages((prev) => [
      ...prev.filter((message) => message.id !== 0),
      {
        id: 0,
        role: "user",
        content: message,
        status: "pending",
        createdAt: new Date().toISOString(),
        price: null,
        inputTokens: null,
        outputTokens: null,
        usedContext: null,
      },
    ]);

    const action = await addApChatMessage({
      body: {
        chatId: chat.id,
        role: "user",
        content: message,
        inputTokens: null,
        outputTokens: null,
        price: null,
        usedContext: null,
      },
    });

    if ("message" in action) {
      toast.error(action.message);
      setMessages((prev) =>
        prev.map((message) =>
          message.id === 0 ? { ...message, status: "error" } : message
        )
      );
    } else {
      setMessages((prev) => [
        ...prev.filter((message) => message.id !== 0),
        ...action.map((m) => ({ ...m, status: "success" as const })),
      ]);
    }

    setClicked(false);
  };

  return (
    <div className='border rounded-2xl p-4 flex flex-col bg-[#865BBD] h-[calc(100dvh-170px)]'>
      <div className='flex items-center justify-between gap-2 mb-4'>
        <div className='flex items-center gap-2 text-white'>
          <Stars className='w-5 h-5' />
          <p className='text-sm font-medium'>{chat.title}</p>
        </div>
        <Button
          type='button'
          variant='secondary'
          className='close-button p-0 w-8 h-8 flex items-center justify-center bg-[#F2F2F2] rounded-full shrink-0'
          asChild
        >
          <Link href={`/admin/ai/${projectId}`} replace>
            <X className='w-4 h-4' />
          </Link>
        </Button>
      </div>
      <div className='relative rounded-2xl p-4 bg-white flex flex-col flex-1 overflow-hidden'>
        <div className='flex-1 overflow-y-auto rounded-2xl mb-4'>
          <div className='space-y-4'>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className='relative w-full'>
          <Textarea
            placeholder='Cпрашивайте о чем угодно в рамках аптеки'
            className='border w-full min-h-[48px] max-h-[120px] pr-12 resize-none rounded-2xl bg-[#F2F2F2] border-none'
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              // Auto-resize the textarea
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !clicked &&
                message.trim()
              ) {
                e.preventDefault();
                sendMessage();
              }
            }}
            ref={(textareaRef) => {
              if (textareaRef) {
                textareaRef.style.height = "auto";
                textareaRef.style.height = `${textareaRef.scrollHeight}px`;
              }
            }}
          />
          <Button
            type='button'
            size='icon'
            className='bg-white hover:bg-white/80 text-[#404040] w-8 h-8 absolute right-2 top-1/2 -translate-y-1/2 rounded-full'
            disabled={!message.trim() || clicked}
            onClick={sendMessage}
          >
            <ChevronUp className='w-4 h-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "w-full",
        isUser ? "flex justify-end" : "flex justify-start"
      )}
    >
      <div
        className={cn(
          isUser ? "flex flex-col items-end" : "flex flex-col items-start",
          "w-full"
        )}
      >
        <div className='flex items-center gap-2'>
          <p className='text-xs text-muted-foreground'>
            {message.role === "user" ? "Вы" : "Ассистент"}
          </p>
          {message.role === "assistant" && (
            <Info message={message} open={open} setOpen={setOpen} />
          )}
        </div>
        <div
          className={cn(
            "p-4 rounded-2xl bg-muted w-fit max-w-[80%] space-y-2",
            isUser ? "rounded-br-none" : "rounded-bl-none"
          )}
        >
          <p
            className={cn(
              "text-sm w-fit whitespace-pre-wrap",
              isUser ? "text-right" : "text-left"
            )}
          >
            {message.content}
          </p>
          <div
            className={cn(
              "flex items-center gap-1",
              isUser ? "justify-end" : "justify-start"
            )}
          >
            <p
              className={cn(
                "text-xs text-muted-foreground whitespace-nowrap",
                isUser ? "text-right" : "text-left"
              )}
              suppressHydrationWarning
            >
              {getDate(message.createdAt)}
            </p>
            {isUser && message.status === "success" && (
              <Check className='w-3 h-3 text-green-500' />
            )}
            {isUser && message.status === "error" && (
              <X className='w-3 h-3 text-red-500' />
            )}
            {isUser && message.status === "pending" && (
              <Loader2 className='w-3 h-3 text-muted-foreground animate-spin' />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({
  message,
  open,
  setOpen,
}: {
  message: Message;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <DialogWrapper
      open={open}
      setOpen={setOpen}
      title='Информация о сообщении'
      trigger={
        <p className='text-xs text-muted-foreground cursor-pointer hover:underline'>
          Инфо
        </p>
      }
    >
      <div className='space-y-4'>
        <InfoItem label='Сообщение' value={message.content} />
        <InfoItem label='Токены ввода' value={message.inputTokens} />
        <InfoItem label='Токены вывода' value={message.outputTokens} />
        <InfoItem
          label='Цена'
          value={message.price ? `${message.price} руб.` : null}
        />
        <InfoItem label='Использованный контекст' value={message.usedContext} />
      </div>
    </DialogWrapper>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  if (!value) return null;

  return (
    <div className='space-y-1'>
      <p className='text-xs text-muted-foreground'>{label}</p>
      <p className='text-xs whitespace-pre-wrap'>{value}</p>
    </div>
  );
}

function getDate(createdAt: string) {
  const date = new Date(createdAt);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const isSameYear = date.getFullYear() === now.getFullYear();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isToday) {
    return formatTime(date);
  }
  if (isSameYear) {
    return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")} ${formatTime(date)}`;
  }

  return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear().toString().slice(-2)} ${formatTime(date)}`;
}

function Stars({ className }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 25 25'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M7.14286 5.35714C7.79012 5.35714 8.34476 5.82003 8.46054 6.45685L8.9111 8.93492C9.07741 9.84961 9.79324 10.5655 10.7079 10.7318L13.186 11.1823C13.8228 11.2981 14.2857 11.8527 14.2857 12.5C14.2857 13.1473 13.8228 13.7019 13.186 13.8177L10.7079 14.2682C9.79324 14.4345 9.07741 15.1504 8.9111 16.0651L8.46054 18.5432C8.34476 19.18 7.79012 19.6429 7.14286 19.6429C6.4956 19.6429 5.94096 19.18 5.82517 18.5431L5.37462 16.0651C5.20831 15.1504 4.49247 14.4345 3.57777 14.2682L1.09971 13.8177C0.462889 13.7019 0 13.1473 0 12.5C0 11.8527 0.462889 11.2981 1.09971 11.1823L3.57778 10.7318C4.49247 10.5655 5.20831 9.84961 5.37462 8.93492L5.82517 6.45685C5.94096 5.82003 6.4956 5.35714 7.14286 5.35714Z'
        fill='currentColor'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M19.6429 0C20.2408 0 20.7663 0.396398 20.9306 0.971356L21.2784 2.18857C21.4903 2.9301 22.0699 3.50974 22.8114 3.72161L24.0286 4.06939C24.6036 4.23366 25 4.75918 25 5.35714C25 5.95511 24.6036 6.48062 24.0286 6.6449L22.8114 6.99267C22.0699 7.20454 21.4903 7.78418 21.2784 8.52572L20.9306 9.74293C20.7663 10.3179 20.2408 10.7143 19.6429 10.7143C19.0449 10.7143 18.5194 10.3179 18.3551 9.74293L18.0073 8.52572C17.7955 7.78418 17.2158 7.20454 16.4743 6.99267L15.2571 6.6449C14.6821 6.48062 14.2857 5.95511 14.2857 5.35714C14.2857 4.75918 14.6821 4.23366 15.2571 4.06939L16.4743 3.72161C17.2158 3.50974 17.7955 2.93011 18.0073 2.18857L18.3551 0.971356C18.5194 0.396398 19.0449 0 19.6429 0Z'
        fill='currentColor'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M16.0714 17.8571C16.686 17.8571 17.2217 18.2754 17.3707 18.8716C17.5256 19.4909 18.0091 19.9744 18.6284 20.1293C19.2246 20.2783 19.6429 20.814 19.6429 21.4286C19.6429 22.0431 19.2246 22.5788 18.6284 22.7279C18.0091 22.8827 17.5256 23.3662 17.3707 23.9855C17.2217 24.5817 16.686 25 16.0714 25C15.4569 25 14.9212 24.5817 14.7721 23.9855C14.6173 23.3662 14.1338 22.8827 13.5145 22.7279C12.9183 22.5788 12.5 22.0431 12.5 21.4286C12.5 20.814 12.9183 20.2783 13.5145 20.1293C14.1338 19.9744 14.6173 19.4909 14.7721 18.8716C14.9212 18.2754 15.4569 17.8571 16.0714 17.8571Z'
        fill='currentColor'
      />
    </svg>
  );
}
