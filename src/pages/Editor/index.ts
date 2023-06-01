import { lazy } from "solid-js";
import { useStore } from "../../store/storeContext";

const Editor = lazy(() => import("./Editor"));

export default function(props) {
  const [, { loadArticle }] = useStore(),
    slug = props.params[0];
  slug && loadArticle(slug);
  return Editor({ slug });
}