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
exports.ProjectService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_entity_1 = require("../entities/project.entity");
const project_user_entity_1 = require("../entities/project-user.entity");
const user_entity_1 = require("../entities/user.entity");
let ProjectService = class ProjectService {
    constructor(projectRepository, projectUserRepository, userRepository) {
        this.projectRepository = projectRepository;
        this.projectUserRepository = projectUserRepository;
        this.userRepository = userRepository;
    }
    async getAllProjects(userId, clientId) {
        const projects = await this.projectRepository.find({
            where: { client_id: clientId },
            relations: ['projectUsers', 'projectUsers.user'],
        });
        return projects;
    }
    async getProjectById(projectId) {
        return this.projectRepository.findOne({
            where: { id: projectId },
            relations: ['projectUsers', 'projectUsers.user'],
        });
    }
    async createProject(userId, clientId, name, description) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user || (user.role !== 'admin' && !this.isProjectOwner(userId, clientId))) {
            throw new Error('Only admin or project owner can create projects');
        }
        const project = this.projectRepository.create({
            name,
            description,
            client_id: clientId,
        });
        const savedProject = await this.projectRepository.save(project);
        // Add creator as owner
        await this.projectUserRepository.save({
            project_id: savedProject.id,
            user_id: userId,
            role: 'owner',
        });
        return savedProject;
    }
    async updateProject(projectId, userId, name, description) {
        const projectUser = await this.projectUserRepository.findOne({
            where: { project_id: projectId, user_id: userId },
        });
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user || (!projectUser || projectUser.role !== 'owner') && user.role !== 'admin') {
            throw new Error('Only project owner or admin can update project');
        }
        await this.projectRepository.update(projectId, { name, description });
        return this.getProjectById(projectId);
    }
    async deleteProject(projectId, userId) {
        const projectUser = await this.projectUserRepository.findOne({
            where: { project_id: projectId, user_id: userId },
        });
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user || (!projectUser || projectUser.role !== 'owner') && user.role !== 'admin') {
            throw new Error('Only project owner or admin can delete project');
        }
        await this.projectRepository.delete(projectId);
        return { message: 'Project deleted successfully' };
    }
    async isProjectOwner(userId, clientId) {
        const projectUser = await this.projectUserRepository.findOne({
            where: { user_id: userId },
            relations: ['project'],
        });
        return !!(projectUser && projectUser.project.client_id === clientId);
    }
};
exports.ProjectService = ProjectService;
exports.ProjectService = ProjectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(1, (0, typeorm_1.InjectRepository)(project_user_entity_1.ProjectUser)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProjectService);
