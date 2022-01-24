# SmartApp bridge library

This library provides a universal interface for exchanging events with an express client.
Andriod, iOS and Web clients supported.

All types can be found [here](https://smartapp.ccsteam.xyz/smartapp-bridge/).

### Send event to eXpress

```js
SmartAppBridge
  .sendClientEvent(
    {
      method: 'get_weather',
      params: {
        city: 'Moscow',
      },
      files: []
    }
  )
  .then(data => {
    // Handle response
    console.log('response', data)
  })
  .then(({ type: method, handler: express, payload: params, files }) => {
    // Handle response data type, payload
  })
  .catch(() => {
    // Do something on timeout
  })
```

```js
SmartAppBridge
  .sendBotEvent(
    {
      method: 'get_weather',
      params: {
        city: 'Moscow',
      },
    }
  )
  .then(data => {
    // Handle response
    console.log('response', data)
  })
  .then(({ type: method, handler: botx, payload: params }) => {
    // Handle response data type, payload
  })
  .catch(() => {
    // Do something on timeout
  })
```

### Receive event from eXpress
```js
SmartAppBridge.onRecieve(({ type, payload }) => {
  // This callback triggers when eXpress client send data without ref
})
```
