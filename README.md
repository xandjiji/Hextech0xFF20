# Hextech0xFF20

A twitter bot that automatically generates and tweets random LoL post-game stats.

<p align="center">
  <img src="https://i.imgur.com/oITRb7k.png">
</p>

Now with beautiful logging!

<p align="center">
  <img src="https://i.imgur.com/pDtW5d4.png">
</p>

### Installation

  - You need [Node.js](https://nodejs.org/) to run this bot
  - You need the [twitter](https://www.npmjs.com/package/twitter) package to communicate with the Twitter API
  - You need the [jimp](https://www.npmjs.com/package/jimp) package to create the trainer card images

Install the dependencies with:

```
npm install twitter
npm install jimp
```

Or simply:

```
npm install
```

Feed your Twitter API keys in the ```keys.env``` file:

```javascript
module.exports = {
     consumer_key:            '...',
     consumer_secret:         '...',
     access_token_key:        '...',
     access_token_secret:     '...'
}
```

Simply run it with:

```
node bot.js
```
