import * as URI from "uri-js";

export const sendtype = ["person", "group"];

export function sendtypePerson<U>(id: U) {
  return URI.normalize(`lulu://sendtype:person@yuzhi.com:${id}`);
}

export function sendtypeGroup<U>(id: U) {
  return URI.normalize(`lulu://sendtype:group@yuzhi.com:${id}`);
}
