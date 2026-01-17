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
exports.ProjectUserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_user_entity_1 = require("../entities/project-user.entity");
const user_entity_1 = require("../entities/user.entity");
const project_entity_1 = require("../entities/project.entity");
let ProjectUserService = class ProjectUserService {
    constructor(projectUserRepository, userRepository, projectRepository) {
        this.projectUserRepository = projectUserRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }
    async assignUserToProject(projectId, userId, currentUserId, role) {
        // Verify current user is project owner or admin
        const currentUser = await this.userRepository.findOne({ where: { id: currentUserId } });
        if (!currentUser) {
            throw new Error('User not found');
        }
        const currentUserProject = await this.projectUserRepository.findOne({
            where: { project_id: projectId, user_id: currentUserId },
        });
        if (!currentUserProject || currentUserProject.role !== 'owner') {
            if (currentUser.role !== 'admin') {
                throw new Error('Only project owner or admin can assign users');
            }
        }
        // Verify user exists
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        // Verify project exists
        const project = await this.projectRepository.findOne({ where: { id: projectId } });
        if (!project) {
            throw new Error('Project not found');
        }
        // Check if already assigned
        const existingAssignment = await this.projectUserRepository.findOne({
            where: { project_id: projectId, user_id: userId },
        });
        if (existingAssignment) {
            throw new Error('User is already assigned to this project');
        }
        const projectUser = this.projectUserRepository.create({
            project_id: projectId,
            user_id: userId,
            role,
        });
        return this.projectUserRepository.save(projectUser);
    }
    async updateUserRole(projectId, userId, currentUserId, newRole) {
        // Verify current user is project owner or admin
        const currentUser = await this.userRepository.findOne({ where: { id: currentUserId } });
        if (!currentUser) {
            throw new Error('User not found');
        }
        const currentUserProject = await this.projectUserRepository.findOne({
            where: { project_id: projectId, user_id: currentUserId },
        });
        if (!currentUserProject || currentUserProject.role !== 'owner') {
            if (currentUser.role !== 'admin') {
                throw new Error('Only project owner or admin can update user roles');
            }
        }
        const projectUser = await this.projectUserRepository.findOne({
            where: { project_id: projectId, user_id: userId },
        });
        if (!projectUser) {
            throw new Error('User is not assigned to this project');
        }
        projectUser.role = newRole;
        return this.projectUserRepository.save(projectUser);
    }
    async removeUserFromProject(projectId, userId, currentUserId) {
        // Verify current user is project owner or admin
        const currentUser = await this.userRepository.findOne({ where: { id: currentUserId } });
        if (!currentUser) {
            throw new Error('User not found');
        }
        const currentUserProject = await this.projectUserRepository.findOne({
            where: { project_id: projectId, user_id: currentUserId },
        });
        if (!currentUserProject || currentUserProject.role !== 'owner') {
            if (currentUser.role !== 'admin') {
                throw new Error('Only project owner or admin can remove users');
            }
        }
        const projectUser = await this.projectUserRepository.findOne({
            where: { project_id: projectId, user_id: userId },
        });
        if (!projectUser) {
            throw new Error('User is not assigned to this project');
        }
        await this.projectUserRepository.remove(projectUser);
        return { message: 'User removed from project successfully' };
    }
};
exports.ProjectUserService = ProjectUserService;
exports.ProjectUserService = ProjectUserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_user_entity_1.ProjectUser)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProjectUserService);
