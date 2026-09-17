package com.devflow.service;

import com.devflow.dto.request.CommentRequest;
import com.devflow.dto.response.CommentResponse;
import com.devflow.security.UserPrincipal;

import java.util.List;

public interface CommentService {
    CommentResponse createComment(Long taskId, CommentRequest request, UserPrincipal currentUser);
    List<CommentResponse> getCommentsByTask(Long taskId, UserPrincipal currentUser);
    void deleteComment(Long commentId, UserPrincipal currentUser);
}
