"use client";

import { useEffect, useRef, useState } from "react";
import Chosen from "./chosen";
import { useMainStore } from "@/providers/main-store-provider";
import { Choose } from "./modal/choose";
import { User } from "@/lib/auth";
import { setCookie } from "@/lib/actions";
import { BranchWithCity } from "@/lib/db/branch/schema";
import { Address } from "@/lib/db/address/schema";
import { DeliveryZone } from "@/lib/db/deliveryzone/schema";

export default function CityList({
  user,
  method: initialMethod,
  branch,
  branches,
  addresses,
  zones,
}: {
  user: User | null;
  method: string | null;
  branch: string | null;
  branches: BranchWithCity[];
  addresses: Address[];
  zones: DeliveryZone[];
}) {
  const { setMethod, setBranch, setBranches, setAddresses, setZones } =
    useMainStore((state) => state);
  const [open, setOpen] = useState(false);
  const hasInitialized = useRef(false);
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return;

    isMounted.current = true;

    if (initialMethod) {
      setMethod(initialMethod);
    } else {
      setMethod("pickup");
      setCookie("method", "pickup");
    }
    if (branch) {
      setBranch(branch);
    } else {
      const main = branches.find((b) => b.main);
      if (main) {
        setBranch(main.id.toString());
        setCookie("branch", main.id.toString());
      }
    }
    if (branches) setBranches(branches);
    if (addresses && user) {
      setAddresses(addresses);
    }
    if (zones) setZones(zones);
  }, [
    user,
    initialMethod,
    branch,
    branches,
    addresses,
    zones,
    setMethod,
    setBranch,
    setBranches,
    setAddresses,
    setZones,
  ]);

  useEffect(() => {
    if (addresses?.length > 0 && user) {
      localStorage.setItem("address", JSON.stringify(addresses));
    }
  }, [addresses, user]);

  useEffect(() => {
    if (user || hasInitialized.current) return;

    hasInitialized.current = true;

    const address = localStorage.getItem("address");
    if (address) {
      try {
        const parsed = JSON.parse(address);

        const validAddresses = Array.isArray(parsed)
          ? parsed.filter((addr) => addr.zoneId)
          : [];

        if (validAddresses.length > 0) {
          setAddresses(validAddresses);
          localStorage.setItem("address", JSON.stringify(validAddresses));
        } else {
          // If no valid addresses found, clear storage and set to pickup
          localStorage.removeItem("address");
          setMethod("pickup");
          setCookie("method", "pickup");
        }
      } catch (error) {
        console.log(error);
        // If parsing fails, clear storage and set to pickup
        localStorage.removeItem("address");
        setMethod("pickup");
        setCookie("method", "pickup");
      }
    }
  }, [user, setAddresses, setMethod]);

  return (
    <div>
      <Chosen setOpen={setOpen} />
      <Choose open={open} setOpen={setOpen} user={user} />
    </div>
  );
}
