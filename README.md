# instagram-likes

Programs that press likes user's posts

## Installation and Running
> Requires Node v7.6 or above

1. Clone the repo
```
$ git clone https://github.com/junggeehoon/instagram-likes
```
2. Install dependencies
```
$ npm install
```
3. In order to login with your account, make `config.js` file inside the project folder like under:
```javascript
const config = {
  email: 'YOUR_INSTAGRAM_EMAIL',
  password: 'YOUR_INSTAGRAM_PASSWORD'
}

module.exports = config;
```
4. Run using `node index.js`
