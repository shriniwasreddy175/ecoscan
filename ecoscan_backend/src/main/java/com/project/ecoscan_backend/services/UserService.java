package com.project.ecoscan_backend.services;

import java.util.List;

import com.project.ecoscan_backend.dtos.AuthResponseDTO;
import com.project.ecoscan_backend.dtos.LeaderboardEntryDTO;
import com.project.ecoscan_backend.dtos.LoginRequestDTO;
import com.project.ecoscan_backend.dtos.SignupRequestDTO;
import com.project.ecoscan_backend.dtos.UserProfileDTO;

public interface UserService {
    AuthResponseDTO signup(SignupRequestDTO request);
    AuthResponseDTO login(LoginRequestDTO request);
    UserProfileDTO getProfileByEmail(String email);
    UserProfileDTO updateProfile(String email, UserProfileDTO request);
    List<LeaderboardEntryDTO> getLeaderboard(int limit);
}