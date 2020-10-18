/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jaeskim <jaeskim@student.42seoul.kr>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2020/10/18 04:00:16 by jaeskim           #+#    #+#             */
/*   Updated: 2020/10/19 01:30:05 by jaeskim          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import express from "express";
import next from "next";
import NodeCache from "node-cache";

import apiRouter from "./route/apiRouter";

// for development
const NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV === "development") {
  require("dotenv").config();
}

const port = process.env.PORT || 3000;
const app = next({ dev: NODE_ENV === "development" });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const cacheStore = new NodeCache();

  server.use("*", (req, _res, next) => {
    req.cacheStore = cacheStore;
    next();
  });

  server.use("/api", apiRouter);

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> ✨Ready on http://localhost:${port}`);
  });
});