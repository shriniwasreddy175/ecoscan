package com.project.ecoscan_backend.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.ecoscan_backend.dtos.LeaderboardEntryDTO;
import com.project.ecoscan_backend.dtos.UserProfileDTO;
import com.project.ecoscan_backend.services.UserService;

@RestController
@RequestMapping("/ecoscan/api/users")
@CrossOrigin("*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getProfile(@RequestParam String email) {
        return ResponseEntity.ok(userService.getProfileByEmail(email));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileDTO> updateProfile(
            @RequestParam String email,
            @RequestBody UserProfileDTO request
    ) {
        return ResponseEntity.ok(userService.updateProfile(email, request));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardEntryDTO>> getLeaderboard(
            @RequestParam(defaultValue = "50") int limit
    ) {
        return ResponseEntity.ok(userService.getLeaderboard(limit));
    }
}