//goto /constants.js to see how these constants are defined
//TODO: seen, typing interactions between users
//TODO: attachments and images between users
//TODO: Games or Netflix API
//TODO: add game component
// points: 0,
// connections: [],
//TODO: add a way to grade or rate user interactions
//TODO: add previous connections tracking to tell users if they are connected to someone new or old
//TODO: add a
//TODO: include tiers for talking, demote users for inactivity

const { CARDS } = require("./constants");

const get = require("./get");
const EventHandler = require("./eventHandler");
const s = new EventHandler();

//attempts to borrow from the linear redux flow to help keep track of state changes
module.exports = async function App(context) {
  //GET USER ID, the process to get ids varies between platforms
  var platform = context.platform;
  var { id, message } = await get[platform](context);
  console.log(`ID: ${id}\t\t\t MESSAGE:${message}`);
  //IF NEW USER, add to list of users, only stores platform and id
  if (s.isNew(id)) s.add(id, platform);
  console.log(`isNew: ${s.isNew(id)}\t\t\t User:`);
  console.log(s.getUsers()[id]);
  console.log("----------------------------------------------\n");
  //platform specific sugar
  switch (platform) {
    case "messenger":
      context.typingOn();
      bot(id, message);
      context.typingOff();
    default:
      bot(id, message);
  }
};
//figures out how to respond to the user
async function bot(id, message) {
  //IF CONNECTED & NOT COMMAND, send to connected user
  if (s.shouldSend(id, message)) s.emit("sendMessage", id, message);

  //IF COMMAND, perform command
  if (s.isCommand(message)) {
    s.emit(message, id);
    console.log("EMITTING COMMAND: \t\t\t" + message);
  }
  //IF NOT COMMAND & NOT CONNECTED, send defult response
  else if (!s.isConnected(id)) {
    s.emit("sendCard", id, CARDS.DEFAULT);
    console.log("EMITTING COMMAND: \t\t\tsendCard");
  }

  //backup to ROM
  s.backup();
}
