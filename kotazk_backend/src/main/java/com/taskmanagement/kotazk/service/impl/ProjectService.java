package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.*;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.RePositionRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.member.MemberRequestDto;
import com.taskmanagement.kotazk.payload.request.project.ProjectRequestDto;
import com.taskmanagement.kotazk.payload.response.attachment.AttachmentResponseDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.common.RePositionResponseDto;
import com.taskmanagement.kotazk.payload.response.project.ProjectDetailsResponseDto;
import com.taskmanagement.kotazk.payload.response.project.ProjectResponseDto;
import com.taskmanagement.kotazk.payload.response.project.ProjectSummaryResponseDto;
import com.taskmanagement.kotazk.repository.ICustomizationRepository;
import com.taskmanagement.kotazk.repository.IProjectRepository;
import com.taskmanagement.kotazk.repository.IWorkSpaceRepository;
import com.taskmanagement.kotazk.service.*;
import com.taskmanagement.kotazk.util.*;
import jakarta.persistence.criteria.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectService implements IProjectService {
    @Autowired
    private IWorkSpaceRepository workSpaceRepository;
    @Autowired
    private IProjectRepository projectRepository;
    @Autowired
    private IMemberService memberService = new MemberService();
    @Autowired
    private ISectionService sectionService = new SectionService();
    @Autowired
    private IMemberRoleService memberRoleService = new MemberRoleService();
    @Autowired
    private IStatusService statusService = new StatusService();
    @Autowired
    private ITaskTypeService taskService = new TaskTypeService();
    @Autowired
    private IPriorityService priorityService = new PriorityService();
    @Autowired
    private ICustomizationRepository customizationRepository;
    @Autowired
    private TimeUtil timeUtil;
    @Autowired
    private final BasicSpecificationUtil<Project> specificationUtil = new BasicSpecificationUtil<>();
    @Autowired
    private FileUtil fileUtil;

    @Override
    public ProjectResponseDto initialProject(ProjectRequestDto projectDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = workSpaceRepository.findById(projectDto.getWorkSpaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", projectDto.getWorkSpaceId()));

        Member currentMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                workSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.CREATE_PROJECT),
                true
        );

        List<MemberRole> memberRoles = memberRoleService.initialMemberRole(false);
        Optional<MemberRole> memberRole = memberRoles.stream()
                .filter(item -> Objects.equals(item.getName(), "Admin"))
                .findFirst();

        Member member = Member.builder()
                .workSpace(workSpace)
                .systemInitial(true)
                .systemRequired(true)
                .role(memberRole.get())
                .memberFor(EntityBelongsTo.PROJECT)
                .user(currentUser)
                .status(MemberStatus.ACTIVE)
                .build();

        List<Status> statuses = statusService.initialStatus();

        List<TaskType> taskTypes = taskService.initialTaskType();

        List<Priority> priorities = priorityService.initialPriority();

        List<Section> sections = sectionService.initialSection();

        Project newProject = Project.builder()
                .name(projectDto.getName())
                .description(projectDto.getDescription())
                .status(ProjectStatus.ACTIVE)
                .visibility(projectDto.getVisibility())
                .isPinned(false)
                .key(generateUniqueKey())
                .position(RepositionUtil.calculateNewLastPosition(workSpace.getProjects().size()))
                .member(currentMember)
                .workSpace(workSpace)
                .memberRoles(memberRoles)
                .members(Collections.singletonList(member))
                .statuses(statuses)
                .taskTypes(taskTypes)
                .priorities(priorities)
                .sections(sections)
                .build();

        memberRoles.forEach(role -> role.setProject(newProject));
        member.setProject(newProject);
        statuses.forEach(status -> status.setProject(newProject));
        taskTypes.forEach(taskType -> taskType.setProject(newProject));
        priorities.forEach(priority -> priority.setProject(newProject));
        sections.forEach(section -> section.setProject(newProject));

        Project savedProject = projectRepository.save(newProject);


        return ModelMapperUtil.mapOne(savedProject, ProjectResponseDto.class);
    }

    @Override
    public ProjectResponseDto create(ProjectRequestDto project) {
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = workSpaceRepository.findById(project.getWorkSpaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", project.getWorkSpaceId()));
        Member currentMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                workSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.CREATE_PROJECT),
                true
        );

        Project newProject = ModelMapperUtil.mapOne(project, Project.class);
        newProject.setId(null);
        newProject.setMember(currentMember);
        newProject.setWorkSpace(workSpace);

        Project savedProject = projectRepository.save(newProject);
        return ModelMapperUtil.mapOne(savedProject, ProjectResponseDto.class);
    }

    @Override
    public ProjectResponseDto update(Long id, ProjectRequestDto project) {
        Project currentProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("project", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = currentProject.getWorkSpace();

        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                currentProject.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.MODIFY_PROJECT),
                false
        );

        Member currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                workSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.MODIFY_ALL_PROJECT),
                false
        );

        if (currentProjectMember == null && currentWorkSpaceMember == null)
            throw new CustomException("This member's role is not permission with this action!");

        if (project.getName() != null) currentProject.setName(project.getName());
        if (project.getDescription() != null) currentProject.setDescription(project.getDescription());
        if (project.getVisibility() != null) currentProject.setVisibility(project.getVisibility());
        if (project.getStatus() != null) currentProject.setStatus(project.getStatus());
        if (project.getIsPinned() != null) currentProject.setIsPinned(project.getIsPinned());

        Project savedProject = projectRepository.save(currentProject);
        return ModelMapperUtil.mapOne(savedProject, ProjectResponseDto.class);
    }

    @Override
    public ProjectResponseDto uploadCover(MultipartFile file, Long id) throws IOException {
        User currentUser = SecurityUtil.getCurrentUser();
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        Member currentMember = memberService.checkProjectMember(
                currentUser.getId(),
                project.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                new ArrayList<>(),
                true
        );

        if (!currentMember.getRole().getProjectPermissions().contains(ProjectPermission.MODIFY_PROJECT))
            throw new CustomException("This user do not have permission to add attachment in this task");


        String url = project.getCover();
        if (url != null)
            fileUtil.deleteFile(url);

        String fileUrl = fileUtil.uploadFile(file, "cover-project-" + project.getId() + "-" + UUID.randomUUID().toString());
        project.setCover(fileUrl);
        Project savedProject = projectRepository.save(project);

        return ModelMapperUtil.mapOne(savedProject, ProjectResponseDto.class);
    }


    @Override
    public Boolean delete(Long id) {
        Project currentProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = currentProject.getWorkSpace();

        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                currentProject.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.DELETE_PROJECT),
                false
        );

        Member currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                workSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.DELETE_ALL_PROJECT),
                false
        );

        if (currentProjectMember == null && currentWorkSpaceMember == null)
            throw new CustomException("This member's role is not permission with this action!");

        projectRepository.deleteById(currentProject.getId());
        return true;
    }

    @Override
    public Boolean softDelete(Long id) {
        Project currentProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = currentProject.getWorkSpace();
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();

        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                currentProject.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.DELETE_PROJECT),
                false
        );

        Member currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                workSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.DELETE_ALL_PROJECT),
                false
        );

        if (currentProjectMember == null && currentWorkSpaceMember == null)
            throw new CustomException("This member's role is not permission with this action!");


        currentProject.setDeletedAt(currentTime);
        projectRepository.deleteById(currentProject.getId());
        return true;
    }

    @Override
    public Boolean archive(Long id) {
        Project currentProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = currentProject.getWorkSpace();
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();

        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                currentProject.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.MODIFY_PROJECT),
                false
        );

        Member currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                workSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.MODIFY_ALL_PROJECT),
                false
        );

        if (currentProjectMember == null && currentWorkSpaceMember == null)
            throw new CustomException("This member's role is not permission with this action!");

        currentProject.setArchiveAt(currentTime);
        projectRepository.deleteById(currentProject.getId());
        return true;
    }

    @Override
    public Boolean restore(Long id) {
        Project currentProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = currentProject.getWorkSpace();

        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                currentProject.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.MODIFY_PROJECT),
                false
        );

        Member currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                workSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.MODIFY_ALL_PROJECT),
                false
        );

        if (currentProjectMember == null && currentWorkSpaceMember == null)
            throw new CustomException("This member's role is not permission with this action!");

        currentProject.setArchiveAt(null);
        projectRepository.deleteById(currentProject.getId());
        return true;
    }

    @Override
    public RePositionResponseDto rePosition(RePositionRequestDto rePositionRequestDto, Long workspaceId) {
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = workSpaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", workspaceId));

        Member currentMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                workSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.RE_POSITION_PROJECT),
                true
        );

        Long nextProjectPosition = workSpace.getProjects().stream()
                .filter(project -> project.getId().equals(rePositionRequestDto.getNextItemId()))
                .findFirst()
                .map(Project::getPosition)
                .orElse(null);

        Long previousProjectPosition = workSpace.getProjects().stream()
                .filter(project -> project.getId().equals(rePositionRequestDto.getPreviousItemId()))
                .findFirst()
                .map(Project::getPosition)
                .orElse(null);

        Project currentProject = workSpace.getProjects().stream()
                .filter(project -> project.getId().equals(rePositionRequestDto.getCurrentItemId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", rePositionRequestDto.getCurrentItemId()));

        currentProject.setPosition(RepositionUtil.calculateNewPosition(previousProjectPosition, nextProjectPosition));

        Project savedProject = projectRepository.save(currentProject);

        return RePositionResponseDto.builder()
                .id(savedProject.getId())
                .newPosition(savedProject.getPosition())
                .build();
    }

    @Override
    public ProjectResponseDto getOne(Long id) {
        Project currentProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = currentProject.getWorkSpace();


        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                currentProject.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.BROWSE_PROJECT),
                false
        );

        Member currentWorkSpaceMember = null;

        if (currentProject.getVisibility().equals(Visibility.PRIVATE))
            currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                    currentUser.getId(),
                    workSpace.getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(WorkSpacePermission.BROWSE_PUBLIC_PROJECT),
                    false
            );
        else if (currentProject.getVisibility().equals(Visibility.PUBLIC))
            currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                    currentUser.getId(),
                    workSpace.getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(WorkSpacePermission.BROWSE_PRIVATE_PROJECT),
                    false
            );

        if (currentProjectMember == null && currentWorkSpaceMember == null)
            throw new CustomException("This member's role is not permission with this action!");


        return ModelMapperUtil.mapOne(currentProject, ProjectResponseDto.class);
    }

    @Override
    public ProjectDetailsResponseDto getDetailsOne(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        Long userId = currentUser.getId();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        WorkSpace workSpace = project.getWorkSpace();


        Member currentMember = null;
        if (!isAdmin)
            currentMember = memberService.checkProjectAndWorkspaceBrowserPermission(currentUser, project, null);

        return ModelMapperUtil.mapOne(project, ProjectDetailsResponseDto.class);
    }

    @Override
    public PageResponse<ProjectResponseDto> getPageByWorkSpace(SearchParamRequestDto searchParam, Long workSpaceId) {
        User currentUser = SecurityUtil.getCurrentUser();
        Long userId = currentUser.getId();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);

        WorkSpace workSpace = workSpaceRepository.findById(workSpaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", workSpaceId));

        Member currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                workSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.BROWSE_PRIVATE_PROJECT),
                false
        );

        Specification<Project> permissionSpecification = (Root<Project> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Predicate publicProjectsPredicate = criteriaBuilder.equal(root.get("visibility"), Visibility.PUBLIC);
            Predicate privateProjectsPredicate = criteriaBuilder.disjunction();

            if (currentWorkSpaceMember != null &&
                    currentWorkSpaceMember.getRole().getWorkSpacePermissions().contains(WorkSpacePermission.BROWSE_PRIVATE_PROJECT)) {
                privateProjectsPredicate = criteriaBuilder.equal(root.get("visibility"), Visibility.PRIVATE);
            } else {
                Join<Project, Member> projectMemberJoin = root.join("members", JoinType.LEFT);
                Predicate privateMemberPredicate = criteriaBuilder.equal(root.get("visibility"), Visibility.PRIVATE);
                Predicate userMemberPredicate = criteriaBuilder.equal(projectMemberJoin.get("user").get("id"), userId);
                Predicate statusPredicate = criteriaBuilder.equal(projectMemberJoin.get("status"), MemberStatus.ACTIVE);
                privateProjectsPredicate = criteriaBuilder.and(privateMemberPredicate, userMemberPredicate, statusPredicate);
            }

            return criteriaBuilder.or(publicProjectsPredicate, privateProjectsPredicate);
        };

        Specification<Project> workSpaceSpecification = (Root<Project> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Join<Project, WorkSpace> workSpaceJoin = root.join("workSpace");
            return criteriaBuilder.equal(workSpaceJoin.get("id"), workSpace.getId());
        };

        Specification<Project> filterSpecification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());

        Pageable pageable = PageRequest.of(
                searchParam.getPageNum(),
                searchParam.getPageSize(),
                Sort.by(searchParam.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParam.getSortBy() != null ? searchParam.getSortBy() : "createdAt"));

        Specification<Project> specification = Specification.where(workSpaceSpecification)
                .and(permissionSpecification)
                .and(filterSpecification);

        Page<Project> page = projectRepository.findAll(specification, pageable);
        List<ProjectResponseDto> dtoList = ModelMapperUtil.mapList(page.getContent(), ProjectResponseDto.class);

        return new PageResponse<>(
                dtoList,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.hasNext(),
                page.hasPrevious()
        );
    }

    @Override
    public PageResponse<ProjectSummaryResponseDto> getSummaryPageByWorkSpace(SearchParamRequestDto searchParam, Long workSpaceId) {
        User currentUser = SecurityUtil.getCurrentUser();
        Long userId = currentUser.getId();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);

        WorkSpace workSpace = workSpaceRepository.findById(workSpaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", workSpaceId));

        Member currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                workSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.BROWSE_PRIVATE_PROJECT),
                false
        );

        Specification<Project> permissionSpecification = (Root<Project> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Predicate publicProjectsPredicate = criteriaBuilder.equal(root.get("visibility"), Visibility.PUBLIC);
            Predicate privateProjectsPredicate = criteriaBuilder.disjunction();

            if (currentWorkSpaceMember != null &&
                    currentWorkSpaceMember.getRole().getWorkSpacePermissions().contains(WorkSpacePermission.BROWSE_PRIVATE_PROJECT)) {
                privateProjectsPredicate = criteriaBuilder.equal(root.get("visibility"), Visibility.PRIVATE);
            } else {
                Join<Project, Member> projectMemberJoin = root.join("members", JoinType.LEFT);
                Predicate privateMemberPredicate = criteriaBuilder.equal(root.get("visibility"), Visibility.PRIVATE);
                Predicate userMemberPredicate = criteriaBuilder.equal(projectMemberJoin.get("user").get("id"), userId);
                Predicate statusPredicate = criteriaBuilder.equal(projectMemberJoin.get("status"), MemberStatus.ACTIVE);
                privateProjectsPredicate = criteriaBuilder.and(privateMemberPredicate, userMemberPredicate, statusPredicate);
            }

            return criteriaBuilder.or(publicProjectsPredicate, privateProjectsPredicate);
        };

        Specification<Project> workSpaceSpecification = (Root<Project> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Join<Project, WorkSpace> workSpaceJoin = root.join("workSpace");
            return criteriaBuilder.equal(workSpaceJoin.get("id"), workSpace.getId());
        };

        Specification<Project> filterSpecification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());

        Pageable pageable = PageRequest.of(
                searchParam.getPageNum(),
                searchParam.getPageSize(),
                Sort.by(searchParam.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParam.getSortBy() != null ? searchParam.getSortBy() : "createdAt"));

        Specification<Project> specification = Specification.where(workSpaceSpecification)
                .and(permissionSpecification)
                .and(filterSpecification);

        Page<Project> page = projectRepository.findAll(specification, pageable);
        List<ProjectSummaryResponseDto> dtoList = ModelMapperUtil.mapList(page.getContent(), ProjectSummaryResponseDto.class);

        return new PageResponse<>(
                dtoList,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.hasNext(),
                page.hasPrevious()
        );
    }

    // Utilities function
    private String generateUniqueKey() {
        String key;
        do {
            key = RandomStringGeneratorUtil.generateKey();
        } while (projectRepository.findByKey(key).isPresent());
        return key;
    }
}
