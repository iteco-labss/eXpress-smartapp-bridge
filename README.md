# SmartApp bridge library

This library provides a universal interface for exchanging events with an express client.
Andriod, iOS and Web clients supported.

All types can be found [here](https://smartapp.ccsteam.xyz/smartapp-bridge/).

### Send event to eXpress
```js
SmartAppBridge
  .send((
    {
      type: 'get_weather',
      handler: 'botx',
      payload: {
        city: 'Moscow',
      },
      timeout: 10000, // timeout is optional, default 30000
    }
  ))
  .then(({ type, payload })
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
