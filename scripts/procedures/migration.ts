import { compat, types as T } from "../deps.ts";

export const migration: T.ExpectedExports.migration = compat.migrations
  .fromMapping({
    "1.22.1.1":
    {
      up: compat.migrations.updateConfig(
        (config) => {
          return config;
        },
        false,
        { version: "1.22.1.1", type: "up" },
      ),
      down: compat.migrations.updateConfig(
        (config) => {
          return config;
        },
        false,
        { version: "1.22.1.1", type: "down" },
      ),
    }
  }, "1.27.6");
