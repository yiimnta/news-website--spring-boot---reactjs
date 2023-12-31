package com.news.news.controller;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.news.news.dto.request.auth.AuthDTO;
import com.news.news.dto.request.auth.AuthEmailVerificationDTO;
import com.news.news.dto.request.auth.LoginDTO;
import com.news.news.dto.request.user.EmailVerificationDTO;
import com.news.news.dto.response.JwtAuthenticationResponse;
import com.news.news.dto.response.ResponseMessage;
import com.news.news.exception.RefreshTokenException;
import com.news.news.model.RefreshToken;
import com.news.news.model.Role;
import com.news.news.model.RoleEnum;
import com.news.news.model.User;
import com.news.news.model.UserStatusEnum;
import com.news.news.service.impl.AuthService;
import com.news.news.service.impl.JWTService;
import com.news.news.service.impl.RefreshTokenService;
import com.news.news.service.impl.RoleService;
import com.news.news.service.impl.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController extends Controller {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> signup(@RequestBody @Valid AuthDTO authDTO, HttpServletResponse response)
            throws Exception {
        if (userService.existsByEmail(authDTO.getEmail())) {
            return new ResponseEntity<>(new ResponseMessage("Email have already existed"), HttpStatus.CONFLICT);
        } else {

            Role memberRole = roleService.findByName(RoleEnum.MEMBER).orElse(null);

            if (memberRole == null) {
                throw new Exception("Can not find Member role!");
            }

            Set<Role> roles = new HashSet<>();
            roles.add(memberRole);
            User newUser = authService.register(authDTO, roles);

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(newUser.getEmail(), newUser.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = jwtService.generateToken(newUser);
            JwtAuthenticationResponse jwtResponse = new JwtAuthenticationResponse(newUser);

            jwtResponse.setAccessToken(jwt);

            refreshTokenService.addRTCookie(response, newUser, true);

            return ResponseEntity.ok(jwtResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<JwtAuthenticationResponse> login(@RequestBody @Valid LoginDTO loginDTO,
            HttpServletResponse response)
            throws Exception {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = (User) authentication.getPrincipal();

        String jwt = jwtService.generateToken(user);
        JwtAuthenticationResponse jwtResponse = new JwtAuthenticationResponse(user);
        jwtResponse.setAccessToken(jwt);

        refreshTokenService.addRTCookie(response, user, loginDTO.getRememberMe());

        return ResponseEntity.ok(jwtResponse);
    }

    @GetMapping("/refresh")
    public ResponseEntity<JwtAuthenticationResponse> getRefreshToken(
            @CookieValue(RefreshTokenService.COOKIE_REFRESH_TOKEN) String cookieRFToken,
            @CookieValue(RefreshTokenService.COOKIE_REMEMBER_ME) String cookieRememberMe,
            HttpServletResponse response)
            throws Exception {

        RefreshToken refreshToken = refreshTokenService.findByToken(cookieRFToken).orElse(null);

        if (refreshToken == null) {
            throw new RefreshTokenException(cookieRFToken, "RToken is invalid");
        }

        if (refreshTokenService.verifyExpiration(refreshToken)) {
            throw new RefreshTokenException(cookieRFToken, "Refresh token was expired!");
        }

        User user = refreshToken.getUser();
        String jwt = jwtService.generateToken(user);
        JwtAuthenticationResponse jwtResponse = new JwtAuthenticationResponse(user);
        jwtResponse.setAccessToken(jwt);

        refreshTokenService.addRTCookie(response, user, refreshToken.getToken(),
                Boolean.parseBoolean(cookieRememberMe));

        return ResponseEntity.ok(jwtResponse);
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logout(
            HttpServletRequest request,
            HttpServletResponse response)
            throws Exception {

        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        refreshTokenService.removeRTCookie(response);
        SecurityContextHolder.clearContext();

        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify")
    public ResponseEntity<ResponseMessage> sendEmailVerification(
            @RequestBody @Valid AuthEmailVerificationDTO authEmailVerificationDTO,
            HttpServletRequest request) {

        User verifyUser = userService.findByEmail(authEmailVerificationDTO.getEmail()).orElse(null);
        ResponseMessage res = new ResponseMessage("");
        if (verifyUser == null) {
            res.setMessage("Email not found");
            return ResponseEntity.ok(res);
        }

        if (verifyUser.getStatus() == UserStatusEnum.ACTIVE) {
            res.setMessage("User has been active!");
            return ResponseEntity.ok(res);
        }

        if (verifyUser.getVerifyToken() == null) {
            res.setMessage("Email not found");
            return ResponseEntity.ok(res);
        }

        if (verifyUser.getVerifyToken().equals(authEmailVerificationDTO.getToken())) {
            verifyUser.setStatus(UserStatusEnum.ACTIVE);
            userService.save(verifyUser);
            res.setMessage("User has been active!");
        }

        return ResponseEntity.ok(res);
    }
}
