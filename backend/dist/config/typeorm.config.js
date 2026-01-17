"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeormConfig = void 0;
const client_entity_1 = require("../entities/client.entity");
const user_entity_1 = require("../entities/user.entity");
const project_entity_1 = require("../entities/project.entity");
const project_user_entity_1 = require("../entities/project-user.entity");
exports.typeormConfig = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'project_management',
    entities: [client_entity_1.Client, user_entity_1.User, project_entity_1.Project, project_user_entity_1.ProjectUser],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: false,
};
