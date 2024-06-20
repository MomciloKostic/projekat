package com.example.machinemanager.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.machinemanager.model.Permission;
import com.example.machinemanager.repository.PermissionRepository;

@Service
public class PermissionService {

    private PermissionRepository permissionRepository;

    @Autowired
    public PermissionService(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }


    public List<Permission> findAll() {
        return (List<Permission>) permissionRepository.findAll();
    }
}
