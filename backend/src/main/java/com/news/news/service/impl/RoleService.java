package com.news.news.service.impl;

import com.news.news.model.Role;
import com.news.news.model.RoleEnum;
import com.news.news.repository.RoleRepository;
import com.news.news.service.CRUDService;
import com.news.news.service.IRoleService;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleService implements IRoleService, CRUDService<Role> {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    @Override
    public Optional<Role> findById(Long id) {
        return roleRepository.findById(id);
    }

    @Override
    public Role save(Role t) {
        return roleRepository.save(t);
    }

    @Override
    public void delete(Long id) {
        roleRepository.deleteById(id);
    }

    public Optional<Role> findByName(RoleEnum role) {
        return roleRepository.findByName(role.getName());
    }
}
