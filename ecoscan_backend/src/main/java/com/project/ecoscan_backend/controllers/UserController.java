package com.project.ecoscan_backend.controllers;

import com.project.ecoscan_backend.dtos.UserProfileDTO;
import com.project.ecoscan_backend.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}