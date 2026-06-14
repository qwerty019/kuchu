import { YMaps, Map, Placemark, Polygon } from "@pbe/react-yandex-maps";
import { useEffect, useRef, useState } from "react";
import { Info, SetInfo } from "@/lib/definitions";
import { YMapsApi } from "@pbe/react-yandex-maps/typings/util/typing";
import { Button } from "../../ui/button";
import { Minus, Plus } from "lucide-react";
import { useMainStore } from "@/providers/main-store-provider";
import MapAlert from "@/components/modal/map-alert";
import { User } from "@/lib/auth";
import { setCookie } from "@/lib/actions";
import { toast } from "sonner";
import { changeAddress } from "@/lib/db/address/actions";
import { changeBranch } from "@/lib/db/branch/actions";

const center = [62.03, 129.74];

export default function MapComponent({
  info,
  setInfo,
  user,
}: {
  info: Info;
  setInfo: SetInfo;
  user: User | null;
}) {
  const ymaps = useRef<YMapsApi>();
  const mapRef = useRef<ymaps.Map>();

  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState<{
    type: string;
    id: number;
    name: string;
  } | null>(null);

  const [coords, setCoords] = useState<number[]>(); // [lat, long]
  const { addresses, branches, zones, branch, method } = useMainStore(
    (state) => state
  );

  useEffect(() => {
    if (info.lat && info.long) {
      setCoords([info.lat, info.long]);

      if (mapRef.current) {
        mapRef.current.setCenter([info.lat, info.long]);
        mapRef.current.setZoom(16);
      }
    } else {
      setCoords(undefined);
    }
  }, [info?.lat, info?.long]);

  useEffect(() => {
    if (!info.result) return;

    const address = info.result.address;
    const point = [info.result.lat, info.result.long];

    const zone = zones?.find((z) => {
      if (!ymaps.current || !mapRef.current) return false;

      try {
        const poly = new ymaps.current.Polygon(JSON.parse(z.polygon));
        // Add polygon to map temporarily
        mapRef.current.geoObjects.add(poly);
        const contains = poly.geometry?.contains(point);
        // Remove polygon from map after checking
        mapRef.current.geoObjects.remove(poly);

        return contains;
      } catch (error) {
        console.error("Error checking polygon:", error);
        return false;
      }
    });

    if (!zone) {
      setInfo((prev) => ({
        ...prev,
        loading: false,
        result: null,
        found: null,
        error: "Адрес находится за пределами зон доставки.",
      }));
      return;
    }

    setInfo((prev) => ({
      ...prev,
      search: "",
      loading: false,
      result: null,
      lat: point[0],
      long: point[1],
      found: {
        lat: point[0],
        long: point[1],
        address: address,
        zoneId: zone.id,
      },
      error: null,
    }));
  }, [info.result, setInfo, zones]);

  return (
    <>
      <YMaps
        query={{
          load: "package.full",
          apikey: process.env.NEXT_PUBLIC_YANDEX_API_KEY,
        }}
      >
        <Map
          instanceRef={mapRef}
          defaultState={{
            center,
            zoom: 12,
            controls: [],
          }}
          style={{ width: "100%", height: "100%" }}
          className='rounded-2xl overflow-hidden relative'
          onLoad={(y) => {
            ymaps.current = y;
          }}
        >
          {zones?.map((zone) => (
            <Polygon
              key={zone.id}
              geometry={JSON.parse(zone.polygon)}
              options={{
                strokeWidth: 3,
                strokeColor: zone.color || "#82cdff",
                strokeOpacity: 0.9,
                fillColor: zone.color || "#82cdff",
                opacity: 0.2,
                openBalloonOnClick: false,
              }}
              onClick={async (e: any) => {
                if (!info.add || info.loading) return;

                const coords = e.get("coords");

                if (!coords) return;

                setInfo((prev) => ({ ...prev, loading: true }));

                try {
                  const res = await ymaps.current?.geocode(coords);
                  const firstGeoObject = res?.geoObjects.get(0);

                  if (!firstGeoObject) return;

                  const address = firstGeoObject.properties.get(
                    "name",
                    {}
                  ) as unknown as string;
                  const kind: string | undefined = (
                    firstGeoObject.properties.get("metaDataProperty", {}) as any
                  )?.GeocoderMetaData?.kind;

                  if (kind !== "house") {
                    toast.error("Нужно выбрать дом.");
                    setInfo((prev) => ({ ...prev, loading: false }));
                    return;
                  }

                  setInfo((prev) => ({
                    ...prev,
                    search: "",
                    loading: false,
                    clicked: true,
                    lat: coords[0],
                    long: coords[1],
                    found: {
                      address: address,
                      lat: coords[0],
                      long: coords[1],
                      zoneId: zone.id,
                    },
                  }));
                } catch (error) {
                  setInfo((prev) => ({ ...prev, loading: false }));
                  console.error("Geocoding error:", error);
                  toast.error("Ошибка при поиске адреса.");
                }
              }}
            />
          ))}
          <div className='absolute top-1/2 -translate-y-1/2 right-4 z-10 space-y-1'>
            <Button
              type='button'
              variant='secondary'
              className='bg-background rounded-full p-0 w-8 h-8 flex items-center justify-center'
              onClick={() => {
                const zoom = mapRef.current?.getZoom();
                if (!zoom && zoom !== 0) return;
                mapRef.current?.setZoom(zoom + 1, { checkZoomRange: true });
              }}
            >
              <Plus className='w-4 h-4' />
            </Button>
            <Button
              type='button'
              variant='secondary'
              className='bg-background rounded-full p-0 w-8 h-8 flex items-center justify-center'
              onClick={() => {
                const zoom = mapRef.current?.getZoom();
                if (!zoom) return;
                mapRef.current?.setZoom(zoom - 1, { checkZoomRange: true });
              }}
            >
              <Minus className='w-4 h-4' />
            </Button>
          </div>
          {coords && <Placemark geometry={coords} />}
          {branches?.map((b, i) => (
            <Placemark
              key={i}
              geometry={[b.lat, b.long]}
              options={{
                iconLayout: "default#image",
                iconImageHref:
                  method === "pickup" && b.id === Number(branch)
                    ? "/images/map-logo-selected.svg"
                    : "/images/map-logo.svg",
              }}
              onClick={() => {
                if (b.id === Number(branch) && method === "pickup") return;

                setDesc({ type: "branch", id: b.id, name: b.title });
                setOpen(true);
              }}
            />
          ))}
          {addresses?.map((a) => (
            <Placemark
              key={a.id}
              geometry={[a.lat, a.long]}
              options={{
                iconLayout: "default#image",
                iconImageHref:
                  method === "delivery" && a.selected
                    ? "/images/home-logo-selected.svg"
                    : "/images/home-logo.svg",
              }}
              onClick={() => {
                if (a.selected && method === "delivery") return;

                setDesc({ type: "address", id: a.id, name: a.address });
                setOpen(true);
              }}
            />
          ))}
        </Map>
      </YMaps>
      {open && desc && (
        <ChangeAlert
          user={user}
          desc={desc}
          setOpen={setOpen}
          setDesc={setDesc}
        />
      )}
    </>
  );
}

function ChangeAlert({
  user,
  desc,
  setOpen,
  setDesc,
}: {
  user: User | null;
  desc: { type: string; id: number; name: string };
  setOpen: (open: boolean) => void;
  setDesc: (desc: { type: string; id: number; name: string } | null) => void;
}) {
  const [clicked, setClicked] = useState(false);

  const { method, branch, setMethod, setBranch, branches, setAddresses } =
    useMainStore((state) => state);

  async function handleChange(type: string, id: number) {
    if (clicked) return;

    setClicked(true);

    if (type === "branch") {
      await choseBranch(id);
    }

    if (type === "address") {
      await choseAddress(id);
    }

    setClicked(false);
    setOpen(false);
    setDesc(null);
  }

  async function choseBranch(id: number) {
    if (user) {
      await changeBranch(id);
    }

    await setCookie("method", "pickup");
    await setCookie("branch", `${id}`);

    setMethod("pickup");
    setBranch(`${id}`);
  }

  async function choseAddress(id: number) {
    const main = branches.find((b) => b.main);
    if (!main) return;

    if (user) {
      await changeAddress(id);
    }

    setAddresses((prev: any) => {
      const updated = prev.map((a: any) => ({
        ...a,
        selected: a.id === id,
      }));

      localStorage.setItem("address", JSON.stringify(updated));

      return updated;
    });

    if (method !== "delivery") {
      await setCookie("method", "delivery");
      setMethod("delivery");
    }

    if (branch !== main.id.toString()) {
      await setCookie("branch", main.id.toString());
      setBranch(main.id.toString());
    }
  }

  return (
    <MapAlert
      open={true}
      setOpen={setOpen}
      title={
        desc.type === "branch"
          ? `Поменять филиал на ${desc.name}?`
          : `Поменять адрес на ${desc.name}?`
      }
      onClick={() => handleChange(desc.type, desc.id)}
      clicked={clicked}
      message=''
    />
  );
}

function isPointGeometry(
  geometry: ymaps.IGeometry
): geometry is ymaps.IPointGeometry {
  return geometry.getType() === "Point";
}
