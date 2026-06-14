import { Loader2, XIcon } from "lucide-react";
import { Button } from "../../ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Info, SetInfo } from "@/lib/definitions";
import { Skeleton } from "../../ui/skeleton";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "sonner";
import { useState } from "react";

type Result = {
  name: string;
  desc: string;
  uri: string;
};

export const AddressInput2 = ({
  form,
  label,
  name,
  desc,
  info,
  setInfo,
}: {
  form: any;
  label: string;
  name: string;
  info: Info;
  setInfo: SetInfo;
  desc?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[]>([]);

  const search = form.watch("search");

  const handleBlur = () => {
    setInfo((prev) => ({ ...prev, search: "" }));
  };

  const handleSearch = useDebouncedCallback(async (query: string) => {
    if (!query) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/maps/suggest?text=${query}`);

      if (!res.ok) {
        throw new Error("Что-то пошло не так. Повторите еще.");
      }

      const data = await res.json();

      if (data.results) {
        const list = data.results.map((result: any) => ({
          name: result.title.text,
          desc: result.subtitle.text,
          uri: result.uri,
        }));
        setResults(list);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.log(err);
      toast.error("Что-то пошло не так. Повторите еще.");
    } finally {
      setLoading(false);
    }
  }, 500);

  return (
    <div className='relative space-y-1'>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className='space-y-0'>
            <FormLabel className='text-xs text-muted-foreground'>
              {label}
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                onBlur={handleBlur}
                onChange={(e) => {
                  field.onChange(e.target.value);

                  setInfo((prev) => ({
                    ...prev,
                    search: e.target.value,
                    lat: null,
                    long: null,
                    result: null,
                    found: null,
                    error: null,
                  }));

                  handleSearch(e.target.value);

                  form.setValue("address", "");
                  form.setValue("lat", "");
                  form.setValue("long", "");
                  form.setValue("zoneId", "");
                  form.clearErrors("search");
                }}
                className='border-0 border-b rounded-none px-0 py-1 h-8 focus-visible:ring-0 focus-visible:border-primary'
              />
            </FormControl>
            {desc && (
              <FormDescription className='text-xs'>{desc}</FormDescription>
            )}
            <FormMessage className='text-xs' />
          </FormItem>
        )}
      />
      {search && (
        <Button
          size='icon'
          className='absolute right-1 top-7 h-4 w-4 text-muted-foreground hover:text-primary'
          variant='link'
          onClick={() => {
            form.setValue("search", "");
            form.setValue("address", "");
            form.setValue("lat", "");
            form.setValue("long", "");
            form.setValue("zoneId", "");

            setInfo((prev) => ({
              ...prev,
              search: "",
              result: null,
              found: null,
              lat: null,
              long: null,
              error: null,
            }));

            setResults([]);
          }}
        >
          {loading || info.loading ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : (
            <XIcon className='w-4 h-4' />
          )}
        </Button>
      )}
      {info.search && (
        <AddressSearch
          results={results}
          loading={loading}
          setInfo={setInfo}
          setResults={setResults}
        />
      )}
    </div>
  );
};

const AddressSearch = ({
  results,
  loading,
  setInfo,
  setResults,
}: {
  results: Result[];
  loading: boolean;
  setInfo: SetInfo;
  setResults: React.Dispatch<React.SetStateAction<Result[]>>;
}) => {
  if (loading) {
    return (
      <div
        className={`absolute top-[58px] w-full bg-background border rounded-md shadow-lg z-10`}
      >
        <div className='py-2 px-2 space-y-0.5 flex flex-col justify-between h-[48px]'>
          <Skeleton className='h-3.5 w-1/3' />
          <Skeleton className='h-3.5 w-1/2' />
        </div>
      </div>
    );
  }

  const handleClick = async (uri: string, name: string) => {
    if (!uri || !name) return;

    setInfo((prev) => ({ ...prev, search: "" }));
    setResults([]);

    try {
      const res = await fetch(`/api/maps/geocode?uri=${uri}`);
      const data = await res.json();

      const point =
        data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
      const long = point.split(" ")[0];
      const lat = point.split(" ")[1];

      setInfo((prev) => ({
        ...prev,
        loading: true,
        result: { lat: Number(lat), long: Number(long), address: name },
        found: null,
      }));
    } catch (err) {
      setInfo((prev) => ({
        ...prev,
        loading: false,
        result: null,
        found: null,
      }));
      console.log(err);
      toast.error("Что-то пошло не так. Повторите еще.");
    }
  };

  return (
    <div
      className={`absolute top-[58px] w-full bg-background border rounded-md shadow-lg z-10`}
    >
      {results?.map((result, i) => (
        <div
          key={i}
          className='py-2 px-2 hover:bg-accent cursor-pointer'
          onMouseDown={(e) => e.preventDefault()}
          onTouchStart={(e) => e.preventDefault()}
          onClick={() => {
            handleClick(result.uri, result.name);
          }}
        >
          <p className='text-xs'>{result.name}</p>
          <p className='text-xs text-muted-foreground'>{result.desc}</p>
        </div>
      ))}
      {results?.length === 0 ? (
        <div className='py-2 px-2 flex items-center h-[48px]'>
          <p className='text-xs text-muted-foreground'>
            Ничего не найдено или адрес вне зон доставки
          </p>
        </div>
      ) : null}
    </div>
  );
};
