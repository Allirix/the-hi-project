const get_FB = (context) => {
  context.getUserProfile().then((user) => {
    return { id: user.id, message: context.event.rawEvent.message.text };
  });
};
const get_LINE = (context) => {
  context.getUserProfile().then((user) => {
    return { id: user.userID, message: context.rawEvent.message.text };
  });
};
const get_SLACK = (context) => {
  console.log(context.event.rawEvent.actions[0].value);
  console.log(context.event.rawEvent.text === undefined);
  console.log(context.event.rawEvent.text == undefined);

  const message =
    context.event.rawEvent.text != undefined
      ? context.event.rawEvent.text
      : context.event.rawEvent.actions[0].value;
  console.log(message);
  return {
    id: context.session.channel.id,
    message,
  };
};
const get_TELEGRAM = (context) => {
  return {
    id: context.event.rawEvent.message.from.id,
    message: context.event.rawEvent.message.text,
  };
};
const get_VIBER = (context) => {
  return {
    id: context.event.rawEvent.sender.id,
    message: context.event.rawEvent.message.text,
  };
};

var get = {};
get["messenger"] = get_FB;
get["line"] = get_LINE;
get["slack"] = get_SLACK;
get["telegram"] = get_TELEGRAM;
get["viber"] = get_VIBER;

module.exports = get;
