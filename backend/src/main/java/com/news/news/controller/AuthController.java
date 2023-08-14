package com.news.news.controller;

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
import org.springframework.web.bind.annotation.RestController;

import com.news.news.dto.request.LoginDTO;
import com.news.news.dto.request.UserDTO;
import com.news.news.dto.response.JwtAuthenticationResponse;
import com.news.news.dto.response.ResponseMessage;
import com.news.news.exception.RefreshTokenException;
import com.news.news.model.RefreshToken;
import com.news.news.model.Role;
import com.news.news.model.RoleEnum;
import com.news.news.model.User;
import com.news.news.service.impl.JWTService;
import com.news.news.service.impl.RefreshTokenService;
import com.news.news.service.impl.RoleService;
import com.news.news.service.impl.UserService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController extends Controller {

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
    public ResponseEntity<?> signup(@RequestBody @Valid UserDTO userDTO, HttpServletResponse response)
            throws Exception {
        if (userService.existsByEmail(userDTO.getEmail())) {
            return new ResponseEntity<>(new ResponseMessage("Email have already existed"), HttpStatus.CONFLICT);
        } else {

            User newUser = userService.saveUserRequest(userDTO);
            Role memberRole = roleService.findByName(RoleEnum.MEMBER).orElse(null);

            if (memberRole == null) {
                throw new Exception("Can not find Member role!");
            } else {
                newUser.addRole(memberRole);
                userService.save(newUser);
            }

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
}
