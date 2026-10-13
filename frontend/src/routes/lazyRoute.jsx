import { lazy, Suspense } from "react";
import Loading from "../components/common/Loading";

export const lazyRoute = (loader) => {
  const Page = lazy(loader);

  return function LazyRoutePage(props) {
    return (
      <Suspense fallback={<Loading message="Loading page…" />}>
        <Page {...props} />
      </Suspense>
    );
  };
};
