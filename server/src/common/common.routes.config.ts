import express from "express";

export abstract class CommonRoutesConfig {
  constructor(public app: express.Application, public name: string) {
    this.configureRoutes();
  }

  get getName(): string {
    return this.name;
  }

  abstract configureRoutes(): express.Application;
}
