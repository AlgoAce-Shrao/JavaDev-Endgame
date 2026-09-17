package com.devflow.controller;

import com.devflow.dto.request.CommentRequest;
import com.devflow.dto.response.CommentResponse;
import com.devflow.security.CurrentUser;
import com.devflow.security.UserPrincipal;
import com.devflow.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
@Tag(name = "Comments", description = "Endpoints for task comments")
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/api/tasks/{taskId}/comments")
    @Operation(summary = "Add comment to task", description = "Adds a comment to a specific task")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long taskId,
            @Valid @RequestBody CommentRequest request,
            @CurrentUser UserPrincipal currentUser) {
        CommentResponse response = commentService.createComment(taskId, request, currentUser);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/api/tasks/{taskId}/comments")
    @Operation(summary = "Get task comments", description = "Retrieves all comments for a specific task")
    public ResponseEntity<List<CommentResponse>> getCommentsByTask(
            @PathVariable Long taskId,
            @CurrentUser UserPrincipal currentUser) {
        List<CommentResponse> comments = commentService.getCommentsByTask(taskId, currentUser);
        return ResponseEntity.ok(comments);
    }

    @DeleteMapping("/api/comments/{commentId}")
    @Operation(summary = "Delete comment", description = "Deletes a comment. Only author or ADMIN can delete.")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @CurrentUser UserPrincipal currentUser) {
        commentService.deleteComment(commentId, currentUser);
        return ResponseEntity.noContent().build();
    }
}
