const fcl = require("@onflow/fcl");

fcl.config({
  "app.detail.title": "Crowdfundapp", // this adds a custom name to our wallet
  "accessNode.api": "http://localhost:8888", // this is for the local emulator
  "discovery.wallet": "http://localhost:8701/fcl/authn", // this is for the local dev wallet
});
