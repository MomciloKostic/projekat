package com.example.machinemanager.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.example.machinemanager.model.Permission;

@Repository
public interface PermissionRepository extends CrudRepository<Permission, Long> {



}
