# @infernus/cef

[![npm](https://img.shields.io/npm/v/@infernus/cef)](https://www.npmx.dev/package/@infernus/cef) ![npm](https://img.shields.io/npm/dw/@infernus/cef) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@infernus/cef)

A wrapper of the popular [omp-cef component](https://github.com/aurora-mp/omp-cef) for samp-node.

**You must use an existing [polyfill](https://github.com/dockfries/infernus-starter/blob/main/gamemodes/polyfill/cef.inc) or compile the corresponding GameMode based on it before you can use it.**

## Getting started

```sh
pnpm add @infernus/core @infernus/cef
```

## Example(untested)

**tests/omp/gamemodes/cef.pwn**

```ts
import { GameMode, Player, PlayerEvent } from "@infernus/core";
import { CefBrowser, CefEvent } from "@infernus/cef";

const WEBVIEW_URL =
  process.env.NODE_ENV === "production"
    ? "http://cef/webview/index.html"
    : "http://localhost:5173/";

GameMode.onInit(({ next }) => {
  CefBrowser.addResource("example");
  CefBrowser.addResource("webview");
  return next();
});

function onAccountLogin(player: Player, browser: CefBrowser, password: string) {
  console.log(
    `OnAccountLogin for playerid=${player.id} browserid=${browser.getId()}, password=${password}`,
  );
}

CefEvent.onRecv(({ browser, data, player, next }) => {
  const jsonData = JSON.parse(data);
  if (jsonData.event === "account:login") {
    onAccountLogin(player, browser, jsonData.password);
  }
  return next();
});

PlayerEvent.onRequestClass(({ player, next }) => {
  player.sendClientMessage(-1, "Welcome to omp-cef example gamemode!");

  CefBrowser.toggleSpawnScreen(player, false);

  player.setSkin(60);
  player.setPos(2296.5662, 2451.627, 10.8202);
  player.setFacingAngle(87.8271);
  player.setCameraPos(2293.364, 2451.7341, 12.8202);
  player.setCameraLookAt(2296.5662, 2451.627, 10.8203);

  return next();
});

CefEvent.onInitialize(({ player, success, next }) => {
  if (!success) {
    player.sendClientMessage(-1, "It appears you do not have the CEF plugin installed.");
    return false;
  }

  next();
  return true;
});

CefEvent.onReady(({ player, next }) => {
  console.log(`CEF Ready for playerid=${player.id}`);

  new CefBrowser({
    type: "2dPlayer",
    player,
    url: WEBVIEW_URL,
    focused: true,
    controlsChat: true,
  }).create();

  return next();
});

CefEvent.onBrowserCreated(({ browser, player, success, code, reason, next }) => {
  console.log(
    `Browser id=${browser.getId()} created for playerid=${player.id} success=${success} code=${code} reason=${reason}`,
  );

  if (success) {
    browser.emitEvent("account:info", { name: player.getName().name });
  }

  return next();
});
```

**tests/webviews/react/src/pages/login.tsx**

```tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IAccount } from "@/types";
import { useCef } from "@/providers/cef-provider";

const formSchema = z.object({
  password: z.string().min(6, "The password must contain a minimum of 6 characters."),
});

export default function Login() {
  const { emit, on, off } = useCef();
  const [account, setAccount] = useState<IAccount | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  useEffect(() => {
    const handleAccountInfo = (raw: string) => {
      try {
        const decodeData = new TextDecoder().decode(new Uint8Array(JSON.parse(stringifyData)));
        const jsonData = JSON.parse(decodeData);

        setAccount({
          name: jsonData.name,
        });
      } catch {}
    };

    on("account:info", handleAccountInfo);

    return () => {
      off("account:info", handleAccountInfo);
    };
  }, [emit, on, off]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSubmitted(true);
    setError("");

    const jsonData = { event: "account:login", password: values.password };
    const encodeData = new TextEncoder().encode(JSON.stringify(jsonData));
    const stringifyData = JSON.stringify(Array.from(encodeData));
    emit("sampnode:cef", stringifyData);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Card className="border-0 min-w-92.5 max-w-92.5">
        <CardHeader>
          <CardTitle className="text-white">Login</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm">
            Hello <span className="text-primary font-medium">{account?.name}</span>,
          </p>

          <p className="text-sm pt-3">Please enter your password:</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mt-5">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="off" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-right">
                <Button type="submit" className="mt-5" disabled={submitted}>
                  Login
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="justify-center">
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </CardFooter>
      </Card>
    </div>
  );
}
```
