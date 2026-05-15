package com.project.ecoscan_backend.services;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.project.ecoscan_backend.dtos.AuthResponseDTO;
import com.project.ecoscan_backend.dtos.LeaderboardEntryDTO;
import com.project.ecoscan_backend.dtos.LoginRequestDTO;
import com.project.ecoscan_backend.dtos.SignupRequestDTO;
import com.project.ecoscan_backend.dtos.UserProfileDTO;
import com.project.ecoscan_backend.entities.User;
import com.project.ecoscan_backend.repositories.UserRepository;
import com.project.ecoscan_backend.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public AuthResponseDTO signup(SignupRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setOrganization(request.getOrganization());
        user.setRole(request.getRole() != null ? request.getRole() : "USER");
        user.setUserId(generateUserId(request.getFullName()));

        User saved = userRepository.save(user);

        return new AuthResponseDTO(
                jwtUtil.generateToken(saved.getUserId()),
                "Signup successful",
                toProfileDTO(saved)
        );
    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return new AuthResponseDTO(
                jwtUtil.generateToken(user.getUserId()),
                "Login successful",
                toProfileDTO(user)
        );
    }

    @Override
    public UserProfileDTO getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        return toProfileDTO(user);
    }

    @Override
    public UserProfileDTO updateProfile(String email, UserProfileDTO request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setOrganization(request.getOrganization());
        user.setRole(request.getRole());

        User saved = userRepository.save(user);
        return toProfileDTO(saved);
    }

    @Override
    public List<LeaderboardEntryDTO> getLeaderboard(int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 100));
        AtomicInteger rankCounter = new AtomicInteger(1);

        return userRepository
                .findAllByOrderByEcoPointsDesc(PageRequest.of(0, safeLimit))
                .stream()
                .map(user -> new LeaderboardEntryDTO(
                        rankCounter.getAndIncrement(),
                        user.getUserId(),
                        user.getFullName(),
                        user.getOrganization(),
                        user.getEcoPoints(),
                        resolveLevel(user.getEcoPoints()),
                        resolveLevelIcon(user.getEcoPoints())
                ))
                .toList();
    }

    private String resolveLevel(int points) {
        if (points >= 1000) return "Sustainability Champion";
        if (points >= 500)  return "Eco Warrior";
        if (points >= 250)  return "Green Guardian";
        if (points >= 100)  return "Eco Explorer";
        return "Seedling";
    }

    private String resolveLevelIcon(int points) {
        if (points >= 1000) return "🏆";
        if (points >= 500)  return "🌍";
        if (points >= 250)  return "♻️";
        if (points >= 100)  return "🌿";
        return "🌱";
    }

    private UserProfileDTO toProfileDTO(User user) {
        return new UserProfileDTO(
                user.getId(),
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getOrganization(),
                user.getRole(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }

    private String generateUserId(String fullName) {
        String baseUserId = normalizeUserId(fullName);
        String candidateUserId = baseUserId;
        int suffix = 2;

        while (userRepository.existsByUserId(candidateUserId)) {
            candidateUserId = baseUserId + "-" + suffix;
            suffix++;
        }

        return candidateUserId;
    }

    private String normalizeUserId(String fullName) {
        if (fullName == null || fullName.isBlank()) {
            return "user";
        }

        String normalized = Normalizer.normalize(fullName, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "_")
                .replaceAll("^_+|_+$", "");

        return normalized.isBlank() ? "user" : normalized;
    }
}