"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTypeORM = void 0;
const typeorm_1 = require("typeorm");
let typeORMDB;
function typeORMConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        const dataSource = new typeorm_1.DataSource({
            type: "postgres",
            url: process.env.PG_URI,
            entities: [
                `${__dirname}/entity/*.entity.js`,
                `${__dirname}/entity/*.entity.ts`,
            ],
            synchronize: true,
        });
        typeORMDB = yield dataSource.initialize();
    });
}
exports.default = typeORMConnect;
function useTypeORM(entity) {
    if (!typeORMDB) {
        throw new Error("TypeORM has not been initialized!");
    }
    return typeORMDB.getRepository(entity);
}
exports.useTypeORM = useTypeORM;
