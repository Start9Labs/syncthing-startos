import { compat, types as T } from "../deps.ts";

export const getConfig: T.ExpectedExports.getConfig = compat.getConfig({
  "tor-address": {
    name: "Tor Address",
    description: "The Tor address.",
    type: "pointer",
    subtype: "package",
    "package-id": "syncthing",
    target: "tor-address",
    interface: "main",
  },
  username: {
    type: "string",
    name: "Username",
    description:
      "The user for loging into the administration page of syncthing",
    nullable: false,
    copyable: true,
    masked: false,
    default: "admin",
  },
  password: {
    type: "string",
    name: "Password",
    description:
      "The password for loging into the administration page of syncthing",
    nullable: false,
    copyable: true,
    masked: true,
    default: {
      charset: "a-z,A-Z,0-9",
      len: 22,
    },
  },
});
