var getClient = require("bottender/dist/getClient.js");
const {
  CARDS,
  BUTTONS,
  newUserTemplate,
  newConnection,
} = require("./constants");
var storage = require("node-persist");
var EventEmitter = require("eventemitter3");

module.exports = class EventHandler {
  constructor() {
    this.setupUsers();
    this.setupClients();
    this.setupEvents();
  }

  async setupEvents() {
    this.e = new EventEmitter();
    this.e.on("sendMessage", (id, message) => this.sendText(id, message));

    this.e.on("sendCard", (id, card) => this.sendCard(id, card));

    this.e.on("/start", (id) => this.start(id));
    this.e.on("/sub", (id) => this.sub(id));
    this.e.on("/server", (id) => this.server(id));
    this.e.on("/stop", (id) => this.stop(id));
    this.e.on("/exit", (id) => this.exit(id));
    this.e.on("/more_info", (id) => this.moreInfo(id));
    this.e.on("/new_connection", (id) => this.newConnection(id));
    this.e.on("/searching", (id) => this.searching(id));
  }

  async setupClients() {
    this.messenger = getClient.default("messenger");
    this.line = getClient.default("line");
    this.slack = getClient.default("slack");
    this.viber = getClient.default("viber");
    this.telegram = getClient.default("telegram");
  }
  async setupUsers() {
    await storage.init({ dir: "./data" }).then(() => {
      storage.setItem("users", {}); //reset data
      storage.getItem("users").then((data) => {
        this.users = data;
      });
    });
  }

  ///////////

  sendText(id, message) {
    console.log(`SENDING MESSAGE: ${message}\t\t to user: ${id}`);
    switch (this.users[id].platform) {
      case "messenger":
        this.messenger.sendText(id, message);
        break;
      case "line":
        this.line.pushText(id, message);
        break;
      case "slack":
        this.slack.postMessage(id, { text: message });
        break;
      case "telegram":
        this.telegram.sendMessage(id, message);
        break;
      case "viber":
        this.viber.sendText(id, message);
    }
  }

  sendCard(id, card) {
    console.log(
      "=========================USERS=================================="
    );
    console.log(id);
    console.log("PLATFORM:\t\t\t" + this.users[id].platform);
    switch (this.users[id].platform) {
      case "messenger":
        this.sendCard_FB(id, card);
        break;
      case "line":
        this.sendCard_LINE(id, card);
        break;
      case "slack":
        this.sendCard_SLACK(id, card);
        break;
      case "telegram":
        this.sendCard_TELEGRAM(id, card);
        break;
      case "viber":
        this.sendCard_VIBER(id, card);
    }
  }

  sendCard_FB(id, card) {
    this.messenger.sendGenericTemplate(id, [
      {
        title: card.title,
        imageUrl: card.url,
        subtitle: card.subtitle,
        buttons: [
          this.isConnected(id)
            ? BUTTONS.EXIT
            : this.isSearching(id)
            ? BUTTONS.STOP_WAITING
            : BUTTONS.START,
          // this.users[id].subscribed ? BUTTONS.UNSUB : BUTTONS.SUB,
          // BUTTONS.MORE_INFO,
        ],
      },
    ]);
  }

  sendCard_LINE(id, card) {
    var label = this.isConnected(id)
      ? BUTTONS.EXIT.title
      : this.isSearching(id)
      ? BUTTONS.STOP_WAITING.title
      : BUTTONS.START.title;
    var data = this.isConnected(id)
      ? BUTTONS.EXIT.payload
      : this.isSearching(id)
      ? BUTTONS.STOP_WAITING.payload
      : BUTTONS.START.payload;

    line.replyTemplate(id, "this is a template", {
      type: "buttons",
      thumbnailImageUrl: card.url,
      title: card.title,
      text: card.subtitle,
      actions: [
        {
          type: "postback",
          label: label,
          data: data,
        },
      ],
    });
  }

  sendCard_SLACK(id, card) {
    var label = this.isConnected(id)
      ? BUTTONS.EXIT.title
      : this.isSearching(id)
      ? BUTTONS.STOP_WAITING.title
      : BUTTONS.START.title;
    var data = this.isConnected(id)
      ? BUTTONS.EXIT.payload
      : this.isSearching(id)
      ? BUTTONS.STOP_WAITING.payload
      : BUTTONS.START.payload;
    const attachments = [
      {
        text: card.subtitle,
        fallback: "You are unable to choose a game",
        callback_id: data,
        color: "#3AA3E3",
        attachment_type: "default",
        actions: [
          {
            name: label,
            text: label,
            type: "button",
            value: data,
          },
        ],
      },
    ];
    this.slack
      .postMessage(id, {
        text: card.title,
        attachments: attachments,
      })
      .catch((err) => console.log(err));
  }

  sendCard_TELEGRAM(id, card) {
    console.log("TELEGRAM CARD");
    var label = this.isConnected(id)
      ? BUTTONS.EXIT.title
      : this.isSearching(id)
      ? BUTTONS.STOP_WAITING.title
      : BUTTONS.START.title;
    var data = this.isConnected(id)
      ? BUTTONS.EXIT.payload
      : this.isSearching(id)
      ? BUTTONS.STOP_WAITING.payload
      : BUTTONS.START.payload;
    this.telegram.sendMessage(
      id,
      card.title + "\n Send " + data + " " + card.subtitle,
      {
        reply_markup: {
          text: label,
          callback_data: data,
        },
      }
    );
  }

  sendCard_VIBER(id, card) {
    var label = this.isConnected(id)
      ? BUTTONS.EXIT.title
      : this.isSearching(id)
      ? BUTTONS.STOP_WAITING.title
      : BUTTONS.START.title;
    var data = this.isConnected(id)
      ? BUTTONS.EXIT.payload
      : this.isSearching(id)
      ? BUTTONS.STOP_WAITING.payload
      : BUTTONS.START.payload;

    const message = {
      type: "rich_media",
      rich_media: {
        Type: "rich_media",
        ButtonsGroupColumns: 1,
        ButtonsGroupRows: 1,
        BgColor: "#FFFFFF",
        Buttons: [
          {
            Columns: 1,
            Rows: 1,
            ActionType: "reply",
            Text: `<font color=#ffffff>${label}</font>`,
            TextSize: "large",
            TextVAlign: "middle",
            TextHAlign: "middle",
            ActionBody: data,
            Image: card.url,
          },
        ],
      },
    };

    this.viber.sendMessage(id, message);
  }

  isNew(id) {
    return this.users[id] === undefined;
  }
  add(id, platform) {
    this.users[id] = { ...newUserTemplate, id, platform };
  }

  shouldSend(id, message) {
    return this.isCommand(message) & this.isConnected(id);
  }

  isCommand(message) {
    try {
      return message[0] == "/";
    } catch (err) {
      return false;
    }
  }

  isConnected(id) {
    return this.users[id].status == "connected";
  }
  isSearching(id) {
    return this.users[id].status == "searching";
  }

  foundMatch(id) {
    var idConnected = null;
    var userIDs = Object.keys(this.users);
    for (let i = 0; i < userIDs.length; i++) {
      if (this.users[userIDs[i]].status == "searching") {
        idConnected = userIDs[i];
        continue;
      }
    }
    if (idConnected == null) {
      this.setStatus(id, "searching");
      return false; //searching for someone
    } else if (idConnected != id) {
      this.connect(id, idConnected);
      return true; //connected with someone
    } else return false;
  }

  connect(id, idConnected) {
    this.users[id].idConnected = idConnected;
    this.users[idConnected].idConnected = id;
    this.users[idConnected].connections[id] = { ...newConnection };
    this.users[id].connections[idConnected] = { ...newConnection };
    this.setStatus(id, "connected");
    this.setStatus(idConnected, "connected");
  }

  disconnect(id, idConnected) {
    this.users[id].idConnected = null;
    this.users[idConnected].idConnected = null;
    this.setStatus(id, "dormant");
    this.setStatus(idConnected, "dormant");
  }

  backup() {
    storage.setItem("users", this.users);
  }

  start(id) {
    if (this.foundMatch(id)) {
      console.log("ISNEWCONNECTION");
      this.newConnection(id);
    } else {
      console.log("SEARCHING");
      this.searching(id);
    }
  }

  newConnection(id) {
    this.sendCard(id, CARDS.NEW_CONNECTION);
    this.sendCard(this.users[id].idConnected, CARDS.NEW_CONNECTION);
  }
  searching(id) {
    this.sendCard(id, CARDS.SEARCHING);
  }

  stop(id) {
    this.setStatus(id, "dormant");
    this.sendCard(id, CARDS.DEFAULT);
  }
  exit(id) {
    if (this.users[id].idConnected != null) {
      var idConnected = this.users[id].idConnected;
      this.disconnect(id, this.users[id].idConnected);
      this.sendCard(id, CARDS.DISCONNECTION);
      this.sendCard(idConnected, CARDS.DISCONNECTION);
    } else this.sendCard(id, CARDS.FAILED_DISCONNECTION);
  }
  getUsers() {
    return this.users;
  }

  setStatus(id, status) {
    this.users[id].status = status;
    return this.users[id].status;
  }

  emit(action, ...args) {
    this.e.emit(action, ...args);
  }
};
