"use client";
import React, { useEffect, useState, ComponentType, JSX } from "react";
import { useRouter } from "next/navigation";
import { getLoggedInUser } from "@/utils/storageHelper";

export default function redirectIfAuth<P extends JSX.IntrinsicAttributes>(
  WrappedComponent: ComponentType<P>,
  redirectTo: string = "/dashboard"
) {
  const ComponentWithRedirect: React.FC<P> = (props) => {
    const router = useRouter();
    const [checking, setChecking] = useState(true);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
      const localUser = getLoggedInUser();
      if (localUser) {
        router.replace(redirectTo);
      } else {
        setShouldRender(true);
      }
      setChecking(false);
    }, [router]);

    if (checking || !shouldRender) {
      return (
        <div className="w-screen h-screen flex items-center justify-center">
          Redirecting...
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithRedirect;
}
