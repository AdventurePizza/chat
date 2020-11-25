# chat

a fun interactive chatroom

## setup

Make sure you have nodejs / npm installed. If not I recommend installing it through nvm https://github.com/nvm-sh/nvm#install--update-script

If you are programming on windows I highly recommend installing wsl 2 for a superior development experience https://docs.microsoft.com/en-us/windows/wsl/install-win10

We're developing using typescript. I highly recommend trying to define your variables/functions like typescript enforces. As a last resort use `any` or `//@ts-ignore`

For more typescript info: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html

---

the app consists of a client and server

In each directory `client` and `server` run `npm install`

## start

In the client directory run `npm start`

In the server directory run `npm run start:dev` 

## adding a new panel item

add your panel type where panel types are declared in `client/src/types.tsx`

panel items are rendered in the `PanelItem` component in  `Panel.tsx`. Add your component to the switch statement

determine what happens when someone clicks the panel item through `App.tsx`'s `onClickPanelItem`, once again add to the switch statement.

## rendering items in the bottom panel

`BottomPanel.tsx` renders its content based off the panel item types previously declared, add to the switch statement `renderPanelContent` like before.

The bottom panel's open state is determined by `App.tsx`, specifically through the state variable `selectedPanelItem`. It should be set in `onClickPanelItem`, mimic the emoji panel. 

## sending messages between server and client

We're using `socket.io` to communicate between server and clients. Add your message handling to the switch statement in `App.tsx`'s `onMessageEvent`. You can add any properties you need to the type `IMessageEvent`

Send a message to the backend using `socket.emit` like
```javascript
socket.emit("event", {
    key: "sound"
});
```

Server-side, add to the switch statement `handleEvent` in `router.ts`. send a message to everyone except the original sender using `socket.broadcast.emit`. 

For more info on socket.io check https://socket.io/docs/v3/emit-cheatsheet/index.html