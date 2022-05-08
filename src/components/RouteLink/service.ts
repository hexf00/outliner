import { IRouteLink } from ".";
import { router } from "../../router";

export function to (link: IRouteLink) {
  router.to(link)
}