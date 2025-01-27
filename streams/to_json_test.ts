// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.

import { assertEquals } from "../assert/assert_equals.ts";
import { toJson } from "./to_json.ts";

const textEncoder = new TextEncoder();

Deno.test("[streams] toJson", async () => {
  const byteStream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(textEncoder.encode("["));
      controller.enqueue(textEncoder.encode("1, 2, 3, 4"));
      controller.enqueue(textEncoder.encode("]"));
      controller.close();
    },
  });

  assertEquals(await toJson(byteStream), [1, 2, 3, 4]);

  const stringStream = new ReadableStream<string>({
    start(controller) {
      controller.enqueue('{ "a": 2,');
      controller.enqueue(' "b": 3,');
      controller.enqueue(' "c": 4 }');
      controller.close();
    },
  });

  assertEquals(await toJson(stringStream), {
    a: 2,
    b: 3,
    c: 4,
  });
});
