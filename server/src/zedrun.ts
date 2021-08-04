import express, { Request, Response } from "express";
const zedrunRouter = express.Router();
const axios = require('axios');

// request Images, This request on serverside because of CORS restriction in client side
zedrunRouter.get("/", async (req, res) => {
  const data = JSON.stringify({query: "{get_race_results(first:5, input: {only_my_racehorses: false}) {edges {node {name race_id}}      }  }"})

  axios.post('https://zed-ql.zed.run/graphql', data, {
      headers: {
        'Content-Type': 'application/json',
        'x-developer-secret': 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjcnlwdG9maWVsZF9hcGkiLCJleHAiOjE2MzAzMTMxNzUsImlhdCI6MTYyNzg5Mzk3NSwiaXNzIjoiY3J5cHRvZmllbGRfYXBpIiwianRpIjoiZmYyY2ZkMjEtYWZiOS00M2YyLWFlNmYtMWQxYzg1YWJmNjFjIiwibmJmIjoxNjI3ODkzOTc0LCJzdWIiOnsiZXh0ZXJuYWxfaWQiOiJkOTY5Y2U3Yi0xNjQzLTQ5NTItODdkZS0zZGVkYjNkZDY4NDAiLCJpZCI6MTUwMzIxLCJwdWJsaWNfYWRkcmVzcyI6IjB4MjI1MUEyMjJCOWQ4MTYxNEJkMzdiRGE1RGY0OWU3RDJiMjk2MmM3MSIsInN0YWJsZV9uYW1lIjoiVHVscGFyIn0sInR5cCI6ImFjY2VzcyJ9.OOa-g_0NzD8ak0ylS-fQJRoHPq3tHKvdWEsSOyPKp2YIQs5qFF2o959T_bySNrIpINoQj5IQzxROpC8F2-KRxg',
      },
  }).then((response: any) => {
    res.status(200).send(response.data);
  }).catch((err: any) => console.log(err));
});

export default zedrunRouter;