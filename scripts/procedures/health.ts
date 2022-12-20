import { matches, types as T, util, YAML } from "../deps.ts";
const { shape, string, number } = matches;
const { ok, errorCode, error } = util;

const Base64 = {
  // private property
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  // public method for encoding
  encode: function (input: string) {
    let output = "";
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    let i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output =
        output +
        this._keyStr.charAt(enc1) +
        this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) +
        this._keyStr.charAt(enc4);
    }
    return output;
  },

  // public method for decoding
  decode: function (input: string) {
    let output = "";
    let chr1, chr2, chr3;
    let enc1, enc2, enc3, enc4;
    let i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }

    output = Base64._utf8_decode(output);

    return output;
  },

  // private method for UTF-8 encoding
  _utf8_encode: function (string: string) {
    string = string.replace(/\r\n/g, "\n");
    let utftext = "";

    for (let n = 0; n < string.length; n++) {
      const c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  },

  // private method for UTF-8 decoding
  _utf8_decode: function (utftext: string) {
    let string = "";
    let i = 0;
    let c = 0;
    let c2 = 0;
    let c3 = 0;

    while (i < utftext.length) {
      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if (c > 191 && c < 224) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  },
};
const isError = shape({ error: string }).test;
const isErrorCode = shape({ "error-code": matches.tuple(number, string) }).test;
const dealWithError = (e: unknown) => {
  if (isError(e) || isErrorCode(e)) {
    return e;
  }
  throw e;
};

/** Call to make sure the duration is pass a minimum */
const guardDurationAboveMinimum = (input: { duration: number; minimumTime: number }) =>
  input.duration <= input.minimumTime ? Promise.reject(errorCode(60, "Starting")) : Promise.resolve(null);
function safeParse(x: string) {
  try {
    return JSON.parse(x);
  } catch (_e) {
    return undefined;
  }
}
const parsableInt = string.map(Number).refine(function isInt(x): x is number {
  return Number.isInteger(x);
});
export const health: T.ExpectedExports.health = {
  async version(effects, lastCall) {
    try {
      const output = await effects.runCommand({
        command: "sh",
        args: ["-c", "HOME=/mnt/filebrowser/syncthing syncthing cli config version get"],
      });
      if ("ok" in output && safeParse(String(output["ok"])) === 36) {
        return ok;
      } else if ("err" in output) {
        const err = safeParse(String(output));

        if (0 in err && 1 in err && typeof err[0] === "number" && typeof err[1]) {
          return errorCode(err[0], err[1]);
        }
      }
      return ok;
    } catch (_e) {
      try {
        await guardDurationAboveMinimum({
          duration: lastCall,
          minimumTime: 10000,
        });
      } catch (e2) {
        dealWithError(e2);
      }
    }
    return error("Could not get the current status");
  },
  "web-ui"(effects, lastCall) {
    return effects
      .readFile({
        volumeId: "main",
        path: "./start9/config.yaml",
      })
      .then((x) => YAML.parse(x))
      .then((x) => matches.shape({ username: matches.string, password: matches.string }).unsafeCast(x))
      .then((config) =>
        effects.fetch("http://syncthing.embassy:8384", {
          headers: {
            Authorization: `Basic ${Base64.encode(`${config.username}:${config.password}`)}`,
          },
        })
      )
      .then((webResponse) =>
        // deno-fmt-ignore
        // prettier-fmt-ignore
        webResponse.status === 401
          ? error(`Authorization issue`)
          : webResponse.status !== 200
          ? error(`Could not fetch site`)
          : ok
      )
      .catch((e) =>
        guardDurationAboveMinimum({
          duration: lastCall,
          minimumTime: 10000,
        }).then(
          (_) => {
            effects.error(`Health check failed: ${e}`);
            return errorCode(61, "Health check has never ran");
          },
          (_) => e
        )
      );
  },
};
