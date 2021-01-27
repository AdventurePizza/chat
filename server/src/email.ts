const mailjet = require("node-mailjet").connect(
  "8fef908a31a7a1f8647120eeb0f14413",
  "f19f15cc3ff0663f91d5e16c65491ab1"
);

export const sendEmail = (to: string, message: string, url: string) => {
  if (!validateEmail(to)) return console.log("invalid email ", to);
  console.log("send email got ", to, message, url);

  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "friends@trychats.com",
          Name: "trychats",
        },
        To: [
          {
            Email: to,
            Name: "friend",
          },
        ],
        Subject: "trychats, message from a friend",
        HTMLPart: `<div>
        <div>happy ${
          days[new Date().getDay()]
        }, your friend shared this page ${url}, and this message</div>
        <br />
        <div>${message}</div>
        <br />
        <a href='${url}'>trychats</a>
        <br />
        <br />
        <div>rich, dynamic, collaborative email</div>
        </div>`,
      },
    ],
  });

  request
    .then((result: any) => {
      console.log(result.body);
    })
    .catch((err: any) => {
      console.log(err.statusCode);
    });
};

const validateEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
