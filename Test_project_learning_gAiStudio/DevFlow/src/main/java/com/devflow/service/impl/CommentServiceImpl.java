package com.devflow.service.impl;

import com.devflow.dto.request.CommentRequest;
import com.devflow.dto.response.CommentResponse;
import com.devflow.entity.Comment;
import com.devflow.entity.Task;
import com.devflow.entity.User;
import com.devflow.enums.Role;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.exception.UnauthorizedActionException;
import com.devflow.mapper.EntityMapper;
import com.devflow.repository.CommentRepository;
import com.devflow.repository.TaskRepository;
import com.devflow.repository.UserRepository;
import com.devflow.security.UserPrincipal;
import com.devflow.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final EntityMapper entityMapper;

    @Override
    @Transactional
    public CommentResponse createComment(Long taskId, CommentRequest request, UserPrincipal currentUser) {
        log.info("User {} adding comment to task ID: {}", currentUser.getId(), taskId);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        User author = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .task(task)
                .author(author)
                .build();

        Comment savedComment = commentRepository.save(comment);
        return entityMapper.toCommentResponse(savedComment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByTask(Long taskId, UserPrincipal currentUser) {
        log.info("Fetching comments for task ID: {}", taskId);

        if (!taskRepository.existsById(taskId)) {
            throw new ResourceNotFoundException("Task", "id", taskId);
        }

        List<Comment> comments = commentRepository.findByTaskIdOrderByCreatedAtDesc(taskId);
        return comments.stream()
                .map(entityMapper::toCommentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId, UserPrincipal currentUser) {
        log.info("Deleting comment ID: {} by user: {}", commentId, currentUser.getId());

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        boolean isAuthor = comment.getAuthor().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isAuthor && !isAdmin) {
            throw new UnauthorizedActionException("You can only delete your own comments unless you are an administrator");
        }

        commentRepository.delete(comment);
    }
}
