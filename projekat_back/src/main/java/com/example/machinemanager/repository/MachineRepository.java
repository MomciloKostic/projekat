package com.example.machinemanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.machinemanager.model.Machine;

@Repository
public interface MachineRepository extends JpaRepository<Machine, Long> {

}