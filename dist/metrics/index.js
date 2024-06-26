"use strict";
// import { NextFunction, Request, Response } from "express";
// import { requestCounter } from "./requestCount";
// import { activeRequestsGauge } from "./activeRequests";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsMiddleware = void 0;
const requestCount_1 = require("./requestCount");
const activeRequests_1 = require("./activeRequests");
const requestCount_2 = require("./requestCount");
const metricsMiddleware = (req, res, next) => {
    const startTime = Date.now();
    activeRequests_1.activeRequestsGauge.inc();
    res.on("finish", function () {
        const endTime = Date.now();
        const duration = endTime - startTime;
        // Increment request counter
        requestCount_1.requestCounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode,
        });
        requestCount_2.httpRequestDurationMicroseconds.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            code: res.statusCode,
        }, duration);
        activeRequests_1.activeRequestsGauge.dec();
    });
    next();
};
exports.metricsMiddleware = metricsMiddleware;
