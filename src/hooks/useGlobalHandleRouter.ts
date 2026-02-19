import {
  createSearchParams,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

function getUrlQueries(url: string): Record<string, string> {
  const urlData = new URLSearchParams(url);
  const resultData: Record<string, string> = {};
  for (const [key, value] of urlData.entries()) {
    resultData[key] = value;
  }
  return resultData;
}
export default function useGlobalRoutesHandler() {
  // url queries
  const navigate = useNavigate();
  const route = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQueries = getUrlQueries(location.search);

  const navigateTo = ({
    remove = "",
    to,
    url,
    replace = false,
    state = {},
  }: {
    remove?: string | string[];
    to?: Record<string, string>;
    url?: string;
    replace?: boolean;
    state?: Record<string, string>;
  }) => {
    if (Array.isArray(remove)) {
      remove.forEach((keyString) => {
        delete urlQueries[keyString];
      });
    } else {
      delete urlQueries[remove];
    }

    navigate(
      {
        ...(url && { pathname: url }),
        search: createSearchParams({
          ...urlQueries,
          ...to,
        }).toString(),
      },
      {
        replace,
      }
    );
  };

  // VARIABLES
  const activeRoutes = location.pathname?.split("/");
  const subRoute = activeRoutes[activeRoutes.length - 1];

  return {
    searchParams,
    setSearchParams,
    activeRoutes,
    subRoute,
    route,
    location,
    urlQueries,
    navigate,
    navigateTo,
  };
}
