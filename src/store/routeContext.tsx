import { createContext, useContext } from "solid-js";
import { IRouteContext} from "./createRouteHandler";

export const RouterContext = createContext<IRouteContext>();

export function useRouter() {
  return useContext<IRouteContext>(RouterContext);
}
