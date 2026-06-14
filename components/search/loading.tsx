import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";

export default function Loading() {
  return (
    <div className='w-full sticky top-0 lg:top-[80px] z-20 bg-background py-4'>
      <div className='absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground'>
        <SearchIcon className='w-4 h-4' />
      </div>
      <Input
        className='w-full bg-[#F2F2F2] border-none rounded-full pl-10 text-xs focus-visible:ring-0 focus-visible:ring-transparent'
        placeholder='Ищите по названию, веществу или симптомам'
      />
    </div>
  );
}
