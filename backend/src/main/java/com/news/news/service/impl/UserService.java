package com.news.news.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.news.news.dto.request.UserDTO;
import com.news.news.model.User;
import com.news.news.repository.UserRepository;
import com.news.news.service.CRUDService;
import com.news.news.service.IUserService;

@Service
public class UserService implements IUserService, CRUDService<User> {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User saveUserRequest(UserDTO userRequest) {

        String hashedPassword = passwordEncoder.encode(userRequest.getPassword());

        User newUser = new User(userRequest.getFirstname(), userRequest.getLastname(), userRequest.getEmail(),
                userRequest.getAvatar(), userRequest.getAge(), userRequest.getGender(), hashedPassword);

        return save(newUser);
    }

    public User updateUser(Long id, UserDTO userRequest) {

        User user = userRepository.findById(id).orElse(null);

        if (user != null) {

            BeanUtils.copyProperties(userRequest, user);
            return userRepository.save(user);
        }

        return null;
    }

    public boolean exists(long id) {
        return userRepository.existsById(id);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public UserDetailsService userDetailsService() {
        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                User user = userRepository.findByEmail(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
                return user;
            }
        };
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public User save(User t) {
        return userRepository.save(t);
    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}
