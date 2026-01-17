"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectUserController = void 0;
const common_1 = require("@nestjs/common");
const project_user_service_1 = require("./project-user.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ProjectUserController = class ProjectUserController {
    constructor(projectUserService) {
        this.projectUserService = projectUserService;
    }
    async assignUserToProject(projectId, req, body) {
        return this.projectUserService.assignUserToProject(projectId, body.user_id, req.user.sub, body.role);
    }
    async updateUserRole(projectId, userId, req, body) {
        return this.projectUserService.updateUserRole(projectId, userId, req.user.sub, body.role);
    }
    async removeUserFromProject(projectId, userId, req) {
        return this.projectUserService.removeUserFromProject(projectId, userId, req.user.sub);
    }
};
exports.ProjectUserController = ProjectUserController;
__decorate([
    (0, common_1.Post)(':id/users'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectUserController.prototype, "assignUserToProject", null);
__decorate([
    (0, common_1.Put)(':id/users/:userId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectUserController.prototype, "updateUserRole", null);
__decorate([
    (0, common_1.Delete)(':id/users/:userId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ProjectUserController.prototype, "removeUserFromProject", null);
exports.ProjectUserController = ProjectUserController = __decorate([
    (0, common_1.Controller)('api/projects'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [project_user_service_1.ProjectUserService])
], ProjectUserController);
