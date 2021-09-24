import * as URI from "uri-js";

export class UriProtocolServer {
  static createServices<T>(
    userid: T,
    serverName: string,
    inter: string,
    elements: any
  ) {
    let query = "";
    for (const key in elements) {
      const value = elements[key];
      query += `${key}=${value}&`;
    }

    return URI.normalize(
      `yuzhi://${userid}:yu@.com:123/${serverName}/${inter}?${query}`
    );
  }

  static Parse(uri: string): URI.URIComponents {
    return URI.parse(uri);
  }
}

export function UriProtocolServerUserChat<T>(userid: T) {
  return UriProtocolServer.createServices(userid, "user-server", "userchat", {
    type: "point",
  });
}
