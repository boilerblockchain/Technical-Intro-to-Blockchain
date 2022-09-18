## Section 1 - JavaScript Basics

First let's review the basics of Javascript and Typescript, the languages we will be using throught the course to develop our Web Applications :)

JavaScript (Js) is a the main scripting programming language for Web pages, originally it was used as the client side in front end development. It can also be used in non-browser environments such as Node.js enabling a wide range of new uses:

- Web Applications, Mobile Apps, Networking Apps, Games etc
  Some common uses: detecting a user's browser, storing browsing cookies, form input validation etc

A scripting language is a high-level programming language that is interpreted by another program at runtime rather than compiled by the computer, other popular scripting languages are PHP and Python. Js is often used together with HTML/CSS, Java or C++.

Typescript (Ts) is an Object-oriented programming language that is complied, not interpreted. It is Js with some extra features, supporting all Js libraries! It has some advantages over Ts:

- Create both client-side and server-side
- Detect errors at compile-time, get less runtime errors
- Static typing support, check type correctness at compile time

Converting code between languages
Ts to Js: Ts code is not direcly supported by broswers, thus it has to Trans-piled to be read directly in your console.
Js to Ts: simply change the file extension from .js to .ts

## Section 2 - Data Structures & Algorithms

Data structures and algorithms are some of the core tools we leverage to develop and build meaningful applications. Although they will not always be explicitly used in web development due to their abstraction in most libraries/APIs, data structures provide critical functionality "under the hood". It is important to be familiar with the fundamentals of data structures and algorithms in order to understand how they are specifically applied in blockchain and web development.

## Section 3 - Networking and Architecture

A web page can't do much on its own. It has HTML, CSS, and JS for content, styling, and logic, but it lacks outside information and state that persists. That's where APIs come in.

In terms of the web, an API endpoint is just a url. We use HTTP requests to access them. There are different types of requests which are called methods. https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
In general, the `GET` method is most important and usually the default method. `POST`, `PUT`, `DELETE` are also commonly use while other methods are more niche. In these examples we are only using `GET` requests. We don't need to specify `GET` when using `curl` or `fetch()`, but we do need to specify the other methods.

`https://api.thecatapi.com/v1/images/search` is an API endpoint.

You can access it by running `curl https://api.thecatapi.com/v1/images/search` in our command line. This endpoint should return a JSON object that looks something like

```
[
  {
    "id": "a4k",
    "url": "https://cdn2.thecatapi.com/images/a4k.jpg",
    "width": 450,
    "height": 361
  }
]
```

You can also just access open the link in your browser. A browser is just a sophisticated tool to send HTTP requests to urls and render the output. Usually, it starts with a GET request to a url which responds with HTML.

There are different ways to send HTTP requests with javascript.

In browsers, there is `fetch()`, or (even XMLHttpRequest).
https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

In versions 18 and up, `fetch()` is available in node. In older versions of node, you can libraries like `node-fetch` to make the `fetch()` api available. There is also the standard `http` module.
https://nodejs.dev/en/learn/making-http-requests-with-nodejs/

There are isomorphic (works in node.js and browser) solutions like `axios` (and hundreds or alternatives), which are great way have a common interface for sending HTTP requests, especially before `fetch()` was part of node.

If you have no opinion, I'd recommend using `fetch()` and an updated version (>=18) of node, since it's a standard tool that doesn't require extra dependencies. Otherwise, use whatever you want, it really doesn't matter.

### Getting data from the blockchain

In order to get data from a blockchain directly, you'd need to run a node. It isn't exactly feasible for everyone to run a node in order to access data, so services like Alchemy, Etherscan, INFURA, etc, run nodes and provide access via their own APIs. A common practice for API providers is to require an API key in order to use their API. This lets them control access.

We're using a library called `ethers` to abtract working with the blockchain. It uses many of those API services internally and has public API keys by default, so we don't have to set that up. If you choose to use your own API keys, you must take care to keep them secret. This means you should NEVER keep API keys in the code that runs on the user's machine (frontend).

This is why we use `ethers` in the backend, where our API keys are safe, to get data from the blockchain. Then from the frontend, we can send requests to our own backend and get the information we desire.

### Challenge

Our example backend exposes `/api/blockNum` which gets the current block number and returns and object that looks like this.

```
{
  blockNum: 69420
}
```

Our example frontend calls `fetch(/api/blockNum)` and accessed the `blockNum` field it receives to display somewhere.

Take a look at the `ethers` documentation and create a new endpoint in the backend that will get information from the blockchain.
https://docs.ethers.io/v5/api/providers/provider/

Then send a request to the newly created endpoint and use it somehow in the frontend.
