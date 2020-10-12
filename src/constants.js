const URL = {
  CONNECT:
    "https://www.hypnosisdownloads.com/sites/www.hypnosisdownloads.com/files/product-images/connected.jpg",
  DEFAULT:
    "https://dz9yg0snnohlc.cloudfront.net/is-it-normal-to-talk-to-random-people-online-1-new.jpg",
  WAVING:
    "https://image.freepik.com/free-photo/friendly-happy-beautiful-woman-waving-hello_74855-2808.jpg",
  DISCONNECT: "https://i.ytimg.com/vi/IEE9XUKr-9U/maxresdefault.jpg",
};

const NOT_COMMAND = "not_command",
  NEW_CONNECTION = "new_connection",
  DORMANT = "dormant",
  SEARCHING = "searching",
  CONNECTED = "connected",
  DISCONNECT = "disconnect",
  FAILED_DISCONNECTION = "failed_disconnection",
  TOGGLE_SUBSCRIPTION = "toggle_subscription",
  UNSUPPORTED = "/unsupported",
  START = "/start",
  UNSUB = "/unsub",
  SUB = "/sub",
  SERVER = "/server",
  STOP = "/stop",
  EXIT = "/exit",
  MORE_INFO = "/more_info";

module.exports = {
  newUserTemplate: {
    id: 1,
    status: DORMANT,
    idConnected: null,
    subscribed: false,
    points: 0,
    platform: null,
    connections: {},
  },

  newConnection: {
    points: 10,
  },
  RESPONSES: {
    NOT_COMMAND,
    NEW_CONNECTION,
    DORMANT,
    SEARCHING,
    CONNECTED,
    DISCONNECT,
    FAILED_DISCONNECTION,
    TOGGLE_SUBSCRIPTION,
    UNSUPPORTED,
  },
  COMMANDS: { START, UNSUB, SUB, SERVER, STOP, EXIT, MORE_INFO },
  CARDS: {
    DEFAULT: {
      title: "The HI - Human Interface",
      subtitle: "Talk to someone anonymously.",
      url: URL.DEFAULT,
    },
    NEW_CONNECTION: {
      title: "Say HI!",
      subtitle: "You have connected to someone! Type /exit to disconnect.",
      url: URL.WAVING,
    },

    DISCONNECTION: {
      title: "Disconnected",
      subtitle: "Someone sent /exit which disconnects users",
      url: URL.DISCONNECT,
    },
    DORMANT: {
      title: "You have stopped waiting",
      subtitle: "Start a new chat.",
      url: URL.DEFAULT,
    },

    FAILED_DISCONNECTION: {
      title: "The Human Interface",
      subtitle: "Talk to someone anonymously.",
      url: URL.DEFAULT,
    },

    FALLBACK: {
      title: "The Human Interface",
      subtitle: "Talk to another person anonymously.",
      url: URL.DEFAULT,
    },

    SEARCHING: {
      title: "Waiting...",
      subtitle: "Please wait for another user to connect...",
      url: URL.DEFAULT,
    },
  },
  BUTTONS: {
    START: {
      type: "postback",
      title: "Chat to Someone",
      payload: START,
    },

    STOP_WAITING: {
      type: "postback",
      title: "Stop Waiting...",
      payload: STOP,
    },

    EXIT: {
      type: "postback",
      title: "Exit Chat",
      payload: EXIT,
    },

    UNSUB: {
      type: "postback",
      title: "Unsub Daily Reminders",
      payload: UNSUB,
    },
    SUB: {
      type: "postback",
      title: "Daily Reminders?",
      payload: SUB,
    },

    MORE_INFO: {
      type: "postback",
      title: "More Info",
      payload: MORE_INFO,
    },
  },

  URL: {
    CONNECT:
      "https://www.hypnosisdownloads.com/sites/www.hypnosisdownloads.com/files/product-images/connected.jpg",
    DEFAULT:
      "https://dz9yg0snnohlc.cloudfront.net/is-it-normal-to-talk-to-random-people-online-1-new.jpg",
  },
};
